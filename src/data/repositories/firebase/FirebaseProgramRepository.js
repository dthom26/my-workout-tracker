// src/data/repositories/firebase/FirebaseProgramRepository.js
import { ProgramRepository } from "../../interfaces/ProgramRepository";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";

export class FirebaseProgramRepository extends ProgramRepository {
  watchUserPrograms(userId, onUpdate, onError) {
    const q = query(
      collection(db, "programs"),
      where("createdBy", "==", userId)
    );

    return onSnapshot(
      q,
      (querySnapshot) => {
        const programs = [];
        querySnapshot.forEach((doc) => {
          programs.push({ id: doc.id, ...doc.data() });
        });
        onUpdate(programs);
      },
      onError
    );
  }

  async getUserPrograms(userId) {
    const q = query(
      collection(db, "programs"),
      where("createdBy", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const programs = [];
    querySnapshot.forEach((doc) => {
      programs.push({ id: doc.id, ...doc.data() });
    });
    return programs;
  }

  async getProgram(programId) {
    const docRef = doc(db, "programs", programId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    throw new Error("Program not found");
  }

  async createProgram(programData) {
    const docRef = await addDoc(collection(db, "programs"), programData);
    return docRef.id;
  }

  async updateProgram(programId, programData) {
    const docRef = doc(db, "programs", programId);
    await updateDoc(docRef, programData);
    return true;
  }

  async deleteProgram(programId) {
    await deleteDoc(doc(db, "programs", programId));
    return true;
  }
}
