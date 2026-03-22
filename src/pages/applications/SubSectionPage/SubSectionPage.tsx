// andre lag med underkategori? Applikasjon/Section/her
import { useEffect, useMemo, useState  } from "react";
import {
    getTextKeysByApplication,
    type TextKeyListItem,
} from "../../../../api";
import { useLocation, useNavigate} from "react-router-dom";
import type { subSectionState } from "../../../types/subSection";

const SubSectionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
    
    if (isLoading) return <p>Laster...</p>;
    
    if (!pageState) {
        return <p>Ingen data tilgjengelig. Gå tilbake og velg på nytt.</p>;
    }

    console.log("side state:", pageState);
    console.log("tekstnøkler:", textKeys);

    return (
        <div style={{ padding: "24px" }}>
            <button onClick={() => navigate(-1)}>‹ Tilbake</button>
            <h1>Tekstnøkler</h1>

            <p>
                Her er alle tekstnøkler tilhørende {pageState.sectionName}
                {pageState.subSectionName ? `, ${pageState.subSectionName}`: ""}
            </p>

            <h2>{pageState.subSectionName || pageState.sectionName}</h2>

            {textKeys.length === 0 ? (
                <p>Ingen tekstnøkler funnet.</p>
            ) : (
                textKeys.map((textKey) => (
                    <div key={textKey.id} className="text-key">
                        <h3>{textKey.name}</h3>
                        <p>Bokmål: {textKey.default.bokmål}</p>
                    </div>
            ))
        )}
        </div>
    );
};

export default SubSectionPage; 