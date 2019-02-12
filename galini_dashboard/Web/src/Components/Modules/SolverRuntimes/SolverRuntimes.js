// @flow
import React from "react";
import { connect } from "react-redux";
import RuntimesGraphEntry from "./RuntimesGraphEntry";
import Placeholder from "../Placeholder";
import { DISCRETE_COLOR_RANGE } from "react-vis/dist/theme";
import moment from "moment";

const mapStateToProps = state => ({ solverEvents: state.solverEvents });

export const formatDuration = (ms: number) => {
  const duration = moment.utc(ms);
  if (ms < 1000) {
    return `${ms} ms`;
  } else {
    return ms > 10000 ? duration.format("m[m] s[s]") : duration.format("s.SSS[s]");
  }
};

const TotalWidthPx = 500;

type Props = { solverEvents: Array, modulesHeight: number };

type State = {};

export class SolverRuntimes extends React.Component<Props, State> {
  state = { solvers: {}, timeStart: 0, timeRange: 0 };

  constructor(props: Props) {
    super(props);
    if (props.solverEvents && props.solverEvents.length > 0) {
      this.state = this.updateStateData(props.solverEvents, 0);
    }
  }

  updateStateData = (solverEvents: Array, startIndex: number) => {
    const { solvers, timeStart: ts } = this.state;
    let clone = JSON.parse(JSON.stringify(solvers));
    const timeStart = startIndex === 0 ? parseInt(solverEvents[0].timestamp) : ts;
    for (let i = startIndex; i < solverEvents.length; i++) {
      if (solverEvents[i].solveStart || solverEvents[i].solveEnd) {
        const { timestamp, solver } = solverEvents[i];
        const realTime = timestamp - timeStart;
        if (!clone[solver]) {
          clone[solver] = { total: 0, data: [{ start: realTime, timestamp }] };
        } else {
          const { data } = clone[solver];
          const length = data.length;
          const { start, duration } = data[length - 1];
          if (duration) {
            data.push({ start: realTime, timestamp });
          } else {
            const duration = realTime - start;
            data[length - 1] = { ...data[length - 1], duration };
            clone[solver].total += duration;
          }
        }
      }
    }
    const timeRange = solverEvents[solverEvents.length - 1].timestamp - timeStart;
    return { solvers: clone, timeStart, timeRange };
  };

  componentDidUpdate(prevProps) {
    const { solverEvents } = this.props;
    const { solverEvents: prevSolverEvents } = prevProps;
    if (prevSolverEvents.length !== solverEvents.length) {
      this.setState(this.updateStateData(solverEvents, prevSolverEvents.length));
    }
  }

  renderAxis() {
    const { timeRange } = this.state;
    return (
      <div style={{ width: TotalWidthPx, height: "20px", display: "flex", flexDirection: "column", paddingTop: "5px" }}>
        <svg width="85%" height="2px">
          <line x1={0} y1={0} x2={TotalWidthPx * 0.85} y2={0} style={{ stroke: "black", strokeWidth: "2px" }} />
        </svg>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            // Font taken from React-Vis for consistency
            fontSize: "11px",
            fontFamily: "Lato,'Helvetica Neue',Arial,Helvetica,sans-serif"
          }}
        >
          <div
            style={{
              width: "85%",

              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <span>0</span>
            <span>Time Elapsed</span>
            <span>{formatDuration(timeRange)}</span>
          </div>
          {<div style={{ width: "15%", textAlign: "end" }}>Run time</div>}
        </div>
      </div>
    );
  }

  render() {
    const { solvers, timeRange } = this.state;
    const graphRows = Object.keys(solvers)
      .sort((a, b) => solvers[b].total - solvers[a].total)
      .map((val, index) => (
        <RuntimesGraphEntry
          key={index}
          solver={val}
          data={solvers[val].data}
          total={solvers[val].total}
          timeRange={timeRange}
          width={TotalWidthPx}
          color={DISCRETE_COLOR_RANGE[index]}
        />
      ));
    return graphRows.length > 0 ? (
      <div style={{ width: TotalWidthPx, height: "100%", display: "flex", flexDirection: "column-reverse" }}>
        {this.renderAxis()}
        {graphRows}
      </div>
    ) : (
      <Placeholder />
    );
  }
}

export default connect(mapStateToProps)(SolverRuntimes);
