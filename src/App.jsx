import { useState, useEffect } from "react";
import "./App.css";
import CoinInfo from "./components/CoinInfo";
const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
    const [list, setList] = useState(null);
    useEffect(() => {
        const controller = new AbortController();

        async function fetchAllCoinData() {
            try {
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1",
                    {
                        headers: {
                            "x-cg-demo-api-key": API_KEY,
                        },
                        signal: controller.signal,
                    },
                );
                const data = await response.json();
                setList(data);
            } catch (error) {
                if (error.name === "AbortError") {
                    // It's ok, don't do anything
                } else {
                    console.error(error);
                }
            }
        }
        fetchAllCoinData();
        return () => controller.abort();
    }, []);
    const [filteredResults, setFilteredResults] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const searchItems = (searchValue) => {
        setSearchInput(searchValue);
        if (searchValue !== "") {
            const filteredData = list.filter(
                (coin) =>
                    coin.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ||
                    coin.symbol
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()),
            );
            setFilteredResults(filteredData);
        } else {
            setFilteredResults(list);
        }
    };

    return (
        <>
            <div className="whole-page">
                <h1>My Crypto List</h1>
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(inputString) =>
                        searchItems(inputString.target.value)
                    }
                />
                <ul>
                    {searchInput.length > 0
                        ? filteredResults.map((coin) => (
                              <CoinInfo
                                  key={coin.id}
                                  id={coin.id}
                                  image={coin.image}
                                  name={coin.name}
                                  symbol={coin.symbol}
                                  price={coin.current_price}
                              />
                          ))
                        : list?.map((coin) => (
                              <CoinInfo
                                  key={coin.id}
                                  id={coin.id}
                                  image={coin.image}
                                  name={coin.name}
                                  symbol={coin.symbol}
                                  price={coin.current_price}
                              />
                          ))}
                </ul>
            </div>
        </>
    );
}

export default App;
