import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// --- Styled Components ---
const NavWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: bold;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};

  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    font-size: 1rem;
    margin-left: ${({ theme }) => theme.spacing.large};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const StyledLink = styled(Link)`
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const IconLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  
  svg {
    width: 26px;
    height: 26px;
    fill: currentColor;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// --- Component ---
export default function Navbar() {
  return (
    <NavWrapper>
      <LogoLink to="/">Aurora Airways</LogoLink>
      
      <NavLinks>
        <StyledLink to="/my-bookings">My Bookings</StyledLink>
        <IconLink to="/login" title="Login / Profile">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/>
          </svg>
        </IconLink>
        
      </NavLinks>
    </NavWrapper>
  );
}