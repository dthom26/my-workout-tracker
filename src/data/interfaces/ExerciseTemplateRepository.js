import { BaseRepository } from "./BaseRepository";

/**
 * Interface for Exercise Template Repository
 * Defines the contract for accessing and managing exercise templates
 * This repository handles the storage and retrieval of exercise templates
 * which are used to maintain exercise identity across workouts
 */
export default class ExerciseTemplateRepository extends BaseRepository {
  /**
   * Get existing template without creating new ones
   * Use this when loading existing workouts
   *
   * @param {string} userId - User ID
   * @param {object} exercise - Exercise data
   * @returns {Promise<object|null>} Template object or null
   */
  getTemplate(userId, exercise) {
    throw new Error("Method not implemented");
  }

  /**
   * Create template only when explicitly needed (e.g., adding new exercise)
   *
   * @param {string} userId - User ID
   * @param {object} exercise - Exercise data
   * @returns {Promise<object>} Template object with ID
   */
  createTemplate(userId, exercise) {
    throw new Error("Method not implemented");
  }

  /**
   * Get or create an exercise template based on exercise data
   * If a template with the same name exists, returns it
   * Otherwise creates a new template
   *
   * @param {string} userId - User ID
   * @param {object} exercise - Exercise data containing name and optionally templateId
   * @returns {Promise<object>} Template object with ID
   */
  getOrCreateTemplate(userId, exercise) {
    throw new Error("Method not implemented");
  }

  /**
   * Get all exercise templates for a specific user
   * Used for providing suggestions and template options
   *
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of templates
   */
  getExerciseTemplates(userId) {
    throw new Error("Method not implemented");
  }

  /**
   * Get a specific template by ID
   * Used to retrieve details for a known template
   *
   * @param {string} userId - User ID
   * @param {string} templateId - Template ID
   * @returns {Promise<object|null>} Template object or null if not found
   */
  getTemplateById(userId, templateId) {
    throw new Error("Method not implemented");
  }

  /**
   * Update an exercise template
   * Used to modify template properties, defaults, etc.
   *
   * @param {string} userId - User ID
   * @param {string} templateId - Template ID
   * @param {object} data - Template data to update
   * @returns {Promise<object>} Updated template
   */
  updateTemplate(userId, templateId, data) {
    throw new Error("Method not implemented");
  }
}
