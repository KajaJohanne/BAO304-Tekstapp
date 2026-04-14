import { Search } from "@digdir/designsystemet-react";
import { BiSearch } from "react-icons/bi";
import type { SearchBarProps } from "../../types/searchBar";
import "./SearchBar.css";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Søk etter",
    ariaLabel = "Søk",
    className = "",
}: SearchBarProps) => {
    return (
        //Søkefelt fra designsystemet
        <Search className={`search-bar ${className}`}>
            <Search.Input 
                aria-label={ariaLabel}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
            />
            {value && (
                <Search.Clear 
                    onClick={() => onChange("")}
                    className="search-clear"
                />
            )}

            <Search.Button className="search-button">
                <BiSearch />
            </Search.Button>
        </Search>
    );
};

export default SearchBar;
        
