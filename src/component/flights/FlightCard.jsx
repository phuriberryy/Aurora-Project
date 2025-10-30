import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "../ui/Button";

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin: 10px 0;
  border: 1px solid #eee;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Left = styled.div`
  display: grid;
  gap: 4px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px; 
`;

const Price = styled.div`
  text-align: center;
  font-weight: 700;
  min-width: 90px;
  color: #0077cc;
`;

const FlightCard = ({ flight }) => {
    return (
        <Card>
            <Left>
                <div>
                    <h2>{flight.from} &rarr; {flight.to}</h2>
                </div>
                <div>
                    Departure: {flight.departTime}
                </div>
                <div>
                    Arrival: {flight.arriveTime}
                </div>
            </Left>
            <Right>
            <Price>${flight.price}</Price>
            <Button>Select</Button>
            </Right>
            
        </Card>
    );
};

FlightCard.propTypes = {
    flight: PropTypes.shape({
        id: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        departTime: PropTypes.string.isRequired,
        arriveTime: PropTypes.string.isRequired,
    }).isRequired,
};

export default FlightCard;