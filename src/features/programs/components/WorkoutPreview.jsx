import React from "react";

const WorkoutPreview = ({ workout, onRemoveWorkout }) => {
  return (
    <div className="workout-preview">
      <div className="workout-header">
        <h5>{workout.name}</h5>
        <button
          onClick={() => onRemoveWorkout(workout.id)}
          className="btn-remove"
        >
          Remove
        </button>
      </div>
      <div className="exercises-preview">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="exercise-preview">
            <span className="exercise-name">{exercise.name}</span>{" "}
            <span className="exercise-details">
              {exercise.sets.length} sets × {exercise.sets[0].reps} reps
              {exercise.sets[0].weight && ` @ ${exercise.sets[0].weight}`}
              {exercise.sets[0].restTime &&
                ` • Rest: ${exercise.sets[0].restTime}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPreview;
