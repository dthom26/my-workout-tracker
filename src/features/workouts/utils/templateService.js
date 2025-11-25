import { repositoryFactory } from "../../../data/factory/repositoryFactory";

/**
 * Exercise Template Service
 * Provides business logic and utility functions for working with exercise templates
 */
export default class TemplateService {
  constructor() {
    this.templateRepository = repositoryFactory.exerciseTemplateRepository;
  }

  /**
   * Process exercises for a workout session
   * Ensures all exercises have template IDs for consistent identity
   *
   * @param {string} userId - User ID
   * @param {Array} exercises - List of exercises in the session
   * @param {boolean} createIfMissing - Whether to create templates if they don't exist (true for saving, false for loading)
   * @returns {Promise<Array>} Exercises with template IDs assigned
   */
  async processExercisesForSession(userId, exercises, createIfMissing = true) {
    if (!exercises || !exercises.length) {
      return [];
    }

    // Process each exercise to ensure it has a template ID
    return await Promise.all(
      exercises.map(async (exercise) => {
        // Skip if already has templateId and is valid
        if (exercise.templateId) {
          try {
            // Verify the template exists
            const template = await this.templateRepository.getTemplateById(
              userId,
              exercise.templateId
            );
            if (template) {
              return { ...exercise };
            }
          } catch (error) {
            console.error("Error verifying template:", error);
            // Continue to get or create if verification fails
          }
        }

        // Get or create template based on createIfMissing parameter
        try {
          const template = createIfMissing
            ? await this.templateRepository.getOrCreateTemplate(
                userId,
                exercise
              )
            : await this.templateRepository.getTemplate(userId, exercise);

          if (template) {
            // Return exercise with template ID assigned
            return {
              ...exercise,
              templateId: template.id,
            };
          } else {
            // If no template found and not creating, return original exercise
            return exercise;
          }
        } catch (error) {
          console.error("Error processing exercise template:", error);
          return exercise; // Return original exercise if template processing fails
        }
      })
    );
  }

  /**
   * Copy exercises from one workout to another with template association
   * Useful for "copy to next week" functionality
   *
   * @param {string} userId - User ID
   * @param {Array} exercises - Original exercises to copy
   * @param {boolean} createIfMissing - Whether to create templates if they don't exist
   * @returns {Promise<Array>} New exercises with same template IDs
   */
  async copyExercisesWithTemplates(userId, exercises, createIfMissing = false) {
    if (!exercises || !exercises.length) {
      return [];
    }

    // Create copies of exercises with new IDs but same template IDs
    return await Promise.all(
      exercises.map(async (exercise) => {
        let templateId = exercise.templateId;

        // If no template ID, try to get or create template based on createIfMissing parameter
        if (!templateId) {
          try {
            const template = createIfMissing
              ? await this.templateRepository.getOrCreateTemplate(
                  userId,
                  exercise
                )
              : await this.templateRepository.getTemplate(userId, exercise);
            if (template) {
              templateId = template.id;
            }
          } catch (error) {
            console.error("Error getting template for copy:", error);
          }
        }

        // Create a new exercise instance with:
        // 1. New ID (for this specific instance)
        // 2. Same template ID (for identity across sessions)
        // 3. Copy of sets and other properties
        return {
          id: Date.now() + Math.random().toString(36).substr(2, 9), // New unique ID
          name: exercise.name,
          templateId, // Same template ID for consistency
          sets: exercise.sets ? [...exercise.sets] : [], // Copy sets
          notes: exercise.notes || "",
          category: exercise.category || "Other",
        };
      })
    );
  }

  /**
   * Get all templates for a user and organize them by category
   * Useful for exercise selection UI
   *
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Templates organized by category
   */
  async getTemplatesByCategory(userId) {
    try {
      const templates = await this.templateRepository.getExerciseTemplates(
        userId
      );

      // Group templates by category
      return templates.reduce((acc, template) => {
        const category = template.category || "Other";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(template);
        return acc;
      }, {});
    } catch (error) {
      console.error("Error getting templates by category:", error);
      return {};
    }
  }

  /**
   * Update template and propagate changes to future workouts if needed
   *
   * @param {string} userId - User ID
   * @param {string} templateId - Template ID
   * @param {object} data - Template data to update
   * @returns {Promise<object>} Updated template
   */
  async updateTemplateData(userId, templateId, data) {
    try {
      return await this.templateRepository.updateTemplate(
        userId,
        templateId,
        data
      );
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  }
}
