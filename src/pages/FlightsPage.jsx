import React, { useEffect, useState, useMemo, useRef } from "react";
import http from "../services/http";
import FlightList from "../component/flights/FlightList";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import SortSelect from "../component/flights/SortSelect";
import PlaneLoader from "../component/ui/PlaneLoader";

const toMin = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
};
const durToMin = (s) => {
    if (typeof s === "string" && /h/i.test(s)) {
        const m = s.match(/(\d+)h\s*(\d+)m?/i);
        if (m) return (+m[1]) * 60 + (+m[2] || 0);
    }
    return 0;
};

const FlightsPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const from = params.get("from");
    const to = params.get("to");
    const departDate = params.get("date");
    const returnDate = params.get("returnDate");
    const isReturn = !!returnDate;
    const returnRef = useRef(null);
    const [isHighlighting, setIsHighlighting] = useState(false);

    useEffect(() => {
        if (!from || !to || !departDate) navigate("/", { replace: true });
    }, [from, to, departDate, navigate]);

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState("default");

    const [selOut, setSelOut] = useState(null);
    const [selRet, setSelRet] = useState(null);

    useEffect(() => {
        if (!from || !to || !departDate) return;
        const fetchFlights = async () => {
            setLoading(true);
            setError(null);
            try {
                if (isReturn) {
                    const responseDepart = await http.get("/flights", {
                        params: { from, to, date: departDate }
                    });
                    const responseReturn = await http.get("/flights", {
                        params: { from: to, to: from, date: returnDate }
                    });
                    const response = {
                        data: [
                            ...(responseDepart.data || []).map(f => ({ ...f, _segment: "outbound" })),
                            ...(responseReturn.data || []).map(f => ({ ...f, _segment: "return" })),
                        ]
                    };
                    setFlights(response.data);
                } else {
                    const response = await http.get("/flights", {
                        params: { from, to, date: departDate }
                    });
                    const list = (response.data || []).map(f => ({ ...f, _segment: "outbound" }));
                    setFlights(list);
                }
            } catch (err) {
                setError(err.message || "Failed to load flights");
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, [from, to, departDate, isReturn, returnDate]);

    const sorted = useMemo(() => {
        const list = [...flights];
        const cmp = {
            price: (a, b) => (+a.price || 0) - (+b.price || 0),
            departTime: (a, b) => toMin(a.departTime) - toMin(b.departTime),
            arriveTime: (a, b) => toMin(a.arriveTime) - toMin(b.arriveTime),
            duration: (a, b) =>
                (a.duration ? durToMin(a.duration) : toMin(a.arriveTime) - toMin(a.departTime)) -
                (b.duration ? durToMin(b.duration) : toMin(b.arriveTime) - toMin(b.departTime)),
        }[sort];
        return cmp ? list.sort(cmp) : list;
    }, [flights, sort]);

    const handleSelect = (flight) => {
        if (flight._segment === "return") {
            setSelRet(flight);
            if (selOut) {
                navigate("/booking", { state: { outbound: selOut, inbound: flight } });
            }
        } else {
            setSelOut(flight);
            if (isReturn) {
                returnRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setIsHighlighting(true);
                setTimeout(() => setIsHighlighting(false), 1000);
            } else {
                navigate("/booking", { state: { outbound: flight } });
            }
        }
    };

    if (loading) return <PlaneLoader />;
    if (error) return <p>Error loading flights: {error}</p>;

    return (
        <div>
            <h1>Available Flights</h1>
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                border: "1px solid #eee", borderRadius: 12, padding: "8px 12px", marginBottom: 12
            }}>
                <div>
                    <strong>{from} → {to}</strong> • {departDate}
                    {isReturn && <div><strong>{to} → {from}</strong> • {returnDate}</div>}
                </div>
                <Link to={`/home?from=${from}&to=${to}&date=${departDate}${isReturn ? `&returnDate=${returnDate}` : ""}`}>
                    Edit search
                </Link>
            </div>
            <div style={{ marginBottom: 16 }}>
                <SortSelect value={sort} onChange={setSort} />
            </div>
            {sorted.length === 0 ? (
                <p>No flights available.</p>
            ) : (
                <>
                <FlightList
                    flights={sorted.filter((f) => f._segment === "outbound")}
                    date={departDate}
                    onSelect={handleSelect}
                />
                {isReturn && (
                <>
                    <h2
                        ref={returnRef}
                        style={{
                            marginTop: 24,
                            transition: "background-color 0.5s ease",
                            backgroundColor: isHighlighting
                                ? "rgba(255, 235, 59, 0.4)"
                                : "transparent",
                            padding: "6px 10px",
                            borderRadius: "8px",
                        }}
                    >Return • {to} → {from} • {returnDate}</h2>
                    <FlightList
                        flights={sorted.filter((f) => f._segment === "return")}
                        date={returnDate}
                        onSelect={handleSelect}
                    />
                </>
                )}   
                </>
            )}         
        </div>
    );
};

export default FlightsPage;
