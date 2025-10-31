import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../component/ui/Button';
import Input from '../component/ui/Input';

import { useDispatch } from 'react-redux';
import { showToast } from '../features/ui/uiSlice';

import { registerUser, loginUser } from '../services/api';

// --- Styled Components ---
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
  border-radius: 20px;
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

const SignupButton = styled(Button)`
  width: 100%;
  padding: 0.9rem;
  font-size: 1.1rem;
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
        password: formData.password,
      };
      await registerUser(newUser);
      dispatch(showToast({ message: 'Signup successful! Welcome!', type: 'success' }));
      setTimeout(() => {
        navigate('/'); // พาผู้ใช้ไปหน้า Login หลังสมัครสำเร็จ
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      dispatch(showToast({ message: 'Signup failed. Please try again.', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupPageWrapper>
      <SignupForm onSubmit={handleSubmit}>
        <Title>Create Account</Title>
        <InputGroup>
          <Label htmlFor="name">Full Name</Label>
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
        
        <SignupButton type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </SignupButton>
        
        <LoginLink>
          Already have an account? <Link to="/login">Login</Link>
        </LoginLink>
      </SignupForm>
    </SignupPageWrapper>
  );
};
