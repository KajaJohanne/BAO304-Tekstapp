import { useState } from "react";
import type { Application } from "../types";
import ApplicationCard from "../components/ApplicationCard";
import AddApplicationFromModal from "../components/AddApplicationFromModal";


// Mockdata for å lage komponenten til listeelementet
const mockApplications: Application[] = [
    {
        id: "1", 
        name: "Trafikk", 
        createdAt: new Date(), 
        sections: [
            { id: "s1", name: "Reiseinformasjon" }, 
            { id: "s2", name: "Langs veien" }, 
            { id: "s3", name: "Trafikksikkerhet" }
        ]
    }, 
    {
        id: "2", 
        name: "Førerkort", 
        createdAt: new Date(), 
        sections: [], 
    },
];

const HomePage = () => {
    const [applications, setApplications] = useState<Application[]>(mockApplications); 
    const [showModal, setShowModal] = useState(false); 

    // Kalles fra modalen når det opprettes ny applikasjon 
    // legger den nye applikasjonen i lista 
    const handleAdd = (application: Application) => {
        setApplications([...applications, application]); 
    };

    return (
        <div>
            <h1>Applikasjoner</h1>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> 
                <p>Her finner du alle applikasjoner. Du kan filtrere og søke etter ønsket applikasjon, eller legge til en ny.</p>
                <button onClick={() => setShowModal(true)}>
                    +
                </button>
            </div>
            
            {applications.map((application) => (
                <ApplicationCard 
                  key={application.id}
                  application={application}
                />
            ))}

            <AddApplicationFromModal 
                isVisible={showModal}
                onClose={() => setShowModal(false)}
                onAdd={handleAdd}
            />
        </div>
    )
};

export default HomePage; 