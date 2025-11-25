import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../../backend/config/firbase-config";
import { saveProgramToFirestore } from "../utils/programService";
import { repositoryFactory } from "../../../data/factory/repositoryFactory";
import ProgramDetails from "../components/ProgramDetails";
import WorkoutBuilder from "../components/WorkoutBuilder";
import ProgramPreview from "../components/ProgramPreview";
import StepIndicator from "../components/StepIndicator";
import { repeatWorkoutsByWeeks } from "../utils/repeatWorkoutsByWeeks";
import "./CreateProgram.css";
import { v4 as uuidv4 } from "uuid";

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

  const addExercise = async () => {
    if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
      const numberOfSets = parseInt(currentExercise.sets) || 1;
      const setsArray = Array.from({ length: numberOfSets }, () => ({
        reps: currentExercise.reps,
        weight: currentExercise.weight || null,
        complete: false,
      }));

      // Create base exercise
      let newExercise = {
        name: currentExercise.name,
        sets: setsArray,
        id: uuidv4(),
      };

      // Add template ID if user is logged in
      const user = auth.currentUser;
      if (user) {
        try {
          // Get or create template for this exercise
          const template =
            await repositoryFactory.exerciseTemplateRepository.getOrCreateTemplate(
              user.uid,
              newExercise
            );

          // Add template ID to the exercise
          newExercise = {
            ...newExercise,
            templateId: template.id,
          };

          console.log("Created exercise with template ID:", newExercise);
        } catch (error) {
          console.error("Error creating exercise template:", error);
        }
      }

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
        workouts: [
          ...prev.workouts,
          { ...currentWorkout, id: uuidv4(), templateId: uuidv4() },
        ],
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

  // Process workouts to ensure all exercises have template IDs
  const processWorkoutsWithTemplates = async (workouts, userId) => {
    // Create deep copy to avoid mutation
    const processedWorkouts = JSON.parse(JSON.stringify(workouts));

    // Process each workout
    for (const workout of processedWorkouts) {
      if (workout.exercises && workout.exercises.length > 0) {
        // Process each exercise in the workout
        for (let i = 0; i < workout.exercises.length; i++) {
          const exercise = workout.exercises[i];

          // If exercise doesn't have a templateId, create one
          if (!exercise.templateId) {
            try {
              const template =
                await repositoryFactory.exerciseTemplateRepository.getOrCreateTemplate(
                  userId,
                  exercise
                );

              // Update exercise with template ID
              workout.exercises[i] = {
                ...exercise,
                templateId: template.id,
              };

              console.log(
                `Added template ID ${template.id} to exercise ${exercise.name}`
              );
            } catch (error) {
              console.error(
                `Error creating template for ${exercise.name}:`,
                error
              );
            }
          }
        }
      }
    }

    return processedWorkouts;
  };

  const handleSaveProgram = async () => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) {
      // Check if user is logged in
      alert("You must be logged in to save a program.");
      return;
    }
    try {
      // First process workouts to ensure all exercises have template IDs
      let workoutsToSave = [...program.workouts];

      // Process with templates
      workoutsToSave = await processWorkoutsWithTemplates(
        workoutsToSave,
        user.uid
      );

      // Then repeat workouts by week
      const repeatedWorkouts = repeatWorkoutsByWeeks(
        workoutsToSave,
        program.duration
      );

      // Prepare program data
      const programData = {
        ...program,
        workouts: repeatedWorkouts,
        createdBy: user.uid,
        createdAt: new Date(),
      };

      const programId = await saveProgramToFirestore(programData); // Save to Firestore
      alert("Program saved successfully! ID: " + programId);
      navigate(`/ExecuteProgram/${programId}`); // Navigate to the specific program execution page
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

  const steps = ["Details", "Workouts", "Preview"];

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

        <button onClick={() => navigate("/dashboard")} className="btn-cancel">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateProgram;
