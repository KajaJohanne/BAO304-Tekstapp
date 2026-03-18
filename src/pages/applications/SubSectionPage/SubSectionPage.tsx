// andre lag med underkategori? Applikasjon/Section/her
import { useEffect, useMemo, useState  } from "react";
import {
    getTextKeysByApplication,
    type TextKeyListItem,
} from "../../../../api";
import { useLocation } from "react-router-dom";
import type { LocationState } from "../../../types/location";
import type { subSectionState } from "../../../types/subSection";

const SubSectionPage = () => {
    const location = useLocation();

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
            if (!pageState) {
              return;
            }
    
            const { applicationId, sectionName, subSectionName } = pageState;
    
            if (!applicationId || !sectionName || !subSectionName) {
              return;
            }
    
            const allKeys = await getTextKeysByApplication(applicationId);
    
            const filtered = allKeys.filter((key) => {
                console.log("placementPath:", key.placementPath);
                console.log("matcher section?:", key.placementPath[1], sectionName);
                console.log("matcher subSection?:", key.placementPath[2], subSectionName);

              if (!key.placementPath) return false;
    
              return (
                key.placementPath[1] === sectionName &&
                key.placementPath[2] === subSectionName
              );
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
    
    if (isLoading) {
        return <p>Laster...</p>;
    }
    
    if (!pageState) {
        return <p>Ingen data tilgjengelig. Gå tilbake og velg på nytt.</p>;
    }

    console.log("side state:", pageState);
    console.log("tekstnøkler:", textKeys);

    return (
        <div style={{ padding: "24px" }}>
            <h1>{pageState.subSectionName}</h1>

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