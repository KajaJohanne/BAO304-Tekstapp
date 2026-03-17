// Første "lag" med underkategori under applikasjon?
import { useParams, useNavigate } from "react-router-dom";
import type { subSectionState } from "../../../types/subSection";

const SectionPage = () => {
    const { applicationId, sectionName } = useParams();
    const navigate = useNavigate();

    const subSections: Record<string, string[]> = {
        Trafikk: ["Reiseinformasjon", "Langs veien", "Trafikksikkerhet"],
        Kjøretøy: ["Kjøp og salg", "Eie og vedlikeholde", "Yrkestransport"],
    };

    const currentSections = sectionName ? subSections[sectionName] || [] : [];

    const handleSubSectionClick = (subSection: string) => {
        if (!applicationId || !sectionName) return;

        const state: subSectionState = {
            applicationId,
            sectionName,
            subSectionName: subSection,
        };
        
        sessionStorage.setItem("subSectionState", JSON.stringify(state));

        navigate("/subSection", {
            state,
        });
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>{sectionName}</h1>

            {currentSections.map((subSection) => (
                <button
                    key={subSection}
                    onClick={() => handleSubSectionClick(subSection)}
                >
                    {subSection}
                </button>
            ))}
        </div>
    );
};

export default SectionPage; 