import PropTypes from "prop-types";
import styled from "styled-components";
import { useMemo } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const Card = styled.form`
  display: grid;
  gap: 18px;
  padding: 24px;
  margin: 20px 0 24px;
  border-radius: 18px;
  border: 1px solid rgba(15, 36, 84, 0.12);
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 18px 32px -18px rgba(15, 36, 84, 0.35);

  @media (max-width: 768px) {
    padding: 20px;
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
  color: #d64545;
`;

const SearchButton = styled(Button)`
  min-width: 130px;
  padding: 12px 28px;
  border-radius: 8px;
`;

export default function SearchBar({ value, onChange, onSearch, options = { origins: [], destinations: [] }, isLoadingOptions = false }) {
  const from = value.from ?? "";
  const to = value.to ?? "";
  const date = value.date ?? "";

  const { origins = [], destinations = [] } = options;

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
    validationMessage = "Please select departure, destination, and date.";
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
          <Select
            id="from"
            name="from"
            value={from}
            onChange={handleFieldChange("from")}
            disabled={isLoadingOptions || origins.length === 0}
          >
            <option value="">
              Select departure
            </option>
            {origins.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </Select>
        </Field>

        <Field htmlFor="to">
          <Label>To</Label>
          <Select
            id="to"
            name="to"
            value={to}
            onChange={handleFieldChange("to")}
            disabled={isLoadingOptions || destinations.length === 0}
          >
            <option value="">
              Select destination
            </option>
            {destinations.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </Select>
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
        <SearchButton
          type="submit"
          disabled={isInvalid || isLoadingOptions}
        >
          Search
        </SearchButton>

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
  options: PropTypes.shape({
    origins: PropTypes.arrayOf(PropTypes.string),
    destinations: PropTypes.arrayOf(PropTypes.string),
  }),
  isLoadingOptions: PropTypes.bool,
};
