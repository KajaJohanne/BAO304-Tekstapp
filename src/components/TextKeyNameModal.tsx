import { useState } from "react";
import "./TextKeyNameModal.css";

export default function TextKeyNameModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    
    //feil validering
    const handleAdd = () => {
        const value = inputValue.trim();

        //Tom verdi
        if (value.length === 0) {
            alert("Nøkkelen kan ikke være tom.");
            return;
        }

        //Mellomrom
        if (value.includes(" ")) {
            alert("Nøkkelen kan ikke inneholde mellomrom.");
            return;
        }

        //Kun bokstaver
        const onlyLetters = /^[A-Za-zÆØÅæøå]+$/;
        if (!onlyLetters.test(value)) {
            alert("Nøkkelen kan kun inneholde bokstaver.");
            return;
        }

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

/*const styles: { [key: string]: CSSProperties } = {
    openButton: {
        marginTop: "32px",
        width: "250px",
        height: "70px",
        backgroundColor: "#F5F5F5",
        color: "#4f5b62",
        border: "2px solid #5b6770",
        fontSize: "18px",
        cursor: "pointer",
        textAlign: "left",
        paddingLeft: "16px",
    },
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        position: "relative",
        width: "880px",
        backgroundColor: "#F5F5F5",
        padding: "48px 64px 56px 64px",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    },
    closeButton: {
        position: "absolute",
        top: "20px",
        right: "24px",
        border: "none",
        background: "transparent",
        fontSize: "36px",
        color: "#4f5b62",
        cursor: "pointer",
        lineHeight: 1,
    },
    text: {
        margin: 0,
        marginBottom: "32px",
        fontSize: "18px",
        color: "#4f5b62",
        maxWidth: "620px",
        lineHeight: 1.4,
        whiteSpace: "pre-line",
    },
    input: {
        display: "block",
        width: "500px",
        height: "56px",
        border: "2px solid #ff9100",
        backgroundColor: "#F5F5F5",
        fontSize: "18px",
        color: "#4f5b62",
        padding: "0 16px",
        marginBottom: "32px",
        outline: "none",
    },
    addButton: {
        width: "140px",
        height: "56px",
        border: "none",
        backgroundColor: "#4f5b62",
        color: "white",
        fontSize: "18px",
        cursor: "pointer",
    },
};*/