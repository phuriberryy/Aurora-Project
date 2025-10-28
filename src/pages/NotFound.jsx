import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../component/ui/Button'; // 1. Import UI Kit ของเรา

// --- Styled Components ---
const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large};
  min-height: 60vh;
  text-align: center;

  h1 {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }

  p {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.large};
  }
`;

// --- Component ---
export default function NotFound() {
  return (
    <NotFoundWrapper>
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      
      {/* 2. ใช้ <Button> ที่เราสร้าง และหุ้มด้วย <Link> */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button>Go Back to Homepage</Button>
      </Link>
    </NotFoundWrapper>
  );
}

