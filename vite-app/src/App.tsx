import "./App.css";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  const changeLanguage = (lng: string) => {
    console.log(i18n.dir());
    i18n.changeLanguage(lng, () => {
      console.log("locale changed to ", lng);
    });
    document.body.dir = i18n.dir();
  };

  return (
    <div>
      <div id="localeSelector">
        <button
          style={{ marginInlineEnd: "10px" }}
          onClick={() => changeLanguage("en")}
        >
          English
        </button>
        <button onClick={() => changeLanguage("ar")}>Arabic</button>
      </div>
      <InfiniteScrollList />
    </div>
  );
}

export default App;
