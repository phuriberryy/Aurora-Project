import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../features/ui/uiSlice'; 

// --- Styled Components ---
const ToastWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  z-index: 200;
  
  /* (???????????? 'type' ??? Redux ?????) */
  background-color: ${({ theme, type }) => {
    if (type === 'success') return theme.colors.success;
    if (type === 'error') return theme.colors.danger;
    return theme.colors.secondary;
  }};
  
  /* (Animation ??????????/???) */
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// --- Component ---
export default function Toast() {
  const { isOpen, message, type } = useSelector((state) => state.ui.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        dispatch(hideToast()); 
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, dispatch]);

  if (!isOpen) {
    return null;
  }

  return (
    <ToastWrapper type={type}>
      {message}
    </ToastWrapper>
  );
}


