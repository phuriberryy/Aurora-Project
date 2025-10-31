import { useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const Card = styled.form`
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 16px;
  background: #fff;
  display: grid;
  gap: 10px;
`;
//One-way / Return
const ToggleRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;
// ปุ่มสลับโหมด One-way / Return
const ToggleBtn = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #0077cc;
  background: ${(p) => (p.$active ? "#0077cc" : "#f2f2f2")};
  color: ${(p) => (p.$active ? "#fff" : "#000")};
  cursor: pointer;
`;
//เรียกใช้  ----ส่งข้อมูลเข้ามา 5 อย่าง
function SearchBar({ value, onChange, onSearch, options, isLoadingOptions }) {
  const [trip, setTrip] = useState("oneway");
  const [error, setError] = useState("");
  const { from = "", to = "", date = "", returnDate = "" } = value;   //ดึงค่าที่ผู้ใช้กรอกจาก props
  const { origins = [], destinations = [] } = options || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      setError("Please fill in all search fields.");
      return;
    }
    if (from === to) {
      setError("Departure and destination must be different airports.");
      return;
    }
    if (trip === "return") {
      if (!returnDate) {
        setError("Please select your return date.");
        return;
      }
      if (returnDate < date) {
        setError("Return date cannot be earlier than the departure date.");
        return;
      }
    }
    setError("");
    const data = { from, to, date };
    if (trip === "return") data.returnDate = returnDate;
    onSearch(data);  //ส่งข้อมูลทั้งหมดกลับไปให้หน้า HomePage ผ่าน onSearch
  };

  return (
    <Card onSubmit={handleSubmit}>
      {/* ปุ่มสลับโหมด */}
      <ToggleRow>
        <ToggleBtn
          type="button"
          $active={trip === "oneway"}
          onClick={() => {
            setTrip("oneway");
            setError("");
          }}
        >
          One-way
        </ToggleBtn>
        <ToggleBtn
          type="button"
          $active={trip === "return"}
          onClick={() => {
            setTrip("return");
            setError("");
          }}
        >
          Return
        </ToggleBtn>
      </ToggleRow>

      {/* ช่องกรอกข้อมูล */}
      <Select
        value={from}
        onChange={(e) => {
          onChange({ from: e.target.value });
          setError("");
        }}
        disabled={isLoadingOptions}
      >
        <option value="">Select departure</option>
        {origins.map((o) => <option key={o}>{o}</option>)}   //ถ้ายังโหลดไม่เสร็จ (isLoadingOptions เป็น true) จะ disable
      </Select>

      <Select
        value={to}
        onChange={(e) => {
          onChange({ to: e.target.value });
          setError("");
        }}
        disabled={isLoadingOptions}
      >
        <option value="">Select destination</option>
        {destinations.map((d) => <option key={d}>{d}</option>)}
      </Select>

      <Input
        type="date"
        value={date}
        onChange={(e) => {
          onChange({ date: e.target.value });
          setError("");
        }}
      />

      {trip === "return" && (
        <Input
          type="date"
          value={returnDate}
          onChange={(e) => {
            onChange({ returnDate: e.target.value });
            setError("");
          }}
        />
      )}

      {error && <p style={{ margin: 0, color: "#dc3545", fontWeight: 600 }}>{error}</p>}

      <Button type="submit" disabled={isLoadingOptions}>
        Search
      </Button>
    </Card>
  );
}

SearchBar.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
    date: PropTypes.string,
    returnDate: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  options: PropTypes.shape({
    origins: PropTypes.arrayOf(PropTypes.string),
    destinations: PropTypes.arrayOf(PropTypes.string),
  }),
  isLoadingOptions: PropTypes.bool,
};


export default SearchBar;
