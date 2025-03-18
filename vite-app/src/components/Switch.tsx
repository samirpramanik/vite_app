import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "react-i18next";

export const Switch = () => {
  const [theme, handleChange] = useTheme("light");

  const { t } = useTranslation();

  return (
    <div className="container-switch">
      <span>{t("themeLbl")}</span>
      <label className="switch">
        <input
          type="checkbox"
          onChange={handleChange}
          checked={theme === "dark"}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};
