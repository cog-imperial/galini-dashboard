// @flow
import React from "react";
import { connect } from "react-redux";
import { XYPlot, LineMarkSeries, XAxis, YAxis, DiscreteColorLegend } from "react-vis";
import { format } from "d3-format";
import Placeholder from "../Placeholder";

const mapStateToProps = state => ({ solverEvents: state.solverEvents, modulesHeight: state.modulesHeight });

type Props = { solverEvents: Array, modulesHeight: number };

type State = { vars: Object, yMin: number, yMax: number };

export class ObjectiveValue extends React.Component<Props, State> {
  state = { vars: {}, yMin: Infinity, yMax: -Infinity };

  constructor(props: Props) {
    super(props);
    if (props.solverEvents && props.solverEvents.length > 0) {
      this.state = this.updateStateData(props.solverEvents, 0);
    }
  }

  updateStateData = (solverEvents: Array, startIndex: number) => {
    const { vars } = this.state;
    let clone = JSON.parse(JSON.stringify(vars));
    let yMin = this.state.yMin;
    let yMax = this.state.yMax;
    for (let i = startIndex; i < solverEvents.length; i++) {
      if (solverEvents[i].updateVariable) {
        const { name, iteration, value } = solverEvents[i].updateVariable;
        yMin = Math.min(yMin, value);
        yMax = Math.max(yMax, value);
        if (!clone[name]) {
          clone[name] = [];
        }
        clone[name].push({ x: iteration || 0, y: value });
      }
    }
    return { vars: clone, yMin, yMax };
  };

  componentDidUpdate(prevProps) {
    const { solverEvents } = this.props;
    const { solverEvents: prevSolverEvents } = prevProps;
    if (prevSolverEvents.length !== solverEvents.length) {
      this.setState(this.updateStateData(solverEvents, prevSolverEvents.length));
    }
  }

  render() {
    const { vars, yMin, yMax } = this.state;
    let length = 0;
    const series = Object.keys(vars).map((val, index) => {
      length = Math.max(vars[val].length, length);
      return <LineMarkSeries key={index} data={vars[val]} />;
    });
    const yDiff = (yMax - yMin) / 2;
    const { modulesHeight } = this.props;
    const size = Math.floor(modulesHeight * 0.9); // To only use 90% of the available height
    return Object.keys(vars).length > 0 ? (
      <XYPlot yDomain={[yMin - yDiff, yMax + yDiff]} height={size} width={size}>
        <DiscreteColorLegend
          items={Object.keys(vars)}
          height={size / 2}
          width={size / 5}
          style={{ position: "absolute", top: 0, right: 0 }}
        />
        <XAxis tickTotal={length} title="Iteration" />
        <YAxis title="Objective Value" tickFormat={tick => format(".2s")(tick)} />
        {series}
      </XYPlot>
    ) : (
      <Placeholder />
    );
  }
}

export default connect(mapStateToProps)(ObjectiveValue);
