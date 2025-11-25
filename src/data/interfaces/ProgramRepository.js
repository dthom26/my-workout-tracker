// src/data/interfaces/ProgramRepository.js
import { BaseRepository } from "./BaseRepository";

export class ProgramRepository extends BaseRepository {
  /**
   * Watch user's programs for real-time updates
   */
  watchUserPrograms(userId, onUpdate, onError) {
    throw new Error("Not implemented");
  }

  /**
   * Get user's programs once
   */
  getUserPrograms(userId) {
    throw new Error("Not implemented");
  }

  /**
   * Get a specific program
   */
  getProgram(programId) {
    throw new Error("Not implemented");
  }

  /**
   * Create a new program
   */
  createProgram(programData) {
    throw new Error("Not implemented");
  }

  /**
   * Update a program
   */
  updateProgram(programId, programData) {
    throw new Error("Not implemented");
  }

  /**
   * Delete a program
   */
  deleteProgram(programId) {
    throw new Error("Not implemented");
  }
}
