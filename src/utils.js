const log = [
  {
    id: 1001,
    date: "2023-05-15",
    exercises: [
      {
        id: 1,
        name: "Bench Press",
        sets: [
          { id: 101, weight: 135, reps: 10, rpe: 6 }, // Exercise 1, Set 1 → 101
          { id: 102, weight: 155, reps: 8, rpe: 7 }, // Exercise 1, Set 2 → 102
          { id: 103, weight: 175, reps: 6, rpe: 8.5 },
        ],
        date: "2023-05-15",
        notes: "Felt strong today, good bar path",
      },
      {
        id: 6,
        name: "Dumbbell Rows",
        sets: [
          { id: 601, weight: 50, reps: 12, rpe: 6, arm: "left" }, // Exercise 6, Set 1 → 601
          { id: 602, weight: 50, reps: 12, rpe: 6, arm: "right" },
          { id: 603, weight: 60, reps: 10, rpe: 7, arm: "left" },
          { id: 604, weight: 60, reps: 10, rpe: 7, arm: "right" },
        ],
        date: "2023-05-15",
      },
    ],
  },
  {
    id: 1002,
    date: "2023-05-16",
    exercises: [
      {
        id: 1,
        name: "Squats",
        sets: [
          { id: 101, weight: 135, reps: 10, rpe: 6 }, // Exercise 1, Set 1 → 101
          { id: 102, weight: 155, reps: 8, rpe: 7 }, // Exercise 1, Set 2 → 102
          { id: 103, weight: 175, reps: 6, rpe: 8.5 },
        ],
        date: "2023-05-16",
        notes: "Felt strong today, good bar path",
      },
      {
        id: 6,
        name: "Dumbbell Curls",
        sets: [
          { id: 601, weight: 10, reps: 12, rpe: 6, arm: "left" }, // Exercise 6, Set 1 → 601
          { id: 602, weight: 10, reps: 12, rpe: 6, arm: "right" },
          { id: 603, weight: 15, reps: 10, rpe: 7, arm: "left" },
          { id: 604, weight: 20, reps: 10, rpe: 7, arm: "right" },
        ],
        date: "2023-05-16",
      },
    ],
  },
];
export default log;
