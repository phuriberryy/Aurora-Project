import PropTypes from "prop-types";

const SearchBar = ({ value, onChange, onSearch }) => {
    const { from, to, date } = value;

    const hasEmptyFields = !from || !to || !date;
    const isSameRoute = from && to && from === to;
    const isInvalid = hasEmptyFields || isSameRoute;

    let validationMessage = "";
    if (hasEmptyFields) {
        validationMessage = "Please provide departure, destination, and date.";
    } else if (isSameRoute) {
        validationMessage = "Departure and destination must be different.";
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isInvalid) {
            return;
        }
        onSearch({ from, to, date });
    };

    const handleFieldChange = (field) => (event) => {
        onChange({ [field]: event.target.value });
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-bar__fields">
                <label className="search-bar__field">
                    <span className="search-bar__label">From</span>
                    <input
                        type="text"
                        name="from"
                        value={from}
                        onChange={handleFieldChange("from")}
                        className="search-bar__input"
                        placeholder="City or airport"
                    />
                </label>
                <label className="search-bar__field">
                    <span className="search-bar__label">To</span>
                    <input
                        type="text"
                        name="to"
                        value={to}
                        onChange={handleFieldChange("to")}
                        className="search-bar__input"
                        placeholder="City or airport"
                    />
                </label>
                <label className="search-bar__field">
                    <span className="search-bar__label">Date</span>
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={handleFieldChange("date")}
                        className="search-bar__input"
                    />
                </label>
            </div>
            <div className="search-bar__actions">
                <button type="submit" className="search-bar__submit" disabled={isInvalid}>
                    Search
                </button>
                {isInvalid && validationMessage && (
                    <small className="search-bar__validation">{validationMessage}</small>
                )}
            </div>
        </form>
    );
};

SearchBar.propTypes = {
    value: PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
