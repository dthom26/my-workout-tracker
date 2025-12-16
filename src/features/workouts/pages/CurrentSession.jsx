import React, { useState, useEffect } from "react";
import SessionActions from "../components/SessionActions.jsx";
import SessionHeader from "../components/SessionHeader.jsx";
import DropdownMenu from "../components/DropdownMenu.jsx";
import ExerciseList from "../components/ExerciseList.jsx";
import PreviousWeekSummary from "../components/PreviousWeekSummary.jsx";
import { v4 as uuidv4 } from "uuid";
import "./CurrentSession.css";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../backend/config/firbase-config";
import { useAuth } from "../../auth/context/AuthContext";
import {
  saveSessionToFirestore,
  getSessionFromFirestore,
  getPreviousSessionData,
} from "../utils/sessionService";

const CurrentSession = () => {
  const { workoutId, programId } = useParams(); // Get workoutId and programId from URL path
  const [searchParams] = useSearchParams(); // Get query parameters
  const weekParam = searchParams.get("week"); // Extract week from query string
  const week = weekParam ? parseInt(weekParam, 10) : null; // Parse to number or null

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previousSession, setPreviousSession] = useState(null);
  const [previousSessionLoading, setPreviousSessionLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

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
          id: uuidv4(),
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

  const handleSaveSession = async () => {
    console.log("Save session clicked");
    console.log("Current workout state:", workout);
    const sessionData = {
      userId: user.uid, // from auth context
      programId: programId, // from route params
      workoutId: workoutId, // from route params
      workoutTemplateId: workout.templateId, // from loaded workout
      name: workout.name,
      week: week || workout.week, // Use URL week param if available, otherwise use from workout
      exercises: workout.exercises, // the modified workout data
      notes: workout.notes || "",
      timestamp: new Date().toISOString(), // current timestamp
    };
    console.log("Session data to save:", sessionData);
    // Call your service to save sessionData to Firestore
    try {
      await saveSessionToFirestore(sessionData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide after 3s
    } catch (error) {
      setSaveError("Failed to save session. Please try again.", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchWorkout = async () => {
      try {
        const programRef = doc(db, "programs", programId);
        const programSnap = await getDoc(programRef);
        const programData = programSnap.data();

        const foundWorkout = programData.workouts.find(
          (w) => w.id === workoutId
        );

        console.log("Found workout from Firestore:", foundWorkout);

        const sessionData = await getSessionFromFirestore(
          user.uid,
          programId,
          workoutId,
          week || foundWorkout.week,
          foundWorkout
        );

        console.log("Session data returned:", sessionData);
        console.log(
          "Does sessionData have templateId?",
          sessionData.templateId
        );

        // ✅ FIX: Ensure templateId is preserved
        const finalWorkoutData = {
          ...sessionData,
          templateId: foundWorkout.templateId, // Explicitly preserve templateId
          week: week || foundWorkout.week, // Use URL week param if available, otherwise use from workout
        };

        console.log("Final workout data being set:", finalWorkoutData);
        console.log(
          "Does final data have templateId?",
          finalWorkoutData.templateId
        );

        setWorkout(finalWorkoutData);

        setLoading(false);

        // Fetch previous week's session data if workout has templateId
        if (foundWorkout.templateId) {
          try {
            const currentWeekNum = parseInt(week) || foundWorkout.week;
            const previousSessionData = await getPreviousSessionData(
              user.uid,
              foundWorkout.templateId,
              currentWeekNum
            );
            setPreviousSession(previousSessionData);
          } catch (error) {
            console.error("Error fetching previous session:", error);
          }
        }
        setPreviousSessionLoading(false);
      } catch (error) {
        console.error("Error fetching workout:", error);
        setLoading(false);
        setPreviousSessionLoading(false);
      }
    };
    fetchWorkout();
  }, [workoutId, programId, week, user]);

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
              label: "Home",
              onClick: (e) => {
                e.stopPropagation();
                navigate("/dashboard");
              },
            },
            {
              label: "Program Overview",
              onClick: (e) => {
                e.stopPropagation();
                navigate(`/ExecuteProgram/${programId}`);
              },
            },
            {
              label: "All Programs",
              onClick: (e) => {
                e.stopPropagation();
                navigate("/ListOfUsersPrograms"); // Adjust the route as needed
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
      <SessionHeader workout={workout} onBack={handleBack} />

      {/* Previous Week Summary */}
      <PreviousWeekSummary
        previousSession={previousSession}
        isLoading={previousSessionLoading}
        programId={programId}
        workoutId={workoutId}
      />

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
          workout={workout}
          saveSuccess={saveSuccess}
        />
        {saveError && alert(saveError)}
      </div>
    </div>
  );
};

export default CurrentSession;
