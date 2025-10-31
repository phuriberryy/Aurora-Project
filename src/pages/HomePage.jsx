import { useEffect, useState } from "react";                       
import { useNavigate } from "react-router-dom";                    
import SearchBar from "../component/search/SearchBar";        
import { getFlights } from "../services/api";    




function HomePage() {                              
  const navigate = useNavigate();                                  // พาไปหน้าอื่น

  // เก็บค่าที่ผู้ใช้กรอกในฟอร์ม
  const [query, setQuery] = useState({ from: "", to: "", date: "", returnDate: "" });

  // เก็บรายชื่อสนามบินทั้งหมด (dropdown) ต้นทางปลายทาง 
  const [options, setOptions] = useState({ origins: [], destinations: [] });

 
  const [loading, setLoading] = useState(true);


  const [error, setError] = useState("");

  // โหลดรายชื่อสนามบินจาก API เมื่อหน้าเพิ่งถูกเปิด
  useEffect(() => {
    async function loadAirports() {                                
      try {                                                        
        const res = await getFlights();                             // ดึง /flights
        const flights = res?.data || [];                           
        const origins = [];                                         
        const destinations = [];                                    

        // ดึงชื่อสนามบินต้นทางปลายทาง
        for (let f of flights) {                                  
          if (f.from && !origins.includes(f.from)) origins.push(f.from);       
          if (f.to && !destinations.includes(f.to)) destinations.push(f.to);   
        }
        origins.sort();                                          
        destinations.sort();                                       
        setOptions({ origins, destinations });                      // อัปเดต state 
        setError("");                                               // เคลียร์ error 
      } catch (e) {                                                
        setError("โหลดรายชื่อสนามบินไม่สำเร็จ");                    
        setOptions({ origins: [], destinations: [] });              
      } finally {                                                  
        setLoading(false);                                          
      }
    }
    loadAirports();                                                 
  }, []);                                                           // [] ทำให้ useEffect รันครั้งเดียวตอนแรก

  // เวลาเปลี่ยนค่าในช่อง input 
  function handleChange(part) {
    setQuery((old) => ({ ...old, ...part }));                       // รวมค่าที่เปลี่ยน (partial)เข้ากับของเดิม ({from:"BKK"})
  }

  // เวลา user กด Search — SearchBar จะส่งค่า (from, to, date)
  function handleSearch({ from, to, date, returnDate }) {
    const paramsObj = { from, to, date };
    if (returnDate) paramsObj.returnDate = returnDate;
    const params = new URLSearchParams(paramsObj).toString(); // สร้าง query string เช่น "from=BKK&to=CNX&date=2025-11-01"
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

export default HomePage;
