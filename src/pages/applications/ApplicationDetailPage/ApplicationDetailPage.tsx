// Her vises detaljer over valgt applikasjon
import { useNavigate } from "react-router-dom";

const ApplicationDetailPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <button
                onClick={() => navigate("/subSection")}
                style={{ marginBottom: "20px" }}
            >
                Kategori side
            </button>
        </div>
    ) 
};

export default ApplicationDetailPage; 