import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../component/ui/Button';
import Input from '../component/ui/Input';

import { useDispatch } from 'react-redux';
import { showToast } from '../features/ui/uiSlice';

// --- 3. เชื่อมต่อ API ---
import { registerUser, loginUser } from '../services/api';

// --- Styled Components (can be refactored into a common file later) ---
const SignupPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 5rem 1rem;
  min-height: calc(100vh - 200px);
  background-color: ${({ theme }) => theme.colors.light};
`;

const SignupForm = styled.form`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.dark};
  text-align: center;
  margin: 0;
  margin-bottom: 0.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.dark};
`;


const LoginLink = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      dispatch(showToast({ message: 'Passwords do not match!', type: 'error' }));
      setLoading(false);
      return;
    }

    try {
      // 1. ตรวจสอบว่าอีเมลถูกใช้ไปแล้วหรือยัง
      const existingUsers = await loginUser(formData.email);
      if (existingUsers.data.length > 0) {
        dispatch(showToast({ message: 'Email already registered. Please login or use another email.', type: 'error' }));
        setLoading(false); // หยุด loading
        return;
      }

      // 2. ถ้าอีเมลยังไม่ถูกใช้ ก็ทำการสมัครสมาชิก
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password, // ในระบบจริงควรมีการ hash รหัสผ่านก่อนส่ง
      };
      await registerUser(newUser);
      dispatch(showToast({ message: 'Signup successful! Welcome!', type: 'success' }));
      setTimeout(() => {
        navigate('/login'); // พาผู้ใช้ไปหน้า Login หลังสมัครสำเร็จ
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      dispatch(showToast({ message: 'Signup failed. Please try again.', type: 'error' }));
    } finally {
      setLoading(false); // หยุด loading
    }
  };

  return (
    <SignupPageWrapper>
      <SignupForm onSubmit={handleSubmit}>
        <Title>Create Account</Title>
        <InputGroup>
          <Label htmlFor="name">Full Name</Label>
          {/* 6. (เชื่อมต่อ UI Kit) - ใช้ <Input /> ที่ import มา */}
          <Input 
            type="text" 
            id="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input 
            type="password" 
            id="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </InputGroup>
        
        {/* 7. (เชื่อมต่อ UI Kit) - ใช้ <Button /> ที่ import มา */}
        {/* (เราเพิ่ม style prop เล็กน้อยเพื่อให้ปุ่มเต็มความกว้างเหมือนดีไซน์เดิม) */}
        <Button type="submit" style={{ width: '100%', padding: '0.9rem', fontSize: '1.1rem' }} disabled={loading}>
          Sign Up
        </Button>
        
        <LoginLink>
          Already have an account? <Link to="/login">Login</Link>
        </LoginLink>
      </SignupForm>
    </SignupPageWrapper>
  );
}
