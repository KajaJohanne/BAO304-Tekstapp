import { useState } from "react";
import "./TextKeyPlacementSelector.css";
import type { ApplicationListItem } from "../../../api";
import type { TextKeyPlacementSelectorProps } from "../../types/textKeyPlacementTree";


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
            ? `${selectedApplication.name}.${selectedLevelOne}.${selectedLevelTwo}`
            : `${selectedApplication.name}.${selectedLevelOne}`;

        onSelectApplication(selectedApplication.id);
        onSavePlacement(placement);
        closeModal();
    };

    const levelOne = selectedApplication?.sections ?? [];
    const selectedSectionObject = selectedApplication?.sections.find(
        (section) => section.name === selectedLevelOne
    );
    const levelTwo = selectedSectionObject?.subSections ?? [];

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
                            <p>Kategori</p>
                            {levelOne.map((section) => (
                            <button
                                key={section.name}
                                className={`option ${selectedLevelOne === section.name ? "selected" : ""}`}
                                onClick={() => handleLevelOne(section.name)}
                                type="button"
                            >
                                <span>{section.name}</span>
                                <span className="arrow">›</span>
                            </button>
                            ))}
                        </div>

                        {/* Valg av undernivå */}
                        <div className="column">
                            <p>Under kategori</p>
                            {levelTwo.map((subSection) => (
                            <button
                                key={subSection.name}
                                className={`option ${selectedLevelTwo === subSection.name ? "selected" : ""}`}
                                onClick={() => handleLevelTwo(subSection.name)}
                                type="button"
                            >
                                <span>{subSection.name}</span>
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