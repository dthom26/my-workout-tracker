import React from "react";

const ExerciseList = ({ exercises, onRemoveExercise }) => {
  if (exercises.length === 0) return null;

  return (
    <div className="create-program-exercise-list">
      {exercises.map((exercise) => (
        <div key={exercise.id} className="create-program-exercise-item">
          <span>
            {exercise.name} - {exercise.sets.length} sets x{" "}
            {exercise.sets[0].reps} reps{" "}
          </span>
          <button
            onClick={() => onRemoveExercise(exercise.id)}
            className="btn-remove"
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
