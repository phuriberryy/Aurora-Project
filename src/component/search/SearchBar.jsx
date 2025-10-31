import { useState } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const Card = styled.form`
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  display: grid;
  gap: 10px;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const ToggleBtn = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #0077cc;
  background: ${(p) => (p.$active ? "#0077cc" : "#f2f2f2")};
  color: ${(p) => (p.$active ? "#fff" : "#000")};
  cursor: pointer;
`;

export default function SearchBar({ value, onChange, onSearch, options, isLoadingOptions }) {
  const [trip, setTrip] = useState("oneway");
  const { from = "", to = "", date = "", returnDate = "" } = value;
  const { origins = [], destinations = [] } = options || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    const data = { from, to, date };
    if (trip === "return") data.returnDate = returnDate;
    onSearch(data);
  };

  return (
    <Card onSubmit={handleSubmit}>
      {/* ปุ่มสลับโหมด */}
      <ToggleRow>
        <ToggleBtn type="button" $active={trip === "oneway"} onClick={() => setTrip("oneway")}>
          One-way
        </ToggleBtn>
        <ToggleBtn type="button" $active={trip === "return"} onClick={() => setTrip("return")}>
          Return
        </ToggleBtn>
      </ToggleRow>

      {/* ช่องกรอกข้อมูล */}
      <Select value={from} onChange={(e) => onChange({ from: e.target.value })} disabled={isLoadingOptions}>
        <option value="">Select departure</option>
        {origins.map((o) => <option key={o}>{o}</option>)}
      </Select>

      <Select value={to} onChange={(e) => onChange({ to: e.target.value })} disabled={isLoadingOptions}>
        <option value="">Select destination</option>
        {destinations.map((d) => <option key={d}>{d}</option>)}
      </Select>

      <Input type="date" value={date} onChange={(e) => onChange({ date: e.target.value })} />

      {trip === "return" && (
        <Input type="date" value={returnDate} onChange={(e) => onChange({ returnDate: e.target.value })} />
      )}

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


