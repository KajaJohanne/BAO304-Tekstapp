import { useState } from "react";
import "./TextKeyPlacementSelector.css";
import React from "react";

type PlacementTree = {
    [key: string]: string[];
};

const keyStructure: PlacementTree = {
    HovedSide: ["Reiseinformasjon"],
    Trafikk: ["Langs veien", "Trafikksikkerhet"],
    Kjøretøy: [],
    Fagkort: [],
    Veiprosjekter: [],
    Fag: [],
};

type TextKeyPlacementSelectorProps = {
    selectedPlacement: string;
    onSavePlacement: (placement: string) => void;
    textKeyName: string;
};

export default function TextKeyPlacementSelector({ selectedPlacement, onSavePlacement, textKeyName,}: TextKeyPlacementSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLevelOne, setSelectedLevelOne] = useState<string | null>(null);
    const [selectedLevelTwo, setSelectedLevelTwo] = useState<string | null>(null);
    const [selectedPath, setSelectedPath] = useState("Velg applikasjon");

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleLevelOne = (item: string) => {
        setSelectedLevelOne(item);
        setSelectedLevelTwo(null);
    };
    const handleLevelTwo = (item: string) => {
        setSelectedLevelTwo(item);
    };
    const handleSave = () => {
        if (selectedLevelOne && selectedLevelTwo) {
            onSavePlacement(`${selectedLevelOne} > ${selectedLevelTwo}`);
            closeModal();
            return;
        }
        if (selectedLevelOne) {
            onSavePlacement(selectedLevelOne);
            closeModal();
            return;
        }

        alert("Du må velge en applikasjon");
    };

    const levelOne = Object.keys(keyStructure);
    const levelTwo = selectedLevelOne && keyStructure[selectedLevelOne] ? keyStructure[selectedLevelOne] : [];
    const buttonText = selectedPlacement
        ? textKeyName
            ? `${selectedPlacement} > ${textKeyName}`
            : selectedPlacement
        : "Velg applikasjon";

    return (
        <>
        <div className="placement-wrapper">
            <p className="placement-label">Plasser nøkkelen</p>

            <button className="placement-button" onClick={openModal} type="button">
                <span>{selectedPath}</span>
                <span className="arrow">›</span>
            </button>
        </div>

        {isOpen && (
            <div className="modal-overlay">
                <div className="modal">

                    <div className="modal-header">
                        <button className="back-button" onClick={closeModal} type="button">
                            ‹ applikasjoner
                        </button>

                        <p className="modal-title">Plasser nøkkelen her</p>
                    </div>
                    <div className="modal-columns">
                        <div className="column">
                            {levelOne.map((item) => (
                                <button
                                    key={item}
                                    className={`option ${selectedLevelOne === item ? "selected" : ""}`}
                                    onClick={() => handleLevelOne(item)}
                                    type="button"
                                >
                                    <span>{item}</span>
                                    <span className="arrow">›</span>
                                </button>
                            ))}
                        </div>
                        <div className="column">
                            {levelTwo.map((item) => (
                                <button
                                    key={item}
                                    className={`option ${selectedLevelTwo === item ? "selected" : ""}`}
                                    onClick={() => handleLevelTwo(item)}
                                    type="button"
                                >
                                    <span>{item}</span>
                                    <span className="arrow">›</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="save-button" onClick={handleSave} type="button">
                            Legg til plassering
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}