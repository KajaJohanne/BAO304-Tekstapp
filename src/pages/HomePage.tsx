import { useState } from "react";
import type { Application } from "../types";
import ApplicationCard from "../components/ApplicationCard";


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

    return (
        <div>
            <h1>Applikasjoner</h1>
            <p>Her finner du alle applikasjoner. Du kan filtrere og søke etter ønsket applikasjon, eller legge til en ny.</p>
            {applications.map((application) => (
                <ApplicationCard 
                  key={application.id}
                  application={application}
                />
            ))}
        </div>
    )
};

export default HomePage; 