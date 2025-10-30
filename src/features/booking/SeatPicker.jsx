import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  align-items: start;
  gap: 8px 24px; /* aisle gap */
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
  background: ${({ selected, theme }) => (selected ? theme.colors.primary : '#fff')};
  color: ${({ selected, theme }) => (selected ? theme.colors.white : theme.colors.dark)};
  font-weight: 600;
  cursor: pointer;
`;
const Label = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  align-self: center;
`;

export default function SeatPicker({ value, onChange }){
  const letters = Array.from({ length: 10 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)); // A..J = 20 seats total (2 per row)
  const left = letters.map(l => `${l}1`);
  const right = letters.map(l => `${l}2`);

  return (
    <Wrapper>
      <Col>
        {left.map(code => (
          <Seat key={code} selected={value===code} onClick={()=>onChange(code)}>{code}</Seat>
        ))}
      </Col>
      <Label>Aisle</Label>
      <Col>
        {right.map(code => (
          <Seat key={code} selected={value===code} onClick={()=>onChange(code)}>{code}</Seat>
        ))}
      </Col>
    </Wrapper>
  );
}