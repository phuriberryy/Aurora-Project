import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

// 1. Import Redux Actions (เพื่อทดสอบ Modal/Toast)
import { openModal, showToast } from '../features/ui/uiSlice';

// 2. Import UI Kit (ที่เราสร้างไว้)
import Button from '../component/ui/Button';
import Input from '../component/ui/Input';

// --- Styled Components (สำหรับจัดหน้า) ---
const ShowcaseWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
  h1 {
    color: ${({ theme }) => theme.colors.dark};
  }
`;

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  h2 {
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    padding-bottom: 5px;
    color: ${({ theme }) => theme.colors.dark};
  }
`;

const ComponentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

// --- Component ---
export default function UIKitPage() {
  const dispatch = useDispatch();

  // 3. handlers สำหรับยิง Redux actions
  const handleOpenModal = () => {
    // (Note: เนื้อหา Modal ตอนนี้ถูก hardcode ไว้ใน Layout.jsx)
    dispatch(openModal()); 
  };

  const handleShowSuccess = () => {
    dispatch(showToast({ message: 'Success! (Test)', type: 'success' }));
  };

  const handleShowError = () => {
    dispatch(showToast({ message: 'Error! (Test)', type: 'error' }));
  };

  return (
    <ShowcaseWrapper>
      <h1>UI Kit Showcase (Owner D)</h1>
      <p>นี่คือหน้าที่ใช้ทดสอบ UI Kit Components ทั้งหมดครับ</p>

      {/* --- Buttons --- */}
      <Section>
        <h2>Buttons</h2>
        <ComponentRow>
          <Button>Primary Button</Button>
          <Button disabled>Disabled Button</Button>
        </ComponentRow>
      </Section>

      {/* --- Inputs --- */}
      <Section>
        <h2>Inputs</h2>
        <ComponentRow>
          <Input type="text" placeholder="Enter your name..." />
        </ComponentRow>
        <ComponentRow>
          <Input type="password" placeholder="Enter password..." />
        </ComponentRow>
      </Section>

      {/* --- Modal & Toast --- */}
      <Section>
        <h2>Modal & Toast (Redux-driven)</h2>
        <ComponentRow>
          <Button onClick={handleOpenModal}>Open Modal</Button>
          <Button onClick={handleShowSuccess}>Show Success Toast</Button>
          <Button onClick={handleShowError}>Show Error Toast</Button>
        </ComponentRow>
      </Section>
    </ShowcaseWrapper>
  );
}

