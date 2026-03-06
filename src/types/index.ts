
//Første "underkategori" for applikasjon -> "Section"
export interface Section {
    id: string; 
    name: string; 
}

// Modell for applikasjon 
export interface Application {
    id: string; 
    name: string; 
    createdAt: Date; 
    sections: Section[]; 
}