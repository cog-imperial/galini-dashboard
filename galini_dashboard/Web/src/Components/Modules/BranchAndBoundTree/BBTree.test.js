// @flow
import React from "react";
import { shallow } from "enzyme";
import BBTree from "./BBTree";
import { Item } from "semantic-ui-react";
import Tree from "react-d3-tree";

describe("BBTree", () => {
  describe("zoom test", () => {
    it("should be zoomed in my default", () => {
      const render = shallow(
        <BBTree
          width={100}
          height={100}
          treeSize={10}
          treeData={[{ name: "root", children: [], attributes: { lowerBound: "1", upperBound: "2", position: [0] } }]}
        />
      );
      expect(render.state("zoomedOut")).toBe(false);
      expect(render.find(Tree)).toHaveLength(1);
      expect(render.find(Tree).prop("separation")).toEqual({ siblings: 1, nonSiblings: 1 });
    });
    it("should have a smaller separation when zoomed in", () => {
      const render = shallow(
        <BBTree
          width={100}
          height={100}
          treeSize={10}
          treeData={[{ name: "root", children: [], attributes: { lowerBound: "1", upperBound: "2", position: [0] } }]}
        />
      );
      render.setState({ zoomedOut: true });
      expect(render.find(Tree)).toHaveLength(1);
      expect(render.find(Tree).prop("separation")).toEqual({ siblings: 0.5, nonSiblings: 0.7 });
    });
  });
});
