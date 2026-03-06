import { FirebaseError } from "firebase/app";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface apiData {
    name: string;
    age: number;
}

export async function uploadData(data: apiData) {
    try {
        const docRef = await addDoc(collection(db, "exampleData"), data);
        console.log("Doc written with id: ", docRef.id);
        return null;
    } catch (e) {
        if (e instanceof FirebaseError) {
            switch (e.code) {
                case "permission-denied":
                    return "Du har ikke lov til å utføre denne operasjonen";
                case "unauthenticated":
                    return "Du er ikke autorisert til å gjøre denne handlingen";
                // Må legge til flere cases senere
                default:
                    return "Ukjent feil oppstod";
            }
        }
        return "Ukjent feil oppstod";
    }
}