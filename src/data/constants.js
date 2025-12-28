// Firestore Collection Names
export const COLLECTIONS = {
  PROGRAMS: "programs",
  SESSIONS: "sessions",
  USERS: "users",
  EXERCISE_TEMPLATES: "exerciseTemplates",
};

// felid names for collection documents
export const FIELDS = {
  USER_ID: "userId",
  WEEK: "week",
  CREATED_BY: "createdBy",
  WORKOUTS: "workouts",
  EXERCISES: "exercises",
  NAME: "name",
  WORKOUT_ID: "workoutId",
};

// Route Paths
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/Dashboard",
  CREATE_PROGRAM: "/CreateProgram",
  LIST_OF_USERS_PROGRAMS: "/ListOfUsersPrograms",
  EXECUTE_PROGRAM: "/ExecuteProgram/:programId",
  CURRENT_SESSION: "/CurrentSession/:programId/:workoutId",
};
