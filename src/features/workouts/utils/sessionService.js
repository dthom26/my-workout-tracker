import { db } from "../../../../backend/config/firbase-config";
import { setDoc, doc, getDoc } from "firebase/firestore";
import TemplateService from "./templateService";

const templateService = new TemplateService();

/**
 * Save workout session to Firestore
 * Ensures all exercises have template IDs for identity preservation
 *
 * @param {Object} sessionData - Session data with exercises
 * @returns {Promise<string>} Session ID
 */
export async function saveSessionToFirestore(sessionData) {
  const { userId, programId, workoutId, week } = sessionData;
  const sessionId = generateSessionId(userId, programId, workoutId, week);

  try {
    // Process exercises to ensure they have template IDs
    if (sessionData.exercises && sessionData.exercises.length > 0) {
      sessionData.exercises = await templateService.processExercisesForSession(
        userId,
        sessionData.exercises,
        true // Create templates when saving sessions
      );
    }

    // Save session with processed exercises
    await setDoc(doc(db, "sessions", sessionId), sessionData, { merge: true });
    console.log("Session saved:", sessionData, "Document ID:", sessionId);
    return sessionId;
  } catch (error) {
    console.error("Error saving session:", error, "Session data:", sessionData);
    throw error;
  }
}

/**
 * Get workout session from Firestore
 * If session exists, returns it. Otherwise, returns program data
 *
 * @param {string} userId - User ID
 * @param {string} programId - Program ID
 * @param {string} workoutId - Workout ID
 * @param {number} week - Week number
 * @param {Object} programData - Default program data if session doesn't exist
 * @returns {Promise<Object>} Session data or program data
 */
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
      const sessionData = sessionSnap.data();

      // Process exercises if needed to ensure all have template IDs
      if (sessionData.exercises && sessionData.exercises.length > 0) {
        sessionData.exercises =
          await templateService.processExercisesForSession(
            userId,
            sessionData.exercises,
            false // Don't create templates when loading existing sessions
          );
      }

      return sessionData;
    } else {
      console.log(
        "❌ No session found with exact workoutId, searching by templateId..."
      );

      // Fallback: Try to find a session for the same week and templateId
      if (programData?.templateId) {
        try {
          const { repositoryFactory } = await import(
            "../../../data/factory/repositoryFactory"
          );

          const sessionByTemplate =
            await repositoryFactory.workoutRepository.getSessionByTemplateAndWeek(
              userId,
              programData.templateId,
              week
            );

          if (sessionByTemplate) {
            console.log("✅ Found session by templateId:", sessionByTemplate);
            return sessionByTemplate;
          }
        } catch (fallbackError) {
          console.log("Fallback search failed:", fallbackError);
        }
      }

      console.log("❌ No session found, will use program data");

      // Process program exercises to ensure they have template IDs
      if (
        programData &&
        programData.exercises &&
        programData.exercises.length > 0
      ) {
        programData.exercises =
          await templateService.processExercisesForSession(
            userId,
            programData.exercises,
            false // Don't create new templates when loading from existing program
          );
      }

      return programData;
    }
  } catch (error) {
    console.error("Error fetching session data:", error);
    return programData;
  }
}

/**
 * Generate unique session ID from components
 *
 * @param {string} userId - User ID
 * @param {string} programId - Program ID
 * @param {string} workoutId - Workout ID
 * @param {number} week - Week number
 * @returns {string} Session ID
 */
function generateSessionId(userId, programId, workoutId, week) {
  return `${userId}_${programId}_${workoutId}_${week}`;
}

/**
 * Copy exercises from one session to another
 * Maintains template identity while creating new exercise instances
 *
 * @param {string} userId - User ID
 * @param {Array} exercises - Exercises to copy
 * @returns {Promise<Array>} Copied exercises with template identity preserved
 */
export async function copyExercisesToNextWeek(userId, exercises) {
  try {
    return await templateService.copyExercisesWithTemplates(userId, exercises);
  } catch (error) {
    console.error("Error copying exercises:", error);
    return exercises.map((exercise) => ({
      ...exercise,
      id: Date.now() + Math.random().toString(36).substr(2, 9), // Fallback to simple ID generation
    }));
  }
}

/**
 * Get previous week's session data for comparison
 * @param {string} userId - User ID
 * @param {string} workoutTemplateId - Workout template ID
 * @param {number} currentWeek - Current week number
 * @returns {Promise<Object|null>} Previous week's session data or null
 */
export async function getPreviousSessionData(
  userId,
  workoutTemplateId,
  currentWeek
) {
  try {
    // Import here to avoid circular dependency
    const { repositoryFactory } = await import(
      "../../../data/factory/repositoryFactory"
    );

    const previousSession =
      await repositoryFactory.workoutRepository.getPreviousWeekSession(
        userId,
        workoutTemplateId,
        currentWeek
      );

    if (!previousSession) {
      return null;
    }

    // Process the data for UI consumption - simplified version
    return {
      week: previousSession.week,
      name: previousSession.name,
      exercises: previousSession.exercises || [],
      timestamp: previousSession.timestamp,
      notes: previousSession.notes || "",
    };
  } catch (error) {
    console.error("Error fetching previous session data:", error);
    return null;
  }
}
