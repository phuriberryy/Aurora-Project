import PropTypes from "prop-types";
import FlightCard from "./FlightCard";

const FlightList = ({ flights, date, onSelect }) => {
    return (
        <div>
            {flights.length === 0 ? (
                <p>No flights available.</p>
            ) : (
                flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} date={date} onSelect={onSelect}/>
                ))
            )}
        </div>
    );
};

FlightList.propTypes = {
    flights: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            from: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            departTime: PropTypes.string.isRequired,
            arriveTime: PropTypes.string.isRequired,
        })
    ).isRequired,
    onSelect: PropTypes.func,
};

export default FlightList;

