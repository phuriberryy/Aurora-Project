// ===========================
// Imports
// ===========================
import React, { useMemo } from 'react';
import styled from 'styled-components';


// ===========================
// Styled Components
// ---------------------------
// โครงร่างปุ่มเลือกที่นั่งแบบ 2 คอลัมน์ซ้าย-ขวา คั่นด้วยช่องทางเดิน (Aisle)
// ===========================
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  align-items: start;
  gap: 8px 24px;
`;
const Col = styled.div`
  display: grid;
  grid-auto-rows: 36px;
  gap: 8px;
`;
const Seat = styled.button`
  width: 56px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.12);
  background: ${({ $selected, theme }) => ($selected ? theme.colors.primary : '#fff')};
  color: ${({ $selected, theme }) => ($selected ? theme.colors.white : theme.colors.dark)};
  font-weight: 600;
  cursor: pointer;
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;
const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  align-self: center;
`;


// ===========================
// Component: MultiSeatPicker
// ---------------------------
// Props:
// - capacity: จำนวนที่นั่งสูงสุดที่เลือกได้
// - value: รายการโค้ดที่นั่งที่ถูกเลือก (เช่น ["A1","B2"])
// - onChange: callback เมื่อมีการเลือก/ยกเลิกเลือก ส่ง array ใหม่กลับไป
// พฤติกรรม:
// - สร้างที่นั่งซ้าย (A..J แถว 1), ช่องทางเดิน, ขวา (A..J แถว 2)
// - ถ้าเลือกครบ capacity แล้ว ปุ่มที่ยังไม่ถูกเลือกจะถูก disable (opacity ลดลง)
// ===========================
export default function MultiSeatPicker({ capacity = 1, value = [], onChange, reserved = [] }){
  // --- เตรียมตัวอักษร A..J ด้วย useMemo เพื่อลดการคำนวณซ้ำ ---
  const letters = useMemo(() => Array.from({ length: 10 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)), []); // A..J

  // --- จัดกลุ่มที่นั่งซ้าย/ขวา (คอลัมน์ที่ 1 และ 2) ---
  const left = letters.map(l => `${l}1`);
  const right = letters.map(l => `${l}2`);

  // --- แปลง value เป็น Set เพื่อเช็คสมาชิกได้ O(1) ---
  const selected = new Set(value);

  // --- flag ว่าเลือกครบจำนวนสูงสุดแล้วหรือยัง ---
  const maxed = selected.size >= capacity;

  // ===========================
  // Handler: toggle(code)
  // ---------------------------
  // - ถ้าที่นั่งถูกเลือกอยู่ => เอาออก
  // - ถ้ายังไม่ถูกเลือกและยังไม่ครบ capacity => เพิ่มเข้าไป
  // - เรียก onChange ด้วย array ใหม่
  // ===========================
  const toggle = (code) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code); else { if (!maxed) next.add(code); }
    onChange(Array.from(next));
  };

  // ===========================
  // Renderer: renderCol(arr)
  // ---------------------------
  // รับอาร์เรย์โค้ดที่นั่ง (เช่น ["A1","B1",...]) แล้วเรนเดอร์เป็นปุ่มที่นั่ง
  // - ปุ่มจะสะท้อนสถานะ selected/disabled
  // - onClick จะ toggle ที่นั่งนั้น (ถ้าไม่ disabled)
  // ===========================
  const reservedSet = useMemo(() => new Set((reserved || []).map(String)), [reserved]);
  const renderCol = (arr) => arr.map(code => {
    const isSel = selected.has(code);
    const isReserved = reservedSet.has(code);
    const disabled = (!isSel && maxed) || (isReserved && !isSel);
    return (
      <Seat key={code} $selected={isSel} $disabled={disabled} onClick={()=>!disabled && toggle(code)}>{code}</Seat>
    );
  });

  // ===========================
  // Render
  // ---------------------------
  // โครงสร้าง:
  // - แสดงสถานะ "Selected X / capacity"
  // - ตาราง 3 คอลัมน์: ซ้าย | Aisle | ขวา
  // ===========================
  return (
    <div>
      <div style={{ marginBottom: 6, color: '#6C757D', fontSize: 13 }}>
        Selected {selected.size} / {capacity}
      </div>
      <Wrapper>
        <Col>{renderCol(left)}</Col>
        <Label>Aisle</Label>
        <Col>{renderCol(right)}</Col>
      </Wrapper>
    </div>
  );
}
