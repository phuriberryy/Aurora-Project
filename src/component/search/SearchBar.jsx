import PropTypes from "prop-types";
import styled from "styled-components";
import { useMemo } from "react";

const Card = styled.form`
  display: grid;
  gap: 14px;
  padding: 16px 20px;
  margin: 10px 0;
  border: 1px solid #eee;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 180px;
  gap: 12px;

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
  color: #666;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #0077cc;
    box-shadow: 0 0 0 3px rgba(0,119,204,0.1);
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  background: ${({ disabled }) => (disabled ? "#cbd5e1" : "#0077cc")};
  color: #fff;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: transform 0.02s ease-in;

  &:active {
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(1px)")};
  }
`;

const Validation = styled.small`
  color: #cc0044;
`;

export default function SearchBar({ value, onChange, onSearch }) {
  const from = value.from ?? "";
  const to = value.to ?? "";
  const date = value.date ?? "";

  const trimmed = useMemo(
    () => ({ from: from.trim(), to: to.trim(), date }),
    [from, to, date]
  );

  const hasEmpty = !trimmed.from || !trimmed.to || !trimmed.date;
  const sameRoute = trimmed.from && trimmed.to && trimmed.from === trimmed.to;

  // กันวันที่ย้อนหลัง (yyyy-mm-dd)
  const pastDate = useMemo(() => {
    if (!trimmed.date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(trimmed.date);
    return picked < today;
  }, [trimmed.date]);

  const isInvalid = hasEmpty || sameRoute || pastDate;

  let validationMessage = "";
  if (hasEmpty) {
    validationMessage = "Please provide departure, destination, and date.";
  } else if (sameRoute) {
    validationMessage = "Departure and destination must be different.";
  } else if (pastDate) {
    validationMessage = "Date cannot be in the past.";
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalid) return;
    onSearch(trimmed);
  };

  const handleFieldChange = (field) => (e) => {
    onChange({ [field]: e.target.value });
  };

  return (
    <Card onSubmit={handleSubmit} noValidate>
      <Row>
        <Field htmlFor="from">
          <Label>From</Label>
          <Input
            id="from"
            type="text"
            name="from"
            value={from}
            onChange={handleFieldChange("from")}
            placeholder="City or airport"
            autoComplete="off"
          />
        </Field>

        <Field htmlFor="to">
          <Label>To</Label>
          <Input
            id="to"
            type="text"
            name="to"
            value={to}
            onChange={handleFieldChange("to")}
            placeholder="City or airport"
            autoComplete="off"
          />
        </Field>

        <Field htmlFor="date">
          <Label>Date</Label>
          <Input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={handleFieldChange("date")}
          />
        </Field>
      </Row>

      <Actions>
        <Button type="submit" disabled={isInvalid}>Search</Button>
        {isInvalid && validationMessage && (
          <Validation>{validationMessage}</Validation>
        )}
      </Actions>
    </Card>
  );
}

SearchBar.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};
