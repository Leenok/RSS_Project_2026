import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { useFormStore } from '../../store/formStore';
import styles from './CountryAutocomplete.module.css';

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    id?: string;
    name?: string;
}

const CountryAutocomplete: React.FC<Props> = ({ value, onChange, error, id, name }) => {
    const { countries } = useFormStore();
    const [inputValue, setInputValue] = useState(value);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filtered = inputValue.trim()
        ? countries.filter((c) => c.toLowerCase().startsWith(inputValue.toLowerCase()))
        : [];

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
        setShowSuggestions(true);
    };

    const handleSelect = (country: string) => {
        setInputValue(country);
        onChange(country);
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <input
                id={id}
                name={name}
                type="text"
                autoComplete="off"
                value={inputValue}
                onChange={handleInput}
                onFocus={() => setShowSuggestions(true)}
                className={`${styles.input} ${error ? styles.inputError : ''}`}
                placeholder="Start typing a country..."
                aria-autocomplete="list"
                aria-expanded={showSuggestions && filtered.length > 0}
                data-testid="country-input"
            />
            {showSuggestions && filtered.length > 0 && (
                <ul className={styles.suggestions} role="listbox" data-testid="country-suggestions">
                    {filtered.slice(0, 8).map((country) => (
                        <li
                            key={country}
                            role="option"
                            className={styles.option}
                            onMouseDown={() => handleSelect(country)}
                            aria-selected={country === value}
                        >
                            {country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CountryAutocomplete;