import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useParams } from "react-router-dom"; // <-- Will use this for dynamic programId
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";
import { useParams } from "react-router-dom";
import "./ExecuteProgram.css";

const ExecuteProgram = () => {
  const navigate = useNavigate();
  const { programId } = useParams(); // <-- Will use this for dynamic programId
  const [userProgram, setUserProgram] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        // Will update docRef to use dynamic programId from useParams
        const docRef = doc(db, "programs", programId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const programData = docSnap.data();
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

  const handleBackToPrograms = () => {
    navigate("/ListOfUsersPrograms"); // Could also be a dedicated programs list page later
  };

  const handleCreateNewProgram = () => {
    navigate("/CreateProgram");
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
        <div className="header-actions">
          <button onClick={handleBackToPrograms} className="btn-back">
            ← Back to Home
          </button>
          <button onClick={handleCreateNewProgram} className="btn-secondary">
            Create New Program
          </button>
        </div>
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
        {currentWeekWorkouts.length === 0 ? (
          <div className="no-workouts">No workouts scheduled for this week</div>
        ) : (
          <div className="workouts-grid">
            {currentWeekWorkouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-card-header">
                  <h3>{workout.name}</h3>
                </div>
                <div className="workout-exercises">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id} className="exercise-summary">
                      <span className="exercise-name">{exercise.name}</span>
                      <span className="exercise-target">
                        {exercise.sets.length} × {exercise.sets[0].reps}
                      </span>
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
