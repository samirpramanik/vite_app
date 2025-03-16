import { useLocation } from "react-router";

const ItemDetails = () => {
  const { state } = useLocation();
  console.log("state in ItemDetails :: ", state);
  return <div>Item details page!</div>;
};

export default ItemDetails;
