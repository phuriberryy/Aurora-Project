import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// --- Styled Components ---
const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #004bbd; // (สีเข้มขึ้นเล็กน้อย)
  }

  /* (เราสามารถเพิ่ม variant อื่นๆ ได้ในอนาคต) */
  /*
  ${(props) =>
    props.variant === 'secondary' &&
    `
    background-color: ${props.theme.colors.secondary};
    &:hover {
      background-color: #5a6268;
    }
  `}
  */

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// --- Component ---
// เราจะส่ง "props" ที่เหลือ (เช่น onClick, disabled) ลงไปที่ <button>
export default function Button({ children, onClick, disabled = false, type = 'button' }) {
  return (
    <StyledButton 
      onClick={onClick} 
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  );
}

// (นี่คือ PropTypes ตามโจทย์ Definition of Done ครับ)
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};
