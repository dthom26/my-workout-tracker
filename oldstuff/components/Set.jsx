import React from "react";
import { useState } from "react";

const Set = ({ set, index, onUpdateSet, exerciseId, sessionId }) => {
  const [isEditing, setIsEditing] = useState(false); // so we can switch between view and edit
  const [editedSet, setEditedSet] = useState(set); // getting a copy of the set state that was passed as a prop

  const handleSaveSet = () => {
    onUpdateSet(sessionId, exerciseId, set.id, editedSet);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSet((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  return (
    <div className="set-container">
      {!isEditing ? (
        <>
          <p className="set-info">Set:{index + 1}</p>
          <p className="set-info">Weight: {set.weight}</p>
          <p className="set-info">Reps: {set.reps}</p>
          <p className="set-info">RPE: {set.rpe}</p>
          <button className="set-button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        </>
      ) : (
        <>
          <p>Set {index + 1}</p>
          <label className="set-label">
            Weight:
            <input
              className="set-input"
              type="number"
              name="weight"
              value={editedSet.weight || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Reps:
            <input
              className="set-input"
              type="number"
              name="reps"
              value={editedSet.reps}
              onChange={handleChange}
            />
          </label>
          <label>
            RPE:
            <input
              className="set-input"
              type="number"
              step="0.5"
              name="rpe"
              value={editedSet.rpe}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSaveSet}>Save</button>
        </>
      )}
    </div>
  );
};

export default Set;
