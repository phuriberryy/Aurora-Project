import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// --- Styled Components ---
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: 1px solid #004bbd;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 3px 0 rgba(0, 59, 148, 0.25);
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;

  &:hover {
    background-color: #0056d6; // (สีเข้มขึ้นเล็กน้อย)
  }

  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 0 rgba(0, 59, 148, 0.25);
  }

  &:focus-visible {
    outline: 3px solid rgba(0, 98, 230, 0.35);
    outline-offset: 2px;
  }

  &:disabled {
    background-color: #cfd6e0;
    border-color: #cfd6e0;
    box-shadow: none;
    color: #7c8ba1;
    cursor: not-allowed;
  }
`;

// --- Component ---
export default function Button({ children, onClick, disabled = false, type = 'button', className, ...rest }) {
  return (
    <StyledButton 
      onClick={onClick} 
      disabled={disabled}
      type={type}
      className={className}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
};
