// @flow
import React from "react";
import { connect } from "react-redux";
import RuntimesGraphEntry from "./RuntimesGraphEntry";

const mapStateToProps = state => ({ solverEvents: state.solverEvents, modulesHeight: state.modulesHeight });
const Colours = ["Red", "Blue", "Green", "Yellow"];

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
        const isStart = !!solverEvents[i].solveStart;
        if (!clone[solver]) {
          clone[solver] = [];
        }
        clone[solver].push({ time: timestamp - timeStart, isStart });
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

  render() {
    const { solvers, timeRange } = this.state;
    const { modulesHeight } = this.props;
    const graphRows = Object.keys(solvers).map((val, index) => (
      <RuntimesGraphEntry
        key={index}
        data={solvers[val]}
        timeRange={timeRange}
        width={Math.floor(modulesHeight * 0.9)}
        color={Colours[index]}
      />
    ));
    return <div style={{ width: `${modulesHeight}px` }}>{graphRows}</div>;
  }
}

export default connect(mapStateToProps)(SolverRuntimes);
