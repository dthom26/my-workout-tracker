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

export default SessionHeader;
