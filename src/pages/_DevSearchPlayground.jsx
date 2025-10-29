import { useState, useCallback } from "react";
import SearchBar from "../components/search/SearchBar";
import Filters from "../components/search/Filters";

const DevSearchPlayground = () => {
    const [query, setQuery] = useState({
        from: "",
        to: "",
        date: "",
    });

    const [filters, setFilters] = useState({
        nonstop: false,
        airlines: [],
        priceMax: null,
    });

    const setPartialQuery = useCallback(
        (partial) => {
            setQuery((prev) => ({ ...prev, ...partial }));
        },
        [setQuery]
    );

    const setPartialFilters = useCallback(
        (partial) => {
            setFilters((prev) => ({ ...prev, ...partial }));
        },
        [setFilters]
    );

    const handleSearch = useCallback((searchValues) => {
        // eslint-disable-next-line no-console
        console.log("Search submitted:", searchValues);
    }, []);

    return (
        <div className="dev-search-playground">
            <h1>Search Playground</h1>
            <SearchBar value={query} onChange={setPartialQuery} onSearch={handleSearch} />
            <Filters filters={filters} onChange={setPartialFilters} />
            <section className="dev-search-playground__debug">
                <h2>Debug Values</h2>
                <pre>{JSON.stringify({ query, filters }, null, 2)}</pre>
            </section>
        </div>
    );
};

export default DevSearchPlayground;
