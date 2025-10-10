import React from "react";
import Set from "./Set";
import { useState } from "react";

const ExerciseCard = ({
  exercise,
  onAddSet,
  sessionId,
  onUpdateSet,
  onUpdateExerciseName,
  onAddAddExercise,
}) => {
  const [isEditing, setIsEditing] = useState(false); // State to track if the exercise name is being edited
  const [exerciseName, setExerciseName] = useState(exercise.name); // State to track the exercise name
  //const [editedExercise, setEditedExercise] = useState(exercise) // State to track the edited exercise
  const { sets, name } = exercise;

  const handleExerciseNameSave = () => {
    onUpdateExerciseName(sessionId, exercise.id, exerciseName); // call the function to update the exercise name in the parent component
    setIsEditing(false); // Exit editing mode
  };

  return (
    <div className="exercise-card">
      <div className="exercise-name">
        {
          /* Exercise name display and edit functionality */
          isEditing ? (
            <input
              className="exercise-name-input"
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)} // Update the exercise name state. remember to use pass e and use e.target.value to get the value of the input field
              onBlur={handleExerciseNameSave}
              autoFocus
            />
          ) : (
            <h3 onClick={() => setIsEditing(true)}>{exercise.name}</h3>
          )
        }
      </div>
      {sets.map((set, index) => (
        <Set
          key={set.id}
          set={set}
          index={index}
          sessionId={sessionId}
          onUpdateSet={onUpdateSet}
          exerciseId={exercise.id}
        />
      ))}

      <button onClick={() => onAddSet(sessionId, exercise.id)}>Add Set</button>
    </div>
  );
};

export default ExerciseCard;
