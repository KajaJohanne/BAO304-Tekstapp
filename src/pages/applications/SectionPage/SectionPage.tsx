// Første "lag" med underkategori under applikasjon?
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";

import { getApplication, type ApplicationListItem, deleteSubSections } from "../../../../api";
import type { SectionState } from "../../../types/section";
import type { SubSectionItem } from "../../../types/subSection";
import "./SectionPage.css";

const SectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [application, setApplication] = useState<ApplicationListItem | null>(null);
    const [subSections, setSubSections] = useState<SubSectionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [checkedSubSections, setCheckedSubSections] = useState<string[]>([]);

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
        const fetchSection = async () => {
            try {
                if (!pageState) return;

                sessionStorage.setItem("sectionState", JSON.stringify(pageState));

                const app = await getApplication(pageState.applicationId);
                if (!app) return;

                setApplication(app);

                const selectedSection = app.sections.find(
                    (section) => section.name === pageState.sectionName
                );

                setSubSections(selectedSection?.subSections ?? []);
            } catch (error) {
                console.error("Feil ved henting av kategori:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSection();
    }, [pageState]);

    //Laster tekst
    if (isLoading) {
        return <p className="section-loading">Laster...</p>;
    }

    //Hvis det ikke finnes noe data
    if (!pageState || !application) {
        return (
            <p className="section-error">Ingen data tilgjengelig. Gå tilbake og velg på nytt.</p>
        );
    }

    //Slette tekstnøkkel
    const handleDeleteSelected = async () => {
        if (!application || !pageState) return;

        if (checkedSubSections.length === 0) return;

        const confirmed = window.confirm(
            `Er du sikker på at du vil slette?\nAntall underkategorier valgt: ${checkedSubSections.length}`
        );
        
        if (!confirmed) return;

        try {
            const error = await deleteSubSections(
                application.id,
                pageState.sectionName,
                checkedSubSections
            );

            if (error) {
                console.error(error);
                alert(error);
                return;
            }

            //Oppdaterer UI
            setSubSections((prev) => 
                prev.filter((sub) => !checkedSubSections.includes(sub.name))
            );
            setCheckedSubSections([]);
        } catch (error) {
            console.error("Feil ved sletting av underkategorier:", error);
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

            <h1>Oversikt {pageState.sectionName}</h1>

            <p className="section-intro">
                Her er oversikt over tekstnøkler innenfor {pageState.applicationName},{" "}
                {pageState.sectionName}
            </p>

            <h2 className="section-current-title">{pageState.sectionName}</h2>

            {/* Header rad */}
            <div className="section-list-header">
                <div className="section-list-header-left">
                    <span>Underkategorier</span>
                    <button className="section-plus-button" aria-label="Legg til underkategori">
                        <BiPlus />
                    </button>
                </div>
                <div className="section-marker-title">Marker</div>
            </div>

            {/* Liste med underkategorier */}
            <div className="section-list">
                {subSections.length === 0 ? (
                    <p className="section-empty">Ingen underkategprier funnet.</p>
                ) : (
                    subSections.map((subSection) => {
                        const isChecked = checkedSubSections.includes(subSection.name);

                        return (
                            <div className="section-row" key={subSection.name}>
                                <button 
                                    className="section-card"
                                    onClick={() =>
                                        //Navigerer til underkategorier
                                        navigate("/subSection", {
                                            state: {
                                                applicationId: pageState.applicationId,
                                                applicationName: pageState.applicationName,
                                                sectionName: pageState.sectionName,
                                                subSectionName: subSection.name,
                                            },
                                        })
                                    }
                                >
                                    <span className="section-card-title">{subSection.name}</span>
                                    <span className="section-card-arrow">›</span>
                                </button>
                                
                                {/* Checkboxer */}
                                <div className="section-checkbox-wrapper">
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;

                                            setCheckedSubSections((prev) =>
                                                isChecked
                                                ? [...prev, subSection.name]
                                                : prev.filter((name) => name !== subSection.name)
                                            );
                                        }}
                                        aria-label={`Marker ${subSection.name}`}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Slett knapp */}
            <Button 
                onClick={handleDeleteSelected}
                disabled={checkedSubSections.length === 0}
                className="section-delete-button"
            >
                Slett underkategori
            </Button>
        </div>
    );
};

export default SectionPage; 