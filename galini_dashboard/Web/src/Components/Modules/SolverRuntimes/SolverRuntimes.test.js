// @flow
import React from "react";
import { shallow } from "enzyme";
import { SolverRuntimes } from "./SolverRuntimes";

const solverEventsA = [
  { solver: "a", timestamp: 0, solveStart: {} },
  { solver: "a", timestamp: 10, solveEnd: {} },
  { solver: "a", timestamp: 20, solveStart: {} },
  { solver: "a", timestamp: 25, solveEnd: {} },
  { solver: "a", timestamp: 40, solveStart: {} },
  { solver: "a", timestamp: 55, solveEnd: {} },
  { solver: "a", timestamp: 56, solveStart: {} },
  { solver: "a", timestamp: 60, solveEnd: {} }
];
const solverAExpected = {
  total: 34,
  data: [
    { start: 0, timestamp: 0, duration: 10 },
    { start: 20, timestamp: 20, duration: 5 },
    { start: 40, timestamp: 40, duration: 15 },
    { start: 56, timestamp: 56, duration: 4 }
  ]
};
const solverEventsB = [
  { solver: "b", timestamp: 3, solveStart: {} },
  { solver: "b", timestamp: 8, solveEnd: {} },
  { solver: "b", timestamp: 11, solveStart: {} },
  { solver: "b", timestamp: 28, solveEnd: {} },
  { solver: "b", timestamp: 49, solveStart: {} },
  { solver: "b", timestamp: 50, solveEnd: {} }
];
const solverBExpected = {
  total: 23,
  data: [
    { start: 3, timestamp: 3, duration: 5 },
    { start: 11, timestamp: 11, duration: 17 },
    { start: 49, timestamp: 49, duration: 1 }
  ]
};
const solverEventsC = [
  { solver: "c", timestamp: 30, solveStart: {} },
  { solver: "c", timestamp: 50, solveEnd: {} },
  { solver: "c", timestamp: 51, solveStart: {} },
  { solver: "c", timestamp: 52, solveEnd: {} },
  { solver: "c", timestamp: 53, solveStart: {} },
  { solver: "c", timestamp: 54, solveEnd: {} }
];
const solverCExpected = {
  total: 22,
  data: [
    { start: 30, timestamp: 30, duration: 20 },
    { start: 51, timestamp: 51, duration: 1 },
    { start: 53, timestamp: 53, duration: 1 }
  ]
};
const combineArrays = (arrays: Array<Array>) => {
  const arr = [].concat.apply([], arrays);
  return arr.sort((a, b) => a.timestamp - b.timestamp);
};

const combinedABC = combineArrays([solverEventsA, solverEventsB, solverEventsC]);
describe("Solver runtimes module", () => {
  it("should process data correctly", () => {
    const render = shallow(<SolverRuntimes solverEvents={combinedABC} />);
    const solvers = render.state("solvers");
    expect(solvers.a).toEqual(solverAExpected);
    expect(solvers.b).toEqual(solverBExpected);
    expect(solvers.c).toEqual(solverCExpected);
  });
  it("should start data time with respect to zero", () => {
    const render = shallow(<SolverRuntimes solverEvents={solverEventsC} />);
    const solvers = render.state("solvers");
    expect(render.state("timeRange")).toEqual(
      solverEventsC[solverEventsC.length - 1].timestamp - solverEventsC[0].timestamp
    );
    expect(solvers.c).toEqual({
      total: solverCExpected.total,
      data: solverCExpected.data.map(val => ({ ...val, start: val.start - solverEventsC[0].timestamp }))
    });
  });
});
