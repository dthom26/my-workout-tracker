import React, { useState, useRef, useEffect } from "react";
import DropdownMenu from "./DropdownMenu.jsx";
import CollapsedExerciseCard from "./CollapsedExerciseCard.jsx";
import { auth } from "@backend/config/firebase-config";
import { repositoryFactory } from "../../../data/factory/repositoryFactory";
const ExerciseList = ({ exercises, setWorkout, handleDeleteExercise }) => {
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);

  // Handle expanding/collapsing exercise card
  const handleExpandClick = (exerciseId) => {
    setExpandedExerciseId((prevId) =>
      prevId === exerciseId ? null : exerciseId
    );
  };

  const handleExerciseNameChange = (exerciseIndex, newName) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.map((ex, idx) =>
        idx === exerciseIndex ? { ...ex, name: newName } : ex
      ),
    }));
  };

  // Delete a set from an exercise
  const handleDeleteSet = (exerciseIndex, setIndex) => {
    setWorkout((prevWorkout) => {
      const updatedExercises = prevWorkout.exercises.map((exercise, exIdx) => {
        if (exIdx !== exerciseIndex) return exercise;

        // Filter out the set to delete
        const updatedSets = exercise.sets.filter(
          (_, sIdx) => sIdx !== setIndex
        );

        return {
          ...exercise,
          sets: updatedSets,
        };
      });

      return {
        ...prevWorkout,
        exercises: updatedExercises,
      };
    });
  };

  const handleRepsChange = (exerciseIndex, setIndex, newRepsValue) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.exercises.map((exercise, exIdx) => {
        if (exIdx !== exerciseIndex) return exercise;

        // Update the reps for the specific set
        const updatedSets = exercise.sets.map((set, sIdx) => {
          if (sIdx !== setIndex) return set;
          return { ...set, reps: newRepsValue };
        });

        return {
          ...exercise,
          sets: updatedSets,
        };
      });

      return {
        ...prevWorkout,
        exercises: updatedWorkout,
      };
    });
  };

  const handleWeightChange = (exerciseIndex, setIndex, newWeightValue) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.exercises.map((exercise, exIdx) => {
        if (exIdx !== exerciseIndex) return exercise;
        // Update the weight for the specific set
        const updatedSets = exercise.sets.map((set, sIdx) => {
          if (sIdx !== setIndex) return set;
          return { ...set, weight: newWeightValue };
        });
        return {
          ...exercise,
          sets: updatedSets,
        };
      });

      return {
        ...prevWorkout,
        exercises: updatedWorkout,
      };
    });
  };

  const handleRirChange = (exerciseIndex, setIndex, newRirValue) => {
    setWorkout((prevWorkout) => {
      const updatedWorkout = prevWorkout.exercises.map((exercise, exIdx) => {
        if (exIdx !== exerciseIndex) return exercise;

        // Update the RIR for the specific set
        const updatedSets = exercise.sets.map((set, sIdx) => {
          if (sIdx !== setIndex) return set;
          return { ...set, rir: newRirValue };
        });

        return {
          ...exercise,
          sets: updatedSets,
        };
      });

      return {
        ...prevWorkout,
        exercises: updatedWorkout,
      };
    });
  };

  /**
   * Toggles the complete status for a specific set in a specific exercise
   * @param {number} exerciseIndex - The index of the exercise in the exercises array
   * @param {number} setIndex - The index of the set within the exercise's sets array
   */
  const handleCompleteSet = (exerciseIndex, setIndex) => {
    setWorkout((prevWorkout) => {
      // Create a new array of exercises using map to ensure React detects the change
      const updatedExercises = prevWorkout.exercises.map((exercise, exIdx) => {
        // If this isn't the exercise we're targeting, return it unchanged
        if (exIdx !== exerciseIndex) return exercise;

        // For the target exercise, create a new object with an updated sets array
        return {
          ...exercise,
          sets: exercise.sets.map((set, sIdx) => {
            // If this isn't the set we're targeting, return it unchanged
            if (sIdx !== setIndex) return set;

            // For the target set, create a new object with toggled complete status
            return { ...set, complete: !set.complete };
          }),
        };
      });

      // Return a new workout object with the updated exercises array
      return {
        ...prevWorkout,
        exercises: updatedExercises,
      };
    });
  };

  const handleAddSet = (exerciseIndex) => {
    setWorkout((prevWorkout) => {
      // Map over exercises to create new references
      const updatedExercises = prevWorkout.exercises.map((exercise, exIdx) => {
        // If this isn't our target exercise, return it unchanged
        if (exIdx !== exerciseIndex) return exercise;

        // For the target exercise, create a new object with a new sets array
        // that includes all existing sets plus the new one
        return {
          ...exercise,
          sets: [...exercise.sets, { reps: "", weight: "", complete: false }],
        };
      });

      // Return a new workout object with the updated exercises
      return {
        ...prevWorkout,
        exercises: updatedExercises,
      };
    });
  };

  const dragItem = useRef(0);
  const dragOverItem = useRef(0);
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    // Only perform the swap if indices are valid and different
    if (dragItem.current !== dragOverItem.current) {
      const clonedExercises = [...exercises];
      const temp = clonedExercises[dragItem.current];
      clonedExercises[dragItem.current] = clonedExercises[dragOverItem.current];
      clonedExercises[dragOverItem.current] = temp;
      setWorkout((prevWorkout) => ({
        ...prevWorkout,
        exercises: clonedExercises,
      }));
    }
    // reset refs
    dragItem.current = null;
    dragOverItem.current = null;
  };
  ///////////////// Fetch templates for autocomplete
  /////////////
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    const fetchTemplates = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userTemplates =
            await repositoryFactory.exerciseTemplateRepository.getExerciseTemplates(
              user.uid
            );
          setTemplates(userTemplates || []);
        } catch (error) {
          console.error("Error fetching templates:", error);
        }
      }
    };

    fetchTemplates();
  }, []);
  ///////////////////

  return (
    <div className="exercise-list-session">
      {/* Map over exercises for this workout */}
      {exercises.map((exercise, index) => (
        <div
          className={`exercise-card 
            ${expandedExerciseId === exercise.id ? "expanded" : "collapsed"} 
            ${draggedId === exercise.id ? "dragging" : ""} 
            ${dragOverId === exercise.id ? "drag-over" : ""}
          `}
          key={exercise.id}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => {
            dragOverItem.current = index;
            setDragOverId(exercise.id);
          }}
          onDragLeave={() => {
            if (dragOverId === exercise.id) {
              setDragOverId(null);
            }
          }}
          data-id={exercise.id}
        >
          {expandedExerciseId === exercise.id ? (
            <>
              <div className="exercise-header">
                {editingExerciseId === exercise.id ? (
                  <>
                    {/* Edit mode - no drag handle at all */}
                    <div className="name-container edit-mode">
                      <input
                        type="text"
                        value={exercise.name}
                        onChange={(e) =>
                          handleExerciseNameChange(index, e.target.value)
                        }
                        className="edit-exercise-name"
                        list="exercise-templates"
                      />
                      <datalist id="exercise-templates">
                        {templates.map((template) => (
                          <option key={template.id} value={template.name} />
                        ))}
                      </datalist>
                    </div>
                    <div className="edit-actions">
                      <button
                        className="btn-save-edit"
                        onClick={() => setEditingExerciseId(null)}
                      >
                        Save
                      </button>
                      <button
                        className="btn-cancel-edit"
                        onClick={() => setEditingExerciseId(null)}
                      >
                        X
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="drag-handle"
                      draggable
                      onDragStart={(e) => {
                        dragItem.current = index;
                        setDraggedId(exercise.id);
                        // For better dragging experience
                        const card = e.target.closest(".exercise-card");
                        if (card) {
                          const rect = card.getBoundingClientRect();
                          // Set drag image offset from pointer
                          e.dataTransfer.setDragImage(
                            card,
                            e.clientX - rect.left,
                            e.clientY - rect.top
                          );
                        }
                      }}
                      onDragEnd={() => {
                        handleSort();
                        setDraggedId(null);
                        setDragOverId(null);
                        // Add "dropped" class temporarily for drop animation
                        const droppedItem = document.querySelector(
                          `.exercise-card[data-id="${exercise.id}"]`
                        );
                        if (droppedItem) {
                          droppedItem.classList.add("dropped");
                          setTimeout(() => {
                            droppedItem.classList.remove("dropped");
                          }, 300);
                        }
                      }}
                    >
                      ≡
                    </div>
                    <div className="name-container">
                      <h2 className="exercise-name">{exercise.name}</h2>
                    </div>
                    <DropdownMenu
                      actions={[
                        {
                          label: "Edit",
                          onClick: (e) => {
                            e.stopPropagation();
                            setEditingExerciseId(exercise.id);
                          },
                        },
                        {
                          label: "Delete",
                          onClick: (e) => {
                            e.stopPropagation();
                            handleDeleteExercise(exercise.id);
                          },
                        },
                      ]}
                      trigger={<span>⋮</span>}
                    />
                  </>
                )}
              </div>
              {/* <div className="exercise-details">
                <span>
              Target: {exercise.sets.length} sets × {exercise.sets[0].reps} reps
              @ {exercise.sets[0].weight}lbs • Rest: {exercise.sets[0].restTime}
              s 
            </span>
              </div> */}
              <div className="sets-list">
                {/* Render set rows based on number of sets */}
                {Array.from({ length: Number(exercise.sets.length) }).map(
                  (_, setIdx) => (
                    <div className="set-row" key={setIdx}>
                      <input
                        type="number"
                        className="input-weight"
                        placeholder="Weight" // Will display/set actual weight
                        value={exercise.sets[setIdx]?.weight || ""} // Assuming exercise.sets is an array of set objects
                        onChange={(e) =>
                          handleWeightChange(index, setIdx, e.target.value)
                        }
                      />
                      <input
                        type="number"
                        className="input-reps"
                        placeholder="Reps" // Will display/set actual reps
                        value={exercise.sets[setIdx]?.reps || ""} // Assuming exercise.sets is an array of set objects
                        onChange={(e) =>
                          handleRepsChange(index, setIdx, e.target.value)
                        } // Add reps change logic here
                      />
                      <input
                        type="number"
                        className="input-rir"
                        placeholder="RIR" // Will display/set actual RIR
                        value={exercise.sets[setIdx]?.rir || ""} // Assuming exercise.sets is an array of set objects
                        onChange={(e) =>
                          handleRirChange(index, setIdx, e.target.value)
                        } // Add RIR change logic here
                      />
                      {/* Add delete button when in edit mode */}
                      {editingExerciseId === exercise.id ? (
                        <button
                          className="btn-delete-set"
                          onClick={() => handleDeleteSet(index, setIdx)}
                        >
                          X
                        </button>
                      ) : (
                        <div className="set-complete-checkbox">
                          <input
                            type="checkbox"
                            checked={exercise.sets[setIdx]?.complete || false}
                            onChange={() => handleCompleteSet(index, setIdx)}
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
              <button
                className="btn-add-set"
                onClick={() => handleAddSet(index)} // Add add set logic here
              >
                Add Set
              </button>
            </>
          ) : (
            <CollapsedExerciseCard
              exercise={exercise}
              onExpand={() => handleExpandClick(exercise.id)}
              dragHandleProps={{
                draggable: true,
                onDragStart: (e) => {
                  dragItem.current = index;
                  setDraggedId(exercise.id);
                  // For better dragging experience
                  const card = e.target.closest(".exercise-card");
                  if (card) {
                    const rect = card.getBoundingClientRect();
                    // Set drag image offset from pointer
                    e.dataTransfer.setDragImage(
                      card,
                      e.clientX - rect.left,
                      e.clientY - rect.top
                    );
                  }
                },
                onDragEnd: () => {
                  handleSort();
                  setDraggedId(null);
                  setDragOverId(null);
                  // Add "dropped" class temporarily for drop animation
                  const droppedItem = document.querySelector(
                    `.exercise-card[data-id="${exercise.id}"]`
                  );
                  if (droppedItem) {
                    droppedItem.classList.add("dropped");
                    setTimeout(() => {
                      droppedItem.classList.remove("dropped");
                    }, 300);
                  }
                },
              }}
            />
          )}
        </div>
      ))}
      {/* Repeat for each exercise */}
    </div>
  );
};
export default ExerciseList;
