import React from "react";
import "./styles/ExerciseList.css";

const ExerciseList = ({ exercises, onRemoveExercise }) => {
  if (exercises.length === 0) return null;

  return (
    <div className="exercise-list__container">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="exercise-list__item">
          <span>
            {exercise.name} - {exercise.sets.length} sets x{" "}
            {exercise.sets[0].reps} reps{" "}
          </span>
          <button
            onClick={() => onRemoveExercise(exercise.id)}
            className="exercise-list__remove-button"
            aria-label={`Remove ${exercise.name}`}
            title={`Remove ${exercise.name}`}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
