export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function getStoredTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"){document.documentElement.classList.add("dark");}}catch(e){document.documentElement.classList.add("dark");}})();`;
