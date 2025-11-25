// src/data/interfaces/WorkoutRepository.js
import { BaseRepository } from "./BaseRepository";

export class WorkoutRepository extends BaseRepository {
  // Define workout-specific methods
  getWorkout(workoutId) {
    throw new Error("Not implemented");
  }

  saveWorkoutProgress(workoutId, progressData) {
    throw new Error("Not implemented");
  }

  addWorkout(programId, workoutData) {
    throw new Error("Not implemented");
  }
  updateWorkoutName(programId, workoutId, newName) {
    throw new Error("Not implemented");
  }

  getPreviousWeekSession(_userId, _workoutTemplateId, _currentWeek) {
    throw new Error("Not implemented");
  }

  // Add other workout-related methods
}
