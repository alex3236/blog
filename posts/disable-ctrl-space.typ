#import "/templates/blog.typ": *

#show: main-chinese.with(
  title: "彻底关闭 Ctrl + Space 快捷键",
  date: "2025-10-12 14:02",
  tags: ("软件"),
  category: "手记",
  summary: "彻底关闭 Windows 中的 Ctrl + Space 快捷键",
  weather: "雾",
)

神金微软，多久的 bug 了，一直没修

```reg
Windows Registry Editor Version 5.00

[HKEY_USERS\.DEFAULT\Control Panel\Input Method\Hot Keys\00000010]
"Key Modifiers"=hex:00,00,00,00
"Target IME"=hex:00,00,00,00
"Virtual Key"=hex:ff,ff,00,00
```
