import React, { useState, useEffect } from "react";
import { auth } from "@backend/config/firebase-config";
import { repositoryFactory } from "../../../data/factory/repositoryFactory";
import "./styles/ExerciseForm.css";

const ExerciseForm = ({ exercise, setExercise, onAddExercise }) => {
  const [templates, setTemplates] = useState([]);

  // Fetch exercise templates for autocomplete
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

  return (
    <div className="exercise-form__section">
      <h3 className="exercise-form__heading">Add Exercise</h3>
      <div className="exercise-form__row">
        <input
          type="text"
          className="exercise-form__input"
          value={exercise.name}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
          placeholder="Exercise name"
          list="exercise-templates"
        />
        <datalist id="exercise-templates">
          {templates.map((template) => (
            <option key={template.id} value={template.name} />
          ))}
        </datalist>
        <input
          type="number"
          className="exercise-form__input"
          value={exercise.sets}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              sets: e.target.value,
            }))
          }
          placeholder="Sets"
        />
        <input
          type="text"
          className="exercise-form__input"
          value={exercise.reps}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              reps: e.target.value,
            }))
          }
          placeholder="Reps"
        />
        {/* <input
          type="text"
          value={exercise.weight}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              weight: e.target.value,
            }))
          }
          placeholder="Weight"
        /> */}
        {/* <input
          type="text"
          value={exercise.restTime}
          onChange={(e) =>
            setExercise((prev) => ({
              ...prev,
              restTime: e.target.value,
            }))
          }
          placeholder="Rest time"
        /> */}
        <button
          type="button"
          onClick={onAddExercise}
          className="exercise-form__button"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ExerciseForm;
