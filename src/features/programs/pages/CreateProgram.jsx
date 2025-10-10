import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../../backend/config/firbase-config";
import { saveProgramToFirestore } from "../utils/programService";
import ProgramDetails from "../components/ProgramDetails";
import WorkoutBuilder from "../components/WorkoutBuilder";
import ProgramPreview from "../components/ProgramPreview";
import StepIndicator from "../components/StepIndicator";
import { repeatWorkoutsByWeeks } from "../utils/repeatWorkoutsByWeeks";
import "./CreateProgram.css";

const CreateProgram = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [program, setProgram] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "beginner",
    workouts: [],
  });

  const [currentWorkout, setCurrentWorkout] = useState({
    name: "",
    exercises: [],
  });

  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    restTime: "",
  });

  const addExercise = () => {
    if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
      const numberOfSets = parseInt(currentExercise.sets) || 1;
      const setsArray = Array.from({ length: numberOfSets }, () => ({
        reps: currentExercise.reps,
        weight: currentExercise.weight || null,
        complete: false,
      }));
      const newExercise = {
        name: currentExercise.name,
        sets: setsArray, // Use the array you created!
        id: Date.now(),
      };
      setCurrentWorkout((prev) => ({
        ...prev,
        exercises: [...prev.exercises, newExercise],
      }));
      console.log(newExercise);
      setCurrentExercise({
        // this resets the form fields after adding
        name: "",
        sets: "",
        reps: "",
        weight: "",
        restTime: "",
      });
    }
  };

  const addWorkout = () => {
    if (currentWorkout.name && currentWorkout.exercises.length > 0) {
      setProgram((prev) => ({
        ...prev,
        workouts: [...prev.workouts, { ...currentWorkout, id: Date.now() }],
      }));
      setCurrentWorkout({ name: "", exercises: [] });
    }
  };

  const removeExercise = (exerciseId) => {
    setCurrentWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
    }));
  };

  const removeWorkout = (workoutId) => {
    setProgram((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((w) => w.id !== workoutId),
    }));
  };

  const handleSaveProgram = async () => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      // Check if user is logged in
      alert("You must be logged in to save a program.");
      return;
    }
    try {
      // Wrap in try-catch for error handling
      // Prepare program data with repeated workouts
      const programData = {
        ...program,
        workouts: repeatWorkoutsByWeeks(program.workouts, program.duration),
        createdBy: user.uid,
        createdAt: new Date(),
      };
      const programId = await saveProgramToFirestore(programData); // Save to Firestore
      alert("Program saved successfully! ID: " + programId);
      navigate("/ExecuteProgram"); // Navigate to the program execution page
    } catch (error) {
      // Catch and log any errors
      console.error("Error saving program:", error);
      alert("Failed to save program: " + error.message);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProgramDetails program={program} setProgram={setProgram} />;
      case 2:
        return (
          <WorkoutBuilder
            currentWorkout={currentWorkout}
            setCurrentWorkout={setCurrentWorkout}
            currentExercise={currentExercise}
            setCurrentExercise={setCurrentExercise}
            onAddExercise={addExercise}
            onRemoveExercise={removeExercise}
            onAddWorkout={addWorkout}
            program={program}
          />
        );
      case 3:
        return (
          <ProgramPreview program={program} onRemoveWorkout={removeWorkout} />
        );
      default:
        return null;
    }
  };

  const steps = ["1. Details", "2. Workouts", "3. Preview"];

  return (
    <div className="create-program-container">
      <div className="create-program-header">
        <h1>Create New Program</h1>
        <StepIndicator currentStep={currentStep} steps={steps} />
      </div>

      <div className="create-program-content">{renderStep()}</div>

      <div className="create-program-actions">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="btn-secondary"
          >
            Previous
          </button>
        )}

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="btn-primary"
            disabled={
              (currentStep === 1 && !program.name) ||
              (currentStep === 2 && program.workouts.length === 0)
            }
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSaveProgram}
            className="btn-success"
            disabled={!program.name || program.workouts.length === 0}
          >
            Save Program
          </button>
        )}

        <button
          onClick={() => navigate("/ListOfUsersPrograms")}
          className="btn-cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateProgram;
