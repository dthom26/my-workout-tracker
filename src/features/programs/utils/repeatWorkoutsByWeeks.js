import { v4 as uuidv4 } from "uuid";
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
        id: uuidv4(),
        templateId: workout.templateId, // Keep same templateId to link them
      });
    }
  }
  return repeatedWorkouts;
}
