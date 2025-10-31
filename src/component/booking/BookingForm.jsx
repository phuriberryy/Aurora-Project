// ===========================
// Imports
// ===========================
import React, { useMemo, useEffect, useState } from 'react';

import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';

import { addPassenger, removePassenger, updatePassenger, updateContact, updateExtras, selectBooking, goToSummary, updateFlight } from './bookingSlice';
import { getFlight } from '../../services/api';

import MultiSeatPicker from './MultiSeatPicker';


// ===========================
// Styled Components
// ---------------------------
// ส่วนนี้คือสไตล์ของ UI เช่น Card, Title, Input ฯลฯ
// ===========================
const Card = styled.section`
  padding: 16px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.dark};
  border-radius: 12px;
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
  border: 1px solid ${({ $invalid, theme }) => $invalid ? theme.colors.danger : 'rgba(0,0,0,0.12)'};
  background: #fff;
  color: ${({ theme }) => theme.colors.dark};
`;

const Select = styled.select`
  padding: 10px 12px;
  margin: 10px 0;
  border-radius: 10px;
  border: 1px solid ${({ $invalid, theme }) => $invalid ? theme.colors.danger : 'rgba(0,0,0,0.12)'};
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

const ErrorBox = styled.div`
  margin: 8px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(220, 53, 69, 0.08);
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  font-weight: 600;
`;


// ===========================
// Component: BookingForm
// ---------------------------
// ฟอร์มการจองหลัก: แสดงเที่ยวบิน ผู้โดยสาร ผู้ติดต่อ Extras ที่นั่ง และราคา
// ===========================
export default function BookingForm() {
  // --- Redux hooks ---
  const dispatch = useDispatch();
  const booking = useSelector(selectBooking);

  // --- Local UI state (error flags) ---
  const [errors, setErrors] = useState({
    flight: false,
    contact: { email: false, phone: false },
    passengers: {}
  });
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  // ===========================
  // Derived State: formValid
  // ---------------------------
  // ตรวจสอบความครบถ้วนของฟอร์มโดยรวมแบบ memoized
  // เงื่อนไข: ต้องมี flight, email/phone ถูกต้อง, มีผู้โดยสาร และมีชื่อ-นามสกุลครบ
  // ===========================
  const formValid = useMemo(() => {
    if (!booking.flight) return false;
    const email = booking?.contact?.email || '';
    const phone = booking?.contact?.phone || '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (!phone || String(phone).trim().length < 6) return false;
    const pax = booking?.passengers || [];
    if (pax.length === 0) return false;
    for (const p of pax) {
      if (!p.firstName || !p.lastName) return false;
    }
    return true;
  }, [booking.flight, booking?.contact?.email, booking?.contact?.phone, booking?.passengers]);

  // ===========================
  // Helper: fmtDateTime
  // ---------------------------
  // แปลงค่าเวลาหยาบให้เป็นข้อความที่อ่านง่าย:
  // 1) ถ้าเป็น Date ที่ parse ได้ => แสดง locale string
  // 2) ถ้าเป็นรูปแบบ HH:mm และมี date ฐาน => สร้าง datetime จาก date+time
  // 3) อย่างอื่น => คืนค่าเป็น string เดิม
  // ===========================
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

  // ===========================
  // Effect: เติมข้อมูลเที่ยวบินให้ครบ (เวลา/รหัส/ราคา ฯลฯ) เมื่อมี flight.id
  // ---------------------------
  // เงื่อนไข:
  // - มี flight.id แล้ว
  // - แต่ยังไม่มี departTime/arriveTime จึง fetch รายละเอียด flight เพิ่มเติม
  // จากนั้น dispatch(updateFlight) เพื่อเติมข้อมูลที่ขาด
  // ===========================
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

  // ===========================
  // Validator: validate()
  // ---------------------------
  // ตรวจสอบทีละส่วนและตั้งค่า error flags:
  // - flight ต้องมี
  // - email/phone ต้องถูกต้อง
  // - ผู้โดยสารทุกคนต้องมี firstName/lastName
  // คืนค่า true เมื่อผ่านทั้งหมด
  // ===========================
  const validate = () => {
    const nextErrors = { flight: false, contact: { email: false, phone: false }, passengers: {} };
    if (!booking.flight) {
      nextErrors.flight = true;
    }
    const email = booking?.contact?.email || '';
    const phone = booking?.contact?.phone || '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.contact.email = true;
    if (!phone || String(phone).trim().length < 6) nextErrors.contact.phone = true;
    const pax = booking?.passengers || [];
    pax.forEach((p) => {
      const pErr = { firstName: false, lastName: false };
      if (!p.firstName || String(p.firstName).trim() === '') pErr.firstName = true;
      if (!p.lastName || String(p.lastName).trim() === '') pErr.lastName = true;
      if (pErr.firstName || pErr.lastName) nextErrors.passengers[p.id] = pErr;
    });
    setErrors(nextErrors);
    const hasAnyError = nextErrors.flight || nextErrors.contact.email || nextErrors.contact.phone || Object.keys(nextErrors.passengers).length > 0;
    setShowErrorMsg(hasAnyError);
    return !hasAnyError;
  };

  // ===========================
  // Handler: handleContinue()
  // ---------------------------
  // ถ้าผ่าน validate => ปิดข้อความ error แล้วไปหน้า Summary (goToSummary)
  // ===========================
  const handleContinue = () => {
    if (validate()) {
      setShowErrorMsg(false);
      dispatch(goToSummary());
    }
  };

  // ===========================
  // Render
  // ---------------------------
  // แสดงข้อมูลแต่ละส่วน: Flight / Passengers / Contact / Extras / Seat / Price
  // พร้อม error message เมื่อกรอกไม่ครบ
  // ===========================
  return (
    <div>
      <Card>
        <Title>Booking Details</Title>

        {/* -------- Flight Section -------- */}
        <SubTitle>Flight</SubTitle>
        {booking.flight ? (
          <Row>
            <div><strong>{booking.flight.carrier} {booking.flight.flightNo}</strong></div>
            <div>Depart: {fmtDateTime(booking.flight.departTime)}</div>
            <div>Arrive: {fmtDateTime(booking.flight.arriveTime)}</div>
            <div>Fare: {booking.price.currency} {booking.price.base}</div>
          </Row>
        ) : (
          <p style={{ color: errors.flight ? '#dc3545' : undefined }}>No flight selected. Return to Flights and choose one.</p>
        )}

        {/* -------- Passengers Section -------- */}
        <SubTitle>Passengers</SubTitle>
        {booking.passengers.map((p) => (
          <Row key={p.id}>
            <Select value={p.type} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{type: e.target.value}}))}>
              <option value="ADT">Adult</option>
              <option value="CHD">Child</option>
              <option value="INF">Infant</option>
            </Select>

            <Input $invalid={Boolean(errors.passengers[p.id]?.firstName)} placeholder="First name" value={p.firstName} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{firstName: e.target.value}}))} />

            <Input $invalid={Boolean(errors.passengers[p.id]?.lastName)} placeholder="Last name" value={p.lastName} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{lastName: e.target.value}}))} />

            <Select value={p.gender} onChange={(e)=>dispatch(updatePassenger({id:p.id, changes:{gender: e.target.value}}))}>
              <option value="UNSPEC">Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="etc.">etc.</option>
            </Select>

            {booking.passengers.length > 1 && (
              <Danger onClick={()=>dispatch(removePassenger(p.id))}>Remove</Danger>
            )}
          </Row>
        ))}

        <div style={{marginTop:12, display:'flex', gap:8}}>
          <Ghost onClick={()=>dispatch(addPassenger())}>+ Add passenger</Ghost>
        </div>

        {/* -------- Contact Section -------- */}
        <SubTitle>Contact</SubTitle>
        <Row>
          <Input $invalid={errors.contact.email} placeholder="Email" value={booking.contact.email} onChange={(e)=>dispatch(updateContact({email: e.target.value}))} />
          <Input $invalid={errors.contact.phone} placeholder="Phone" value={booking.contact.phone} onChange={(e)=>dispatch(updateContact({phone: e.target.value}))} />
        </Row>

        {/* -------- Extras Section -------- */}
        <SubTitle>Extras</SubTitle>
        <Row>
          <label>
            Baggage (kg)
            <Input type="number" min={0} max={40} value={booking.extras.baggageKg}
              onChange={(e)=>dispatch(updateExtras({baggageKg: Number(e.target.value)}))}/>
          </label>
        </Row>

        {/* -------- Seat Selection Section -------- */}
        <SubTitle>Seat Selection</SubTitle>
        <MultiSeatPicker
          capacity={booking.passengers.length}
          value={booking.extras.seats || []}
          onChange={(arr)=>dispatch(updateExtras({ seats: arr, seatPref: (arr && arr.length>0) ? arr[0] : 'AUTO' }))}
        />

        {/* -------- Price Summary Section -------- */}
        <SubTitle>Price</SubTitle>
        <Row>
          <div>Base: {booking.price.currency} {booking.price.base}</div>
          <div>Taxes: {booking.price.currency} {booking.price.taxes}</div>
          <div>Extras: {booking.price.currency} {booking.price.extras}</div>
          <div><strong>Total: {booking.price.currency} {booking.price.total}</strong></div>
        </Row>

        {/* -------- Error Message -------- */}
        {showErrorMsg && (
          <ErrorBox>
            Please complete all required fields
          </ErrorBox>
        )}

      </Card>

      {/* -------- Footer Actions -------- */}
      <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
        <Button onClick={handleContinue}>Review &amp; Continue</Button>
      </div>

    </div>
  );
}
