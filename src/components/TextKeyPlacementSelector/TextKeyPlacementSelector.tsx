import { useEffect, useState } from "react";
import "./TextKeyPlacementSelector.css";
import type { ApplicationListItem } from "../../../api";
import type { TextKeyPlacementSelectorProps } from "../../types/textKeyPlacementTree";


export default function TextKeyPlacementSelector({ applications, selectedPlacement, selectedApplicationId, onSavePlacement, onSelectApplication,}: TextKeyPlacementSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationListItem | null>(null);
    const [selectedLevelOne, setSelectedLevelOne] = useState<string | null>(null);
    const [selectedLevelTwo, setSelectedLevelTwo] = useState<string | null>(null);
    const [mobileStep, setMobileStep] = useState<"application" | "category" | "subCategory">("application");

    const openModal = () => {
        setIsOpen(true);
        setMobileStep("application");
    }
    const closeModal = () => {
        setIsOpen(false);
        setMobileStep("application");
    }

    //Henter plassering om man kommer fra applikasjon/subSection siden
    useEffect (() => {
        if (!applications.length) return;

        const application = applications.find(
            (app) => app.id === selectedApplicationId
        );

        if (!application) return;

        setSelectedApplication(application);

        if (!selectedPlacement) return;

        const parts = selectedPlacement.split(".").map((part) => part.trim());

        const appName = application.name;

        if (parts[0] === appName) {
            setSelectedLevelOne(parts[1] ?? null);
            setSelectedLevelTwo(parts[2] ?? null);
        } else {
            setSelectedLevelOne(parts[0] ?? null);
            setSelectedLevelTwo(parts[1] ?? null);
        }
    }, [applications, selectedApplicationId, selectedPlacement]);

    //Valg av nivåer, rekkefølge
    const handleLevelOne = (item: string) => {
        setSelectedLevelOne(item); //Lagrer valgt kategori
        setSelectedLevelTwo(null); //Nullstiller underkategori
        setMobileStep("subCategory"); //Går videre til neste steg (mobilvisning)
    };
    const handleLevelTwo = (item: string) => {
        setSelectedLevelTwo(item); //Lagrer valgt underkategori
    };

    //Lagring
    const handleSave = () => {
        //Hvis ingen applikasjon er valgt -> alert
        if (!selectedApplication) {
            alert("Du må velge en applikasjon");
            return;
        }
        //Hvis ingen kategori er valgt -> alert
        if (!selectedLevelOne) {
            alert("Du må velge en plassering");
            return;
        }

        //Bygger nøkkelnavnet
        const placement = selectedLevelTwo
            ? `${selectedApplication.name}.${selectedLevelOne}.${selectedLevelTwo}`
            : `${selectedApplication.name}.${selectedLevelOne}`;

        onSelectApplication(selectedApplication.id); //Sender valgt applikasjon tilbake
        onSavePlacement(placement); //Sender selve nøkkelnavnet videre
        closeModal();
    };

    //Henter kategoriene fra valgt applikasjon
    const levelOne = selectedApplication?.sections ?? [];
    //Finner kategorien som er valgt
    const selectedSectionObject = selectedApplication?.sections?.find(
        (section) => section.name === selectedLevelOne
    );
    //Henter underkategoriene for valgt kategori
    const levelTwo = selectedSectionObject?.subSections ?? [];

    const buttonText = "Velg applikasjon";

    return (
        <>
        {/* Velg applikasjon tekst */}
        <div className="placement-wrapper">
            <p className="placement-label">Plasser nøkkelen</p>

            <button className="placement-button" onClick={openModal} type="button">
                <span>{buttonText}</span>
                <span className="placement-arrow">›</span>
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
                    <div className="modal-columns desktop-view">
                        <div className="column">
                            <p>Applikasjoner</p>
                            {applications.map((application) => (
                            <button
                                key={application.id}
                                className={`option ${selectedApplication?.id === application.id ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedApplication(application);
                                    setSelectedLevelOne(null);
                                    setSelectedLevelTwo(null);
                                }}
                                type="button"
                            >
                                <span>{application.name}</span>
                                <span className="placement-arrow">›</span>
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
                                <span className="placement-arrow">›</span>
                            </button>
                            ))}
                        </div>

                        {/* Valg av undernivå */}
                        <div className="column">
                            <p>Underkategori</p>
                            {levelTwo.map((subSection) => (
                            <button
                                key={subSection.name}
                                className={`option ${selectedLevelTwo === subSection.name ? "selected" : ""}`}
                                onClick={() => handleLevelTwo(subSection.name)}
                                type="button"
                            >
                                <span>{subSection.name}</span>
                                <span className="placement-arrow">›</span>
                            </button>
                            ))}
                        </div>
                    </div>

                    {/* Valg av applikasjon */}
                    <div className="mobile-view">
                        {mobileStep === "application" && (
                        <div className="mobile-step">
                            <p>Applikasjoner</p>
                            {applications.map((application) => (
                            <button
                                key={application.id}
                                className={`option ${selectedApplication?.id === application.id ? "selected" : ""}`}
                                onClick={() => {
                                    setSelectedApplication(application);
                                    setSelectedLevelOne(null);
                                    setSelectedLevelTwo(null);
                                    setMobileStep("category");
                                }}
                                type="button"
                            >
                                <span>{application.name}</span>
                                <span className="placement-arrow">›</span>
                            </button>
                            ))}
                        </div>
                        )}

                        {/* Valg av hovednivå */}
                        {mobileStep === "category" && (
                        <div className="mobile-step">
                            {/* Tilbake knapp */}
                            <button 
                                className="back-button"
                                onClick={() => setMobileStep("application")}
                                type="button"
                            >
                                <span className="back-arrow">‹</span>
                                <span className="back-text">Applikasjoner</span>                            
                            </button>

                            <p>Kategori</p>
                            {levelOne.map((section) => (
                            <button
                                key={section.name}
                                className={`option ${selectedLevelOne === section.name ? "selected" : ""}`}
                                onClick={() => handleLevelOne(section.name)}
                                type="button"
                            >
                                <span>{section.name}</span>
                                <span className="placement-arrow">›</span>
                            </button>
                            ))}
                        </div>
                        )}

                        {/* Valg av undernivå */}
                        {mobileStep === "subCategory" && (
                        <div className="mobile-step">
                            {/* Tilbake knapp */}
                            <button 
                                className="back-button"
                                onClick={() => setMobileStep("category")}
                                type="button"
                            >
                                <span className="back-arrow">‹</span>
                                <span className="back-text">Kategorier</span>                            
                            </button>

                            <p>Underkategori</p>
                            {levelTwo.length > 0 ? (
                                levelTwo.map((subSection) => (
                                    <button
                                        key={subSection.name}
                                        className={`option ${selectedLevelTwo === subSection.name ? "selected" : ""}`}
                                        onClick={() => handleLevelTwo(subSection.name)}
                                        type="button"
                                    >
                                        <span>{subSection.name}</span>
                                        <span className="placement-arrow">›</span>
                                    </button>
                                ))
                            ) : (
                                <p>Ingen underkategorier tilgjengelig</p>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}