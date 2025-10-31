import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../features/ui/uiSlice';
import PropTypes from 'prop-types';

// --- Styled Components ---
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: 8px;
  min-width: 400px;
  max-width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  &:hover {
    color: ${({ theme }) => theme.colors.dark};
  }
`;

// --- Component ---
// (Component นี้รับ 'children' เพื่อให้หน้าอื่น (เช่น Booking) ใส่ฟอร์มเข้ามาข้างในได้)
export default function Modal({ children }) {
  const isOpen = useSelector((state) => state.ui.isModalOpen);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onClick={handleClose}>
      {/* (e.stopPropagation ป้องกันไม่ให้คลิกที่ Content แล้ว Modal ปิด) */}
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handleClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalBackdrop>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
};
