import "./App.css";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng, () => {
      console.log("locale changed to ", lng);
    });
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>english</button>
      <button onClick={() => changeLanguage("ar")}>arabic</button>
      <InfiniteScrollList />
    </div>
  );
}

export default App;
