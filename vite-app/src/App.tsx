import { Route, Routes } from "react-router-dom";
import "./App.css";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import { useTranslation } from "react-i18next";
import ItemDetails from "./components/ItemDetails";

function App() {
  const { i18n } = useTranslation();
  document.body.dir = i18n.dir();

  return (
    <div>
      {/* <InfiniteScrollList /> */}
      <Routes>
        <Route path="/" element={<InfiniteScrollList />}></Route>
        <Route path="itemdetails" element={<ItemDetails />}></Route>
      </Routes>
    </div>
  );
}

export default App;
