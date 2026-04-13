import type { ApplicationListItem } from "../../../api";
import { Card } from "@digdir/designsystemet-react";
import { useNavigate } from "react-router-dom";
import "./ApplicationCard.css";
import { useState } from "react";
import { updateApplicationName, applicationExists} from "../../../api";
import { toast } from "react-toastify";

interface ApplicationCardProps {
  application: ApplicationListItem;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {

    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(application.name);
    const [error, setError] = useState("");
    const handleSave = async () => {
    const validationError = await validateName(name);

    if (validationError) {
        setError(validationError);
        return;
    }

    const trimmed = name.trim();

    const response = await updateApplicationName(application.id, trimmed);

    if (response) {
        setError("Kunne ikke lagre");
        return;
    }

    setIsEditing(false);
    setError("");
    toast.success("Navn oppdatert!");
};

const validateName = async (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
        return "Du må gi et navn til applikasjonen";
    }

    if (!/^[a-zA-ZæøåÆØÅ0-9\s]+$/.test(trimmed)) {
        return "Navnet kan bare inneholde bokstaver og tall";
    }

    const exists = await applicationExists(trimmed);
    if (exists && trimmed !== application.name) {
        return "Navnet er allerede i bruk";
    }

    return "";
};

    return (
        <Card asChild className={`application-card ${isEditing ? "editing" : ""}`}>
    <a onClick={() => navigate(`/applicationDetails/${application.id}`)} >
        <Card.Block>
            <div className="application-card-content">
                {isEditing ? (
    <div className="application-input-wrapper">
        <input
            value={name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
                setName(e.target.value);
                setError(""); 
            }}
            onBlur={handleSave}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleSave();
                }
            }}
            autoFocus
            className="application-input"
        />

        {error && <p className="error-text">{error}</p>}
    </div>
) : (
    <h3 className="application-title">{name}</h3>
)}

                <button
                    title="Rediger navn"
                    type="button"
                    className="application-card-edit-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                    }}
                >
                    ✎
                </button>
            </div>
        </Card.Block>
    </a>
</Card>
    );
};

export default ApplicationCard;