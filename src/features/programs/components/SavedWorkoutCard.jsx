import React, { useState, useEffect } from "react";
import "./styles/SavedWorkoutCard.css";

const SavedWorkoutCard = ({
  workout,
  isEditing,
  onEdit,
  onUpdate,
  onCancel,
  onDelete,
}) => {
  // ============ STATE ============
  const [editedWorkout, setEditedWorkout] = useState(workout);
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [editingExerciseData, setEditingExerciseData] = useState(null);

  // Add Exercise state
  const [addingNewExercise, setAddingNewExercise] = useState(false);
  const [newExerciseData, setNewExerciseData] = useState({
    name: "",
    sets: "",
    reps: "",
  });

  // Reset when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditedWorkout({ ...workout });
    }
  }, [isEditing, workout]);

  // ============ WORKOUT-LEVEL FUNCTIONS ============
  const handleSave = () => {
    onUpdate(workout.id, editedWorkout);
  };
  const handleRemoveWorkout = () => {
    onDelete(workout.id);
  };

  // ============ EXERCISE-LEVEL FUNCTIONS ============
  const handleDeleteExercise = (exerciseId) => {
    // No confirmation needed - changes aren't saved until workout-level save
    setEditedWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));

    // If we were editing this exercise, clear that state
    if (editingExerciseId === exerciseId) {
      setEditingExerciseId(null);
      setEditingExerciseData(null);
    }
  };

  const handleEditExercise = (exercise) => {
    setEditingExerciseId(exercise.id);
    setEditingExerciseData({ ...exercise });
    // Close add form if open
    setAddingNewExercise(false);
  };

  const handleSaveExercise = () => {
    setEditedWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === editingExerciseId ? editingExerciseData : ex
      ),
    }));
    setEditingExerciseId(null);
    setEditingExerciseData(null);
  };

  const handleCancelExercise = () => {
    setEditingExerciseId(null);
    setEditingExerciseData(null);
  };

  // ============ ADD NEW EXERCISE FUNCTIONS ============
  const handleAddNewExercise = () => {
    setAddingNewExercise(true);
    setEditingExerciseId(null); // Close any open exercise edits
  };

  const handleSaveNewExercise = () => {
    // Validation
    if (!newExerciseData.name.trim()) {
      alert("Please enter an exercise name");
      return;
    }
    if (!newExerciseData.sets || newExerciseData.sets < 1) {
      alert("Please enter number of sets");
      return;
    }
    if (!newExerciseData.reps) {
      alert("Please enter reps");
      return;
    }

    // Create new exercise
    const newExercise = {
      id: Date.now().toString(),
      name: newExerciseData.name,
      sets: Array.from({ length: parseInt(newExerciseData.sets) }, () => ({
        reps: newExerciseData.reps,
        weight: null,
        complete: false,
      })),
    };

    // Add to workout
    setEditedWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));

    // Reset form
    setNewExerciseData({ name: "", sets: "", reps: "" });
    setAddingNewExercise(false);
  };

  const handleCancelNewExercise = () => {
    setNewExerciseData({ name: "", sets: "", reps: "" });
    setAddingNewExercise(false);
  };

  // ============ RENDER ============
  return (
    <div
      className={`saved-workout-card ${
        isEditing ? "saved-workout-card--editing" : ""
      }`}
    >
      {isEditing ? (
        // ========== EDIT MODE ==========
        <div className="saved-workout-card__edit-mode">
          <div className="saved-workout-card__edit-header">
            <span className="saved-workout-card__edit-indicator">
              ✏️ Editing Workout
            </span>
          </div>

          <div className="saved-workout-card__edit-body">
            {/* Workout Name Input */}
            <div className="saved-workout-card__form-group">
              <label>Workout Name</label>
              <input
                type="text"
                value={editedWorkout.name}
                onChange={(e) =>
                  setEditedWorkout((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            {/* Exercises List */}
            <div className="saved-workout-card__edit-exercises">
              <h5>Exercises ({editedWorkout.exercises.length})</h5>
              <ul>
                {editedWorkout.exercises.map((exercise) => {
                  const isEditingThisExercise =
                    editingExerciseId === exercise.id;

                  return (
                    <li
                      key={exercise.id}
                      className="saved-workout-card__exercise-item"
                    >
                      {isEditingThisExercise ? (
                        // ===== EDIT MODE for individual exercise =====
                        <div className="saved-workout-card__exercise-edit-form">
                          <div className="saved-workout-card__exercise-form-row">
                            <input
                              type="text"
                              value={editingExerciseData.name}
                              onChange={(e) =>
                                setEditingExerciseData((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="Exercise name"
                              className="saved-workout-card__input-exercise-name"
                            />
                          </div>

                          <div className="saved-workout-card__exercise-form-row">
                            <input
                              type="number"
                              value={editingExerciseData.sets.length}
                              onChange={(e) => {
                                const newCount = parseInt(e.target.value) || 1;
                                const newSets = Array.from(
                                  { length: newCount },
                                  (_, i) =>
                                    editingExerciseData.sets[i] || {
                                      reps: "10",
                                      weight: null,
                                      complete: false,
                                    }
                                );
                                setEditingExerciseData((prev) => ({
                                  ...prev,
                                  sets: newSets,
                                }));
                              }}
                              placeholder="Sets"
                              min="1"
                              className="saved-workout-card__input-sets"
                            />
                          </div>

                          <div className="saved-workout-card__exercise-form-row">
                            <input
                              type="text"
                              value={editingExerciseData.sets[0]?.reps || ""}
                              onChange={(e) => {
                                const newReps = e.target.value;
                                setEditingExerciseData((prev) => ({
                                  ...prev,
                                  sets: prev.sets.map((set) => ({
                                    ...set,
                                    reps: newReps,
                                  })),
                                }));
                              }}
                              placeholder="Reps"
                              className="saved-workout-card__input-reps"
                            />
                          </div>

                          <div className="saved-workout-card__exercise-edit-actions">
                            <button
                              onClick={handleSaveExercise}
                              className="saved-workout-card__btn-save-exercise"
                            >
                              ✓ Save
                            </button>
                            <button
                              onClick={handleCancelExercise}
                              className="saved-workout-card__btn-cancel-exercise"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // ===== VIEW MODE for individual exercise =====
                        <div className="saved-workout-card__exercise-view">
                          <span className="saved-workout-card__exercise-info">
                            <strong>{exercise.name}</strong> -{" "}
                            {exercise.sets.length} sets
                          </span>
                          <div className="saved-workout-card__exercise-actions">
                            <button
                              onClick={() => handleEditExercise(exercise)}
                              className="saved-workout-card__btn-edit-exercise"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteExercise(exercise.id)}
                              className="saved-workout-card__btn-delete-exercise"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* ========== ADD NEW EXERCISE SECTION ========== */}
              {!addingNewExercise ? (
                <button
                  onClick={handleAddNewExercise}
                  className="saved-workout-card__add-exercise-btn"
                >
                  ➕ Add Exercise
                </button>
              ) : (
                <div className="saved-workout-card__add-exercise-form">
                  <h6>Add New Exercise</h6>
                  <div className="saved-workout-card__exercise-form-row">
                    <input
                      type="text"
                      value={newExerciseData.name}
                      onChange={(e) =>
                        setNewExerciseData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Exercise name"
                      className="saved-workout-card__input-exercise-name"
                    />
                  </div>

                  <div className="saved-workout-card__exercise-form-row">
                    <input
                      type="number"
                      value={newExerciseData.sets}
                      onChange={(e) =>
                        setNewExerciseData((prev) => ({
                          ...prev,
                          sets: e.target.value,
                        }))
                      }
                      placeholder="Sets"
                      min="1"
                      className="saved-workout-card__input-sets"
                    />
                  </div>

                  <div className="saved-workout-card__exercise-form-row">
                    <input
                      type="text"
                      value={newExerciseData.reps}
                      onChange={(e) =>
                        setNewExerciseData((prev) => ({
                          ...prev,
                          reps: e.target.value,
                        }))
                      }
                      placeholder="Reps"
                      className="saved-workout-card__input-reps"
                    />
                  </div>

                  <div className="saved-workout-card__exercise-edit-actions">
                    <button
                      onClick={handleSaveNewExercise}
                      className="saved-workout-card__btn-save-exercise"
                    >
                      ✓ Add
                    </button>
                    <button
                      onClick={handleCancelNewExercise}
                      className="saved-workout-card__btn-cancel-exercise"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Workout-Level Save/Cancel */}
          <div className="saved-workout-card__edit-actions">
            <button
              onClick={handleSave}
              className="saved-workout-card__btn-save-workout"
            >
              💾 Save Changes
            </button>
            <button
              onClick={onCancel}
              className="saved-workout-card__btn-cancel-workout"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // ========== VIEW MODE ==========
        <>
          <div className="saved-workout-card__header">
            <h4>{workout.name}</h4>
          </div>

          <div className="saved-workout-card__exercises">
            <ul>
              {workout.exercises.map((exercise) => (
                <li key={exercise.id}>
                  <strong>{exercise.name}</strong> - {exercise.sets.length} sets
                </li>
              ))}
            </ul>
          </div>

          <div className="saved-workout-card__actions">
            <button onClick={onEdit} className="saved-workout-card__btn-edit">
              ✏️ Edit
            </button>
            <button
              onClick={() => {
                const confirmed = window.confirm(
                  `Are you sure you want to delete "${workout.name}"?\n\nThis will delete the entire workout and all its exercises.\n\nThis action cannot be undone.`
                );
                if (confirmed) {
                  onDelete(workout.id);
                }
              }}
              className="saved-workout-card__btn-delete"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SavedWorkoutCard;
