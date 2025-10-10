import { db } from "../../../../backend/config/firbase-config";
import { collection, addDoc } from "firebase/firestore";

export const saveProgramToFirestore = async (programData) => {
  // Use addDoc for auto-generated ID
  const docRef = await addDoc(collection(db, "programs"), programData);
  return docRef.id;
};
