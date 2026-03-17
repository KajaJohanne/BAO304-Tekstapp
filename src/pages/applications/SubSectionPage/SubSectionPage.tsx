// andre lag med underkategori? Applikasjon/Section/her
import { useEffect, useState  } from "react";
import {
    getTextKeysByApplication,
    type TextKeyListItem,
} from "../../../../api";
import { useLocation } from "react-router-dom";
import type { LocationState } from "../../../types/location";

const SubSectionPage = () => {
    const location = useLocation();
    const state = location.state as LocationState | null;

    const [textKeys, setTextKeys] = useState<TextKeyListItem[]>([]);
    
    useEffect(() => {
        const fetchTextKeys = async () => {
            if (!state) return;
            const { applicationId, sectionName, subSectionName } = state;

            if (!applicationId || !sectionName || !subSectionName) return;

            const allKeys = await getTextKeysByApplication(applicationId);

            const filtered = allKeys.filter((key) => {
                if (!key.placementPath) return false;

                return (
                    key.placementPath[1] === sectionName &&
                    key.placementPath[2] === subSectionName
                );
            });
            setTextKeys(filtered);
        };
        fetchTextKeys();
    }, [state]);

    if (!state) {
        return <p>Ingen data tilgjengelig. Gå tilbake og velg på nytt.</p>
    }

    const { subSectionName } = state;

    return (
        <div style={{ padding: "24px" }}>
            <h1>{subSectionName}</h1>

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