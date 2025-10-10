import React from "react";
import ExerciseForm from "./ExerciseForm";
import ExerciseList from "./ExerciseList";
import ProgramPreview from "./ProgramPreview";

const WorkoutBuilder = ({
  currentWorkout,
  setCurrentWorkout,
  currentExercise,
  setCurrentExercise,
  onAddExercise,
  onRemoveExercise,
  onAddWorkout,
  program, // Receive the program state as a prop
}) => {
  return (
    <div className="step-content">
      <h2>Add Workouts</h2>
      <div className="form-group">
        <label>Workout Name</label>
        <input
          type="text"
          value={currentWorkout.name}
          onChange={(e) =>
            setCurrentWorkout((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          placeholder="e.g., Upper Body Day"
        />
      </div>

      <ExerciseForm
        exercise={currentExercise}
        setExercise={setCurrentExercise}
        onAddExercise={onAddExercise}
      />

      <ExerciseList
        exercises={currentWorkout.exercises}
        onRemoveExercise={onRemoveExercise}
      />

      {currentWorkout.exercises.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={onAddWorkout} className="btn-primary">
            Add Workout to Program
          </button>
        </div>
      )}
      {/* Live Preview of Workouts */}
      <div className="workout-preview">
        <h3>Workouts in Program</h3>
        {program.workouts.length > 0 ? (
          program.workouts.map((workout) => (
            <div key={workout.id} className="workout-card">
              <h4>{workout.name}</h4>
              <ul>
                {workout.exercises.map((exercise) => (
                  <li key={exercise.id}>
                    <strong>{exercise.name}</strong> - {exercise.sets.length}{" "}
                    sets
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No workouts added yet.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutBuilder;
