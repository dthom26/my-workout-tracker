import React from "react";

import { MemoryRouter } from "react-router-dom";
import PreviousWeekSummary from "../src/features/workouts/components/PreviousWeekSummary.jsx";
import { describe, expect, test } from "vitest";

const previousSession = {
  week: 3,
  notes: "Felt strong today!",
  timestamp: "2025-11-24T14:11:41.871Z",
  workoutTemplateId: "d8062c8c-70dc-4bd8-b039-e8f9053b4211",
  programId: "00Q26qAjMw5ArM1syOZA",
  userId: "q0hdPaZ3W8b00ckuJKxjXzV3aoj1",
  workoutId: "354a175b-2e69-406f-b5ea-d490fb491827",
  name: "Upper day 1",
  exercises: [
    {
      id: "51b72c98-3b13-44ec-8570-2b3bebdb0195",
      name: "Lat pulldown",
      sets: [
        { complete: true, reps: "5", weight: "170" },
        { complete: true, reps: "8", weight: "160" },
        { complete: true, reps: "7", weight: "155" },
      ],
      templateId: "Hukd0ZXekmfGnab105v7",
    },
  ],
};

describe("PreviousWeekSummary Component", () => {
  test("renders notes for previous session", () => {
    expect(previousSession.notes).toBe("Felt strong today!");
  });
  test("workoutTemplateId is correct", () => {
    expect(previousSession.workoutTemplateId).toBe(
      "d8062c8c-70dc-4bd8-b039-e8f9053b4211"
    );
  });
});
