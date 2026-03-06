import React, { useState, useEffect, useRef } from 'react';
import './custom-dropdown.css';
import { CiAirportSign1 } from "react-icons/ci";
import { post } from "../../API/apiHelper";
import { country_list } from "../../API/endpoints";

const AutoCompleteDropdown = ({ placeholder, value, onChange, showError ,type}) => {
    const [destinations, setDestinations] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef(null);

    useEffect(() => {
        let lock_type;
        if (type == 'visa') {
            lock_type = {}
        }else if (type == 'otb') {
            lock_type = {}
        }


        const fetchCountry = async () => {
            try {
                const response = await post(country_list, { 
                    where : lock_type,
                    page: '0',
                    limit: '50000' }, true);
                const data = await response.json();
                const res = data.data.map((country) => ({
                  code: country.alpha_2,
                  name: country.country_name,
                  country_code: country.country_code,
                  country_id: country.country_id,
                  display: `${country.alpha_2} - ${country.country_code}`,
                }));
                setDestinations(res);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchCountry();
    }, []);

    useEffect(() => {
        setActiveIndex(-1);
    }, [filteredOptions]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        if (inputValue) {
        const matches = destinations
          .filter(
            (option) =>
              (option.code || "")
                .toLowerCase()
                .startsWith(inputValue.toLowerCase()) ||
              (option.name || "")
                .toLowerCase()
                .startsWith(inputValue.toLowerCase()) ||
              (option.country_code || "")
                .toLowerCase()
                .startsWith(inputValue.toLowerCase())
          )
          .sort((a, b) => {
            const input = inputValue.toLowerCase();
            const aCode = (a.code || "").toLowerCase();
            const bCode = (b.code || "").toLowerCase();

            // Check if the code matches the inputValue
            const aCodeMatches = aCode.startsWith(input);
            const bCodeMatches = bCode.startsWith(input);

            // If a matches on code but b doesn't, a should come first
            if (aCodeMatches && !bCodeMatches) return -1;
            // If b matches on code but a doesn't, b should come first
            if (!aCodeMatches && bCodeMatches) return 1;
            // If both match on code or neither matches, sort alphabetically by code
            return aCode.localeCompare(bCode);
          });
            setFilteredOptions(matches);
        } else {
            setFilteredOptions([]);
        }
    };

    const handleOptionClick = (option) => {
        onChange(option.code);  // Only set `alpha_2` as the input value
        setFilteredOptions([]);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex((prevIndex) =>
                prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            setActiveIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1
            );
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            handleOptionClick(filteredOptions[activeIndex]);
        } else if (e.key === 'Escape') {
            setFilteredOptions([]);
        }
    };

    return (
        <div className="dropdown-container-sit">
            <input
                type="text"
                className={`sel-input auto-input form-control ${showError ? 'input-error' : ''}`}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                required
            />
            {showError && <small className="error-text">Please select a valid option from the list.</small>}
            {filteredOptions.length > 0 && (
                <ul className="dropdown">
                    {filteredOptions.map((option, index) => (
                        <li key={index} onClick={() => handleOptionClick(option)} className={`dropdown-item border-bottom ${index === activeIndex ? 'active' : ''}`}>
                            <CiAirportSign1 />
                            {option.display} {/* Display both `alpha_2` and country name */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoCompleteDropdown;
