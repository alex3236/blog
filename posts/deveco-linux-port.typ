#import "/templates/blog.typ": *

#show: main-chinese.with(
  title: "Linux 移植 DevEco Studio 6.1.1.280 全记录",
  date: "2025-06-14 23:49",
  tags: ("开发", "软件"),
  category: "手记",
  summary: "将华为的 DevEco Studio（鸿蒙 IDE）从 Windows 移植到 Linux，记录踩坑全过程。",
  weather: "键盘冒烟",
)

年初尝试搞鸿蒙开发，发现 DevEco Studio 只有 Windows 版和 Mac 版，Linux 用户被华丽地忽视了。但既然这玩意基于 IntelliJ IDEA，那理论上 Java 部分全是跨平台的，只需要把平台相关的二进制换掉就行。于是开始折腾。

感谢 CrisQ 的 #link("https://crisq.top/blog/deveco_linux_porting_notes")[这篇文章]，是此项目的灵感来源。

== 成果

#link("https://github.com/alex3236/devecostudio-linux")[DevEcoStudio Linux PKGBUILD]

== 原理

DevEco Studio 本质上就是 IntelliJ IDEA Community 版套了一层华为的壳。从 `build.txt` 可以确认：`DS-243.24978.46.36.611280`，基于 IDEA Community 2024.3.2（build `243.24978.46`）。

平台相关的部分只有这些：

- *JBR*（JetBrains Runtime）—— 绑定的 JDK，包含 JCEF、GLFW 等本地库
- *bin/devecostudio* —— ELF 启动器，负责解析 product-info.json 并启动 JVM
- `lib/native/` —— 本地库（sqlite、lib7z 等）
- `lib/pty4j/` —— 终端 pty 库
- `lib/jna/amd64/libjnidispatch.so` —— JNA 桥接
- *bin/fsnotifier* —— 文件变更监控
- `tools/node/` —— Node.js 运行时

所有 JAR（`lib/*.jar`）、插件（`plugins/*`）、模块描述符（`modules/`）、工具链脚本（`tools/hvigor/` 等）都是跨平台的，完全不用动。

== 移植步骤

=== 准备工作

从 Bottles/Wine 安装目录把 Windows 版 DevEco Studio 拷贝出来，作为底座。然后解压一份 Linux 版 IDEA 2026.1.3 作为素材源，再准备华为官方的 `commandline-tools-linux-x64-6.1.1.280.zip`（内含 Linux SDK 和 Node.js）。

=== 替换平台二进制

把 IDEA Linux 的那套原生组件盖到 DevEco 上：

- `jbr/` —— 整目录替换，Windows 的 `.dll` 变成 Linux 的 `.so`
- `lib/native/linux-x86_64/` —— 补上 Linux 本地库
- `lib/pty4j/linux/` —— 补上 Linux pty
- `lib/jna/amd64/libjnidispatch.so` —— 替换 `jnidispatch.dll`
- `bin/idea` → `bin/devecostudio` —— 复制并改名
- `bin/fsnotifier` —— 修复文件监视器缺失警告

=== 替换工具链

Node.js 不要自己下载，直接用 commandline-tools 包里附带的华为捆绑版（v18.20.1），覆盖 `tools/node/`。后来发现 CLI 包的 node 能顺带解决路径验证警告，比从官网下载再手动配路径干净。

SDK 也同步用 Linux 版覆盖 `sdk/default/openharmony/`，把旧的 Windows SDK 残留清理掉。

=== 编写配置文件

三个文件需要手动创建。

*product-info.json*：启动器通过它找到 JVM 和主类。Windows 原版只有一个 `os: "Windows"` 的 launch 条目。拷贝一份改成 Linux 路径，但 IDEA 2026 的新启动器限制 `launch` 数组只能有一条记录——需要删除 Windows 条目。

```json
{
  "name": "DevEco Studio",
  "version": "6.1.1.280",
  "launch": [
    {
      "os": "Linux",
      "launcherPath": "bin/devecostudio",
      "javaExecutablePath": "jbr/bin/java",
      "vmOptionsFilePath": "bin/devecostudio64-lin.vmoptions",
      "bootClassPathJar": "lib/platform-loader.jar"
    }
  ]
}
```

*devecostudio64-lin.vmoptions*：基于原版 `devecostudio64.exe.vmoptions` 改写。几个关键变更：

- 删除 `-Djava.security.manager=allow` —— JBR 25 已彻底移除 Security Manager 支持，导致 JVM 直接崩溃
- `-Dsun.java2d.metal=true` → `-Dsun.java2d.opengl=true` —— macOS 的 Metal 在 Linux 上无效
- 新增 `--enable-native-access=ALL-UNNAMED` —— JBR 25 的 JNA 警告
- 新增 `-Dglfw.im.module=fcitx` —— fcitx5 输入法支持

*idea.properties*：主要把 Windows 路径改成 Linux 路径，以及 `sun.java2d.uiScale.enabled=false` → `true`（JBR 25 自带 HiDPI，禁用反而导致 JBUIScale SEVERE 错误）。

=== 修复签名路径

逆向 `hos-project-mgmt-*.jar` 发现华为把 Linux 错误归类到了 Mac 路径（`jbr/Contents/Home/bin` 而非 `jbr/bin`）。解决方案简单粗暴：

```shell
mkdir -p jbr/Contents/Home
ln -s ../../bin jbr/Contents/Home/bin
```

=== 禁用遥测插件解决无法正常退出

IDE 关闭后进程不消失，查日志发现 `trace-lemon-plugin-6.1.1.280.jar` 里的 `MyStartupActivity` 在退出时死循环刷 "Shutting down thread pool"——这是华为的埋点上报插件，`shutdownNow()` 之后没有超时保护。

在 `idea.properties` 中加一行禁用即可，不影响编码、编译、签名、部署等核心功能。

=== 创建启动脚本

IDE 本身能跑了，但还需要绑环境变量。建一个 `bin/devecostudio.sh`：

```shell
#!/bin/bash
export GLFW_IM_MODULE=fcitx
export _JAVA_AWT_WM_NONREPARENTING=1
LOG_DIR="$HOME/.cache/Huawei/DevEcoStudio6.1/log"
STDOUT_LOG="$LOG_DIR/devecostudio-console.$(date +%Y%m%d-%H%M%S).log"
exec "$(dirname "$0")/devecostudio" "$@" >> "$STDOUT_LOG" 2>&1
```

== 最终成果

文件变更清单：

#figure(
  table(
    columns: 2,
    table.header[*操作*][*内容*],
    [保留], [`lib/*.jar`、`plugins/*`、`modules/`、`tools/hvigor/` 等],
    [替换], [JBR、native、pty4j、JNA、Node.js、SDK],
    [新增], [`bin/devecostudio`（ELF 启动器）、`bin/fsnotifier`、`bin/devecostudio.sh`],
    [创建], [`product-info.json`、`devecostudio64-lin.vmoptions`、`idea.properties`],
    [禁用], [`trace-lemon-plugin`（遥测插件）],
    [Hack], [`jbr/Contents/Home/bin` → `../../bin` 软链接],
  ),
  caption: [文件变更清单],
)

DevEco Studio 6.1.1.280 现在在 Linux 上正常运行：编码、编译、签名均可用。当然，闭源的模拟器无解。
