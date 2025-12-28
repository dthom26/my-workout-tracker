import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// import { useParams } from "react-router-dom"; // <-- Will use this for dynamic programId
import { doc, getDoc } from "firebase/firestore";
import { db } from "@backend/config/firebase-config";
import { useParams } from "react-router-dom";
import { DropdownMenu } from "../../../shared/components/DropdownBreadCrumb";
import { repositoryFactory } from "../../../data/factory/repositoryFactory";
import { useAuth } from "../../auth/context/AuthContext";
import "./ExecuteProgram.css";

const ExecuteProgram = () => {
  const navigate = useNavigate();
  const { programId } = useParams(); // <-- Will use this for dynamic programId
  const { logout } = useAuth();
  const [userProgram, setUserProgram] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updateExerciseName, setUpdateExerciseName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  const updateWorkoutName = async (workoutId, newName) => {
    try {
      await repositoryFactory.workoutRepository.updateWorkoutName(
        programId,
        workoutId,
        newName
      );

      setUserProgram((prev) => ({
        ...prev,
        workouts: prev.workouts.map((workout) =>
          workout.id === workoutId ? { ...workout, name: newName } : workout
        ),
      }));
    } catch (error) {
      console.error("❌ Test failed:", error);
      alert(`❌ Test failed: ${error.message}`);
    }

    console.log(userProgram);
  };

  const handleEditStart = (workoutId) => {
    setEditingWorkoutId(workoutId);
    // setUpdateExerciseName(currentName);
    setIsEditing(true);
  };

  const handleEditEnd = async () => {
    if (editingWorkoutId && updateExerciseName.trim()) {
      await updateWorkoutName(editingWorkoutId, updateExerciseName.trim());
    }
    setIsEditing(false);
    setEditingWorkoutId(null);
    setUpdateExerciseName("");
  };

  const addWorkout = async () => {
    const newWorkout = {
      id: uuidv4(),
      templateId: uuidv4(),
      name: "New Workout - double click to edit name",
      week: currentWeek,
      exercises: [],
      createdAt: new Date(),
    };

    try {
      await repositoryFactory.workoutRepository.addWorkoutToProgram(
        programId,
        newWorkout
      );
      // Update local state to reflect the added workout

      setUserProgram((prev) => ({
        ...prev,
        workouts: [...prev.workouts, newWorkout],
      }));
      console.log("Updated userProgram state:", {
        ...userProgram,
        workouts: [...userProgram.workouts, newWorkout],
      });
      alert("✅ Successful! Added workout");
    } catch (error) {
      console.error("❌ Test failed:", error);
      alert(`❌ Test failed: ${error.message}`);
    }
  };

  /////

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        // Will update docRef to use dynamic programId from useParams
        const docRef = doc(db, "programs", programId);
        const docSnap = await getDoc(docRef);
        console.log(docSnap);
        if (docSnap.exists()) {
          const programData = docSnap.data();
          console.log(programData.workouts);
          setUserProgram(programData);
          setCurrentWeek(1); // or programData.workouts[0].week if you want to start at first week
        } else {
          setUserProgram(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch program:", error);
        setLoading(false);
      }
    };

    fetchProgramData();
  }, [programId]); // <-- Will add [programId] as dependency when dynamic

  // Filter workouts for the current week
  const currentWeekWorkouts = userProgram
    ? userProgram.workouts.filter((w) => w.week === currentWeek)
    : [];

  const handleWeekChange = (weekNumber) => {
    setCurrentWeek(weekNumber);
  };

  if (loading) {
    return (
      <div className="execute-program-container">
        <div className="loading">Loading your program...</div>
      </div>
    );
  }

  if (!userProgram) {
    return (
      <div className="execute-program-container">
        <div className="error">Failed to load program</div>
      </div>
    );
  }

  return (
    <div className="execute-program-container">
      {/* Header */}
      <div className="execute-program-header">
        <nav className="breadcrumb">
          <DropdownMenu
            actions={[
              {
                label: "Home",
                onClick: (e) => {
                  e.stopPropagation();
                  navigate("/dashboard");
                },
              },
              {
                label: "Create Program",
                onClick: (e) => {
                  e.stopPropagation();
                  navigate("/CreateProgram");
                },
              },
              {
                label: "Sign Out",
                onClick: (e) => {
                  e.stopPropagation();
                  handleSignOut();
                },
              },
            ]}
            trigger={<span>⋮</span>}
          />
        </nav>

        <h1>{userProgram.name}</h1>
        <div className="program-info">
          <span>
            Week {currentWeek} of {userProgram.duration}
          </span>
          <span>{userProgram.difficulty}</span>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="week-navigation">
        {Array.from(
          { length: parseInt(userProgram.duration, 10) },
          (_, i) => i + 1
        ).map((week) => (
          <button
            key={week}
            className={`week-btn ${currentWeek === week ? "active" : ""}`}
            onClick={() => handleWeekChange(week)}
          >
            Week {week}
          </button>
        ))}
      </div>

      {/* Current Week Content */}
      <div className="week-content">
        <h2>Week {currentWeek} Workouts</h2>
        <nav className="add-workout-menu">
          <DropdownMenu
            actions={[
              {
                label: "Add Workout",
                onClick: (e) => {
                  e.stopPropagation();
                  addWorkout();
                },
              },
            ]}
            trigger={<span>+</span>}
          />
        </nav>
        {currentWeekWorkouts.length === 0 ? (
          <div className="no-workouts">No workouts scheduled for this week</div>
        ) : (
          <div className="workouts-grid">
            {currentWeekWorkouts.map((workout) => (
              <div key={workout.id} className="execution-workout-card">
                {/* <nav className="execution-workout-card-menu">
                  <DropdownMenu
                    actions={[
                      {
                        label: "Edit",
                        onClick: (e) => {
                          e.stopPropagation();
                        },
                      },
                    ]}
                  />
                </nav> */}
                <div className="execution-workout-card-header">
                  {isEditing && editingWorkoutId === workout.id ? (
                    <input
                      type="text"
                      value={updateExerciseName}
                      onChange={(e) => setUpdateExerciseName(e.target.value)}
                      onBlur={handleEditEnd}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditEnd();
                        }
                        if (e.key === "Escape") {
                          setIsEditing(false);
                          setEditingWorkoutId(null);
                          setUpdateExerciseName("");
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <h3
                      onDoubleClick={() =>
                        handleEditStart(workout.id, workout.name)
                      }
                    >
                      {workout.name}
                    </h3>
                  )}
                </div>
                <div className="workout-exercises">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-summary">
                      <span className="exercise-name">{exercise.name}</span>
                      {/* <span className="exercise-target">
                        {exercise.sets.length} × {exercise.sets[0].reps}
                      </span> */}
                    </div>
                  ))}
                </div>
                <div className="workout-actions">
                  <button
                    // Will update navigation to use dynamic programId
                    onClick={() =>
                      navigate(`/CurrentSession/${programId}/${workout.id}`)
                    }
                    className="btn-primary"
                  >
                    Start Workout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/*
        Future Updates:
        - Use React Router `useParams` to get dynamic `programId`
        - Update navigation and data fetching to use dynamic `programId`
        - Consider adding a ProgramsList page and navigation to it - done
      */}
    </div>
  );
};

export default ExecuteProgram;
