import React from "react";
import { shallow } from "enzyme";

import { App } from "./App";
import { Grid, Menu } from "semantic-ui-react";
import Dashboard from "./Components/Dashboard";

describe("Main Dashboard", () => {
  it("should render", () => {
    const render = shallow(<App />);
    expect(render).not.toBeNull();
    expect(render.find(Grid)).toHaveLength(1);
    expect(render.find(Dashboard)).toHaveLength(1);
  });

  describe("Sidebar", () => {
    it("should not sidebar render when logsList is null", () => {
      const render = shallow(<App />);
      expect(render.find(Menu)).toHaveLength(0);
    });
    it("should render sidebar when logsList is empty, indicating it", () => {
      const render = shallow(<App logsList={[]} />);
      expect(render.find(Menu)).toHaveLength(1);
      expect(render.find(Menu.Header)).toHaveLength(1);
      expect(
        render
          .find(Menu.Header)
          .childAt(0)
          .text()
      ).toEqual("No logs yet");
    });
    it("should render sidebar with menu.items from logsList", () => {
      const logsList = ["test_1", "test_2", "test_3"];
      const render = shallow(<App logsList={logsList} />);
      expect(render.find(Menu).children()).toHaveLength(logsList.length);
      logsList.forEach((val, index) =>
        expect(
          render
            .find(Menu)
            .childAt(index)
            .childAt(0)
            .text()
        ).toContain(val)
      );
    });
  });
});
