import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import SearchBar from "../component/search/SearchBar";
import { getFlights } from "../services/api";

export default function HomePage() {
  const navigate = useNavigate();

  // เก็บค่าที่ผู้ใช้กรอก
  const [query, setQuery] = useState({ from: "", to: "", date: "" });
  // เก็บรายชื่อสนามบินทั้งหมด
  const [options, setOptions] = useState({ origins: [], destinations: [] });
  // สถานะโหลดข้อมูล
  const [loading, setLoading] = useState(true);
  // ถ้ามี error ตอนโหลด
  const [error, setError] = useState("");

  // โหลดรายชื่อสนามบินจาก API
  useEffect(() => {
    async function loadAirports() {
      try {
        const res = await getFlights();
        const flights = res?.data || [];
        const origins = [];
        const destinations = [];

        // วนลูปเที่ยวบิน แล้วดึงชื่อสนามบินต้นทาง/ปลายทาง (กันซ้ำ)
        for (let f of flights) {
          if (f.from && !origins.includes(f.from)) origins.push(f.from);
          if (f.to && !destinations.includes(f.to)) destinations.push(f.to);
        }

        origins.sort();
        destinations.sort();
        setOptions({ origins, destinations });
        setError("");
      } catch (e) {
        setError("โหลดรายชื่อสนามบินไม่สำเร็จ");
        setOptions({ origins: [], destinations: [] });
      } finally {
        setLoading(false);
      }
    }
    loadAirports();
  }, []);

  // เวลาเปลี่ยนค่าในช่อง input
  function handleChange(part) {
    setQuery((old) => ({ ...old, ...part }));
  }

  // เวลา user กด Search
  function handleSearch({ from, to, date }) {
    const params = new URLSearchParams({ from, to, date }).toString();
    navigate(`/flights?${params}`);
  }

  return (
    <main style={{ maxWidth: 720, margin: "50px auto", padding: "0 20px" }}>
      <h1>Find your flight</h1>

      <SearchBar
        value={query}
        onChange={handleChange}
        onSearch={handleSearch}
        options={options}
        isLoadingOptions={loading}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}


