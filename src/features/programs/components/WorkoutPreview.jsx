import React from "react";
import "./styles/WorkoutPreview.css";

const WorkoutPreview = ({ workout, onRemoveWorkout }) => {
  return (
    <div className="workout-preview__container">
      <div className="workout-preview__header">
        <h5>{workout.name}</h5>
        <button
          onClick={() => onRemoveWorkout(workout.id)}
          className="workout-preview__remove-button"
        >
          x
        </button>
      </div>
      <div className="workout-preview__exercises">
        {workout.exercises.map((exercise) => (
          <div key={exercise.id} className="workout-preview__exercise">
            <div className="workout-preview__exercise-name">
              {exercise.name}
            </div>
            <div className="workout-preview__exercise-details">
              {exercise.sets.length} sets × {exercise.sets[0].reps} reps
              {/* {exercise.sets[0].weight && ` @ ${exercise.sets[0].weight}`}
              {exercise.sets[0].restTime &&
                ` • Rest: ${exercise.sets[0].restTime}`} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPreview;
