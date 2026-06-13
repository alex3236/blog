#import "/templates/blog.typ": *

#show: main-chinese.with(
  title: "记第一次开发 Xposed 模块",
  date: "2025-05-25 17:22",
  tags: ("软件", "开发"),
  category: "手记",
  summary: "挺闲的，写个 Xposed 模块玩玩。",
  weather: "多云",
)

挺闲的，写个 Xposed (LSPosed) 模块玩玩。

刚好之前写过一个 Magisk 模块，用于恢复一加 13T 移除的亮屏时间显示，不妨改写试试。

== 前期准备

简单看看系统设置，不难发现整个电池页面显示由 `com.oplus.battery` 即「电池」应用负责。

其配置项由 `/my_product/etc/extension/com.oplus.app-feature.xml` 提供：

```xml
<app_feature name="com.oplus.battery.phoneusage.screenon.hide" args="boolean:true"/>
```

反编译 APK 后，可以看见该配置项被读取，证明这部分内容确实由「电池」应用控制。

== 开发环境

现成轮子这么多，真好（

+ 用 #link("https://github.com/HighCapable/YukiHookAPI-ProjectBuilder")[`YukiHookAPI Project Builder`] 创建一个新项目

    #figure(image("https://s2.loli.net/2025/05/25/Gfjeanl7BMmwPgb.png"))

+ 添加 #link("https://github.com/LuckyPray/DexKit")[`DexKit`] 依赖

    ```yaml
    = sweet-dependencies-config.yaml
    libraries:
      org.luckypray:
        dexkit:
          version: 2.0.4
      # ...
    ```

    ```gradle
    // build.gradle
    dependencies {
        // ...
        implementation(org.luckypray.dexkit)
    }
    ```

+ Android Studio 打开项目，等待 Gradle 同步完成

== 找 Hook 点

+ #link("https://github.com/skylot/jadx")[jadx-gui] 反编译 APK，找配置项

    #figure(image("https://s2.loli.net/2025/05/25/vwIhYO381EiWp9Q.png"))

+ 看看用例，找到需要 Hook 的方法

    #figure(
  image("https://s2.loli.net/2025/05/25/DNm3gW5UPx1My2q.png"),
  caption: [查找用例],
)

    #figure(
  image("https://s2.loli.net/2025/05/25/YoiBcjkbz9dUfOn.png"),
  caption: [找到 Getter],
)

    #figure(
  image("https://s2.loli.net/2025/05/25/6X91PtU8yosnWLr.png"),
  caption: [其他地方均使用 Getter],
)

    不难看出，当 `q5.a.Q() == true` 时，亮屏时间显示会被移除。

== 写代码

为了尽可能适配今后的版本，不要直接使用类名和方法名，而是使用 DexKit 模糊搜索。

+ 找一个合适的 Class 匹配点：

    #figure(
  image("https://s2.loli.net/2025/05/25/ndUbmvWoIrA945J.png"),
  caption: [.source 就够了],
)

+ 再找一个合适的 Method 匹配点：

    #figure(
  image("https://s2.loli.net/2025/05/25/5WFDhBieTpQSRxa.png"),
  caption: [usingString 的 callerMethod],
)

    #figure(
  image("https://s2.loli.net/2025/05/25/37znCXA8RVoObvj.png"),
  caption: [大概确认一下唯一性],
)

+ 写代码：

    ```kotlin
    override fun onHook() = encase {
            System.loadLibrary("dexkit")  // 加载 DexKit 库
            loadApp("com.oplus.battery") {
                DexKitBridge.create(this.appInfo.sourceDir).use {
                    it.findClass {
                        matcher {
                            source("AppFeature.java")  // 用 .source 匹配
                        }
                    }.findMethod {
                        matcher {
                            callerMethods {
                                add {
                                    usingStrings("PhoneUsageTime")  // 用 usingStrings 匹配
                                }
                            }
                        }
                    }.singleOrNull()?.also {
                        it.className.toClass().method{ name = it.methodName }.hook {
                            replaceToFalse() // 替换为 false
                        }
                    }
                }
            }
        }
    ```

== 测试

LSPosed 模块，需要禁用 Android Studio 的部署优化，或者直接使用 `installDebug` 命令安装，否则无法成功更新。

```shell
./gradlew installDebug
```

== 效果


#figure(
  image("https://s2.loli.net/2025/05/25/wfSAi4dQYyRoUIm.jpg"),
  caption: [Result],
)
#figure(
  image("https://s2.loli.net/2025/05/25/U6FdyxJrNQjTRWh.jpg"),
  caption: [Result],
)
