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
  border-radius: 12px;
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

  return (
    <Container>
      <Heading>My Bookings</Heading>
      <Card>
        {booking?.confirmation ? (
          <>
            <p>Latest booking:</p>
            <p>PNR: <strong>{booking.confirmation.pnr}</strong></p>
            <p>Booking ID: {booking.confirmation.bookingId}</p>
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