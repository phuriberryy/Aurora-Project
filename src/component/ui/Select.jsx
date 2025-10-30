import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledSelect = styled.select`
  width: 100%;
  padding: 12px 44px 12px 14px;
  font-size: 1rem;
  border: 1px solid rgba(15, 36, 84, 0.2);
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.dark};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  appearance: none;
  cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, rgba(15, 36, 84, 0.55) 50%),
    linear-gradient(135deg, rgba(15, 36, 84, 0.55) 50%, transparent 50%),
    linear-gradient(to right, rgba(15, 36, 84, 0.2), rgba(15, 36, 84, 0.2));
  background-position: calc(100% - 20px) calc(50% - 5px), calc(100% - 15px) calc(50% - 5px), calc(100% - 2.5rem) 50%;
  background-size: 5px 5px, 5px 5px, 1px 65%;
  background-repeat: no-repeat;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(0, 98, 230, 0.18);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.light};
    color: rgba(15, 36, 84, 0.45);
    cursor: not-allowed;
  }
`;

export default function Select({ children, disabled = false, ...props }) {
  return (
    <StyledSelect disabled={disabled} {...props}>
      {children}
    </StyledSelect>
  );
}

Select.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};
