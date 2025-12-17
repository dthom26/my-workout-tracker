import React from "react";
import ExerciseForm from "./ExerciseForm";
import ExerciseList from "./ExerciseList";
import ProgramPreview from "./ProgramPreview";
import SavedWorkoutCard from "./SavedWorkoutCard";
import "./styles/WorkoutBuilder.css";

const WorkoutBuilder = ({
  currentWorkout,
  setCurrentWorkout,
  currentExercise,
  setCurrentExercise,
  onAddExercise,
  onRemoveExercise,
  onAddWorkout,
  showSuccessMessage,
  lastAddedWorkout,
  onEditWorkout,
  editingWorkoutId,
  onCancelEdit,
  onUpdateWorkout,
  onRemoveWorkout,
  program, // Receive the program state as a prop
}) => {
  return (
    <div className="workout-builder__container">
      <h2 className="workout-builder__heading">Build Your Workouts</h2>
      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="workout-builder__success-toast">
          ✓ "{lastAddedWorkout}" added to your program!
        </div>
      )}
      <div className="workout-builder__draft-card">
        <div className="workout-builder__draft-header">
          <span className="workout-builder__draft-indicator">
            Building Workout
          </span>
          {currentWorkout.name && (
            <span className="workout-builder__draft-title">
              {" "}
              "{currentWorkout.name}"
            </span>
          )}
          <div className="workout-builder__draft-body">
            <div className="workout-builder__form-group">
              <label className="workout-builder__form-label">
                Workout Name
              </label>
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
          </div>
        </div>

        <ExerciseForm
          exercise={currentExercise}
          setExercise={setCurrentExercise}
          onAddExercise={onAddExercise}
        />

        {currentWorkout.exercises.length > 0 && (
          <div className="workout-builder__draft-exercises">
            <h4>
              Exercises in this workout ({currentWorkout.exercises.length})
            </h4>
            <ExerciseList
              exercises={currentWorkout.exercises}
              onRemoveExercise={onRemoveExercise}
            />
          </div>
        )}
        <div className="workout-builder__draft-footer">
          {currentWorkout.exercises.length > 0 && (
            <button onClick={onAddWorkout} className="btn-primary">
              Save "{currentWorkout.name || "Workout"}" to Program
            </button>
          )}
        </div>
      </div>
      {/* Live Preview of Workouts */}

      {/* Saved Workouts Section */}
      <div className="workout-builder__saved-workouts">
        <h3>
          ✓ Workouts in Your Program
          {/* <span className="workout-builder__workout-count">
            ({program.workouts.length})
          </span> */}
        </h3>

        {program.workouts.length > 0 ? (
          <div className="workout-builder__saved-workouts-list">
            {program.workouts.map((workout) => (
              <SavedWorkoutCard
                key={workout.id}
                workout={workout}
                isEditing={workout.id === editingWorkoutId}
                onEdit={() => onEditWorkout(workout.id)}
                onUpdate={onUpdateWorkout}
                onCancel={onCancelEdit}
                onDelete={() => onRemoveWorkout(workout.id)}
              />
            ))}
          </div>
        ) : (
          <p className="workout-builder__empty-state">
            No workouts added yet. Complete the workout above to add it!
          </p>
        )}
      </div>
    </div>
  );
};

export default WorkoutBuilder;
