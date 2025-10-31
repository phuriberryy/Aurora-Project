// component/ui/FlyingPlaneLoader.jsx
import styled, { keyframes } from "styled-components";

const fly = keyframes`
  0% { transform: translateX(-50px); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(200px); opacity: 0; }
`;

const Wrap = styled.div`
  display:flex; 
  flex-direction:column; 
  align-items:center; 
  justify-content:center;
  min-height:100vh;
  text-align:center;
  color:#0077cc; 
  font-weight:600;
`;

const Plane = styled.div`
  font-size: 40px;
  animation: ${fly} 2s linear infinite;
`;

export default function FlyingPlaneLoader() {
  return (
    <Wrap>
      <Plane>✈️</Plane>
      <p>Loading your flights...</p>
    </Wrap>
  );
}
