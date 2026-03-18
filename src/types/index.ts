
// Andre "underkategori" for applikasjon -> "SubSection"
export interface SubSection {
    id: string, 
    name: string; 
}


//Første "underkategori" for applikasjon -> "Section"
export interface Section {
    id: string; 
    name: string; 
    subSections: SubSection[]; 
}


// Modell for applikasjon 
export interface Application {
    id: string; 
    name: string; 
    createdAt: Date; 
    sections: Section[]; 
}