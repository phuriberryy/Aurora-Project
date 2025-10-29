import PropTypes from "prop-types";

const AIRLINES = ["TG", "FD", "SL", "WE"];

const Filters = ({ filters, onChange }) => {
    const { nonstop = false, airlines = [], priceMax = null } = filters;

    const handleNonstopChange = (event) => {
        onChange({ nonstop: event.target.checked });
    };

    const handlePriceChange = (event) => {
        const { value } = event.target;
        const parsedValue = value === "" ? null : Number(value);
        onChange({ priceMax: Number.isNaN(parsedValue) ? null : parsedValue });
    };

    const handleAirlineToggle = (code) => (event) => {
        const isChecked = event.target.checked;
        const nextAirlines = isChecked
            ? Array.from(new Set([...airlines, code]))
            : airlines.filter((airline) => airline !== code);
        onChange({ airlines: nextAirlines });
    };

    return (
        <section className="filters">
            <div className="filters__group">
                <label className="filters__option">
                    <input
                        type="checkbox"
                        checked={Boolean(nonstop)}
                        onChange={handleNonstopChange}
                        className="filters__checkbox"
                    />
                    <span>Non-stop only</span>
                </label>
            </div>
            <div className="filters__group">
                <label className="filters__option">
                    <span className="filters__label">Max price</span>
                    <input
                        type="number"
                        min="0"
                        value={priceMax ?? ""}
                        onChange={handlePriceChange}
                        className="filters__input"
                        placeholder="Any"
                    />
                </label>
            </div>
            <div className="filters__group filters__airlines">
                <span className="filters__label">Airlines</span>
                <div className="filters__options">
                    {AIRLINES.map((code) => (
                        <label key={code} className="filters__option">
                            <input
                                type="checkbox"
                                checked={airlines.includes(code)}
                                onChange={handleAirlineToggle(code)}
                                className="filters__checkbox"
                            />
                            <span>{code}</span>
                        </label>
                    ))}
                </div>
            </div>
        </section>
    );
};

Filters.propTypes = {
    filters: PropTypes.shape({
        nonstop: PropTypes.bool,
        airlines: PropTypes.arrayOf(PropTypes.string),
        priceMax: PropTypes.number,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Filters;
