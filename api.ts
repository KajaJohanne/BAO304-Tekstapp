import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

export type Environment = "utv" | "test" | "prod";
export type Language = "bokmål" | "nynorsk" | "engelsk";
export type TextType = "Tittel" | "Brødtekst" | "Feilmelding" | "Knappetekst" | "Hjelpetekst";

export interface TextValues {
  bokmål: string;
  nynorsk: string;
  engelsk: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  allowedEnvironments: Environment[];
}

export interface Application {
  name: string;
  sections: { 
    name: string;
    subSections: { name: string }[];
  }[]; 
}

// Hvordan dataen skal lagres i Firebase
export interface TextKeyDocument {
  name: string;
  applicationId: string;
  applicationName: string;
  textType: TextType;
  default: TextValues;
  environments: {
    utv: TextValues;
    test: TextValues;
    prod: TextValues;
  };
  placementPath: string[];
}

// Brukes når vi henter en liste med tekstnøkler og også trenger document id
export interface TextKeyListItem extends TextKeyDocument {
  id: string;
}

export interface ApplicationListItem extends Application {
  id: string;
}

// Registrere ny bruker
export async function registerUser(
  name: string,
  email: string,
  password: string,
  allowedEnvironments: Environment[],
): Promise<string | null> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(credential.user, {
      displayName: name,
    });

    const userData: User = {
      uid: credential.user.uid,
      name,
      email,
      allowedEnvironments,
    };

    await setDoc(doc(db, "users", credential.user.uid), userData);

    return null;
  } catch (e) {
    if (e instanceof FirebaseError) {
      switch (e.code) {
        case "auth/email-already-in-use":
          return "Denne e-posten er allerede i bruk.";
        case "auth/invalid-email":
          return "E-posten er ikke gyldig.";
        case "auth/weak-password":
          return "Passordet må være minst 6 tegn.";
        default:
          return e.message;
      }
    }
    return "Ukjent feil ved opprettelse av bruker."
  }
}

// Logger inn på eksisteren bruker
export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: User} | { error: string}> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    const userData = await getDoc(doc(db, "users", credential.user.uid));

    const firestoreUser = userData.exists()
      ? (userData.data() as User)
      : {
        uid: credential.user.uid,
        name: credential.user.displayName || "Bruker",
        email: credential.user.email || email,
        allowedEnvironments: [],
      };

      return { user: firestoreUser };
  } catch (e) {
    if (e instanceof FirebaseError) {
      switch (e.code) {
        case "auth/invalid-email":
          return { error: "E-posten er ikke gyldig." };
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          return { error: "Feil e-post eller passord." };
        default:
          return { error: e.message };
      }
    }
    return { error: "Ukjent feil ved innlogging." }
  }
}

export async function getUser(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));

    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as User;
  } catch (e) {
    console.error("Feil ved henting av bruker:", e);
    return null;
  }
}

// Sjekker om det allerede finnes en tekstnøkkel med samme navn
export async function textKeyExists(name: string): Promise<boolean> {
  try {
    const textKeysRef = collection(db, "textKeys");
    const q = query(textKeysRef, where("name", "==", name), limit(1));
    const snapshot = await getDocs(q);

    return !snapshot.empty;
  } catch (e) {
    console.error("Feil ved sjekk av duplikat tekstnøkkel:", e);
    return false;
  }
}

// Oppretter tekstnøkkel i Firebase med default-tekst
export async function saveDefaultText(
  name: string,
  applicationId: string,
  applicationName: string,
  defaultText: TextValues,
  placementPath: string[],
  textType: TextType
): Promise<string | null> {
  try {
    //Sjekker om tekstnøkkel finnes allerede
    const exists = await textKeyExists(name);

    if (exists) {
      return "Denne tekstnøkkelen finnes allerede.";
    }

    const data: TextKeyDocument = {
      name,
      applicationId,
      applicationName,
      textType,
      default: defaultText,
      environments: {
        utv: { bokmål: "", nynorsk: "", engelsk: "" },
        test: { bokmål: "", nynorsk: "", engelsk: "" },
        prod: { bokmål: "", nynorsk: "", engelsk: "" },
      },
      placementPath,
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

// Henter tekstnøkler for valgt applikasjon
export async function getTextKeysByApplication(applicationId: string): Promise<TextKeyListItem[]> {
  try {
    const textKeysRef = collection(db, "textKeys");
    const q = query(textKeysRef, where("applicationId", "==", applicationId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as TextKeyDocument),
    }));
  } catch (e) {
    console.error("Feil ved henting av tekstnøkler for applikasjon:", e);
    return [];
  }
}

// Henter applikasjon
export async function getApplication(documentId: string): Promise<ApplicationListItem | null> {
  try {
    const snapshot = await getDoc(doc(db, "applications", documentId));

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data() as Application;

    return {
      id: snapshot.id,
      name: data.name,
      sections: data.sections ?? [],
    };
  } catch (e) {
    console.error("Feil ved henting av applikasjon:", e);
    return null;
  }
}

// Legger til og lagrer underkategorier for hver kategori
export async function addSubSectionToApplication(
  applicationId: string, 
  sectionName: string, 
  subSectionName: string
  ): Promise<string | null> {
    try {
      const applicationsRef = doc(db, "applications", applicationId);
      const snapshot = await getDoc(applicationsRef);

      if (!snapshot.exists()) {
        return "Fant ikke applikasjonen.";
      }

      const data = snapshot.data() as Application;

      const updatedSections = (data.sections ?? []).map((section) => {
        if (section.name !== sectionName) {
          return section;
        }

        const existingSubSections = section.subSections ?? [];

        const alreadyExists = existingSubSections.some(
          (subSection) =>
            subSection.name.trim().toLowerCase() === 
            subSectionName.trim().toLowerCase()
        );

        if (alreadyExists) {
          return section;
        }

        return {
          ...section,
          subSections: [
            ...existingSubSections,
            { name: subSectionName.trim() },
          ],
        };
      });

      await updateDoc(applicationsRef, {
        sections: updatedSections,
      });

      return null;
    } catch (e) {
      if (e instanceof FirebaseError) {
        return e.message;
      }
      return "Ukjent feil ved lagring av underkategori.";    
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

// Oppretter ny applikasjon i Firebase
export async function saveApplication(
  application: Application
): Promise<string | null> {
  try {
    await addDoc(collection(db, "applications"), application);
    return null;
  } catch (e) {
    if (e instanceof FirebaseError) {
      return e.message;
    }
    return "Ukjent feil ved lagring av applikasjon.";
  }
}

// Henter alle applikasjoner fra Firebase
export async function getAllApplications(): Promise<ApplicationListItem[]> {
  try {
    const snapshot = await getDocs(collection(db, "applications"));

    return snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...(docSnapshot.data() as Application),
    }));
  } catch (e) {
    console.error("Feil ved henting av applikasjoner:", e);
    return [];
  }
}

// Sjekker om det finnes en applikasjon med samme navn fra før
export async function applicationExists(name: string): Promise<boolean> {
  try {
    const applicationsRef = collection(db, "applications"); 
    const q = query(applicationsRef, where("name", "==", name), limit(1));
    const snapshot = await getDocs(q); 
    return !snapshot.empty; 
  } catch (e) {
    console.error("Feil ved sjekk av duplikat applikasjon", e);
    return false; 
  }
}