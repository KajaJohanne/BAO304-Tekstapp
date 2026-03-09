import { useEffect, useState } from "react";
import "./TextTypeSelector.css";

type TextType = "Tittel" | "Brødtekst" | "Feilmelding" | "Knappetekst" | "Hjelpetekst";

const STORAGE_KEY = "selectedTextType";
const TEXT_TYPES: TextType[] = [
    "Tittel",
    "Brødtekst",
    "Feilmelding",
    "Knappetekst",
    "Hjelpetekst",
];

export default function TextTypeSelector() {
    const [selected, setSelected] = useState<TextType | null>(null);

    //Henter lagret verdi fra localStorage når komponenten lastes
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved && TEXT_TYPES.includes(saved as TextType)) {
            setSelected(saved as TextType);
        }
    }, []);

    //Lagrer valgt teksttype i localStorage
    useEffect(() => {
        if (selected) {
            localStorage.setItem(STORAGE_KEY, selected);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [selected]);

    const handleSelect = (type: TextType) => {
        setSelected(type);
    };

    return (
        <div className="text-type-selector">
            <p className="text-type-selector_label">Velg type tekst</p>

            <div className="text-type-selector_button-group">
                {TEXT_TYPES.map((type) => {
                    const isSelected = selected === type;

                    return (
                        <button
                            key={type}
                            type="button"
                            onClick={() => handleSelect(type)}
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

/*const styles: { [key: string]: CSSProperties } = {
    container: {
        marginTop: "16px",
        textAlign: "left",
    },
    label: {
        margin: 0,
        marginBottom: "12px",
        fontWeight: 400,
        fontSize: "16px",
        color: "black",
        textAlign: "left",
    },
    buttonGroup: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        justifyContent: "flex-start",
    },
    button: {
        padding: "10px 14px",
        minWidth: "110px",
        backgroundColor: "#F5F5F5",
        color: "black",
        border: "2px solid #5b6770",
        cursor: "pointer",
        fontSize: "14px",
    },
    selected: {
        border: "2px solid #ff9100",
    },
};*/