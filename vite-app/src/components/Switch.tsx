import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { themeActions } from "../features/theming/themeSlice";

type stateType = {
  themes: {
    theme: string;
  };
};

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export const Switch = () => {
  const theme = useSelector((state: stateType) => state.themes.theme);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent) => {
    console.log("current theme :: ", theme);
    let themeToSet = e.target.checked ? "dark" : "light";
    themeToSet === "dark"
      ? dispatch(themeActions.setDark())
      : dispatch(themeActions.setLight());
  };

  useEffect(() => {
    console.log("theme after change :: ", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

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

// dispatch from here
