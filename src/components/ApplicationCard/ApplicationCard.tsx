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
                <h3>{application.name}</h3>
            </Card.Block>
            </a>
        </Card>
    );
};

export default ApplicationCard; 