#import "/templates/blog.typ": *

#show: main-chinese.with(
  title: "Android 开发：动态枚举包中的类",
  date: "2025-11-25 14:02",
  tags: ("开发", "Android"),
  category: "手记",
  summary: "想做一个支持 Material Icons (Extended) 的图标选择器，需动态获取包中的类名，最终使用 dexlib2 实现。",
  weather: "晴",
)

之前想做一个支持 Material Icons (Extended) 的图标选择器。现有的实现大多是静态地维护一个图标类名列表，但这并不“优雅”。理想的做法是动态地获取图标类中的所有图标名称。

在 #link("https://stackoverflow.com/questions/69666501/list-all-classes-in-a-package-on-android/")[StackOverFlow] 上找到了一个用 `DexFile` 动态获取包中所有类的实现：

```java
fun getClasses(context: Context, packageName: String): List<Class<*>> {
    val dexFile = DexFile(context.applicationInfo.sourceDir)
    return dexFile.entries().asSequence()
        .filter { it.startsWith(packageName) }
        .map { context.classLoader.loadClass(it) }.toList()
}
```

然而，`DexFile` 已被弃用。故最终改用 #link("https://javadoc.io/doc/org.smali/dexlib2/2.3.4/org/jf/dexlib2/DexFileFactory.html")[`dexlib2`] 来实现：

```java
fun getClasses(context: Context, packageName: String): List<String> {
	val dexFile = DexFileFactory.loadDexFile(File(context.applicationInfo.sourceDir), Opcodes.getDefault())
	return dexFile.classes
		.map { it.type.removePrefix("L").removeSuffix(";").replace("/", ".") }
		.filter { it.startsWith(packageName) }
		.map { context.classLoader.loadClass(it) }.toList()
}
```

这样就能动态地获取指定包中的所有类名了。也许仍然不够完美，但已经比手动维护类名列表要好得多了。
