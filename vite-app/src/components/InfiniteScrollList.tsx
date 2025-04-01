import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useTranslation } from "react-i18next";
import { Switch } from "./Switch";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../app/store.ts";
import { fetchPosts } from "../features/posts/postSlice.ts";
import { postActions } from "../features/posts/postSlice.ts";

const styles = window.getComputedStyle(document.body);
console.log(styles.getPropertyValue("--background-colorodd"));

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

interface postsStateType {
  posts: postStateType;
}

interface postStateType {
  page: number;
  post: itemType[];
  error: { message: string };
  loading: boolean;
  hasMore: boolean;
}

export const InfiniteScrollList = () => {
  const theme = useSelector((state: stateType) => state.themes.theme);
  const posts = useSelector((state: postsStateType) => state.posts.post);
  const error = useSelector((state: postsStateType) => state.posts.error);
  const page = useSelector((state: postsStateType) => state.posts.page);
  const loading = useSelector((state: postsStateType) => state.posts.loading);
  const hasMore = useSelector((state: postsStateType) => state.posts.hasMore);
  const dispatch = useDispatch<AppDispatch>();
  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  useEffect(() => {
    setForceUpdateKey((prev) => prev + 1); // force re-render on theme change by changing key whenever theme changes
  }, [theme]);

  useEffect(() => {
    dispatch(fetchPosts());
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
          dispatch(postActions.incrementPage());
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
    const item = posts[index];

    if (!item) return null;
    const rowColor =
      index % 2 === 0
        ? styles.getPropertyValue("--background-coloreven")
        : styles.getPropertyValue("--background-colorodd");
    //console.log("bg color :: ", rowColor);

    return (
      <div
        ref={index === posts.length - 1 ? lastItemRef : null} // Attaching ref to the last item
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
        key={forceUpdateKey} // to force re-render after theme change
        height={600}
        itemCount={posts.length}
        itemSize={120}
        width="80rem"
      >
        {Row}
      </List>
      {/* {hasMore && (page >= 2 ? <p>Loading more...</p> : <p>Loading...</p>)} */}
      {loading && <p>{t("loading")}</p>}
    </div>
  );
};
