const CollapsedExerciseCard = ({ exercise, onExpand, dragHandleProps }) => {
  return (
    <div className="collapsed-exercise-inner" onClick={onExpand}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="drag-handle" {...dragHandleProps}>
          ≡
        </div>
        <h2 className="exercise-name">{exercise.name}</h2>
      </div>
    </div>
  );
};
export default CollapsedExerciseCard;
