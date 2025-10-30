import PropTypes from "prop-types";
import styled from "styled-components";
import { useMemo, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const Card = styled.form`
  display: grid;
  gap: 22px;
  padding: 24px;
  margin: 20px 0 24px;
  border-radius: 18px;
  border: 1px solid rgba(15, 36, 84, 0.12);
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 18px 32px -18px rgba(15, 36, 84, 0.35);
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const ToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "active"
})`
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid ${({ active }) => (active ? "#0077cc" : "#ccc")};
  background: ${({ active }) => (active ? "#0077cc" : "#f8f8f8")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ active }) => (active ? "#006bb3" : "#eaeaea")};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) 180px;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: rgba(15, 36, 84, 0.6);
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const Validation = styled.small`
  color: #696969;
`;

const SearchButton = styled(Button)`
  min-width: 130px;
  padding: 12px 28px;
  border-radius: 8px;
`;

export default function SearchBar({
  value,
  onChange,
  onSearch,
  options = { origins: [], destinations: [] },
  isLoadingOptions = false,
}) {
  const [tripType, setTripType] = useState("oneway");

  const from = value.from ?? "";
  const to = value.to ?? "";
  const departDate = value.date ?? "";
  const returnDate = value.returnDate ?? "";

  const { origins = [], destinations = [] } = options;

  const trimmed = useMemo(
    () => ({
      from: from.trim(),
      to: to.trim(),
      date: departDate,
      returnDate,
    }),
    [from, to, departDate, returnDate]
  );

  const hasEmpty =
    !trimmed.from || !trimmed.to || !trimmed.date || (tripType === "return" && !trimmed.returnDate);
  const sameRoute = trimmed.from && trimmed.to && trimmed.from === trimmed.to;

  const pastDate = useMemo(() => {
    if (!trimmed.date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(trimmed.date);
    return picked < today;
  }, [trimmed.date]);

  const isInvalid = hasEmpty || sameRoute || pastDate;

  let validationMessage = "";
  if (sameRoute) {
    validationMessage = "Departure and destination must be different.";
  } else if (pastDate) {
    validationMessage = "Date cannot be in the past.";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalid) return;
    const searchData =
      tripType === "return"
        ? { from: trimmed.from, to: trimmed.to, date: trimmed.date, returnDate: trimmed.returnDate }
        : { from: trimmed.from, to: trimmed.to, date: trimmed.date };
    onSearch(searchData);
  };

  const handleFieldChange = (field) => (e) => {
    onChange({ [field]: e.target.value });
  };

  return (
    <Card onSubmit={handleSubmit} noValidate>
      {/* Trip type toggle */}
      <ToggleRow>
        <ToggleButton
          type="button"
          active={tripType === "oneway"}
          onClick={() => setTripType("oneway")}
        >
          One-way
        </ToggleButton>
        <ToggleButton
          type="button"
          active={tripType === "return"}
          onClick={() => setTripType("return")}
        >
          Return
        </ToggleButton>
      </ToggleRow>

      {/* From / To / Date (+Return date) */}
      <Row>
        <Field>
          <Label>From</Label>
          <Select
            value={from}
            onChange={handleFieldChange("from")}
            disabled={isLoadingOptions || origins.length === 0}
          >
            <option value="">Select departure</option>
            {origins.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label>To</Label>
          <Select
            value={to}
            onChange={handleFieldChange("to")}
            disabled={isLoadingOptions || destinations.length === 0}
          >
            <option value="">Select destination</option>
            {destinations.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label>Date</Label>
          <Input
            type="date"
            value={departDate}
            onChange={handleFieldChange("date")}
          />
        </Field>

        {/* Return Date */}
        {tripType === "return" && (
          <Field>
            <Label>Return Date</Label>
            <Input
              type="date"
              value={returnDate}
              onChange={handleFieldChange("returnDate")}
            />
          </Field>
        )}
      </Row>

      <Actions>
        <SearchButton type="submit" disabled={isInvalid || isLoadingOptions}>
          Search
        </SearchButton>
        {validationMessage && <Validation>{validationMessage}</Validation>}
      </Actions>
    </Card>
  );
}

SearchBar.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
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
