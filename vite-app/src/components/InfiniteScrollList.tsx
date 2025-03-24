import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useTranslation } from "react-i18next";
import { Switch } from "./Switch";
import { useSelector, UseSelector } from "react-redux";

const styles = window.getComputedStyle(document.body);
console.log(styles.getPropertyValue("--background-colorodd"));

const API_URL = "https://jsonplaceholder.typicode.com/posts";

type itemType = {
  id: number;
  title: string;
  body: string;
};

type stateType = {
  themes: {
    theme: string;
  };
};

export const InfiniteScrollList = () => {
  const [data, setData] = useState<itemType[]>([]); // data from get api call(array of objects)
  const [page, setPage] = useState(1); // current page, increments after every page's last element is visible
  const [loading, setLoading] = useState(false); // data being fetched
  const [hasMore, setHasMore] = useState(true); // checks if more data is available

  const theme = useSelector((state: stateType) => state.themes.theme);
  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  useEffect(() => {
    setForceUpdateKey((prev) => prev + 1); // force re-render on theme change by changing key whenever theme changes
  }, [theme]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasMore) return;
      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}?_page=${page}&_limit=20`);
        console.log("URL :: ", `${API_URL}?_page=${page}&_limit=20`);
        console.log("number of records fetched :: ", response.data.length);
        console.log("records fetched :: ", response.data);
        setData((prev) => [...prev, ...response.data]);
        setHasMore(response.data.length > 0); // If no data, set hasMore to false
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      console.log("node :: ", node);
      if (loading || !hasMore) return; // if already loading is in progress or if no more records are present
      if (observer.current) observer.current.disconnect(); // resetting the observer at every data load

      observer.current = new IntersectionObserver((entries) => {
        console.log("intersection observer entries :: ", entries);
        if (entries[0].isIntersecting) {
          console.log("Last item is in view, loading more...");
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    console.log(i18n.dir());
    i18n.changeLanguage(lng, () => {
      console.log("locale changed to ", lng);
    });
    document.body.dir = i18n.dir();
  };

  const onRowClickHandler = (item: itemType) => {
    console.log("item data :: ", item);
    navigate("itemdetails", { state: item });
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const item = data[index];

    if (!item) return null;
    const rowColor =
      index % 2 === 0
        ? styles.getPropertyValue("--background-coloreven")
        : styles.getPropertyValue("--background-colorodd");
    console.log("bg color :: ", rowColor);

    return (
      <div
        ref={index === data.length - 1 ? lastItemRef : null} // Attaching ref to the last item
        style={{
          ...style,
          marginTop: "20px",
          borderBottom: "2px solid #ddd",
          background: rowColor,
        }}
      >
        <h3
          style={{
            marginTop: "10px",
          }}
          onClick={() => {
            console.log(`clicked on ${item.id}`);
            onRowClickHandler(item);
          }}
        >
          {item.title}
        </h3>
        <p
          onClick={() => {
            console.log(`clicked on ${item.id}`);
            onRowClickHandler(item);
          }}
        >
          {item.body}
        </p>
      </div>
    );
  };

  return (
    <div>
      <Switch></Switch>
      <div id="localeSelector">
        <button
          style={{ marginInlineEnd: "10px" }}
          onClick={() => changeLanguage("en")}
        >
          English
        </button>
        <button onClick={() => changeLanguage("ar")}>Arabic</button>
      </div>
      <h2>{t("title")}</h2>
      <List
        key={forceUpdateKey}
        height={460}
        itemCount={data.length}
        itemSize={120}
        width="80vw"
      >
        {Row}
      </List>
      {/* {hasMore && (page >= 2 ? <p>Loading more...</p> : <p>Loading...</p>)} */}
      {loading && <p>{t("loading")}</p>}
    </div>
  );
};
