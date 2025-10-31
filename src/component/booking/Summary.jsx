import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { backToForm, selectBooking, submitBooking, updateFlight } from './bookingSlice';
import { getFlight } from '../../services/api';

const Card = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.dark};
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
`;
const Button = styled.button`
  padding: 10px 14px;
  border-radius: 20px;
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

  const fmtDateTime = (raw) => {
    if (!raw) return '-';
    const d = new Date(raw);
    if (!Number.isNaN(d.valueOf())) return d.toLocaleString();
    const dateBase = booking.flight?.date;
    if (dateBase && /^\d{2}:\d{2}/.test(String(raw))) {
      const t = String(raw).slice(0,5);
      const composed = `${dateBase}T${t}:00`;
      const d2 = new Date(composed);
      if (!Number.isNaN(d2.valueOf())) return d2.toLocaleString();
    }
    return String(raw);
  };

  useEffect(() => {
    const id = booking?.flight?.id;
    if (!id) return;
    const needsFetch = !(booking.flight.departTime && booking.flight.arriveTime && booking.flight.date);
    if (needsFetch) {
      getFlight(id)
        .then((res) => {
          const f = res?.data || {};
          dispatch(updateFlight({
            departTime: f.departTime || f.depart,
            arriveTime: f.arriveTime || f.arrive,
            date: f.date || booking.flight.date,
            from: f.from || booking.flight.from,
            to: f.to || booking.flight.to,
            price: Number(f.price) || booking.price.base,
            carrier: f.carrier || booking.flight.carrier,
            flightNo: f.code || f.flightNo || booking.flight.flightNo,
          }));
        })
        .catch(() => {});
    }
  }, [booking?.flight?.id]);

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
        <p><strong>Depart:</strong> {fmtDateTime(booking.flight?.departTime)}</p>
        <p><strong>Arrive:</strong> {fmtDateTime(booking.flight?.arriveTime)}</p>
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



