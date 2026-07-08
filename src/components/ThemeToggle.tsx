"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Váltás világos módra" : "Váltás sötét módra"}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-navy/12 text-muted transition-colors duration-200 hover:text-accent hover:border-accent/40 cursor-pointer bg-transparent"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
