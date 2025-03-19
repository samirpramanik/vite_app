import { useEffect, useState } from "react";

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

type Theme = "dark" | "light";

type useThemeReturn = [string, (e: ChangeEvent) => void];

export const useTheme = (initialTheme: Theme): useThemeReturn => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const handleChange = (e: ChangeEvent) => {
    console.log("current theme :: ", theme);
    setTheme(e.target.checked ? "dark" : "light");
  };

  useEffect(() => {
    console.log("theme after change :: ", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return [theme, handleChange];
};
