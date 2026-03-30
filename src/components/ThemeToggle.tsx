"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light" as const, icon: "☀️", label: "Light" },
    { value: "dark" as const, icon: "🌙", label: "Dark" },
    { value: "system" as const, icon: "💻", label: "System" },
  ];

  return (
    <div className="flex items-center gap-1 glass rounded-full p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={`px-2.5 py-1 rounded-full text-xs transition-all duration-200 ${
            theme === opt.value
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
          aria-label={opt.label}
          title={opt.label}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
