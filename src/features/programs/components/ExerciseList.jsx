import React from "react";

const ExerciseList = ({ exercises, onRemoveExercise }) => {
  if (exercises.length === 0) return null;

  return (
    <div className="exercise-list">
      <h4>Exercises in this workout:</h4>
      {exercises.map((exercise) => (
        <div key={exercise.id} className="exercise-item">
          <span>
            {exercise.name} - {exercise.sets.length} sets x{" "}
            {exercise.sets[0].reps} reps{" "}
            {exercise.sets[0].weight && ` @ ${exercise.sets[0].weight}`}
            {exercise.sets[0].restTime &&
              ` • Rest: ${exercise.sets[0].restTime}`}
          </span>
          <button
            onClick={() => onRemoveExercise(exercise.id)}
            className="btn-remove"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExerciseList;
