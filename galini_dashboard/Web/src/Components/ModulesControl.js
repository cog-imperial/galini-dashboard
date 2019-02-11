// @flow
import React from "react";
import { Dropdown, Button, Segment } from "semantic-ui-react";
import ObjectiveValue from "./Modules/ObjectiveValue/ObjectiveValue";
import SolverRuntimes from "./Modules/SolverRuntimes/SolverRuntimes";

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
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", overflow: "auto" }}>
          {modules.map((val, index) => (
            <div style={{ padding: "10px", height: "100%" }} key={index}>
              <Segment style={{ height: "100%" }}>{val}</Segment>
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
    case 2:
      return <SolverRuntimes />;
    default:
      return null;
  }
};

const ModulesMap = [
  { key: 1, text: "Objective Value over Time", value: 1 },
  { key: 2, text: "Solver runtimes", value: 2 }
];

export default ModulesControl;
