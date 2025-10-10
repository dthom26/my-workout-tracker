import React from "react";

const ProgramDetails = ({ program, setProgram }) => {
  return (
    <div className="step-content">
      <h2>Program Details</h2>
      <div className="form-group">
        <label>Program Name</label>
        <input
          type="text"
          value={program.name}
          onChange={(e) =>
            setProgram((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter program name"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={program.description}
          onChange={(e) =>
            setProgram((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Describe your program"
          rows="3"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Duration (weeks)</label>
          <input
            type="number"
            value={program.duration}
            onChange={(e) =>
              setProgram((prev) => ({
                ...prev,
                duration: e.target.value,
              }))
            }
            placeholder="e.g., 12"
          />
        </div>
        <div className="form-group">
          <label>Difficulty</label>
          <select
            value={program.difficulty}
            onChange={(e) =>
              setProgram((prev) => ({
                ...prev,
                difficulty: e.target.value,
              }))
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
