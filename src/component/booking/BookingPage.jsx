// ===========================
// Imports
// ===========================
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import BookingForm from './BookingForm';
import Summary from './Summary';
import { selectStep, selectBooking, startBooking, updateFlight, updateReturnFlight } from './bookingSlice';
import { listHistory, deleteByTimestamp, clearHistory } from './localHistory';


// ===========================
// Styled Components
// ---------------------------
// ส่วนจัดสไตล์องค์ประกอบหน้า Booking (Container, Stepper, Pill, Card)
// ===========================
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


// ===========================
// Component: BookingPage
// ---------------------------
// หน้าหลักของการจอง ประกอบด้วย Stepper + เนื้อหาตามขั้นตอน (Details/Review/Done)
// ===========================
export default function BookingPage(){
  const dispatch = useDispatch();
  const location = useLocation();
  const step = useSelector(selectStep);
  const { confirmation, flight, returnFlight, passengers, extras, price } = useSelector(selectBooking);

  // Initialize booking from selected flight(s) passed via navigation state (outbound + optional inbound)
  useEffect(() => {
    const st = location?.state || {};
    const norm = (f) => !f ? null : ({
      id: f.id,
      from: f.from,
      to: f.to,
      price: Number(f.price) || 0,
      departTime: f.departTime || f.depart,
      arriveTime: f.arriveTime || f.arrive,
      carrier: f.carrier || f.airline || f.carrierCode,
      flightNo: f.code || f.flightNo || f.flight_number,
      date: f.date || f.flightDate
    });
    const outbound = norm(st.outbound || st.flight || st.selected);
    const inbound = norm(st.inbound);
    if (!outbound && !inbound) return;
    // Always restart booking when user selects a flight (even if same id)
    if (outbound) {
      dispatch(startBooking(outbound));
    } else if (inbound) {
      // fallback: start with inbound if outbound missing
      dispatch(startBooking(inbound));
    }
    if (inbound) dispatch(updateReturnFlight(inbound));
  }, [location?.state, dispatch, flight?.id]);

  // ===========================
  // Helper: fmtDT
  // ---------------------------
  // ฟอร์แมตวันที่/เวลาให้เป็นข้อความอ่านง่าย:
  // - ถ้า raw แปลงเป็น Date ได้ => ใช้ toLocaleString()
  // - ถ้าเป็นรูปแบบ HH:mm และมี dateBase => ประกอบเป็น datetime (dateBase + time)
  // - มิฉะนั้น คืนค่าข้อความเดิม
  // ===========================
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

  // ===========================
  // Render
  // ---------------------------
  // โครงร่าง:
  // - Header "Booking"
  // - Stepper แสดงสถานะขั้นตอน
  // - เนื้อหาตาม step:
  //   1) Details => <BookingForm/>
  //   2) Review  => <Summary/>
  //   3) Done    => แสดงผลยืนยัน/รายละเอียดสรุป
  // ===========================
  return (
    <Container>
      {/* Header */}
      <h1 style={{ color: '#0062E6' }}>Booking</h1>

      {/* Stepper */}
      <Stepper>
        <Pill $active={step===1}>1  -  Details</Pill>
        <Pill $active={step===2}>2  -  Review</Pill>
        <Pill $active={step===3}>3  -  Done</Pill>
      </Stepper>

      {/* Step 1: รายละเอียดการจอง */}
      {step === 1 && <BookingForm/>}

      {/* Step 2: รีวิว/ตรวจสอบก่อนยืนยัน */}
      {step === 2 && <Summary/>}

      {/* Step 3: เสร็จสิ้น/ยืนยันการจอง */}
      {step === 3 && (
        <Card>
          <h2 style={{ marginTop: 0 }}>Booking confirmed!</h2>
          {confirmation ? (
            <>
              {/* รหัสการจอง/PNR */}
              <p>PNR: <strong>{confirmation.pnr}</strong></p>
              <p>Booking ID: {confirmation.bookingId}</p>

              <div style={{ height: 8 }} />

              {/* ข้อมูลไฟลต์แบบย่อ */}
              <p>Flight: <strong>{flight ? [flight.carrier, flight.flightNo].filter(Boolean).join(' ') || '-' : '-'}</strong></p>

              {/* ผู้จอง (เลือกผู้โดยสาร ADT ที่มีชื่อ/นามสกุล หรือคนแรกในลิสต์) */}
              <p>Booker: {(() => {
                const pax = Array.isArray(passengers) ? passengers : [];
                const primary = pax.find(p => (p?.type === 'ADT') && (p?.firstName || p?.lastName)) || pax[0];
                return primary ? `${primary.firstName || ''} ${primary.lastName || ''}`.trim() || '-' : '-';
              })()}</p>

              {/* ที่นั่ง/ความต้องการที่นั่ง */}
              <p>Seat(s): {extras?.seats && extras.seats.length > 0 ? extras.seats.join(', ') : (extras?.seatPref || 'AUTO')}</p>

              {/* เวลาเดินทาง */}
              <p>Depart: {flight ? fmtDT(flight.departTime, flight.date) : '-'}</p>
              <p>Arrive: {flight ? fmtDT(flight.arriveTime, flight.date) : '-'}</p>
              <p>Fare: {flight ? `${(price?.currency || 'THB')} ${flight.price ?? '-'}` : '-'}</p>

              {returnFlight && (
                <>
                  <div style={{ height: 8 }} />
                  <p>Return Flight: <strong>{[returnFlight.carrier, returnFlight.flightNo].filter(Boolean).join(' ') || '-'}</strong></p>
                  <p>Depart: {fmtDT(returnFlight.departTime, returnFlight.date)}</p>
                  <p>Arrive: {fmtDT(returnFlight.arriveTime, returnFlight.date)}</p>
                  <p>Fare: {(price?.currency || 'THB')} {returnFlight.price ?? '-'}</p>
                </>
              )}

            </>
          ) : (
            // กรณีไม่มีรายละเอียดเพิ่มเติม แสดงข้อความยืนยันอย่างย่อ
            <p>Your booking is confirmed.</p>
          )}

          {/* แจ้งส่งอีเมล e-ticket */}
          <p>We sent your e-ticket to your email - Thank you 😜</p>

          
          
        </Card>
      )}
    </Container>
  );
}


