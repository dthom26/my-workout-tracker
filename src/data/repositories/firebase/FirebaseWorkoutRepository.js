// src/data/repositories/firebase/FirebaseWorkoutRepository.js
import { WorkoutRepository } from "../../interfaces/WorkoutRepository";
import { COLLECTIONS, FIELDS } from "@data/constants";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@backend/config/firebase-config";

export class FirebaseWorkoutRepository extends WorkoutRepository {
  async getWorkout(workoutId) {
    const docRef = doc(db, FIELDS.WORKOUTS, workoutId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }

    throw new Error("Workout not found");
  }

  async saveWorkoutProgress(workoutId, progressData) {
    const docRef = doc(db, FIELDS.WORKOUTS, workoutId);
    await updateDoc(docRef, { progress: progressData });
    return true;
  }

  async addWorkoutToProgram(programId, workoutData) {
    try {
      const docRef = doc(db, COLLECTIONS.PROGRAMS, programId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Program with ID ${programId} not found`);
      }
      const currentProgramData = docSnap.data();
      const currentWorkouts = currentProgramData.workouts || []; // 👈 Safe default!
      console.log("Current Program Data:", currentProgramData);
      const updatedWorkouts = [...currentWorkouts, workoutData];
      await updateDoc(docRef, { workouts: updatedWorkouts });
      return workoutData.id;
    } catch (error) {
      console.error("Error adding workout to program:", error);
      throw error; // Re-throw so component can handle it
    }
  }

  async updateWorkoutName(programId, workoutId, newName) {
    try {
      const docRef = doc(db, COLLECTIONS.PROGRAMS, programId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Program with ID ${programId} not found`);
      }
      const programData = docSnap.data();
      const updatedWorkouts = (programData.workouts || []).map((workout) =>
        workout.id === workoutId ? { ...workout, name: newName } : workout
      );

      await updateDoc(docRef, { workouts: updatedWorkouts });
      return true;
    } catch (error) {
      console.error("Error updating workout name:", error);
      throw error;
    }
  }

  async getPreviousWeekSession(userId, workoutTemplateId, currentWeek) {
    try {
      const previousWeek = currentWeek - 1;

      if (previousWeek < 1) {
        return null; // No previous week for week 1
      }

      const sessionsRef = collection(db, COLLECTIONS.SESSIONS);
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        where("workoutTemplateId", "==", workoutTemplateId),
        where("week", "==", previousWeek)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      // Get all matching sessions and sort by timestamp in JavaScript
      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by timestamp (most recent first) and take the first one
      const mostRecentSession = sessions.sort((a, b) => {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();
        return bTime - aTime; // Descending order (most recent first)
      })[0];

      return mostRecentSession;
    } catch (error) {
      console.error("Error fetching previous week session:", error);
      return null;
    }
  }

  async getSessionByTemplateAndWeek(userId, workoutTemplateId, week) {
    try {
      const sessionsRef = collection(db, COLLECTIONS.SESSIONS);
      const q = query(
        sessionsRef,
        where("userId", "==", userId),
        where("workoutTemplateId", "==", workoutTemplateId),
        where("week", "==", week)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      // Get the most recent session for this week and template
      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by timestamp (most recent first) and take the first one
      const mostRecentSession = sessions.sort((a, b) => {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();
        return bTime - aTime; // Descending order (most recent first)
      })[0];

      return mostRecentSession;
    } catch (error) {
      console.error("Error fetching session by template and week:", error);
      return null;
    }
  }

  // Implement other methods as needed
}
