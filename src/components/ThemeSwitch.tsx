import { Fragment, useEffect, useRef, useState } from "react";
import { FaSun } from "react-icons/fa6";
import { MdBrightnessAuto, MdModeNight } from "react-icons/md";

type Theme = "light" | "dark" | "system";

const Sun = () => <FaSun className="h-5 w-5" />;
const Moon = () => <MdModeNight className="h-5 w-5" />;
const Monitor = () => <MdBrightnessAuto className="h-5 w-5" />;
const Blank = () => <svg className="h-6 w-6" />;

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(stored: Theme): "dark" | "light" {
  if (stored === "system") return getSystemTheme();
  return stored;
}

function applyClass(resolved: "dark" | "light") {
  if (resolved === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
}

function getStored(): Theme {
  try {
    return (localStorage.getItem("theme") as Theme) || "system";
  } catch {
    return "system";
  }
}

export default function ThemeSwitch() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [stored, setStored] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"dark" | "light">("light");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const s = getStored();
    setStored(s);
    setResolved(resolveTheme(s));
    setMounted(true);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      const current = getStored();
      if (current === "system") setResolved(getSystemTheme());
    };
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const changeTheme = (t: Theme) => {
    setStored(t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
    const r = resolveTheme(t);
    setResolved(r);
    applyClass(r);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div className="flex items-center rounded-md p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        <button
          aria-label="Theme switcher"
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {mounted ? resolved === "dark" ? <Moon /> : <Sun /> : <Blank />}
        </button>
      </div>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 dark:bg-gray-800">
          {[
            { value: "light" as Theme, label: "白天", Icon: Sun },
            { value: "dark" as Theme, label: "晚上", Icon: Moon },
            { value: "system" as Theme, label: "自动", Icon: Monitor },
          ].map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => changeTheme(value)}
              className={`group flex w-full items-center rounded-md px-2 py-2 text-sm hover:bg-primary-600 hover:text-white ${
                stored === value ? "font-bold" : ""
              }`}
            >
              <span className="mr-2">
                <Icon />
              </span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
