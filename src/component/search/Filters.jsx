import PropTypes from "prop-types";
import styled from "styled-components";

const AIRLINES = ["TG", "FD", "SL", "WE"];

const Card = styled.section`
  display: grid;
  gap: 14px;
  padding: 16px 20px;
  margin: 10px 0;
  border: 1px solid #eee;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const Group = styled.div`
  display: grid;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 12px;
  color: #666;
`;

const Row = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const NumberInput = styled.input`
  padding: 10px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  width: 160px;

  &:focus {
    border-color: #0077cc;
    box-shadow: 0 0 0 3px rgba(0,119,204,0.1);
  }
`;

const AirlineWrap = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export default function Filters({ filters, onChange }) {
  const { nonstop = false, airlines = [], priceMax = null } = filters;

  const handleNonstopChange = (e) => {
    onChange({ nonstop: e.target.checked });
  };

  const handlePriceChange = (e) => {
    const val = e.target.value;
    const parsed = val === "" ? null : Number(val);
    onChange({ priceMax: Number.isNaN(parsed) ? null : parsed });
  };

  const handleAirlineToggle = (code) => (e) => {
    const next = e.target.checked
      ? Array.from(new Set([...airlines, code]))
      : airlines.filter((a) => a !== code);
    onChange({ airlines: next });
  };

  return (
    <Card>
      <Group>
        <Row htmlFor="nonstop">
          <Checkbox
            id="nonstop"
            type="checkbox"
            checked={Boolean(nonstop)}
            onChange={handleNonstopChange}
          />
          <span>Non-stop only</span>
        </Row>
      </Group>

      <Group>
        <Label>Max price</Label>
        <NumberInput
          id="priceMax"
          type="number"
          min="0"
          value={priceMax ?? ""}
          onChange={handlePriceChange}
          placeholder="Any"
        />
      </Group>

      <Group>
        <Label>Airlines</Label>
        <AirlineWrap>
          {AIRLINES.map((code) => (
            <Row key={code} htmlFor={`air-${code}`}>
              <Checkbox
                id={`air-${code}`}
                type="checkbox"
                checked={airlines.includes(code)}
                onChange={handleAirlineToggle(code)}
              />
              <span>{code}</span>
            </Row>
          ))}
        </AirlineWrap>
      </Group>
    </Card>
  );
}

Filters.propTypes = {
  filters: PropTypes.shape({
    nonstop: PropTypes.bool,
    airlines: PropTypes.arrayOf(PropTypes.string),
    priceMax: PropTypes.number,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
