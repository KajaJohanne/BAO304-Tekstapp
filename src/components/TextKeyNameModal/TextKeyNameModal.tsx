import { useState, useEffect } from "react";
import "./TextKeyNameModal.css";
import React from "react";

type TextKeyNameModalProps = {
    value: string;
    onSave: (value: string) => void;
};

export default function TextKeyNameModal({value, onSave}: TextKeyNameModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    
    //feil validering
    const handleAdd = () => {
        const trimmedValue = inputValue.trim();

        //Tom verdi
        if (trimmedValue.length === 0) {
            alert("Nøkkelen kan ikke være tom.");
            return;
        }

        //Mellomrom
        if (trimmedValue.includes(" ")) {
            alert("Nøkkelen kan ikke inneholde mellomrom.");
            return;
        }

        //Kun bokstaver
        const onlyLetters = /^[A-Za-zÆØÅæøå]+$/;
        if (!onlyLetters.test(trimmedValue)) {
            alert("Nøkkelen kan kun inneholde bokstaver.");
            return;
        }

        onSave(trimmedValue);
        //Hvis alt er gyldig
        console.log("Ny tekstnøkkel:", inputValue);
        closeModal();
    };

    return (
        <>
            <button 
                type="button" 
                onClick={openModal} 
                className="text-key-name-modal_open-button"
            >
                Gi nøkkelen et navn
            </button>

            {isOpen && (
                <div className="text-key-name-modal_overlay">
                    <div className="text-key-name-modal_modal">
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="text-key-name-modal_close-button"
                        >
                            ×
                        </button>

                        <p className="text-key-name-modal_text">
                            Skriv et beskrivende navn for tekstnøkkelen. Ikke bruk mellomrom. 
                            <br />
                            Hvis navnet består av flere ord, skriv dem sammen som ett ord med 
                            stor forbokstav på hvert ord.
                            <br />
                            <br />
                            Eksempel:
                            <br />
                            intro tekst → IntroTekst
                        </p>
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Skriv navnet her"
                            className="text-key-name-modal_input"
                        />
                        <button 
                            type="button" 
                            onClick={handleAdd} 
                            className="text-key-name-modal_add-button"
                        >
                            Legg til
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
