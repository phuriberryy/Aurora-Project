import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

import Button from '../component/ui/Button';
import Input from '../component/ui/Input';

import { useDispatch } from 'react-redux';
import { showToast } from '../features/ui/uiSlice';

import { loginUser } from '../services/api'; 



const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 5rem 1rem;
  min-height: calc(100vh - 200px);
  background-color: ${({ theme }) => theme.colors.light};
`;

const LoginForm = styled.form`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const SignupLink = styled.p`
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginUser(email); 

      if (response.data.length === 0) {
        dispatch(showToast({ message: 'Email not found. Please sign up.', type: 'error' }));
      
      } else {
        const user = response.data[0];
        if (user.password !== password) {
          dispatch(showToast({ message: 'Incorrect password. Please try again.', type: 'error' }));
        } else {
          dispatch(showToast({ message: 'Login Successful! Redirecting...', type: 'success' }));
          
          setTimeout(() => {
            navigate('/home');
          }, 1500);
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      dispatch(showToast({ message: 'An error occurred. Please try again.', type: 'error' }));
    
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginPageWrapper>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Login</Title>
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </InputGroup>
        
        <Button 
          type="submit" 
          style={{ width: '100%', padding: '0.9rem', fontSize: '1.1rem' }}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        
        <SignupLink>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </SignupLink>
      </LoginForm>
    </LoginPageWrapper>
  );
}

