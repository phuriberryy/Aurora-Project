import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { backToForm, selectBooking, submitBooking } from './bookingSlice';

const Card = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.dark};
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
`;
const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  cursor: pointer;
`;
const Ghost = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

export default function Summary(){
  const dispatch = useDispatch();
  const booking = useSelector(selectBooking);

  const handleConfirm = () => {
    const payload = {
      flightId: booking.flight.id,
      passengers: booking.passengers,
      contact: booking.contact,
      extras: booking.extras,
      price: booking.price
    };
    dispatch(submitBooking(payload));
  };

  return (
    <div style={{display:'grid', gap:16}}>
      <Card>
        <h3 style={{ color: '#0062E6', marginTop: 0 }}>Review your booking</h3>
        <p><strong>Flight:</strong> {booking.flight?.carrier} {booking.flight?.flightNo}</p>
        <p><strong>Depart:</strong> {new Date(booking.flight?.depart).toLocaleString()}</p>
        <p><strong>Arrive:</strong> {new Date(booking.flight?.arrive).toLocaleString()}</p>
        <hr/>
        <h4>Passengers</h4>
        <ul>
          {booking.passengers.map(p => (
            <li key={p.id}>{p.type}  |  {p.firstName} {p.lastName} ({p.gender})</li>
          ))}
        </ul>
        <h4>Contact</h4>
        <p>{booking.contact.email}  |  {booking.contact.phone}</p>
        <h4>Extras</h4>
        <p>{booking.extras.baggageKg} kg baggage  |  Seats: {(booking.extras.seats && booking.extras.seats.length>0) ? booking.extras.seats.join(', ') : booking.extras.seatPref}</p>
        <h4>Total</h4>
        <p><strong>{booking.price.currency} {booking.price.total}</strong></p>
        {booking.status === 'failed' && (
          <p style={{color:'#DC3545'}}>Error: {booking.error}</p>
        )}
      </Card>
      <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
        <Ghost onClick={()=>dispatch(backToForm())}>&larr; Edit details</Ghost>
        <Button onClick={handleConfirm} disabled={booking.status==='loading'}>
          {booking.status==='loading' ? 'Confirming ...' : 'Confirm & Pay'}
        </Button>
      </div>
    </div>
  );
}



