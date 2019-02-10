// @flow
import React from "react";
import { shallow } from "enzyme";
import { ObjectiveValue } from "./ObjectiveValue";
import { Segment } from "semantic-ui-react";
import { XYPlot } from "react-vis";

describe("Objective value over time modules", () => {
  it("should render placeholder message if no suitable logs", () => {
    const render = shallow(<ObjectiveValue />);
    expect(render.find(Segment));
  });
  const testData = [{ updateVariable: { name: "test", iteration: 0, value: 10 } }];
  it("should render XYPlot given working data", () => {
    const render = shallow(<ObjectiveValue solverEvents={testData} />);
    expect(render.find(XYPlot)).toHaveLength(1);
    expect(render.state(["vars"]).test).toHaveLength(1);
  });
  describe("data", () => {
    const largeDataset = [
      { updateVariable: { name: "test", iteration: 0, value: -1000 } },
      { updateVariable: { name: "test", iteration: 1, value: 5000 } },
      { updateVariable: { name: "test", iteration: 2, value: 39 } },
      { updateVariable: { name: "test", iteration: 3, value: 141 } },
      { updateVariable: { name: "test", iteration: 4, value: 5912 } },
      { updateVariable: { name: "test", iteration: 5, value: 100000 } },
      { updateVariable: { name: "test", iteration: 6, value: 0 } },
      { updateVariable: { name: "test", iteration: 7, value: 999999 } }
    ];
    const render = shallow(<ObjectiveValue solverEvents={largeDataset} />);
    it("should set yMin/Max correctly", () => {
      expect(render.state(["yMin"])).toEqual(-1000);
      expect(render.state(["yMax"])).toEqual(999999);
    });
    it("should set vars correctly", () => {
      const expectedVars = {
        test: [
          { x: 0, y: -1000 },
          { x: 1, y: 5000 },
          { x: 2, y: 39 },
          { x: 3, y: 141 },
          { x: 4, y: 5912 },
          { x: 5, y: 100000 },
          { x: 6, y: 0 },
          { x: 7, y: 999999 }
        ]
      };
      expect(render.state(["vars"])).toEqual(expectedVars);
    });
  });
});
