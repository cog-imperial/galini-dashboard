// @flow
import React from "react";
import { formatName } from "./Utils";
import _ from "underscore";

type Props = { nodeData: Object, hidden: boolean };

type State = { selected: boolean };

class NodeLabel extends React.Component<Props, State> {
  state = { selected: false };

  render() {
    const { nodeData, hidden, selectedNode } = this.props;
    const { selected } = this.state;
    const {
      name,
      attributes: {
        upperBound,
        lowerBound,
        pruned,
        lower_bounds,
        solution,
        upper_bounds,
        setTensorMessage,
        position,
        symmetryGroup
      }
    } = nodeData;
    const defaultBackground = symmetryGroup ? symmetryGroup.color : "white";
    if (hidden) {
      return symmetryGroup ? (
        <div style={{ width: "35px", height: "35px", backgroundColor: symmetryGroup.color, borderRadius: "5px" }} />
      ) : (
        <div />
      );
    }
    const obj = formatName({ variableName: "z", lowerBound, upperBound });
    return (
      <div
        onClick={e => {
          setTensorMessage({ lower_bounds, upper_bounds, solution, name }, position, symmetryGroup);
          e.stopPropagation();
        }}
        onMouseOver={() => this.setState({ selected: true })}
        onMouseLeave={() => this.setState({ selected: false })}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textDecoration: pruned ? "line-through" : "initial",
          backgroundColor: selected ? "rgb(220,220,220)" : defaultBackground,
          borderRadius: "2px",
          padding: 5,
          borderStyle: _.isEqual(selectedNode, position) ? "dashed" : "none"
        }}
      >
        <h3 style={{ marginBottom: 0, display: "inline-block" }}>{name}</h3>
        <div style={{ height: "1rem", lineHeight: "1rem", fontStyle: "italic", display: "inline-block" }}>{obj}</div>
      </div>
    );
  }
}

export default NodeLabel;
