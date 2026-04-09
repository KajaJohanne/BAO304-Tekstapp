// Første "lag" med underkategori under applikasjon?
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";

import { type ApplicationListItem, type TextKeyListItem, getTextKeysByApplication, deleteTextKey } from "../../../../api";
import type { SectionState } from "../../../types/section";
import type { SubSectionItem } from "../../../types/subSection";
import "./SectionPage.css";

const SectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [application, setApplication] = useState<ApplicationListItem | null>(null);
    const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

    const [subSections, setSubSections] = useState<SubSectionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checkedSubSections, setCheckedSubSections] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddingSubSection, setIsAddingSubSection] = useState(false);
    const [newSubSectionName, setNewSubSectionName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const pageState = useMemo(() => {
        if (location.state) {
            return location.state as SectionState;
        }
        
        const savedState = sessionStorage.getItem("sectionState");
        if (!savedState) return null;

        try {
            return JSON.parse(savedState) as SectionState;
        } catch {
            return null;
        }
    }, [location.state]);

    useEffect(() => {
        //Henter kategori og underkateogrier
        const fetchTextKeys = async () => {
            try {
                if (!pageState) return;

                sessionStorage.setItem("sectionState", JSON.stringify(pageState));

                const allKeys = await getTextKeysByApplication(pageState.applicationId);

                const filtered = allKeys.filter((key) => {
                    if (!key.placementPath || key.placementPath.length < 2) return false;

                    const keySection = key.placementPath[1];

                    //Kun tekstnøkler som tilhører valgt kategori
                    return keySection === pageState.sectionName;
                });

                setTextKeys(filtered);
            } catch (error) {
                console.error("Feil ved henting av tekstnøkler:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTextKeys();
    }, [pageState]);

    //Laster tekst
    if (isLoading) {
        return <p className="section-loading">Laster...</p>;
    }

    //Hvis det ikke finnes noe data
    if (!pageState) {
        return (
            <p className="section-error">Ingen data tilgjengelig. Gå tilbake og velg på nytt.</p>
        );
    }

    const filteredTextKeys = textKeys.filter((textKey) =>
        textKey.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    //Slette underkategori
    const handleDeleteSelected = async () => {
        if (!application || !pageState) return;

        if (checkedSubSections.length === 0) return;

        const confirmed = window.confirm(
            `Er du sikker på at du vil slette?\nAntall tekstnøkler valgt: ${checkedKeys.length}`
        );
        
        if (!confirmed) return;

        try {
            const results = await Promise.all(
                checkedKeys.map((id) => deleteTextKey(id)),
            );

            const firstError = results.find((result) => result !== null);
            if (firstError) {
                console.error(firstError);
                alert(firstError);
                return;
            }

            //Oppdaterer UI
            setTextKeys((prev) => 
                prev.filter((textKey) => !checkedKeys.includes(textKey.id))
            );
            setCheckedKeys([]);
        } catch (error) {
            console.error("Feil ved sletting av tekstnøkler:", error);
            alert("Noe gikk galt ved sletting.");
        }
    };

    return(
        <div className="section-page">
            {/* Tilbake knapp */}
            <button className="back-button" onClick={() => navigate(-1)}>
                <span className="back-arrow">‹</span>
                <span className="back-text">{pageState.applicationName}</span>
            </button>

            <h1>{pageState.sectionName}</h1>

            <p className="section-intro">
                Her er oversikt over tekstnøkler innenfor {pageState.applicationName},{" "}
                {pageState.sectionName}
            </p>

            <div className="section-header-wrapper">
                {/* Header rad */}
                <div className="section-list-header">
                    <div className="section-list-header-left">
                        {/* Legg til tekstnøkkel knapp */}
                        <Button 
                            onClick={() => 
                                navigate("/create-textkey", {
                                    state: {
                                        applicationId: pageState.applicationId,
                                        sectionName: pageState.sectionName,
                                    },
                                })
                            }
                            className="section-add-button"
                        >
                            <span className="add-button-plus">+</span>
                            <span className="add-button-text">Legg til ny tekstnøkkel</span>
                        </Button>
                    </div>
                    <div className="section-marker-title">Marker</div>
                </div>
            </div>
            
            {/* Liste med underkategorier */}
            {filteredTextKeys.length === 0 ? (
                <p className="section-empty">Ingen tekstnøkler funnet.</p>
            ) : (
                <div className="section-list">
                    {filteredTextKeys.map((textKey) => {
                        const isChecked = checkedKeys.includes(textKey.id);

                        return (
                            <div className="section-row" key={textKey.id}>
                                <button 
                                    className="section-card"
                                    onClick={() =>
                                        // Navigerer til textKeyDetail siden
                                        navigate("/textkeyDetails/:id", {
                                            state: {
                                                textKeyId: textKey.id,
                                            },
                                        })
                                    }
                                >
                                    <span className="section-card-title">{textKey.name}</span>
                                    <span className="section-card-edit">✎</span>
                                </button>
                                
                                {/* Checkboxer */}
                                <div className="section-checkbox-wrapper">
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={(e) => {
                                            const checked = e.target.checked;

                                            setCheckedKeys((prev) =>
                                                checked
                                                ? [...prev, textKey.id]
                                                : prev.filter((id) => id !== textKey.id)
                                            );
                                        }}
                                        aria-label={`Marker ${textKey.name}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
            )}

            {/* Slett knapp */}
            <Button 
                onClick={handleDeleteSelected}
                disabled={checkedKeys.length === 0}
                className="section-delete-button"
            >
                Slett tekstnøkkel
            </Button>
        </div>
    );
};

export default SectionPage; 