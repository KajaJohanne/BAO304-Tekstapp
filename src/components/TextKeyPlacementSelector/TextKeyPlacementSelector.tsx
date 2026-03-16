import { useState } from "react";
import "./TextKeyPlacementSelector.css";
import React from "react";
import type { ApplicationListItem } from "../../../api";

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
    applications: ApplicationListItem[];
    selectedPlacement: string;
    onSavePlacement: (placement: string) => void;
    onSelectApplication: (applicationId: string) => void;
    textKeyName: string;
};

export default function TextKeyPlacementSelector({ applications, onSavePlacement, onSelectApplication,}: TextKeyPlacementSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationListItem | null>(null);
    const [selectedLevelOne, setSelectedLevelOne] = useState<string | null>(null);
    const [selectedLevelTwo, setSelectedLevelTwo] = useState<string | null>(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    //Valg av nivåer, rekkefølge
    const handleLevelOne = (item: string) => {
        setSelectedLevelOne(item);
        setSelectedLevelTwo(null);
    };
    const handleLevelTwo = (item: string) => {
        setSelectedLevelTwo(item);
    };

    //Lagring
    const handleSave = () => {
        if (!selectedApplication) {
            alert("Du må velge en applikasjon");
            return;
        }
        if (!selectedLevelOne) {
            alert("Du må velge en plassering");
            return;
        }

        const placement = selectedLevelTwo
            ? `${selectedApplication.name} > ${selectedLevelOne} > ${selectedLevelTwo}`
            : `${selectedApplication.name} > ${selectedLevelOne}`;

        onSelectApplication(selectedApplication.id);
        onSavePlacement(placement);
        closeModal();
    };

    const levelOne = Object.keys(keyStructure);
    const levelTwo = 
        selectedLevelOne && keyStructure[selectedLevelOne] 
        ? keyStructure[selectedLevelOne] 
        : [];

    const buttonText = "Velg applikasjon";

    return (
        <>
        {/* Velg applikasjon tekst */}
        <div className="placement-wrapper">
            <p className="placement-label">Plasser nøkkelen</p>

            <button className="placement-button" onClick={openModal} type="button">
                <span>{buttonText}</span>
                <span className="arrow">›</span>
            </button>
        </div>

        {isOpen && (
            <div className="modal-overlay">
                <div className="modal">

                    {/* Knapper øverst i popup */}
                    <div className="modal-header">
                        <button className="close-button" onClick={closeModal} type="button">
                            ×
                        </button>

                        <button className="modal-title-button" onClick={handleSave} type="button">
                            Plasser nøkkelen her
                        </button>
                    </div>

                    {/* Valg av applikasjon */}
                    <div className="modal-columns">
                        <div className="column">
                            <p>Applikasjoner</p>
                            {applications.map((application) => (
                            <button
                                key={application.id}
                                className={`option ${selectedApplication?.id === application.id ? "selected" : ""}`}
                                onClick={() => setSelectedApplication(application)}
                                type="button"
                            >
                                <span>{application.name}</span>
                                <span className="arrow">›</span>
                            </button>
                            ))}
                        </div>

                        {/* Valg av hovednivå */}
                        <div className="column">
                            <p><strong>Hovednivå</strong></p>
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

                        {/* Valg av undernivå */}
                        <div className="column">
                            <p><strong>Undernivå</strong></p>
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
                </div>
            </div>
        )}
        </>
    );
}