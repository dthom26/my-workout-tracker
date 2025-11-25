// src/features/programs/utils/programService.js
import { repositoryFactory } from "../../../data/factory/repositoryFactory";

const programRepository = repositoryFactory.programRepository;

export const saveProgramToFirestore = async (programData) => {
  return await programRepository.createProgram(programData);
};

export const deleteProgramFromFirestore = async (programId) => {
  return await programRepository.deleteProgram(programId);
};

// Add other methods as needed
