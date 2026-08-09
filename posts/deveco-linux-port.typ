#import "/templates/blog.typ": *

#show: main-chinese.with(
  title: "把 DevEco Studio 移植到 Linux，难吗？",
  date: "2026-08-09 22:37",
  tags: ("开发", "软件"),
  category: "手记",
  summary: "把华为 DevEco Studio 做成 Arch 包，会有多难？",
  weather: "奔跑的白海豚",
)

== 成果

https://github.com/alex3236/devecostudio-linux

除预览器外目前未发现不可用功能

== 一切的开始

最初的设想是：

#figure(
  table(
    columns: 2,
    table.header[*源*][*提供什么*],
    [**Windows 安装器** `deveco-studio-6.1.1.280.exe`], [平台无关内容（`lib/*.jar`、plugins、tools）],
    [**IDEA Community tarball**], [Linux JBR + 启动器 + 原生库（pty4j、JNA、fsnotifier）],
    [**华为 commandline-tools-linux**], [Linux Node.js + OpenHarmony SDK],
  ),
)

但第一步就出了问题：Windows 安装器解不开。

`7z l` 一看，PE 里只嵌了一个 7z（里面只有 jbr），真正的软件本体在 2.85GB 的尾部；`nsisbi-ext` 找到 NSISBI 头但 LZMA 解压失败，`7z x` 只能解出内嵌 jbr，wine 静默安装（`/S`）也失败。

于是转向 Mac DMG——`7z x` 可以直接解压，`.app/Contents` 里就是同样的平台无关内容。项目的基础就此定下：**以 Mac DMG 为包源**。

华为的下载链接是签名链接、会过期，写不进 PKGBUILD。

方案：两个华为 zip 由用户手动提供（放在 PKGBUILD 目录，重命名为版本无关的文件名），只有 JetBrains tarball 自动下载。

== 第一个能跑的包（v6.1.1）

makepkg 会自动解压 zip/tarball，`prepare()` 只手动处理 DMG（7z 限定 `DevEco-Studio.app/Contents` 路径，再排除 sdk/default、jbr、emulator 等）。随后是问题：

+ `package()` 目录嵌套：`cp -a plugins/ pkg/plugins/` 会搞出 `plugins/plugins/`，改成 `cp -a source/* dest/` 通配
+ 检查文件存在性时 `-d` 和 `-f` 用错——plugins 是目录不是文件

+ 然后是**连环权限问题**。Mac DMG 的文件以 700 打包，`cp -a` 原样保留，首次启动直接 `ClassNotFoundException: com.intellij.util.lang.PathClassLoader`——最初误以为是 JDK 25 的类加载变化，还加了 `-Xbootclasspath/a` 实验，真正原因其实是 **JAR 700 权限 JVM 读不了**。修好后那个参数是多余的，删掉。

+ `AccessDeniedException: plugins/plugins/lib` \
    `Cannot resolve intellij.platform.settings.local.xml`（`cp -a lib/*.jar` 漏了 `lib/modules/` 和 `lib/cds/`） \
    以及 **`posix_spawn failed, error: 13 (EACCES)`**： \

    全局 chmod 644 把 `jbr/lib/jspawnhelper` 的 +x 剥掉了。JDK 18+ 的子进程启动走 posix_spawn 执行 jspawnhelper，IDE 本体能开（`jbr/bin/java` 有 +x），第一个子进程就炸。同样遭殃的还有 `cef_server`、`chrome-sandbox`、`jcef_helper`、`jexec`。

+ 批量 `file` 命令扫描还会触发 SIGSYS（signal 31）把恢复 exec 位的逻辑打断：

    换成 Python 读文件头 256 字节（ELF magic `\x7fELF` 或 `#!`）。

+ 后来发现 `hstack` 的 shebang 在**第 3 行**（前面是版权注释），所以扫描时得在整个 256 字节里找 `#!`，不能只看第一个字节。

+ Node.js 路径也报过：File Watcher 说 `tools/node/npm` 不存在（CLI 只有 `tools/node/bin/npm`）。解决方式一句话：`ln -sf bin/* tools/node/`。

== 发布

仓库公开后做了些收尾：`.gitignore` 排除 pkg、src、zip、tarball；GitHub Actions workflow 在 `archlinux:base-devel` 容器里构建；LICENSE 用 BSD 2-Clause。

== v26.0.0

6.1.1 能用之后，很快发布了 26.0.0 Beta 大版本（IDEA 2026.1 基底）。DMG 结构变化不小：

- `lib/` 平铺：全部平台 jar 扁平放在 `lib/`（347 个、789MB，对比 6.1.1 只有 ~23 个 bootstrap jar）
- `lib/modules/`、`lib/cds/` 消失
- `lib/skiko-awt-runtime-all/` 新增（Mac 是 dylib，要换成 IDEA Linux 版）
- `bootClassPathJarNames` 从 22 条变成 202 条（jq 自动适配，不硬编码）

期间还有一次假警报：解压后 `lib/` 看着空了（只剩 1 个 jar），结果是 /tmp 磁盘满，7z 静默失败（errno=28）解出了几乎空目录。

=== CLI tools 替换

对比 Mac DMG 与 commandline-tools 的每个工具目录后，决定此版本能换全换：`hvigor`、`ohpm`、`hstack`、`codelinter`、`node`、`sdk`、`emulator` 全部来自 CLI（Linux 原生）。

理由：CLI 的 `bin/` 有终端可调用的 wrapper，Mac 版没有。`UxTestService` 只有 Mac DMG 有（Python 跨平台，保留）；`llvm`、`profiler`、`dumpParser` 没有 Linux 替代，排除。

修 CLI 的 wrapper 脚本：

1. `$0` 经 `/usr/bin` symlink 调用时解析到 `/usr/bin` → 改 `readlink -f "$0"`
2. 路径假设：`$all_tool_dir/tool/node` → `$all_tool_dir/node`、`$all_tool_dir/sdk` → `$all_tool_dir/../sdk`
3. codelinter 内层脚本硬编码 `$ROOT_PATH/tool/node` 和 `$ROOT_PATH/sdk` → sed 改写主程序（不能用 symlink，那会让 IDE 的 node 发现逻辑看到一个"独立 node 安装"）

=== node.sync.path.invalid

26.0.0 在项目同步前检查 Node.js 路径，报 `node.sync.path.invalid`——"请选择 Node.js 24.x 所在的路径"。

反编译 `project-mgmt-26.0.0.621.jar` 的 `getNpmVersionFast`（AbstractNodejsChecker.checkIsValidVersions）：

- **非 Windows 分支只查 `<nodeDir 父目录>/lib/node_modules/npm/package.json`**
- 不查 `<nodeDir>/node_modules/npm/package.json`（那是 Windows 分支）
- CLI 的 node 是官方 tarball 布局：npm 在 `<nodeDir>/lib/node_modules/npm/`，顶层没有 node_modules → 检查必失败

顺带解释了"把 `node` 改名为 `node.bak` 警告就消失"的怪现象：顶层 node 没了 → fallback 到 `bin/` → 父目录恰好命中 npm 真实位置。

最终修复是三个 symlink（不需要 122MB 的真实文件副本）：

```shell
ln -sfn ../node/lib/node_modules tools/lib/node_modules   # 真正的修复，命中检查路径
ln -sfn lib/node_modules tools/node/node_modules          # Windows 分支
# 顶层 node/npm/npx/corepack → bin/*                       # File Watcher，6.1.1 就有的
```

== 模拟器：堂堂复活！

新版本 CLI 的 `emulator/` 是 **376MB 自包含 ELF**（自带 QEMU .so，无 Qt 依赖）

但激活它的过程相当曲折：

+ **模拟器需要 `~/Library/Huawei/Sdk`，Linux 上镜像在 `~/.Huawei/Sdk`

    实际上这个问题很奇怪，模拟器的命令行是支持 `~/.Huawei/Sdk` 的，但不知为何 IDE 里始终没跑起来。加了这个链接之后好了，所以就留着吧：

    ```shell
    ln -sfn "$HOME/.Huawei/Sdk" "$HOME/Library/Huawei/Sdk"
    ```

+ **Qt platform 插件** 模拟器只有 xcb/offscreen，默认找 wayland 插件 → 卡住。修复：`export QT_QPA_PLATFORM=xcb`。

+ **IDE 本体对`Emulator.exe` 硬编码。** 

    反编译 `LocalDeviceConnection.getEmulatorPathName`，发现非 Mac 分支硬编码 `Emulator.exe` 后缀。Linux 上只有 `Emulator`。
    
    其实这个问题也挺奇怪的，其他部分基本是 Windows 特判，而这里是 Mac 特判

    ```shell
    ln -sf Emulator Emulator.exe
    ```

+ 镜像下载：CLI 的 `-install` 可用；IDE 的"安装向导"不出现，镜像只能 `hemulator -install` 或从其他平台拷贝。

+ 静默等 y：模拟器有两个协议需要同意，若未同意会导致 IDE 调用时静默等待。

    协议状态在 `~/Library/Caches/Huawei/Emulator26.0/.emu_config`，故修改 wrapper 使用 `-license accept` 自动同意

== JCEF

=== GPU

项目结构页空白。`idea.log` 显示 IDE 自动把 `ide.browser.jcef.gpu.disable` 设为 true（检测到 GPU 进程反复崩溃），coredump 栈显示 `jcef_helper` 每 3-4 秒 SIGSEGV，`libGLESv2 (ANGLE) → EGL_CreateWindowSurface → eglCreateWindowSurface`。

原因（也许）是，在笔者环境下，Chromium 137 默认 Wayland EGL，ANGLE 的 eglCreateWindowSurface 在此组合下段错误 → 崩溃循环 → 所有 JCEF 页面空白/黑。

尝试： `-Dide.browser.jcef.additional.switches`（属性名不对）、JCEF 扩展点（空）、`GDK_BACKEND=x11`（不影响 Chromium）。

**有效的是 `unset WAYLAND_DISPLAY`**——Chromium 退回 X11 后端 + GLX，绕过 Wayland EGL。

=== headless + out-of-process

偶发所有 JCEF 页面空白，手动启用 `ide.browser.jcef.headless.enabled` + `ide.browser.jcef.out-of-process.enabled` 解决。

反编译确认 registry 值可被 `-D` 系统属性预设 → wrapper 默认传这两个参数。

=== 环境问题

升级 NVIDIA 驱动（610.43 → 610.57.04）后 IDE 窗口大面积黑色闪烁（JCEF 正常）。根因：新驱动 + Java2D OpenGL 管线（从 Mac 的 metal 转来的 `-Dsun.java2d.opengl=true`）回归。本地 `opengl=false` 解决；降级重新升级驱动后没有再现。

== Previewer

Previewer 启动报 `libshared_libz.so: cannot open shared object file`。CLI 提供的是 `libhilog_linux.so`（名字不同）且没有 libshared_libz。

临时补了 `ln -sf libhilog_linux.so libhilog.so` + `cp /usr/lib/libz.so libshared_libz.so`（只需要 adler32 符号）→ 引擎能启动了。

但还是不行：`Run ability start failed. Linux is not supported.`

决定性证据来自反汇编：

- **`RunDebugAbility` 是 45 字节桩**（只打印错误），旁边的 `RunNormalAbility` 是 1302 字节完整实现 → debug 路径被 `#ifdef` 编译排除
- 运行时分支：`RunJsApp` 检查 debug 标志 ← 命令行 `-d` ← IDE 总是传 `-d` → 必然撞桩

去掉 `-d` 手动跑 normal 路径 → SIGSEGV：`Window::Create → RSUIDirector::Init → RSUIContextManager` 构造函数崩溃——这是鸿蒙的 Rosen 渲染服务客户端，Linux 上不存在。

结论：Previewer 不可用（debug 编译排除 + normal 渲染服务崩溃），包层面无解。

== HiDPI：DPI 抽奖

用户报每次启动 UI 缩放抽奖。通过 hidpi 调试面板对比：

- 紧凑：Per-monitor DPI-aware **enabled** + Monitor scale 1.0 + User scale 1.0
- 正常：Per-monitor DPI-aware **disabled** + Monitor scale 1.5 + User scale 1.5

`-Dsun.java2d.uiScale=1.5` 无效（per-monitor 覆盖它），需要 `-Dsun.java2d.hidpi.mode=off`。

但禁用 JRE HiDPI 后 JCEF 变得巨大——反编译 `JBCefApp.getForceDeviceScaleFactor()`：

```java
if (JreHiDpiUtil.isJreHiDPIEnabled()) return -1.0;  // Chromium 自检（好）
return ScaleContext.getScale(PIX_SCALE);            // 跟随 IDE 缩放
```

禁用 JRE HiDPI → JCEF 走 `ScaleContext.PIX_SCALE` → 与 Swing 缩放叠加 → 巨大。

**结论：JRE HiDPI 必须保持启用（JCEF 自检），IDE 缩放用 `-Dide.ui.scale` 单独固定。**

用户级 vmoptions（`~/.config/Huawei/DevEcoStudio26.0/devecostudio64.vmoptions`）会被 launcher 读取并与系统 vmoptions 合并，所以用户可以直接用 IDE 的 *Help → Edit Custom VM Options* 修改缩放，无需 root。

最终方案：`wlr-randr` 读合成器 scale，0.25 步取整（1.0/1.25/1.5/1.75/2.0），写入一行用户级 vmoptions overlay。

wlr-randr 需要 `WAYLAND_DISPLAY`，而 X11 workaround 会 unset 它——检测块必须放在 unset 之前。

== 收尾

尝试支持其他发行版，最省事的方案：workflow 额外产出 distro-agnostic tarball，解压到 /opt + 手动建 symlink。

== 心得

反正能用了，管他咋修的
