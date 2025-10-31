import React, { useEffect, useState } from "react";
import http from "../services/http";
import FlightList from "../component/flights/FlightList";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";
import SortSelect from "../component/flights/SortSelect";

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
    const date = params.get("date");

    useEffect(() => {
        if (!from || !to || !date) navigate("/", { replace: true });
    }, [from, to, date, navigate]);

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sort, setSort] = useState("default");

    useEffect(() => {
        if (!from || !to || !date) return;
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const q = { from, to, date };
                const response = await http.get("/flights", { params: q });
                setFlights(response.data);
            } catch (err) {
                setError(err.message || "Failed to load flights");
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, [from, to, date]);

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

    if (loading) return <p>Loading flights...</p>;
    if (error) return <p>Error loading flights: {error}</p>;

    return (
        <div>
            <h1>Available Flights</h1>
            <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                border: "1px solid #eee", borderRadius: 12, padding: "8px 12px", marginBottom: 12
            }}>
                <div><strong>{from} → {to}</strong> • {date}</div>
                <Link to={`/?from=${from}&to=${to}&date=${date}`}>Edit search</Link>
            </div>
            <div style={{ marginBottom: 16 }}>
                <SortSelect value={sort} onChange={setSort} />
            </div>
            {sorted.length === 0 ? (
                <p>No flights available.</p>
            ) : (
                <FlightList flights={sorted} date={date} />

            )}
        </div>
    );
};

export default FlightsPage;
