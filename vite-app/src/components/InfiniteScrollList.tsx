import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

type itemType = {
  id: number;
  title: string;
  body: string;
};

export const InfiniteScrollList = () => {
  const [data, setData] = useState<itemType[]>([]); // data from get api call(array of objects)
  const [page, setPage] = useState(1); // current page, increments after every page's last element is visible
  const [loading, setLoading] = useState(false); // data being fetched
  const [hasMore, setHasMore] = useState(true); // checks if more data is available

  useEffect(() => {
    const fetchData = async () => {
      if (!hasMore) return;
      setLoading(true);

      try {
        const response = await axios.get(`${API_URL}?_page=${page}&_limit=20`);
        console.log('URL :: ', `${API_URL}?_page=${page}&_limit=20`)
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
    (node: HTMLLIElement | null) => {
      console.log("node :: ", node);
      if (loading || !hasMore) return;  // if already loading is in progress or if no more records are present
      if (observer.current) observer.current.disconnect();  // resetting the observer at every data load

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

  return (
    <div>
      <h2>Infinite Scroll List</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.map((item, index) => (
          <li
            key={item.id}
            ref={index === data.length - 1 ? lastItemRef : null}    // attaching ref to the last record
            style={{
              padding: "10px",
              borderBottom: "2px solid #ddd",
              background: index % 2 === 0 ? "#eeeeaa" : "#fff",
            }}
          >
            <h3>{item.title}</h3>
            {item.body}
          </li>
        ))}
      </ul>
      {/* {loading && <p>Loading more...</p>} */}
      {page>=2 ? <p>Loading more...</p> : <p>Loading...</p>}
    </div>
  );
};
