// @flow
import React from "react";
import { connect } from "react-redux";
import Placeholder from "../Placeholder";
import BBTree from "./BBTree";
import { format } from "d3-format";
import { addNodeToTree, pruneNode, addTensorMessage, findNode } from "./Utils";
import _ from "underscore";
import randomColor from "randomcolor";

const mapStateToProps = state => ({
  solverEvents: state.solverEvents,
  modulesHeight: state.modulesHeight,
  symmetry: state.symmetry
});

type Props = { solverEvents: Array, modulesHeight: number, addToModuleList: (component: Object) => void };

type State = { treeData: Array, treeSize: number };

export class BranchAndBoundTree extends React.Component<Props, State> {
  state = { treeData: [], treeSize: 0, selectedNode: { tensorMessage: {} } };

  constructor(props: Props) {
    super(props);
    if (props.solverEvents && props.solverEvents.length > 0) {
      this.state = this.updateStateData(props.solverEvents, 0);
      const { symmetry } = props;
      const { treeData } = this.state;
      symmetry &&
        symmetry.forEach((group, index) => {
          const color = randomColor({ seed: _.random(0, 1000), alpha: 0.5, luminosity: "bright", format: "rgba" });
          group.forEach(x => {
            const { node: src } = findNode(treeData, x.src.split("_"));
            const { node: dst } = findNode(treeData, x.dst.split("_"));
            src.attributes.symmetryGroup = { color, group: index };
            dst.attributes.symmetryGroup = { color, group: index };
          });
        });
    }
  }

  updateStateData = (solverEvents: Array, startIndex: number) => {
    const { treeData, treeSize } = this.state;
    const treeClone = _.clone(treeData);
    let acc = treeSize;
    for (let i = startIndex; i < solverEvents.length; i++) {
      const curr = solverEvents[i];
      if (curr.addBabNode) {
        const { coordinate, lowerBound, upperBound, variablesInformation } = curr.addBabNode;
        addNodeToTree(treeClone, coordinate, variablesInformation, {
          upperBound: format(".2")(upperBound),
          lowerBound: format(".2")(lowerBound)
        });
        acc++;
      } else if (curr.pruneBabNode) {
        const { coordinate } = curr.pruneBabNode;
        pruneNode(treeClone, coordinate);
      } else if (curr.tensor && curr.hdf5 && treeClone.length > 0) {
        const {
          hdf5,
          tensor: { dataset, group }
        } = curr;
        const coordinate = group
          .split("/")
          .slice(-1)[0]
          .split("_");
        addTensorMessage(treeClone, coordinate, dataset, hdf5);
      }
    }
    return { ...this.state, treeData: treeClone, treeSize: acc };
  };

  componentDidUpdate(prevProps) {
    const { solverEvents } = this.props;
    const { solverEvents: prevSolverEvents } = prevProps;
    if (prevSolverEvents.length !== solverEvents.length) {
      this.setState(this.updateStateData(solverEvents, prevSolverEvents.length));
    }
  }

  renderTree = (treeData: Array, treeSize: number) => {
    const { modulesHeight, addToModuleList, symmetry } = this.props;
    return (
      /* Magic Number: 20 is used to fill height to segment - TODO: Replace with proper CSS */
      <BBTree
        width={modulesHeight * 1.3}
        height={modulesHeight - 20}
        treeData={treeData}
        treeSize={treeSize}
        addToModuleList={addToModuleList}
        allowOpen
        symmetry={symmetry}
      />
    );
  };

  render() {
    const { treeData, treeSize } = this.state;
    return treeSize > 0 ? this.renderTree(treeData, treeSize) : <Placeholder />;
  }
}

export default connect(mapStateToProps)(BranchAndBoundTree);
