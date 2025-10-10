export function repeatWorkoutsByWeeks(originalWorkouts, duration) {
  const weeks =
    Number.isInteger(duration) && duration > 0
      ? duration
      : parseInt(duration, 10) > 0
      ? parseInt(duration, 10)
      : 1;
  const repeatedWorkouts = [];
  for (let week = 1; week <= weeks; week++) {
    for (const workout of originalWorkouts) {
      repeatedWorkouts.push({
        ...workout,
        week,
        id: `${workout.id || ""}-week${week}`, // ensures unique id per week
      });
    }
  }
  return repeatedWorkouts;
}
