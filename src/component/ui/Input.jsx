import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// --- Styled Components ---
const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  box-sizing: border-box; /* (สำคัญมาก) */
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33; /* (เพิ่ม-glow-effect) */
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.light};
    cursor: not-allowed;
  }
`;

// --- Component ---
export default function Input({ type = 'text', value, onChange, placeholder, disabled = false, ...props }) {
  return (
    <StyledInput
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  );
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};
