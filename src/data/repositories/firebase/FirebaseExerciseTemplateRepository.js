import ExerciseTemplateRepository from "../../interfaces/ExerciseTemplateRepository";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";
import standardizeTextInput from "../../../shared/utils/textInputStandardization";

/**
 * Firebase implementation of the Exercise Template Repository
 * Handles all database operations related to exercise templates using Firebase Firestore
 */
export default class FirebaseExerciseTemplateRepository extends ExerciseTemplateRepository {
  constructor() {
    super();
    this.templateCache = new Map(); // Cache templates by standardized name
  }
  /**
   * Get existing template without creating new ones
   * Use this when loading existing workouts
   *
   * @param {string} userId - User ID
   * @param {object} exercise - Exercise data
   * @returns {Promise<object|null>} Template object or null
   */
  async getTemplate(userId, exercise) {
    const standardizedName = standardizeTextInput(exercise.name);
    const cacheKey = `${userId}:${standardizedName}`;

    // Check cache first
    if (this.templateCache.has(cacheKey)) {
      return this.templateCache.get(cacheKey);
    }

    // First check if exercise already has templateId
    if (exercise.templateId) {
      try {
        const template = await this.getTemplateById(
          userId,
          exercise.templateId
        );
        if (template) {
          this.templateCache.set(cacheKey, template);
          return template;
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    }

    // Then check by standardized name
    const templatesRef = collection(db, "users", userId, "exerciseTemplates");
    const nameQuery = query(
      templatesRef,
      where("standardizedName", "==", standardizedName)
    );

    try {
      const snapshot = await getDocs(nameQuery);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const template = { id: doc.id, ...doc.data() };
        this.templateCache.set(cacheKey, template);
        return template;
      }
      return null; // Don't create, just return null
    } catch (error) {
      console.error("Error in getTemplate:", error);
      throw error;
    }
  }

  /**
   * Create template only when explicitly needed (e.g., adding new exercise)
   *
   * @param {string} userId - User ID
   * @param {object} exercise - Exercise data
   * @returns {Promise<object>} Template object with ID
   */
  async createTemplate(userId, exercise) {
    const standardizedName = standardizeTextInput(exercise.name);

    // Double-check if template already exists
    const existing = await this.getTemplate(userId, exercise);
    if (existing) return existing;

    const template = {
      name: exercise.name,
      standardizedName,
      category: exercise.category || "Other",
      defaultSets: exercise.sets
        ? exercise.sets.map((set) => ({
            reps: set.reps || "",
            weight: set.weight || null,
            rir: set.rir || "",
          }))
        : [{ reps: "", weight: null, rir: "" }],
      createdAt: new Date(),
      userId,
    };

    const templatesRef = collection(db, "users", userId, "exerciseTemplates");
    const docRef = await addDoc(templatesRef, template);
    const newTemplate = { id: docRef.id, ...template };

    // Cache the new template
    const cacheKey = `${userId}:${standardizedName}`;
    this.templateCache.set(cacheKey, newTemplate);

    return newTemplate;
  }

  /**
   * Get or create an exercise template based on exercise data
   * First checks if exercise already has a templateId and tries to fetch that template
   * If not found or no templateId, searches by name
   * If still not found, creates a new template
   *
   * @param {string} userId - User ID
   * @param {object} exercise - Exercise data
   * @returns {Promise<object>} Template object with ID
   */
  async getOrCreateTemplate(userId, exercise) {
    // Try to get existing template first
    const existingTemplate = await this.getTemplate(userId, exercise);
    if (existingTemplate) {
      return existingTemplate;
    }

    // If no existing template found, create a new one
    return await this.createTemplate(userId, exercise);
  }

  /**
   * Get a specific template by ID
   *
   * @param {string} userId - User ID
   * @param {string} templateId - Template ID
   * @returns {Promise<object|null>} Template object or null
   */
  async getTemplateById(userId, templateId) {
    try {
      const templateRef = doc(
        db,
        "users",
        userId,
        "exerciseTemplates",
        templateId
      );
      const snapshot = await getDoc(templateRef);

      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null; // Return null if template doesn't exist
    } catch (error) {
      console.error("Error in getTemplateById:", error);
      throw error;
    }
  }

  /**
   * Get all exercise templates for a user
   * Used for providing exercise suggestions and options
   *
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of templates
   */
  async getExerciseTemplates(userId) {
    try {
      // Get all templates for this user
      const templatesRef = collection(db, "users", userId, "exerciseTemplates");
      const snapshot = await getDocs(templatesRef);

      // Map documents to objects with IDs
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error in getExerciseTemplates:", error);
      throw error;
    }
  }

  /**
   * Update an exercise template
   *
   * @param {string} userId - User ID
   * @param {string} templateId - Template ID
   * @param {object} data - Template data
   * @returns {Promise<object>} Updated template
   */
  async updateTemplate(userId, templateId, data) {
    try {
      // Update document with merge (preserves fields not specified in data)
      const templateRef = doc(
        db,
        "users",
        userId,
        "exerciseTemplates",
        templateId
      );
      await setDoc(templateRef, data, { merge: true });
      return { id: templateId, ...data };
    } catch (error) {
      console.error("Error in updateTemplate:", error);
      throw error;
    }
  }
}
