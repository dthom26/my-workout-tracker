import React from "react";
import { useState } from "react";
import log from "../utils";
import ExerciseCard from "./ExerciseCard";

const WorkoutLog = () => {
  const [exercises, setExercises] = useState(log); // state for complete workout log (history)
  const [currentSessionId, setCurrentSessionId] = useState(1002); // state holding current session id

  const activeWorkoutSession =
    exercises.find((session) => session.id === currentSessionId) || // use .find() to loop through the data to then check each session to see
    // if session.id matched currentSessionId that is in state
    exercises[0]; // if nothing matches then we just use the first session in the data.

  // handle functions are found below ///
  const handleUpdateSetAfterInput = (
    sessionId,
    exerciseId,
    setId,
    updatedSet
  ) => {
    // console.log("Updating:", { exerciseId, setId, updatedSet }); // Input verification
    setExercises((prevExercises) =>
      prevExercises.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              exercises: session.exercises.map((exercise) =>
                exercise.id === exerciseId
                  ? {
                      ...exercise,
                      sets: exercise.sets.map((set) =>
                        set.id === setId
                          ? {
                              ...set,
                              ...updatedSet,
                            }
                          : set
                      ),
                    }
                  : exercise
              ),
            }
          : session
      )
    );
    // console.log("New state:", updatedExercises); // Verify full new state
    // return updatedExercises;
  };

  const handleAddSet = (sessionId, exerciseId) => {
    // pass ids as prams
    setExercises(
      (
        oldExercises // make a copy of old state
      ) =>
        oldExercises.map(
          (
            session // loop through data and compare ids
          ) =>
            session.id === sessionId // if they match then spread the session
              ? {
                  ...session,
                  exercises: session.exercises.map(
                    (
                      exercise // we need to move to the next level to compare the ids
                    ) =>
                      exercise.id === exerciseId // again compare ids
                        ? {
                            ...exercise, // if the match then we can spread the exercise
                            sets: [
                              // access the sets array and then spread it and add an empty new set data to the array of sets
                              ...exercise.sets,
                              { id: Date.now(), weight: 0, reps: 0, rpe: 0 },
                            ],
                          }
                        : exercise
                  ),
                }
              : session
        )
    );
  };

  const handleUpdateExerciseName = (sessionId, exerciseId, name) => {
    setExercises((oldExercises) =>
      oldExercises.map(
        (session) =>
          session.id === sessionId
            ? {
                ...session,
                exercises: session.exercises.map(
                  (exercise) =>
                    exercise.id === exerciseId
                      ? {
                          ...exercise,
                          name: name, // update the name of the exercise
                        }
                      : exercise // if not the same id then just return the exercise as is
                ),
              }
            : session // if not the same session id then just return the session as is
      )
    );
  };

  const handleAddExercise = () => {
    setExercises((oldExercises) => [
      ...oldExercises,
      {
        id: Date.now(),
        name: "Name",
        sets: [{ id: Date.now(), weight: 10, reps: 12, rpe: 9 }],
        date: "date",
      },
    ]);
  };

  const handleRemoveExercise = () => {};

  return (
    <div className="workout-log">
      {activeWorkoutSession.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          sessionId={currentSessionId}
          onAddSet={handleAddSet} // pass handler down
          onUpdateSet={handleUpdateSetAfterInput} // Pass handler down
          onUpdateExerciseName={handleUpdateExerciseName} // Pass handler down
        />
      ))}
      <button onClick={handleAddExercise}>Add Exercise</button>
      <button>Log Workout</button>
    </div>
  );
};

export default WorkoutLog;
