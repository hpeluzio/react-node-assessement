import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import axios from "axios";

const API_URL =
  "https://api.giphy.com/v1/gifs/search?api_key=pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa";

function App() {
  const [debounce, setDebounce] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gifs, setGifs] = useState([]);
  const [offset, setOffset] = useState(0);
  const pageSizes = [25, 50, 100];
  const [limit, setLimit] = useState(50);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  console.log("loading", loading);
  console.log("searchTerm", searchTerm);
  console.log("limit", limit);

  useEffect(() => {
    const abortController = new AbortController();
    // const signal = abortController.signal;

    try {
      const loadApi = async () => {
        const response = await axios.get(
          API_URL + "&offset=" + offset + "&q=cheeseburger"
        );
        console.log("response: ", response);
        setGifs(response.data);
      };
      loadApi();
    } catch (err) {
      abortController.abort();
      console.log(err);
    }

    return () => {
      abortController.abort();
    };
  }, []);

  const searchCall = useCallback(() => {
    setLoading(true);

    try {
      const loadApi = async () => {
        if (searchTerm === "") {
          console.log("Search something");
          alert("Search something");
          return;
        }

        // const EDITED_API_URL = API_URL + `?q=${searchTerm}&offset=${offset}&limit=${limit}`;
        const apiUrlWithParams = `${API_URL}&q=${searchTerm}&offset=${offset}&limit=${limit}`;

        const response = await axios.get(apiUrlWithParams);
        console.log("response: ", response);
        setGifs(response.data);
      };
      loadApi();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }

    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, [searchTerm, limit, offset]);

  const searching = (value) => {
    setInputValue(value.trim());
    setSearchTerm(inputValue.trim());

    setLoading(true);

    if (debounce !== null) {
      clearTimeout(debounce);
    }

    setDebounce(
      setTimeout(() => {
        searchCall();
      }, 2000)
    );
  };

  const searchedData = useMemo(() => {
    if (gifs?.data) {
      const startIndex = offset * limit;
      const endIndex = startIndex + limit;
      return gifs.data.slice(startIndex, endIndex);
    }
    return [];
  }, [gifs, limit, offset]);

  // const goToNextPage = () => {
  //   const newOffset = offset + pageSize;
  //   if (newOffset < gifs.length) {
  //     setOffset(newOffset);
  //   }
  // };

  // const goToPreviousPage = () => {
  //   const newOffset = offset - pageSize;
  //   if (newOffset >= 0) {
  //     setOffset(newOffset);
  //   }
  // };

  const handleLimit = (limit) => {
    setLimit(limit);
    searchCall();
  };

  return (
    <div className="App">
      <input
        value={inputValue}
        onChange={(e) => searching(e.target.value)}
        placeholder="Search"
      />

      <button onClick={(e) => setGifs([])}>Clear results</button>
      <button>{"<"}</button>
      <button>{">"}</button>

      <select
        id="pageSize"
        value={limit}
        onChange={(e) => handleLimit(e.target.value)}
      >
        {pageSizes.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <div>Gifs:</div>
      {loading && <div>Wait a moment... Fetching the data...</div>}
      {searchedData.map((each) => (
        <>
          <img
            src={each.images.downsized_medium.url}
            alt="gif"
            height="50"
            // width="50"
          />
        </>
      ))}
    </div>
  );
}

export default App;
