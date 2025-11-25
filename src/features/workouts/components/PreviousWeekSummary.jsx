import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PreviousWeekSummary.css";

const PreviousWeekSummary = ({
  previousSession,
  isLoading,
  programId,
  workoutId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleWeekClick = (e) => {
    e.stopPropagation(); // Prevent triggering parent's onClick
    navigate(
      `/CurrentSession/${programId}/${workoutId}?week=${previousSession.week}`
    );
  };

  if (isLoading) {
    return (
      <div className="previous-week-summary loading">
        <div className="summary-header">
          <span>Loading previous week data...</span>
        </div>
      </div>
    );
  }

  if (!previousSession) {
    return (
      <div className="previous-week-summary no-data">
        <div className="summary-header">
          <span>No previous week data available</span>
        </div>
      </div>
    );
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const formatSetDisplay = (set) => {
    const weight = set.weight ? `${set.weight}lbs` : "BW";
    const reps = set.reps || "0";
    return `${weight} × ${reps}`;
  };

  return (
    <div className="previous-week-summary">
      <div className="summary-header" onClick={toggleExpanded}>
        <div className="header-content">
          <h3>Last Week's Performance</h3>
          <span
            onClick={handleWeekClick}
            style={{ cursor: "pointer" }}
            className="week-info"
          >
            Week {previousSession.week}
          </span>
        </div>
        <button className="toggle-btn">{isExpanded ? "▼" : "▶"}</button>
      </div>

      {isExpanded && (
        <div className="summary-content">
          <div className="session-date">
            {new Date(previousSession.timestamp).toLocaleDateString()}
          </div>

          <div className="exercises-list">
            {previousSession.exercises.map((exercise, index) => (
              <div key={exercise.id || index} className="exercise-item">
                <div className="exercise-name-previous-week">
                  {exercise.name}
                </div>
                <div className="sets-display">
                  {exercise.sets &&
                    exercise.sets.map((set, setIndex) => (
                      <span key={setIndex} className="set-item">
                        {formatSetDisplay(set)}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousWeekSummary;
