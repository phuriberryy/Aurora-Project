import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Container = styled.main`
  max-width: 700px;
  margin: 40px auto;
  padding: 0 16px;
`;
const Heading = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 16px;
`;
const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.dark};
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
`;
const Button = styled(Link)`
  display: inline-block;
  padding: 10px 14px;
  border-radius: 10px;
  border: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  text-decoration: none;
`;

export default function MyBookingsPage() {
  const booking = useSelector((state) => state.booking);
  const fmtDT = (raw, dateBase) => {
    if (!raw) return '-';
    const d = new Date(raw);
    if (!Number.isNaN(d.valueOf())) return d.toLocaleString();
    if (dateBase && /^\d{2}:\d{2}/.test(String(raw))) {
      const t = String(raw).slice(0,5);
      const composed = `${dateBase}T${t}:00`;
      const d2 = new Date(composed);
      if (!Number.isNaN(d2.valueOf())) return d2.toLocaleString();
    }
    return String(raw);
  };

  return (
    <Container>
      <Heading>My Bookings</Heading>
      <Card>
        {booking?.confirmation ? (
          <>
            <p>Latest booking:</p>
            <p>PNR: <strong>{booking.confirmation.pnr}</strong></p>
            <p>Booking ID: {booking.confirmation.bookingId}</p>
            <div style={{ height: 8 }} />
            <p>Flight: <strong>{booking.flight ? [booking.flight.carrier, booking.flight.flightNo].filter(Boolean).join(' ') || '-' : '-'}</strong></p>
            <p>Booker: {(() => {
              const pax = Array.isArray(booking.passengers) ? booking.passengers : [];
              const primary = pax.find(p => (p?.type === 'ADT') && (p?.firstName || p?.lastName)) || pax[0];
              return primary ? `${primary.firstName || ''} ${primary.lastName || ''}`.trim() || '-' : '-';
            })()}</p>
            <p>Seat(s): {booking?.extras?.seats && booking.extras.seats.length > 0 ? booking.extras.seats.join(', ') : (booking?.extras?.seatPref || 'AUTO')}</p>
            <p>Depart: {booking.flight ? fmtDT(booking.flight.departTime, booking.flight.date) : '-'}</p>
            <p>Arrive: {booking.flight ? fmtDT(booking.flight.arriveTime, booking.flight.date) : '-'}</p>
            <p>Fare: {booking.flight ? `${booking?.price?.currency || 'THB'} ${booking.flight.price ?? '-'}` : '-'}</p>

            {booking.returnFlight && (
              <>
                <hr/>
                <h4>Return Flight</h4>
                <p>Flight: <strong>{[booking.returnFlight.carrier, booking.returnFlight.flightNo].filter(Boolean).join(' ') || '-'}</strong></p>
                <p>Depart: {fmtDT(booking.returnFlight.departTime, booking.returnFlight.date)}</p>
                <p>Arrive: {fmtDT(booking.returnFlight.arriveTime, booking.returnFlight.date)}</p>
                <p>Fare: {(booking?.price?.currency || 'THB')} {booking.returnFlight.price ?? '-'}</p>
              </>
            )}
          </>
        ) : (
          <>
            <p>You have no bookings yet.</p>
            <Button to="/booking">Book a Flight</Button>
          </>
        )}
      </Card>
    </Container>
  );
}
