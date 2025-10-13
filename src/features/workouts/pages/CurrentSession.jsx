import React, { useState, useEffect, useRef } from "react";
import "./CurrentSession.css";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";
import { useAuth } from "../../auth/context/AuthContext";
import { saveSessionToFirestore } from "../utils/sessionService"; // Import the service to save session
import { getSessionFromFirestore } from "../utils/sessionService"; // Import the service to get session
// Header component
const SessionHeader = ({ workout }) => {
  return (
    <div className="session-header">
      {/* Program/workout name, week, day */}

      <h1 className="session-title">
        {workout.name} {/* Will display workout name from DB */}
      </h1>
      <div className="session-meta">
        <span>
          Week {workout.week} {/* Will display week number from DB */}
        </span>
      </div>
    </div>
  );
};

// Drop down menu component

function DropdownMenu({ actions, trigger }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={menuRef}>
      <button className="dropdown-trigger" onClick={() => setOpen((o) => !o)}>
        {trigger || "⋮"}
      </button>
      {open && (
        <div className="dropdown-content">
          {actions.map((action, index) => (
            <button
              key={index}
              className="dropdown-item"
              onClick={(e) => {
                action.onClick(e);
                setOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Collapsed version of ExerciseCard component
const CollapsedExerciseCard = ({ exercise, onExpand }) => {
  return (
    <div className="collapsed-exercise-inner" onClick={onExpand}>
      <h2 className="exercise-name">{exercise.name}</h2>
    </div>
  );
};

// Exercise list component
const ExerciseList = ({ exercises, setWorkout, handleDeleteExercise }) => {
  const [editingExerciseId, setEditingExerciseId] = useState(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

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

  return (
    <div className="exercise-list-session">
      {/* Map over exercises for this workout */}
      {exercises.map((exercise, index) => (
        <div
          className={`exercise-card ${
            expandedExerciseId === exercise.id ? "expanded" : "collapsed"
          }`}
          key={exercise.id}
        >
          {expandedExerciseId === exercise.id ? (
            <>
              <div className="exercise-header">
                {editingExerciseId === exercise.id ? (
                  <>
                    {/* Edit mode */}
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) =>
                        handleExerciseNameChange(index, e.target.value)
                      }
                      className="edit-exercise-name"
                    />
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
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="exercise-name">{exercise.name}</h2>
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
              <div className="exercise-details">
                {/* <span>
              Target: {exercise.sets.length} sets × {exercise.sets[0].reps} reps
              @ {exercise.sets[0].weight}lbs • Rest: {exercise.sets[0].restTime}
              s 
            </span> */}
              </div>
              <div className="sets-list">
                {/* Render set rows based on number of sets */}
                {Array.from({ length: Number(exercise.sets.length) }).map(
                  (_, setIdx) => (
                    <div className="set-row" key={setIdx}>
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
                        type="text"
                        className="input-weight"
                        placeholder="Weight" // Will display/set actual weight
                        value={exercise.sets[setIdx]?.weight || ""} // Assuming exercise.sets is an array of set objects
                        onChange={(e) =>
                          handleWeightChange(index, setIdx, e.target.value)
                        }
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
            />
          )}
        </div>
      ))}
      {/* Repeat for each exercise */}
    </div>
  );
};

// Notes and actions component
const SessionActions = ({ setWorkout, handleSaveSession }) => {
  const handleNotesChange = (e) => {
    setWorkout((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };
  return (
    <div className="session-actions">
      <textarea
        className="session-notes"
        placeholder="Add notes for this session..." // Will display/set session notes
        onChange={handleNotesChange} // Add notes change logic here
      />
      <div className="session-action-buttons">
        <button
          className="btn-save"
          onClick={handleSaveSession} // Add save session logic here
        >
          Save Session
        </button>
        {/* <button
          className="btn-cancel"
          // onClick={handleCancelSession} // Add cancel session logic here
        >
          Cancel
        </button> */}
      </div>
    </div>
  );
};

const CurrentSession = () => {
  const { workoutId, programId } = useParams(); // You need both IDs in your route!
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    // Navigate back to the program execution page
    navigate(`/ExecuteProgram/${programId}`);
  };

  const handleAddExercise = () => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: [
        ...prevWorkout.exercises,
        {
          id: Date.now(),
          name: "New Exercise",
          sets: [{ reps: "", weight: "", complete: false }],
        },
      ],
    }));
  };

  const handleDeleteExercise = (exerciseId) => {
    console.log("delete");
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const handleSaveSession = () => {
    console.log("Save session clicked");
    console.log("Current workout state:", workout);
    const sessionData = {
      userId: user.uid, // from auth context
      programId: programId, // from route params
      workoutId: workoutId, // from route params
      name: workout.name,
      week: workout.week,
      exercises: workout.exercises, // the modified workout data
      notes: workout.notes || "",
      timestamp: new Date().toISOString(), // current timestamp
    };
    console.log("Session data to save:", sessionData);
    // Call your service to save sessionData to Firestore
    saveSessionToFirestore(sessionData);
  };

  useEffect(() => {
    if (!user) return; // Wait until user is loaded
    const fetchWorkout = async () => {
      try {
        // Fetch the program document
        const programRef = doc(db, "programs", programId);
        const programSnap = await getDoc(programRef);
        const programData = programSnap.data();
        // Find the workout in the workouts array
        const foundWorkout = programData.workouts.find(
          (w) => w.id === workoutId
        );
        const sessionData = await getSessionFromFirestore(
          user.uid,
          programId,
          workoutId,
          foundWorkout.week,
          foundWorkout
        );
        setWorkout(sessionData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching workout:", error);
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [workoutId, programId, user]);

  if (loading) {
    return (
      <div className="current-session-container">
        <div className="loading">Loading workout...</div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="current-session-container">
        <div className="error">Workout not found</div>
      </div>
    );
  }
  console.log("Loaded workout:", workout);
  // Pass workout data to components as props
  return (
    <div className="current-session-container">
      <nav className="breadcrumb">
        <DropdownMenu
          actions={[
            {
              label: "Edit",
              onClick: (e) => {
                e.stopPropagation();
                handleBack();
              },
            },
            {
              label: "Delete",
              onClick: (e) => {
                e.stopPropagation();
                handleBack();
              },
            },
          ]}
          trigger={<span>⋮</span>}
        />
      </nav>
      <SessionHeader workout={workout} onBack={handleBack} />
      <div className="current-session-content">
        <ExerciseList
          exercises={workout.exercises}
          setWorkout={setWorkout}
          handleDeleteExercise={handleDeleteExercise}
        />
        <button
          className="btn-add-exercise"
          onClick={handleAddExercise} // Add add exercise logic here
        >
          Add Exercise
        </button>
        <SessionActions
          handleSaveSession={handleSaveSession}
          setWorkout={setWorkout}
        />
      </div>
    </div>
  );
};

export default CurrentSession;
