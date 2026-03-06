import type { Application } from "../types";

// TODO add styling 

interface ApplicationCardProps {
    application: Application; 
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
    return (
        <div>
            <h2>{application.name}</h2>
        </div>
    );
};

export default ApplicationCard; 