import React from "react";
import WorkoutPreview from "./WorkoutPreview";
import "./styles/ProgramPreview.css";

const ProgramPreview = ({ program, onRemoveWorkout }) => {
  return (
    <div className="program-preview__step-content">
      <h2 className="program-preview__heading">Program Preview</h2>
      <div className="program-preview__container">
        <div className="program-preview__header">
          <h3>{program.name || "Untitled Program"}</h3>
          <div className="program-preview__meta">
            <span className="program-preview__duration">
              {program.duration} weeks
            </span>
            <span className="program-preview__difficulty">
              {program.difficulty}
            </span>
          </div>
          <p className="program-preview__description">{program.description}</p>
        </div>

        <div className="program-preview__workouts">
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
          <p className="program-preview__no-workouts">
            No workouts added yet. Go back to add some workouts!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgramPreview;
