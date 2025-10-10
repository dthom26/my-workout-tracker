import React from "react";

const ExerciseForm = ({ exercise, setExercise, onAddExercise }) => {
  return (
    <div className="exercise-section">
      <h3>Add Exercise</h3>
      <div className="form-row">
        <input
          type="text"
          value={exercise.name}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          placeholder="Exercise name"
        />
        <input
          type="number"
          value={exercise.sets}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              sets: e.target.value,
            }))
          }
          placeholder="Sets"
        />
        <input
          type="text"
          value={exercise.reps}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              reps: e.target.value,
            }))
          }
          placeholder="Reps"
        />
        {/* <input
          type="text"
          value={exercise.weight}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              weight: e.target.value,
            }))
          }
          placeholder="Weight"
        /> */}
        {/* <input
          type="text"
          value={exercise.restTime}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              restTime: e.target.value,
            }))
          }
          placeholder="Rest time"
        /> */}
        <button type="button" onClick={onAddExercise} className="btn-add">
          Add
        </button>
      </div>
    </div>
  );
};

export default ExerciseForm;
