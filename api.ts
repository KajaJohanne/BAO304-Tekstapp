import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export type Environment = "utv" | "test" | "prod";
export type Language = "bokmål" | "nynorsk" | "engelsk";

export interface TextValues {
  bokmål: string;
  nynorsk: string;
  engelsk: string;
}

export interface User {
  name: string;
  email: string;
  allowedEnvironments: Environment[];
}

// Hvordan dataen skal lagres i Firebase
export interface TextKeyDocument {
  name: string;
  default: TextValues;
  environments: {
    utv: TextValues;
    test: TextValues;
    prod: TextValues;
  };
}

// Brukes når vi henter en liste med tekstnøkler og også trenger document id
export interface TextKeyListItem extends TextKeyDocument {
  id: string;
}

// Oppretter tekstnøkkel i Firebase med default-tekst
export async function saveDefaultText(
  name: string,
  defaultText: TextValues
): Promise<string | null> {
  try {
    const data: TextKeyDocument = {
      name,
      default: defaultText,
      environments: {
        utv: { bokmål: "", nynorsk: "", engelsk: "" },
        test: { bokmål: "", nynorsk: "", engelsk: "" },
        prod: { bokmål: "", nynorsk: "", engelsk: "" },
      },
    };

    await addDoc(collection(db, "textKeys"), data);
    return null;
  } catch (e) {
    if (e instanceof FirebaseError) {
      return e.message;
    }
    return "Ukjent feil ved lagring av default tekst.";
  }
}

// Henter én tekstnøkkel fra Firebase og brukes når den skal vises i UI
export async function getTextKey(
  documentId: string
): Promise<TextKeyDocument | null> {
  try {
    const snapshot = await getDoc(doc(db, "textKeys", documentId));

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as TextKeyDocument;
  } catch (e) {
    console.error("Feil ved henting av tekstnøkkel:", e);
    return null;
  }
}

// Henter alle tekstnøkler fra Firebase
export async function getAllTextKeys(): Promise<TextKeyListItem[]> {
  try {
    const snapshot = await getDocs(collection(db, "textKeys"));

    return snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as TextKeyDocument),
    }));
  } catch (e) {
    console.error("Feil ved henting av tekstnøkler:", e);
    return [];
  }
}

// Oppdaterer tekstnøkler når de blir redigert i de ulike miljøene
export async function updateEnviormentText(
  documentId: string,
  environment: Environment,
  values: TextValues
): Promise<string | null> {
  try {
    await updateDoc(doc(db, "textKeys", documentId), {
      [`environments.${environment}`]: values,
    });

    return null;
  } catch (e) {
    if (e instanceof FirebaseError) {
      return e.message;
    }
    return "Ukjent feil ved lagring av miljøtekst";
  }
}

// Oppretter bruker i Firebase
export async function saveUser(user: User): Promise<string | null> {
  try {
    await setDoc(doc(db, "users", user.email), user);
    return null;
  } catch (e) {
    if (e instanceof FirebaseError) {
      return e.message;
    }
    return "Ukjent feil ved lagring av bruker.";
  }
}

// Henter én bruker fra Firebase
export async function getUser(email: string): Promise<User | null> {
  try {
    const snapshot = await getDoc(doc(db, "users", email));

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as User;
  } catch (e) {
    console.error("Feil ved henting av bruker:", e);
    return null;
  }
}