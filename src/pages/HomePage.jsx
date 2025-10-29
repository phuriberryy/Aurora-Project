import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../component/search/SearchBar";
import Filters from "../component/search/Filters";

export default function HomePage() {
  const navigate = useNavigate();

  // state ข้อมูลฟอร์มค้นหา
  const [query, setQuery] = useState({
    from: "",
    to: "",
    date: "",
  });

  // state ตัวกรอง
  const [filters, setFilters] = useState({
    nonstop: false,
    airlines: [],
    priceMax: null,
  });

  // อัปเดตค่าฟอร์มหลัก
  const handleQueryChange = (partial) => {
    setQuery((prev) => ({ ...prev, ...partial }));
  };

  // อัปเดตค่าฟิลเตอร์
  const handleFilterChange = (partial) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  // กด Search แล้วไปหน้า Flights พร้อม query string
  const handleSearch = ({ from, to, date }) => {
    const params = new URLSearchParams({
      from,
      to,
      date,
      ...(filters.nonstop && { nonstop: "true" }),
      ...(filters.airlines.length > 0 && {
        airlines: filters.airlines.join(","),
      }),
      ...(filters.priceMax && { priceMax: filters.priceMax }),
    });

    navigate(`/flights?${params.toString()}`);
  };

  return (
    <main style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1 style={{ color: "#0077cc" }}>Find your flight</h1>

      {/* ส่วนกรอกฟอร์มค้นหา */}
      <SearchBar
        value={query}
        onChange={handleQueryChange}
        onSearch={handleSearch}
      />

      {/* ส่วนฟิลเตอร์ */}
      <Filters filters={filters} onChange={handleFilterChange} />
    </main>
  );
}
