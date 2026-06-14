#import "/templates/blog.typ": *

#show: main-chinese.with(
  title: "样式测试：Typst 排版一览",
  date: "2026-06-13",
  tags: ("Typst", "测试"),
  category: "手记",
  page: true,
  summary: "一个用来检查 Typst 模板样式的测试页面，涵盖标题层级、正文、图片、代码块和数学公式。",
)

= 标题层级

== 二级标题：关于中文字体排印

中文排版有其独特的审美要求。一个好的模板需要处理好字体族、行距、标题层次和留白，让阅读体验舒服而不拥挤。

=== 三级标题

三级标题显然会更小一点。

==== 四级标题：细节很重要

除了大的布局，一些细小的元素——比如内联代码、链接样式、列表缩进——也会影响整体的阅读感受。四级标题看起来应该像加粗的正文，略有上边距即可。

===== 五级标题：更小的层级

五级标题用于最细节的分节，字号与正文相同，但有稍粗的字体和略小的上边距。

== 正文样式

正文是一个博客最核心的部分。当读者打开一篇文章，他们首先感受到的是行距是否合适、字间距是否均匀、换行是否自然。Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

中文和西文混排时需要注意基线对齐。In a well-typeset document, Chinese characters and Latin letters should sit comfortably on the same baseline. 一般来说，中文的 x-height 比西文略低，这也导致了混排时肉眼可见的不和谐。好的字体搭配可以缓解这种差异。

*粗体*和 _斜体_ 是基本的强调方式。当然还有 #strike[删除线]，用于表示「这件事已经不重要了」。链接也应该有合适的颜色和下划线，比如这里有个到#link("https://typst.app")[Typst 主站]的链接。

== 列表测试

一些日常常用软件：

- *VS Code* — 主力编辑器，插件丰富
- *Figma* — 偶尔需要画原型
- *Obsidian* — 笔记工具
- *Docker* — 开发环境隔离
- *Git* — 版本控制，没有它不敢写代码

一套典型的开发流程：

+ 新建分支 `git checkout -b feat/xxx`
+ 写代码，提交改动
+ Push 到远程仓库
+ 创建 Pull Request
+ Code Review 后合并到主分支

== 引用块

#quote()[
  好的代码是写给人看的，顺便让机器执行。
  *—— Harold Abelson*
]

#quote()[
  很多年前，在学编译原理的课上学过一个观点：一个语言的复杂程度，不是看它怎么写，而是看它怎么写错。于是你看 C++ 的复杂，不在于它怎么写对，而在于它写错的方式太多了。
  *—— 某位老师的碎碎念*
]

== 图片与标题

Astro 和 Typst 的结合让写博客变成了一件有仪式感的事。下面是一张经典的「阮一峰标准照」（并不是）。

// Placeholder: 用一张拍摄桌面的截图来测试图片排版
#figure(
  image("https://s2.loli.net/2025/02/12/IabfHnRiezh9U5k.png"),
  caption: [桌面截图：代码与终端的日常],
)

图片应该居中显示，带有圆角和淡淡的边框。暗色模式下图片会自动降低亮度，以避免和暗色背景冲突。

多个连续的图片：

#figure(
  image("https://s2.loli.net/2025/02/12/d91FSY7GCXOyEIv.png"),
  caption: [另一张截图：也不知道是什么时候截的],
)

== 代码块

一段 Java 代码，来源于一个真实项目：

```java
public class DexHookHelper {
    private static final String TAG = "DexHookHelper";

    public static Class<?> findClass(String className) {
        try {
            return Class.forName(className);
        } catch (ClassNotFoundException e) {
            Log.e(TAG, "Class not found: " + className, e);
            return null;
        }
    }

    public static void logAllMethods(Class<?> clazz) {
        for (var method : clazz.getDeclaredMethods()) {
            Log.d(TAG, "Method: " + method.getName());
        }
    }
}
```

一段 Kotlin：

```java
data class XposedHook(
    val packageName: String,
    val className: String,
    val methodName: String,
    val hook: (XC_MethodHook.MethodHookParam) -> Unit
)

fun XposedHook.install() {
    XposedHelpers.findAndHookMethod(
        className,
        lpparam.classLoader,
        methodName,
        object : XC_MethodHook() {
            override fun beforeHookedMethod(param: MethodHookParam) {
                hook(param)
            }
        }
    )
}
```

一段 Shell 脚本：

```shell
#!/bin/bash
set -euo pipefail

BIN_DIR="$HOME/.local/bin"
mkdir -p "$BIN_DIR"

for jdk in "$HOME/.jdks"/*; do
    if [[ -d "$jdk" ]]; then
        version="$(basename "$jdk")"
        echo "Registering JDK: $version"
        alias "java-${version}"="${jdk}/bin/java"
    fi
done

echo "All JDKs registered"
```

内联代码：`System.out.println("Hello, Typst!")` —— 看起来还不错。

== 数学公式

Typst 内置了强大的数学公式排版能力。hAST 渲染模式下公式可以正常输出。

爱因斯坦质能方程：$E = m c^2$

微积分基本定理：

$ integral_a^b f(x) dif x = F(b) - F(a) $

贝叶斯定理：$ P(A | B) = (P(B | A) P(A)) / P(B) $

== 水平分割线和表格

#line(length: 100%)

上面的线应该是一道淡淡的灰色分割线。

一个简单的表格：

#figure(
  table(
    columns: 3,
    table.header[*名称*][*版本*][*状态*],
    [Astro], [5.x], [正常],
    [Typst], [0.14.x], [正常],
    [Shiki], [4.x], [正常],
    [Tailwind], [3.x], [正常],
  ),
  caption: [博客技术栈一览],
)

== 结语

至此，基本的排版元素——标题、正文、列表、引用、图片、代码、公式、分割线、表格——都已经覆盖。你可以通过这个页面检查模板的样式是否符合预期。
