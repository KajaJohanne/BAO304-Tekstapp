// andre lag med underkategori? Applikasjon/Section/her
import { useEffect, useMemo, useState  } from "react";
import {
    getTextKeysByApplication,
    type TextKeyListItem,
} from "../../../../api";
import { useLocation, useNavigate} from "react-router-dom";
import type { subSectionState } from "../../../types/subSection";
import "./SubSectionPage.css";
import TextKeyCard from "../../../components/TextKeyCard/TextKeyCard";

const SubSectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");

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
        textKey.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    console.log("side state:", pageState);
    console.log("tekstnøkler:", textKeys);

    return (
        <div className="subsection-page">
            <div className="subsection-container">
                {/* Tilbake knapp */}
                <button
                    className="subsection-back-button"
                    onClick={() => navigate(-1)}
                    type="button"
                >
                    <span>‹</span>
                    <span>{pageState.sectionName}</span>
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
                <button 
                    className="subsection-add-button" 
                    type="button" 
                    onClick={() => 
                        navigate("/create-textkey", {
                            state: {
                                applicationId: pageState.applicationId,
                                sectionName: pageState.sectionName,
                                subSectionName: pageState.subSectionName,
                            },
                        })
                    }
                >
                    Legg til tekstnøkkel
                </button>
            </div>

            {/* Marker tekstnøkler seksjon */}
            <div className="subsection-list-header">
                <div />
                <div className="subsection-marker-title">Marker</div>
            </div>

            {/* Dukker opp hvi det ikke finnes noen tekstnøkler tilhørende kategorien */}
            {filteredTextKeys.length === 0 ? (
                <p className="subsection-empty">Ingen tekstnøkler funnet.</p>
            ) : (
                //Listen over tekstnøkler
                <div className="subsection-list">
                    {filteredTextKeys.map((textKey) => (
                        <TextKeyCard
                            key={textKey.id}
                            textKey={textKey}
                            onEdit={(selectedTextKey) => {
                                console.log("Rediger tekstnøkkel:", selectedTextKey);
                            }}
                            onCheckChange={(isChecked) => {
                                console.log(textKey.name, isChecked);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubSectionPage; 