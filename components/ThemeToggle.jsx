"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a placeholder of the exact same size to prevent layout shift on load
  if (!mounted) {
    return <div className="w-9 h-9"></div>; 
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group"
      aria-label="Toggle Dark Mode"
    >
      {theme === "light" ? ( 
        <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
      ) : (
        <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      )}
    </button>
  );
}