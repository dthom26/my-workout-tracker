// src/data/factory/repositoryFactory.js
import { FirebaseProgramRepository } from "../repositories/firebase/FirebaseProgramRepository";
import { FirebaseWorkoutRepository } from "../repositories/firebase/FirebaseWorkoutRepository";
import { FirebaseUserRepository } from "../repositories/firebase/FirebaseUserRepository";
import { FirebaseAuthRepository } from "../repositories/firebase/FirebaseAuthRepository";
import FirebaseExerciseTemplateRepository from "../repositories/firebase/FirebaseExerciseTemplateRepository";

// This factory allows us to easily switch implementations later
class RepositoryFactory {
  constructor() {
    this._programRepository = new FirebaseProgramRepository();
    this._workoutRepository = new FirebaseWorkoutRepository();
    this._userRepository = new FirebaseUserRepository();
    this._authRepository = new FirebaseAuthRepository();
    this._exerciseTemplateRepository = new FirebaseExerciseTemplateRepository();
  }

  get programRepository() {
    return this._programRepository;
  }

  get workoutRepository() {
    return this._workoutRepository;
  }

  get userRepository() {
    return this._userRepository;
  }

  get authRepository() {
    return this._authRepository;
  }

  get exerciseTemplateRepository() {
    return this._exerciseTemplateRepository;
  }
}

export const repositoryFactory = new RepositoryFactory();
