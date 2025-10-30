import styled from "styled-components";
import PropTypes from "prop-types";

const Select = styled.select`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

export default function SortSelect({ value, onChange }) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="default">ตั้งต้น</option>
      <option value="departTime">เวลาออกเดินทาง</option>
      <option value="arriveTime">เวลาถึง</option>
      <option value="price">ราคา</option>
      <option value="duration">ระยะเวลาเดินทาง</option>
    </Select>
  );
}

SortSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
