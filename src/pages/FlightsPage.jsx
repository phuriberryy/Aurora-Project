import React, { useEffect, useState } from "react";
import http from "../services/http";
import FlightList from "../component/flights/FlightList";

const FlightsPage = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const response = await http.get("/flights");
                setFlights(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, []);

    if (loading) return <p>Loading flights...</p>;
    if (error) return <p>Error loading flights: {error}</p>;

    return (
        <div>
            <h1>Available Flights</h1>
            {flights.length === 0 ? (
                <p>No flights available.</p>
            ) : (
                <FlightList flights={flights} />
                
            )}
        </div>
    );
};

export default FlightsPage;
