import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadHistory } from '../component/booking/localHistory';

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
  const historyBookings = useMemo(() => {
    try {
      const items = loadHistory() || [];
      return items
        .filter((it) => it && it.snapshot && it.type === 'booking')
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (_) {
      return [];
    }
  }, []);
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
        {historyBookings.length > 0 ? (
          <div>
            <h3 style={{ marginTop: 0 }}>My Bookings</h3>
            {historyBookings.map((item, idx) => {
              const s = item.snapshot || {};
              const flight = s.flight;
              const r = s.returnFlight;
              const pax = Array.isArray(s.passengers) ? s.passengers : [];
              const booker = (() => {
                const primary = pax.find(p => (p?.type === 'ADT') && (p?.firstName || p?.lastName)) || pax[0];
                return primary ? `${primary.firstName || ''} ${primary.lastName || ''}`.trim() || '-' : '-';
              })();
              const currency = s.price?.currency || 'THB';
              return (
                <div key={item.timestamp + '-' + idx} style={{ padding: '12px 0', borderTop: idx===0 ? '0' : '1px solid rgba(0,0,0,0.06)' }}>
                  {s.confirmation && (
                    <>
                      <div>PNR: <strong>{s.confirmation.pnr}</strong></div>
                      <div>Booking ID: {s.confirmation.bookingId}</div>
                    </>
                  )}
                  <div style={{ height: 6 }} />
                  <div>Flight: <strong>{flight ? [flight.carrier, flight.flightNo].filter(Boolean).join(' ') || '-' : '-'}</strong></div>
                  <div>Booker: {booker}</div>
                  <div>Seat(s): {Array.isArray(s.extras?.seats) && s.extras.seats.length > 0 ? s.extras.seats.join(', ') : (s.extras?.seatPref || 'AUTO')}</div>
                  <div>Depart: {flight ? fmtDT(flight.departTime, flight.date) : '-'}</div>
                  <div>Arrive: {flight ? fmtDT(flight.arriveTime, flight.date) : '-'}</div>
                  <div>Fare: {flight ? `${currency} ${flight.price ?? '-'}` : '-'}</div>
                  {r && (
                    <div style={{ marginTop: 6 }}>
                      <strong>Return Flight</strong>
                      <div>Flight: <strong>{[r.carrier, r.flightNo].filter(Boolean).join(' ') || '-'}</strong></div>
                      <div>Depart: {fmtDT(r.departTime, r.date)}</div>
                      <div>Arrive: {fmtDT(r.arriveTime, r.date)}</div>
                      <div>Fare: {currency} {r.price ?? '-'}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
