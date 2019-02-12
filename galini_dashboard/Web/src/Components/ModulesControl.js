// @flow
import React from "react";
import { Dropdown, Button, Segment, Icon } from "semantic-ui-react";
import ObjectiveValue from "./Modules/ObjectiveValue/ObjectiveValue";
import SolverRuntimes from "./Modules/SolverRuntimes/SolverRuntimes";

type State = { modules: Array<React.Component>, hideButton: boolean };

type Props = { selected: string };

class ModulesControl extends React.Component<Props, State> {
  state = { modules: [], hideButton: true };

  componentDidUpdate(prevProps) {
    if (prevProps.selected !== this.props.selected) {
      this.setState({ modules: [] });
    }
  }

  render() {
    const { modules, hideButton } = this.state;
    return (
      <React.Fragment>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "row", overflow: "auto" }}>
          {modules.map((val, index) => (
            <div style={{ padding: "10px", height: "100%" }} key={index}>
              <Segment style={{ height: "100%", position: "relative" }}>
                <Icon
                  name="close"
                  onClick={() => {
                    modules.splice(index, 1);
                    this.setState({ modules });
                  }}
                  style={{ position: "absolute", top: 0, right: 0, margin: 0, zIndex: 10, cursor: "pointer" }}
                />
                {val}
              </Segment>
            </div>
          ))}
        </div>
        <Button.Group
          positive
          onMouseOver={() => {
            this.setState({ hideButton: false });
          }}
          onMouseLeave={() => {
            this.setState({ hideButton: true });
          }}
          style={{ opacity: hideButton ? "0.5" : "1" }}
        >
          <Dropdown
            icon="plus"
            floating
            button
            direction="left"
            className="icon"
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <Dropdown.Menu>
              {ModulesMap.map(val => (
                <Dropdown.Item
                  key={val.key}
                  value={val.value}
                  text={val.text}
                  selected={false}
                  active={false}
                  onClick={() => {
                    this.setState({ modules: [...modules, renderModule(val.value)] });
                  }}
                />
              ))}
            </Dropdown.Menu>
          </Dropdown>
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
<<<<<<< HEAD
  { key: 2, text: "Solver Runtimes", value: 2 }
=======
  { key: 2, text: "Solver runtimes", value: 2 }
>>>>>>> f73ff2c8629de0eb44d3220c63d3ec80929083ee
];

export default ModulesControl;
