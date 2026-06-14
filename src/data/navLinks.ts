export interface Friend {
  href: string;
  imgUrl: string;
  title: string;
  description: string;
}

export const navLinks = [
  { href: "/pages/stardust-baking", title: "星辰烘焙手记" },
  { href: "/archives", title: "归档" },
  { href: "https://alex3236.moe/", title: "关于我" },
  { href: "/friends", title: "朋友们" },
];

export const friends: Friend[] = [
  {
    href: "https://www.yuanshen.dev/",
    imgUrl: "/static/assets/friends/yuanretro.png",
    title: "YuanRetro",
    description: "这是一个成分复杂的小站哦~",
  },
  {
    href: "https://aimerny.top/",
    imgUrl: "/static/assets/friends/aimerny.png",
    title: "Aimerny",
    description: "Ciallo～(∠・ω< )⌒☆",
  },
];

export function formatDate(
  date: string | Date,
  locale: string = "zh-CN",
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getValidDate(date: string): Date | null {
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
}
