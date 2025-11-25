const SessionActions = ({ setWorkout, handleSaveSession }) => {
  //   const { workoutId, programId, week } = useParams();
  //   const { user } = useAuth();
  //   const navigate = useNavigate();
  //   const [showCopyOptions, setShowCopyOptions] = useState(false);

  const handleNotesChange = (e) => {
    setWorkout((prev) => ({
      ...prev,
      notes: e.target.value,
    }));
  };

  // Handle copy to next week action
  //   const handleCopyToNextWeek = async () => {
  //     // Get current workout data
  //     setWorkout((prevWorkout) => {
  //       if (!prevWorkout || !prevWorkout.exercises) return prevWorkout;

  //       const nextWeek = parseInt(week, 10) + 1;

  //       // Copy exercises to next week with template identity preserved
  //       copyExercisesToNextWeek(user.uid, prevWorkout.exercises)
  //         .then((copiedExercises) => {
  //           // Create a new session for next week with copied exercises
  //           const nextWeekSession = {
  //             userId: user.uid,
  //             programId,
  //             workoutId,
  //             week: nextWeek,
  //             exercises: copiedExercises,
  //             notes: prevWorkout.notes,
  //             name: prevWorkout.name,
  //             completed: false,
  //             copySource: `${user.uid}_${programId}_${workoutId}_${week}`, // Reference to source
  //             createdAt: new Date(),
  //           };

  //           // Save the next week session
  //           saveSessionToFirestore(nextWeekSession)
  //             .then(() => {
  //               // Show success message
  //               alert(`Workout copied to week ${nextWeek}!`);

  //               // Option to navigate to the copied session
  //               if (confirm(`Do you want to go to week ${nextWeek}'s workout?`)) {
  //                 navigate(
  //                   `/CurrentSession/${programId}/${workoutId}/${nextWeek}`
  //                 );
  //               }
  //             })
  //             .catch((error) => {
  //               console.error("Error saving copied session:", error);
  //               alert("Failed to copy workout to next week");
  //             });
  //         })
  //         .catch((error) => {
  //           console.error("Error copying exercises:", error);
  //           alert("Failed to copy exercises to next week");
  //         });

  //       // Return unchanged current workout
  //       return prevWorkout;
  //     });
  //   };

  return (
    <div className="session-actions">
      <textarea
        className="session-notes"
        placeholder="Add notes for this session..." // Will display/set session notes
        onChange={handleNotesChange} // Add notes change logic here
      />
      <div className="session-action-buttons">
        <button className="btn-save" onClick={handleSaveSession}>
          Save Session
        </button>

        {/* <button
          className="btn-copy"
          onClick={() => setShowCopyOptions(!showCopyOptions)}
        >
          Copy Options ▼
        </button>

        {showCopyOptions && (
          <div className="copy-options">
            <button
              className="btn-copy-next-week"
              onClick={handleCopyToNextWeek}
            >
              Copy to Week {parseInt(week, 10) + 1}
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SessionActions;
