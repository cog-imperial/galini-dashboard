// @flow
import React from "react";
import { Dropdown, Button } from "semantic-ui-react";
import ObjectiveValue from "./Modules/ObjectiveValue";

type State = { modules: Array<React.Component> };

type Props = { selected: string };

class ModulesControl extends React.Component<Props, State> {
  state = { modules: [] };

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.setState({ modules: [] });
    }
  }

  render() {
    const { modules } = this.state;
    return (
      <React.Fragment>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
          {modules.map((val, index) => (
            <div style={{ padding: "10px", height: "100%" }} key={index}>
              {val}
            </div>
          ))}
        </div>
        <Button.Group positive>
          <Dropdown
            text="Add modules"
            icon="plus"
            floating
            button
            labeled
            direction="left"
            className="icon"
            options={ModulesMap}
            style={{ position: "absolute", top: 10, right: 10 }}
            onChange={(event, { value }) => {
              this.setState({ modules: [...modules, renderModule(value)] });
            }}
          />
        </Button.Group>
      </React.Fragment>
    );
  }
}

const renderModule = (key: number) => {
  switch (key) {
    case 1:
      return <ObjectiveValue />;
    //case 2: return <BranchingTree/>
    default:
      return null;
  }
};

const ModulesMap = [
  { key: 1, text: "Objective Value over Time", value: 1 },
  { key: 2, text: "Branch and Bound Tree", value: 2 }
];

export default ModulesControl;
