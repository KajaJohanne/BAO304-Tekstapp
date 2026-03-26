// andre lag med underkategori? Applikasjon/Section/her
import { useEffect, useMemo, useState  } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import { Button } from "@digdir/designsystemet-react";
import { BiPlus } from "react-icons/bi";

import {
    getTextKeysByApplication,
    deleteTextKey,
    type TextKeyListItem,
} from "../../../../api";
import type { subSectionState } from "../../../types/subSection";
import "./SubSectionPage.css";
import TextKeyCard from "../../../components/TextKeyCard/TextKeyCard";
import SearchBar from "../../../components/Search/SearchBar";

const SubSectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

    const pageState = useMemo(() => {
        if (location.state) {
            return location.state as subSectionState;
        }

        const savedState = sessionStorage.getItem("subSectionState");
        if (!savedState) return null;

        try {
            return JSON.parse(savedState) as subSectionState;
        } catch {
            return null;
        }
    }, [location.state]);
    
    //Henter nøkler tilhørende applikasjonen som er valgt
    useEffect(() => {
        const fetchTextKeys = async () => {
          try {
            if (!pageState) return;

            sessionStorage.setItem("subSectionState", JSON.stringify(pageState));
    
            const { applicationId, sectionName, subSectionName } = pageState;
            const allKeys = await getTextKeysByApplication(applicationId);
    
            const filtered = allKeys.filter((key) => {
                if (!key.placementPath || key.placementPath.length < 2) return false;

                const keySection = key.placementPath[1];
                const keySubSection = key.placementPath[2];

                const matchesSection = keySection === sectionName;
                const matchesSubSection = subSectionName
                    ? keySubSection === subSectionName
                    : true;
                
                return matchesSection && matchesSubSection;
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
    
    //Laste visning
    if (isLoading) {
        return <p className="subsection-loading">Laster...</p>;
    }
    
    //Tekst som vises hvis noe går galt
    if (!pageState) {
        return (
            <p className="subsection-error">
                Ingen data tilgjengelig. Gå tilbake og velg på nytt.
            </p>
        );
    }

    const filteredTextKeys = textKeys.filter((textKey) =>
        textKey.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("side state:", pageState);
    console.log("tekstnøkler:", textKeys);

    //Slette tekstnøkkel
    const handleDeleteSelected = async () => {
        if (checkedKeys.length === 0) return;

        const confirmed = window.confirm(
            `Er du sikker på at du vil slette ${checkedKeys.length} tekstnøkkel(er)?`
        );
        
        if (!confirmed) return;

        try {
            const results = await Promise.all(
                checkedKeys.map((id) => deleteTextKey(id))
            );

            const firstError = results.find((result) => result !== null);
            if (firstError) {
                console.error(firstError);
                alert(firstError);
                return;
            }

            setTextKeys((prev) => 
                prev.filter((textKey) => !checkedKeys.includes(textKey.id))
            );
            setCheckedKeys([]);
        } catch (error) {
            console.error("Feil ved sletting av tekstnøkler:", error);
            alert("Noe gikk galt ved sletting.");
        }
    };

    return (
        <div className="subsection-page">
            {/* Tilbake knapp */}
            <button
                className="back-button"
                onClick={() => navigate(-1)}
            >
                <span className="back-arrow">‹</span>
                <span className="back-text">{pageState.sectionName}</span>
            </button>

            <h1>Tekstnøkler</h1>

            {/* Henter navnet til applikasjonen og kategorien som er valgt */}
            <p>
                Her er alle tekstnøkler tilhørende {pageState.sectionName || pageState.sectionName}
                {pageState.subSectionName ? `, ${pageState.subSectionName}`: ""}
            </p>

            {/* Navn på kategorien som er valgt */}
            <h2>
                {pageState.subSectionName || pageState.sectionName}
            </h2>

            {/* Legg til tekstnøkkel knapp */}
            <Button 
                onClick={() => 
                    navigate("/create-textkey", {
                        state: {
                            applicationId: pageState.applicationId,
                            sectionName: pageState.sectionName,
                            subSectionName: pageState.subSectionName,
                        },
                    })
                }
                className="subsection-add-button"
            >
                <BiPlus aria-hidden />
                Legg til ny tekstnøkkel
            </Button>

            {/* Søkefelt fra komponent */}
            <SearchBar 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Søk etter tekstnøkkel..."
                ariaLabel="Søk etter tekstnøkkel"
            />

            {/* Marker tekstnøkler seksjon */}
            <div className="subsection-list-header">
                <div />
                <div className="subsection-marker-title">Marker</div>
            </div>
            
            {/* Dukker opp hvis det ikke finnes noen tekstnøkler tilhørende kategorien */}
            {filteredTextKeys.length === 0 ? (
                <p className="subsection-empty">Ingen tekstnøkler funnet.</p>
            ) : (
                //Listen over tekstnøkler
                <div className="subsection-list">
                    {filteredTextKeys.map((textKey) => (
                        <TextKeyCard
                            key={textKey.id}
                            textKey={textKey}
                            checked={checkedKeys.includes(textKey.id)}
                            onEdit={(selectedTextKey) => {
                                console.log("Rediger tekstnøkkel:", selectedTextKey);
                            }}
                            onCheckChange={(isChecked) => {
                                setCheckedKeys((prev) => 
                                    isChecked
                                    ? [...prev, textKey.id]
                                    : prev.filter((id) => id !== textKey.id)
                                );
                                console.log(textKey.name, isChecked);
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Slett knapp */}
            <Button 
                onClick={handleDeleteSelected}
                disabled={checkedKeys.length === 0}
                className="subsection-delete-button"
            >
                Slett tekstnøkkel
            </Button>
            
        </div>
    );
};

export default SubSectionPage; 