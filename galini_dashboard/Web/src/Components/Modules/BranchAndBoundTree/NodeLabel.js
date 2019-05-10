// @flow
import React from "react";
import { formatName } from "./Utils";

type Props = { nodeData: Object, hidden: boolean };

type State = { selected: boolean };

class NodeLabel extends React.Component<Props, State> {
  state = { selected: false };

  render() {
    const { nodeData, hidden } = this.props;
    if (hidden) {
      return <div width={0} height={0} />;
    }
    const { selected } = this.state;
    const {
      name,
      attributes: { upperBound, lowerBound, pruned, lower_bounds, solution, upper_bounds, setTensorMessage, position }
    } = nodeData;
    const obj = formatName({ variableName: "z", lowerBound, upperBound });
    return (
      <div
        onMouseEnter={() => {
          setTensorMessage({ lower_bounds, upper_bounds, solution, name }, position);
          this.setState({ selected: true });
        }}
        onMouseLeave={() => this.setState({ selected: false })}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textDecoration: pruned ? "line-through" : "initial",
          backgroundColor: selected ? "rgba(220,220,220,1)" : "rgba(0,0,0,0)",
          borderRadius: "2px",
          padding: 5
        }}
      >
        <h3 style={{ marginBottom: 0 }}>{name}</h3>
        <div style={{ height: "1rem", lineHeight: "1rem", fontStyle: "italic" }}>{obj}</div>
      </div>
    );
  }
}

export default NodeLabel;
