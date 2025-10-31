import React, { useMemo, useEffect } from 'react';

import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';

import { addPassenger, removePassenger, updatePassenger, updateContact, updateExtras, selectBooking, goToSummary, updateFlight } from './bookingSlice';
import { getFlight } from '../../services/api';

import MultiSeatPicker from './MultiSeatPicker';



const Card = styled.section`

  padding: 16px;

  background: ${({ theme }) => theme.colors.white};

  color: ${({ theme }) => theme.colors.dark};

  border-radius: 20px;

  margin-bottom: 16px;

  border: 1px solid rgba(0,0,0,0.06);

  box-shadow: 0 6px 18px rgba(0,0,0,0.08);

`;

const Title = styled.h2`

  margin: 0 0 12px;

  font-size: 22px;

  color: ${({ theme }) => theme.colors.primary};

`;

const SubTitle = styled.h3`

  margin: 16px 0 8px;

  font-size: 16px;

  color: ${({ theme }) => theme.colors.dark};

`;

const Row = styled.div`

  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));

  gap: 12px;

`;

const Input = styled.input`

  padding: 10px 12px;

  margin: 10px 0;

  border-radius: 10px;

  border: 1px solid rgba(0,0,0,0.12);

  background: #fff;

  color: ${({ theme }) => theme.colors.dark};

`;

const Select = styled.select`

  padding: 10px 12px;

  margin: 10px 0;

  border-radius: 10px;

  border: 1px solid rgba(0,0,0,0.12);

  background: #fff;

  color: ${({ theme }) => theme.colors.dark};

`;

const Button = styled.button`

  padding: 10px 14px;

  margin: 10px 0;

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

const Danger = styled(Button)`

  background: ${({ theme }) => theme.colors.danger};

`;



export default function BookingForm() {

  const dispatch = useDispatch();

  const booking = useSelector(selectBooking);

  const formValid = useMemo(() => Boolean(booking.flight), [booking.flight]);
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
    const hasTimes = booking.flight.departTime && booking.flight.arriveTime;
    if (!hasTimes) {
      getFlight(id).then(res => {
        const f = res?.data || {};
        dispatch(updateFlight({
          departTime: f.departTime || f.depart,
          arriveTime: f.arriveTime || f.arrive,
          date: f.date || booking.flight.date,
          from: f.from || booking.flight.from,
          to: f.to || booking.flight.to,
          price: Number(f.price) || booking.price.base,
          carrier: f.carrier || booking.flight.carrier,
          flightNo: f.code || f.flightNo || booking.flight.flightNo
        }));
      }).catch(() => {});
    }
  }, [
    booking?.flight?.id,
    booking?.flight?.departTime,
    booking?.flight?.arriveTime,
    booking?.flight?.carrier,
    booking?.flight?.flightNo,
    booking?.flight?.date,
    booking?.flight?.from,
    booking?.flight?.to,
    booking.price.base,
    dispatch
  ]);



  return (

    <div>

      <Card>

        <Title>Booking Details</Title>



        <SubTitle>Flight</SubTitle>

        {booking.flight ? (

          <Row>

            <div><strong>{booking.flight.carrier} {booking.flight.flightNo}</strong></div>

            <div>Depart: {fmtDateTime(booking.flight.departTime)}</div>

            <div>Arrive: {fmtDateTime(booking.flight.arriveTime)}</div>

            <div>Fare: {booking.price.currency} {booking.price.base}</div>

          </Row>

        ) : (

          <p>No flight selected. Return to Flights and choose one.</p>

        )}



        <SubTitle>Passengers</SubTitle>

        {booking.passengers.map((p) => (

          <Row key={p.id}>

            <Select value={p.type} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{type: e.target.value}}))}>

              <option value="ADT">Adult</option>

              <option value="CHD">Child</option>

              <option value="INF">Infant</option>

            </Select>

            <Input placeholder="First name" value={p.firstName} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{firstName: e.target.value}}))} />

            <Input placeholder="Last name" value={p.lastName} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{lastName: e.target.value}}))} />

            <Select value={p.gender} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{gender: e.target.value}}))}>

              <option value="UNSPEC">Gender</option>

              <option value="M">Male</option>

              <option value="F">Female</option>

              <option value="X">None</option>

            </Select>

            {booking.passengers.length > 1 && (

              <Danger onClick={()=>dispatch(removePassenger(p.id))}>Remove</Danger>

            )}

          </Row>

        ))}

        <div style={{marginTop:12, display:'flex', gap:8}}>

          <Ghost onClick={()=>dispatch(addPassenger())}>+ Add passenger</Ghost>

        </div>



        <SubTitle>Contact</SubTitle>

        <Row>

          <Input placeholder="Email" value={booking.contact.email} onChange={(e)=>dispatch(updateContact({email: e.target.value}))} />

          <Input placeholder="Phone" value={booking.contact.phone} onChange={(e)=>dispatch(updateContact({phone: e.target.value}))} />

        </Row>



                <SubTitle>Extras</SubTitle>

        <Row>

          <label>

            Baggage (kg)

            <Input type="number" min={0} max={40} value={booking.extras.baggageKg}

              onChange={(e)=>dispatch(updateExtras({baggageKg: Number(e.target.value)}))}/>

          </label>

        </Row>

        <SubTitle>Seat Selection</SubTitle>
        <MultiSeatPicker
          capacity={booking.passengers.length}
          value={booking.extras.seats || []}
          onChange={(arr)=>dispatch(updateExtras({ seats: arr, seatPref: (arr && arr.length>0) ? arr[0] : 'AUTO' }))}
        />



        <SubTitle>Price</SubTitle>

        <Row>

          <div>Base: {booking.price.currency} {booking.price.base}</div>

          <div>Taxes: {booking.price.currency} {booking.price.taxes}</div>

          <div>Extras: {booking.price.currency} {booking.price.extras}</div>

          <div><strong>Total: {booking.price.currency} {booking.price.total}</strong></div>

        </Row>

      </Card>



      <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>

        <Button disabled={!formValid} onClick={() => dispatch(goToSummary())}> Review &amp; 
          Continue →
        </Button>

      </div>

    </div>

  );

}



















