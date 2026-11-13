import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  volume,
  totalVolume,
  rm,
  prHistory,
  exerciseHistory,
  goalProgress,
  achieved,
  stateSchema,
  trainingCSV,
  dateKey,
  bodySchema,
} from "../lib/model.ts";
const set = (weight, reps) => ({ weight, reps, rpe: null });
const workout = (id, date, sets) => ({
  id,
  date,
  name: "测试训练",
  note: "",
  entries: [{ exerciseId: "exercise-0-0", sets }],
});
test("mixed set weights, volume and single-rep 1RM use actual values", () => {
  const w = workout("a", "2026-01-01", [
    set(40, 8),
    set(45, 6),
    set(50, 5),
    set(50, 5),
    set(50, 5),
  ]);
  assert.equal(totalVolume(w), 1340);
  assert.equal(rm(set(100, 1)), 100);
  assert.equal(Math.round(rm(set(50, 5)) * 10) / 10, 58.3);
});
test("PR history is chronological and recalculates when editing or deleting", () => {
  const state = initialState();
  state.workouts = [
    workout("b", "2026-01-03", [set(50, 5)]),
    workout("a", "2026-01-01", [set(40, 8)]),
  ];
  const weight = prHistory(state).filter((p) => p.type === "weight");
  assert.deepEqual(
    weight.map((p) => p.value),
    [50, 40],
  );
  assert.equal(weight[0].initial, false);
  assert.equal(weight[1].initial, true);
  state.workouts = state.workouts.filter((w) => w.id !== "b");
  assert.deepEqual(
    prHistory(state)
      .filter((p) => p.type === "weight")
      .map((p) => p.value),
    [40],
  );
});
test("5x5 goal requires 5 qualifying sets within a single workout", () => {
  const state = initialState();
  const goal = {
    id: "goal",
    name: "60kg 5x5",
    type: "weight",
    exerciseId: "exercise-0-0",
    target: 60,
    sets: 5,
    reps: 5,
  };
  state.workouts = [
    workout(
      "a",
      "2026-01-01",
      Array.from({ length: 4 }, () => set(60, 5)),
    ),
    workout("b", "2026-01-02", [set(60, 5)]),
  ];
  assert.equal(goalProgress(state, goal), 0);
  assert.equal(achieved(state, goal), false);
  state.workouts.push(
    workout("c", "2026-01-03", [
      set(62.5, 5),
      set(60, 5),
      set(60, 5),
      set(60, 5),
      set(60, 5),
    ]),
  );
  assert.equal(goalProgress(state, goal), 60);
  assert.equal(achieved(state, goal), true);
});
test("backup rejects invalid dates, broken references, duplicate IDs and invalid values", () => {
  const state = initialState();
  assert.equal(stateSchema.safeParse(state).success, true);
  state.workouts = [workout("a", "2026-01-01", [set(-5, 5)])];
  assert.equal(stateSchema.safeParse(state).success, false);
  state.workouts = [workout("a", "2026-02-31", [set(50, 5)])];
  assert.equal(stateSchema.safeParse(state).success, false);
  state.workouts = [workout("a", "2026-01-01", [set(50, 5)])];
  state.workouts[0].entries[0].exerciseId = "missing";
  assert.equal(stateSchema.safeParse(state).success, false);
  state.workouts = [];
  state.exercises.push({ ...state.exercises[0] });
  assert.equal(stateSchema.safeParse(state).success, false);
});
test("CSV exports all sets, quotes and formula-like names safely", () => {
  const state = initialState();
  state.workouts = [
    {
      ...workout("a", "2026-01-01", [set(50, 5), set(45, 6)]),
      name: "=SUM(A1)",
      note: '包含,"引号"',
    },
  ];
  const csv = trainingCSV(state);
  assert.equal(csv.split("\r\n").length, 3);
  assert.ok(csv.includes("'=SUM(A1)"));
  assert.ok(csv.includes('"包含,""引号"""'));
});
test("body metrics require at least one value and use Shanghai date", () => {
  const b = {
    id: "x",
    date: "2026-01-01",
    weight: null,
    fat: null,
    chest: null,
    waist: null,
    arm: null,
    shoulder: null,
    thigh: null,
  };
  assert.equal(bodySchema.safeParse(b).success, false);
  assert.equal(bodySchema.safeParse({ ...b, weight: 75 }).success, true);
  assert.equal(dateKey(new Date("2026-11-11T16:30:00Z")), "2026-11-12");
});
test("same-day training retains input order, not random UUID order", () => {
  const state = initialState();
  state.workouts = [
    workout("z", "2026-01-01", [set(40, 8)]),
    workout("a", "2026-01-01", [set(50, 5)]),
  ];
  assert.deepEqual(
    exerciseHistory(state, "exercise-0-0").map((h) => h.weight),
    [40, 50],
  );
  assert.equal(
    prHistory(state).filter((p) => p.type === "weight" && !p.initial).length,
    1,
  );
});
