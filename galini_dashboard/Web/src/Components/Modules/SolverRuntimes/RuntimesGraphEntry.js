// @flow
import React from "react";
import { format } from "d3-format";
import { Popup } from "semantic-ui-react";
import moment from "moment";
import { formatDuration } from "./SolverRuntimes";

type Props = { data: Array, solver: String, timeRange: number, width: number, colour: String };

const height = "25px";

class RuntimesGraphEntry extends React.Component<Props> {
  render() {
    const { solver, color, data, timeRange, width, total } = this.props;
    const perUnitWidth = (width * 0.85) / timeRange;
    let prev = 0;
    const graph = data.map((val, index) => {
      const ren = (
        <React.Fragment key={index}>
          <div
            key={index * 2}
            style={{ height, width: `${perUnitWidth * (val.start - prev)}px`, background: "white" }}
          />
          <Popup
            trigger={
              <div
                style={{
                  height,
                  width: `${Math.max(perUnitWidth * val.duration, 1)}px`,
                  background: color,
                  borderRadius: "2px"
                }}
              />
            }
            position="top center"
            key={index * 2 + 1}
            content={`Solver started at ${moment(parseInt(val.timestamp)).format(
              "MMM Do YY HH:m:ss"
            )}, with a duration of ${formatDuration(val.duration)}`}
          />
        </React.Fragment>
      );
      prev = val.start + val.duration;
      return ren;
    });
    graph.push(
      <div key={data.length} style={{ height, width: `${perUnitWidth * (timeRange - prev)}px`, background: "white" }} />
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", width }}>
        <div
          style={{
            width: "100%",
            textAlign: "left",
            // Font taken from React-Vis for consistency
            fontSize: "11px",
            fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif"
          }}
        >
          {solver}
        </div>
        <div style={{ display: "flex", flexDirection: "row", width }}>
          {graph}
          <div style={{ height, width: width * 0.15, textAlign: "end", lineHeight: height }}>
            {format(",.2%")(total / timeRange)}
          </div>
        </div>
      </div>
    );
  }
}

export default RuntimesGraphEntry;
