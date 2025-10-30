import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Panel = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  padding: 16px 20px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  max-width: 420px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 12px;
  color: #003366;
`;

const RangeGroup = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Range = styled.input`
  width: 100%;
  accent-color: #0077cc;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  font-size: 13px;
  color: #555;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  color: #fff;
  background: ${({ variant }) => (variant === "primary" ? "#0054a6" : "#9ca3af")};
  &:hover {
    opacity: 0.9;
  }
`;

export default function FlightFilterPanel({ onApply, onReset }) {
  const [depRange, setDepRange] = useState([0, 1439]);
  const [arrRange, setArrRange] = useState([0, 1439]);
  const [durRange, setDurRange] = useState([60, 720]);
  const [directOnly, setDirectOnly] = useState(false);

  const fmtTime = (min) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const fmtDur = (min) => `${Math.floor(min/60)}h ${min%60}m`;

  const handleApply = () => {
    onApply({
      depMin: depRange[0],
      depMax: depRange[1],
      arrMin: arrRange[0],
      arrMax: arrRange[1],
      durMin: durRange[0],
      durMax: durRange[1],
      directOnly
    });
  };

  const handleReset = () => {
    setDepRange([0,1439]);
    setArrRange([0,1439]);
    setDurRange([60,720]);
    setDirectOnly(false);
    onReset();
  };

  return (
    <Panel>
      <Title>🧭 กรองเที่ยวบิน</Title>

      <RangeGroup>
        <Label>เวลาออกเดินทาง</Label>
        <Range type="range" min="0" max="1439" value={depRange[0]}
          onChange={(e)=>setDepRange([+e.target.value, depRange[1]])}/>
        <Range type="range" min="0" max="1439" value={depRange[1]}
          onChange={(e)=>setDepRange([depRange[0], +e.target.value])}/>
        <Row><span>{fmtTime(depRange[0])}</span><span>{fmtTime(depRange[1])}</span></Row>
      </RangeGroup>

      <RangeGroup>
        <Label>เวลาถึง</Label>
        <Range type="range" min="0" max="1439" value={arrRange[0]}
          onChange={(e)=>setArrRange([+e.target.value, arrRange[1]])}/>
        <Range type="range" min="0" max="1439" value={arrRange[1]}
          onChange={(e)=>setArrRange([arrRange[0], +e.target.value])}/>
        <Row><span>{fmtTime(arrRange[0])}</span><span>{fmtTime(arrRange[1])}</span></Row>
      </RangeGroup>

      <RangeGroup>
        <Label>ระยะเวลาเที่ยวบิน</Label>
        <Range type="range" min="0" max="720" value={durRange[0]}
          onChange={(e)=>setDurRange([+e.target.value, durRange[1]])}/>
        <Range type="range" min="0" max="720" value={durRange[1]}
          onChange={(e)=>setDurRange([durRange[0], +e.target.value])}/>
        <Row><span>{fmtDur(durRange[0])}</span><span>{fmtDur(durRange[1])}</span></Row>
      </RangeGroup>

      <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        <input
          type="checkbox"
          checked={directOnly}
          onChange={(e) => setDirectOnly(e.target.checked)}
        />
        <span>แสดงเฉพาะเที่ยวบินตรง</span>
      </label>

      <Actions>
        <Button variant="secondary" onClick={handleReset}>รีเซ็ตตัวกรอง</Button>
        <Button variant="primary" onClick={handleApply}>ใช้ตัวกรอง</Button>
      </Actions>
    </Panel>
  );
}

FlightFilterPanel.propTypes = {
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};
