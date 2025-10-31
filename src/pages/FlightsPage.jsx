import React, { useEffect, useState } from "react";
import http from "../services/http";
import FlightList from "../component/flights/FlightList";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";

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

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (!from || !to || !date) return;
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const q = { from, to, date };
                const response = await http.get("/flights", { params: q });
                setFlights(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, [from, to, date]);

    const filtered = useMemo(() => {
        const min = minPrice === "" ? -Infinity : Number(minPrice);
        const max = maxPrice === "" ? Infinity : Number(maxPrice);
        return flights.filter(f => {
            const okMin = f.price >= min;
            const okMax = f.price <= max;
            const okStatus = !status || f.status === status;
            return okMin && okMax && okStatus;
        });
    }, [flights, minPrice, maxPrice, status]);

    if (loading) return <p>Loading flights...</p>;
    if (error) return <p>Error loading flights: {error}</p>;

    return (
        <div>
            <h1>Available Flights</h1>
            <strong>Filter by Price:</strong>
            <Link to={`/?from=${from}&to=${to}&date=${date}`}>Edit search</Link>
            <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "8px 0 16px" }}>
                <input
                    type="number" placeholder="Min ฿"
                    value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                    style={{ width: 110 }}
                />
                <input
                    type="number" placeholder="Max ฿"
                    value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ width: 110 }}
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All status</option>
                    <option value="On Time">On Time</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>
            {filtered.length === 0 ? (
                <p>No flights available.</p>
            ) : (
                <FlightList flights={filtered} date={date} />
                
            )}
        </div>
    );
};

export default FlightsPage;
