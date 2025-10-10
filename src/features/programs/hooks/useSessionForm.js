import { useState } from "react";

export function useSessionForm() {
  const [sessionName, setSessionName] = useState("");
  const [exerciseName, setExerciseName] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleSessionNameChange = (e) => {
    setSessionName(e.target.value);
  };
  const handleExerciseNameChange = (e) => {
    setExerciseName(e.target.value);
  };
  const handleAddExercise = () => {
    setExercises((prevExercises) => {
      const newExercises = [...prevExercises, { name: exerciseName }];
      console.log(newExercises); // This logs the updated list immediately
      return newExercises;
    });
    setExerciseName(""); // Clear input after adding
  };
  return {
    sessionName,
    setSessionName: handleSessionNameChange,
    exerciseName,
    setExerciseName: handleExerciseNameChange,
    exercises,
    addExercise: handleAddExercise,
  };
}

export function useAddSessionToProgramOverViewUi() {}
