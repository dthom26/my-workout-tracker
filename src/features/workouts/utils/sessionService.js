import { db } from "../../../../backend/config/firbase-config";
import { setDoc, doc, getDoc } from "firebase/firestore";

export async function saveSessionToFirestore(sessionData) {
  const { userId, programId, workoutId, week } = sessionData;
  const sessionId = generateSessionId(userId, programId, workoutId, week);
  try {
    // Instead of addDoc (auto-generated ID)
    await setDoc(doc(db, "sessions", sessionId), sessionData, { merge: true });
    console.log("Session saved:", sessionData, "Document ID:", sessionId);
    return sessionId;
  } catch (error) {
    console.error("Error saving session:", error, "Session data:", sessionData);
    throw error;
  }
}

export async function getSessionFromFirestore(
  userId,
  programId,
  workoutId,
  week,
  programData
) {
  const sessionId = generateSessionId(userId, programId, workoutId, week);
  try {
    const sessionRef = doc(db, "sessions", sessionId);
    const sessionSnap = await getDoc(sessionRef);
    if (sessionSnap.exists()) {
      console.log("✅ Found existing session data:", sessionSnap.data());
      return sessionSnap.data();
    } else {
      console.log("❌ No session found, will use program data");
      return programData;
    }
  } catch (error) {
    console.error("Error fetching session data:", error);
    return programData;
  }
}

function generateSessionId(userId, programId, workoutId, week) {
  return `${userId}_${programId}_${workoutId}_${week}`;
}
