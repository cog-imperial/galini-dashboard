// @flow
import React from "react";

type Props = { data: Array, solver: String, timeRange: number, width: number, colour: String };

const height = "25px";

class RuntimesGraphEntry extends React.Component<Props> {
  renderGraph() {
    const { data, timeRange, width, color } = this.props;
    let prev = 0;
    const res = [];
    const perUnitWidth = width / timeRange;
    for (let i = 0; i < data.length; i += 2) {
      if (prev !== data[i].time) {
        const diff = data[i].time - prev;
        res.push(<div style={{ height, width: `${perUnitWidth * diff}px`, background: "white" }} />);
      }
      const diff = data[i + 1].time - data[i].time;
      res.push(<div style={{ height, width: `${perUnitWidth * diff}px`, background: color, borderRadius: "2px" }} />);
      prev = data[i + 1].time;
    }
    res.push(<div style={{ height, width: `${perUnitWidth * (timeRange - prev)}px`, background: "white" }} />);
    return res;
  }

  render() {
    const { data, solver, timeRange, width, color } = this.props;
    const graph = this.renderGraph();
    return <div style={{ display: "flex", flexDirection: "row", width: `${width}px` }}>{graph}</div>;
  }
}

export default RuntimesGraphEntry;
