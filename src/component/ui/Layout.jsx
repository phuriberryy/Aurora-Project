import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar'; 
import Modal from './Modal';
import Toast from './Toast'; 

const ContentWrapper = styled.main`
  padding: ${({ theme }) => theme.spacing.medium};
  max-width: 1200px;
  margin: 0 auto; 
`;

export default function Layout() {
  return (
    <div>
      <Navbar /> 
      
      <ContentWrapper>
        <Outlet /> 
      </ContentWrapper>
      
      {/* 3. วาง Modal และ Toast ไว้ที่นี่ */}
      {/* (เราวางไว้ที่ Layout เพื่อให้มันพร้อมแสดงผล "ทับ" ทุกหน้า) */}
      
      <Modal>
        {/* (เนื้อหา Modal จะถูกกำหนดโดย Page ที่เรียกมัน) */}
        {/* (เช่น BookingPage (C) อาจจะใส่ <BookingForm /> ไว้ตรงนี้) */}
      </Modal>
      
      <Toast />
    </div>
  );
}

