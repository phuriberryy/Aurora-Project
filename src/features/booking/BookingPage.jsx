import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import BookingForm from './BookingForm';
import Summary from './Summary';
import { selectStep, selectBooking } from './bookingSlice';

const Container = styled.main`
  max-width: 700px;
  margin: 40px auto;
  padding: 0 16px;
`;
const Stepper = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;
const Pill = styled.div`
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: ${(p)=> (p.$active ? p.theme.colors.primary : 'transparent')};
  color: ${(p)=> (p.$active ? p.theme.colors.white : p.theme.colors.dark)};
`;
const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.dark};
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border: 1px solid rgba(0,0,0,0.06);
`;

export default function BookingPage(){
  const step = useSelector(selectStep);
  const { confirmation } = useSelector(selectBooking);
  return (
    <Container>
      <h1 style={{ color: '#0062E6' }}>Booking</h1>
      <Stepper>
        <Pill $active={step===1}>1  -  Details</Pill>
        <Pill $active={step===2}>2  -  Review</Pill>
        <Pill $active={step===3}>3  -  Done</Pill>
      </Stepper>
      {step === 1 && <BookingForm/>}
      {step === 2 && <Summary/>}
      {step === 3 && (
        <Card>
          <h2 style={{ marginTop: 0 }}>Booking confirmed!</h2>
          {confirmation ? (
            <>
              <p>PNR: <strong>{confirmation.pnr}</strong></p>
              <p>Booking ID: {confirmation.bookingId}</p>
            </>
          ) : (
            <p>Your booking is confirmed.</p>
          )}
          <p>We sent your e-ticket to your email.</p>
        </Card>
      )}
    </Container>
  );
}

