import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

const ItemDetails = () => {
  const { state } = useLocation();
  console.log("state in ItemDetails :: ", state);
  const { t } = useTranslation();
  return (
    <div>
      <h2 id="detailsTitle">{t("detailsTitle")}</h2>
      <h3>{state.title}</h3>
      <p>{state.body}</p>
      <h1 id="detailsTitle"></h1>
    </div>
  );
};

export default ItemDetails;
