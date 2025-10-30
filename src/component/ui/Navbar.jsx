import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// --- Styled Components ---
const NavWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.dark};
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  
  /* 1. (ตกแต่ง) ใช้ Flexbox เพื่อจัดให้ โลโก้ อยู่ซ้าย และ ลิงก์ อยู่ขวา */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 2. (ตกแต่ง) สร้าง Style เฉพาะสำหรับ "โลโก้" ให้เด่น
const LogoLink = styled(Link)`
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: bold;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// 3. (ตกแต่ง) สร้าง Style สำหรับ "ลิงก์อื่นๆ" ด้านขวา
const NavLinks = styled.div`
  a {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
    font-size: 1rem;
    margin-left: ${({ theme }) => theme.spacing.large}; /* เว้นระยะห่างระหว่างลิงก์ */

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

// --- Component ---
export default function Navbar() {
  return (
    <NavWrapper>
      {/* (โลโก้/ลิงก์หน้าแรก ด้านซ้าย) */}
      <LogoLink to="/">Aurora Airways</LogoLink>
      
      {/* (ลิงก์อื่นๆ ด้านขวา) */}
      <NavLinks>
        {/* 4. (เพิ่มลิงก์) นี่คือลิงก์ "My Bookings" ที่เราเพิ่มเข้ามา 
          (อย่าลืมไปเพิ่ม path นี้ใน routes.jsx และบอกให้ Owner C สร้างหน้านี้ด้วยนะครับ!)
        */}
        <Link to="/my-bookings">My Bookings</Link>
        <Link to="/login">Login</Link>
        
      </NavLinks>
    </NavWrapper>
  );
}

