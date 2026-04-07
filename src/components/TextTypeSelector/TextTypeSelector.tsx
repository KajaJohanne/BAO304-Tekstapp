import { useEffect } from "react";
import "./TextTypeSelector.css";
import type { TextType } from "../../../api";

const STORAGE_KEY = "selectedTextType";
const TEXT_TYPES: TextType[] = [
    "Tittel",
    "Brødtekst",
    "Feilmelding",
    "Knappetekst",
    "Hjelpetekst",
];

interface TextTypeSelectorProps {
    value: TextType | null;
    onChange: (type: TextType) => void;
}

export default function TextTypeSelector({
    value, 
    onChange,
}: TextTypeSelectorProps) {
    //Henter lagret verdi fra localStorage når komponenten lastes
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved && TEXT_TYPES.includes(saved as TextType) && !value) {
            onChange(saved as TextType);
        }
    }, [onChange, value]);

    //Lagrer valgt teksttype i localStorage
    useEffect(() => {
        if (value) {
            localStorage.setItem(STORAGE_KEY, value);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [value]);

    return (
        /* Valg av type tekst */
        <div className="text-type-selector">
            <p className="text-type-selector_label">Velg type tekst</p>

            <div className="text-type-selector_button-group">
                {TEXT_TYPES.map((type) => {
                    const isSelected = value === type;

                    return (
                        <button
                            key={type}
                            type="button"
                            onClick={() => onChange(type)}
                            className={`text-type-selector_button ${
                                isSelected ? "text-type-selector_button-selected" : ""
                            }`}
                        >
                            {type}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}