import type { ApplicationListItem } from "../../../api";
import { Card } from "@digdir/designsystemet-react"; 
import { useNavigate } from "react-router-dom";
import "./ApplicationCard.css";

interface ApplicationCardProps {
    application: ApplicationListItem; 
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {

    const navigate = useNavigate();

    return (
        <Card asChild className="application-card">
    <a onClick={() => navigate(`/applicationDetails/${application.id}`)} >
        <Card.Block>
            <div className="application-card-content">
                <h3 className="application-title">{application.name}</h3>

                <button
                    type="button"
                    className="application-card-edit-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/applicationDetails/${application.id}`);
                    }}
                    aria-label={`Rediger ${application.name}`}
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
