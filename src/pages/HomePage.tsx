import { useState } from "react";
import type { Application } from "../types";


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
        </div>
    )
};

export default HomePage; 