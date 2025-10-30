import React, { useMemo } from 'react';
import styled from 'styled-components';

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

export default function MultiSeatPicker({ capacity = 1, value = [], onChange }){
  const letters = useMemo(() => Array.from({ length: 10 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)), []); // A..J
  const left = letters.map(l => `${l}1`);
  const right = letters.map(l => `${l}2`);
  const selected = new Set(value);
  const maxed = selected.size >= capacity;

  const toggle = (code) => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code); else { if (!maxed) next.add(code); }
    onChange(Array.from(next));
  };

  const renderCol = (arr) => arr.map(code => {
    const isSel = selected.has(code);
    const disabled = !isSel && maxed;
    return (
      <Seat key={code} $selected={isSel} $disabled={disabled} onClick={()=>!disabled && toggle(code)}>{code}</Seat>
    );
  });

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