// @flow
import React from "react";
import { shallow } from "enzyme";
import ModulesControl from "./ModulesControl";
import { Dropdown } from "semantic-ui-react";

describe("Controller", () => {
  it("should render", () => {
    const render = shallow(<ModulesControl />);
    expect(render.find(Dropdown)).toHaveLength(1);
  });
});
