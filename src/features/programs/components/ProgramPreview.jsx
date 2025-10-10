import React from "react";
import WorkoutPreview from "./WorkoutPreview";

const ProgramPreview = ({ program, onRemoveWorkout }) => {
  return (
    <div className="step-content">
      <h2>Program Preview</h2>
      <div className="program-preview">
        <div className="preview-header">
          <h3>{program.name || "Untitled Program"}</h3>
          <div className="program-meta">
            <span className="duration">{program.duration} weeks</span>
            <span className="difficulty">{program.difficulty}</span>
          </div>
          <p className="description">{program.description}</p>
        </div>

        <div className="workouts-preview">
          <h4>Workouts ({program.workouts.length})</h4>
          {program.workouts.map((workout) => (
            <WorkoutPreview
              key={workout.id}
              workout={workout}
              onRemoveWorkout={onRemoveWorkout}
            />
          ))}
        </div>

        {program.workouts.length === 0 && (
          <p className="no-workouts">
            No workouts added yet. Go back to add some workouts!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgramPreview;
