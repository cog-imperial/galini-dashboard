// @flow
import React from "react";
import Tree from "react-d3-tree";
import { Table, Button, Icon } from "semantic-ui-react";
import { format } from "d3-format";
import NodeLabel from "./NodeLabel";
import { findNode, addAttributeToNodes } from "./Utils";
import _ from "underscore";
import SymmetryVis from "./SymmetryVis";
import randomColor from "randomcolor";


type Props = {
  treeData: Array,
  treeSize: number,
  size: {
    height: number,
    width: number
  },
  addToModuleList: Object => void,
  symmetry: Array
};

type State = {
  processedTreeData: Object,
  selectedNode: {
    tensorMessage: Object,
    position: Array
  },
  zoomedOut: boolean
};

class BBTree extends React.Component<Props, State> {
  state = {
    processedTreeData: {},
    selectedNode: { tensorMessage: {}, position: [] },
    zoomedOut: false
  };

  constructor(props: Props) {
    super(props);
    const { treeData } = this.cloneTree([0], props.treeData);
    const processedTreeData = addAttributeToNodes(treeData[0], {
      setTensorMessage: this.setTensorMessage
    });
    this.state = { ...this.state, processedTreeData };
  }

  cloneTree = (position: Array, data: Object) => {
    const { processedTreeData } = this.state;
    const treeData = data || [processedTreeData];
    const { node } = findNode(treeData, position);
    const childClone = _.clone(node);
    return { treeData: [childClone], treeSize: this.countNodes(childClone) };
  };

  countNodes = (node: Array) => {
    let count = node ? 1 : 0;
    if (node && node.children) {
      node.children.forEach(v => {
        count += this.countNodes(v);
      });
    }
    return count;
  };

  setTensorMessage = (tensorMessage: Object = {}, position: Array = [], symmetryGroup: Ojbect) => {
    this.setState({ selectedNode: { tensorMessage, position, symmetryGroup } });
  };

  updateTreeState = (e: Object) => {
    const { zoom } = e;
    const { zoomedOut } = this.state;
    if (zoom < 1) {
      if (zoomedOut && zoom > 0.5) {
        this.setState({ zoomedOut: false });
      } else if (!zoomedOut && zoom < 0.5) {
        this.setState({ zoomedOut: true });
      }
    }
  };

  renderTensorMessage() {
    const {
      selectedNode: {
        tensorMessage: { lower_bounds = [], upper_bounds = [], solution = [] },
        position,
        symmetryGroup
      }
    } = this.state;
    const { addToModuleList, allowOpen } = this.props;
    const maxLength = Math.max(lower_bounds.length, upper_bounds.length, solution.length);
    return maxLength > 0 ? (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Button
                icon
                color="red"
                onClick={() => {
                  this.setTensorMessage();
                }}
              >
                <Icon fitted name="close" />
              </Button>
            </Table.HeaderCell>
            {[...Array(maxLength).keys()].map((v, i) => (
              <Table.HeaderCell key={i}>
                x<sub>{v}</sub>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Solutions</Table.Cell>
            {solution.map((v, i) => (
              <Table.Cell key={i}>{format(".2")(v)}</Table.Cell>
            ))}
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lower Bound</Table.Cell>
            {lower_bounds.map((v, i) => (
              <Table.Cell key={i}>{format(".2")(v)}</Table.Cell>
            ))}
          </Table.Row>
          <Table.Row>
            <Table.Cell>Upper Bound</Table.Cell>
            {upper_bounds.map((v, i) => (
              <Table.Cell key={i}>{format(".2")(v)}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
        {allowOpen || symmetryGroup ? (
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={maxLength + 1}>
                {symmetryGroup ? (
                  <React.Fragment>
                    <Button
                      content="Show Symmetry"
                      icon="idea"
                      labelPosition="left"
                      onClick={() => addToModuleList(this.renderSymmetryVis(symmetryGroup))}
                    />
                    <h4 style={{ display: "inline-block", margin: 0 }}>{`Position: ${position.join("_")}`}</h4>
                  </React.Fragment>
                ) : null}
                {allowOpen ? (
                  <Button
                    floated="right"
                    onClick={() => {
                      const { treeData, treeSize } = this.cloneTree(position);
                      addToModuleList(this.renderTree(treeData, treeSize, position.length - 1));
                    }}
                    content="Open as root"
                    icon="right arrow"
                    labelPosition="right"
                  />
                ) : null}
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        ) : null}
      </Table>
    ) : null;
  }

  renderSymmetryVis = (symmetryGroup: Object) => {
    const { height, symmetry, depth } = this.props;
    const { processedTreeData } = this.state;
    return (
      <SymmetryVis
        height={height}
        treeData={processedTreeData}
        symmetryData={symmetry[symmetryGroup.group]}
        color={symmetryGroup.color}
        depth={depth || 0}
      />
    );
  };

  renderTree = (treeData: Array, treeSize: number, depth: number = 0) => {
    const { width, height, addToModuleList, symmetry } = this.props;
    return (
      <BBTree
        width={width}
        height={height}
        treeData={treeData}
        treeSize={treeSize}
        addToModuleList={addToModuleList}
        allowOpen={false}
        symmetry={symmetry}
        depth={depth}
      />
    );
  };

  render() {
    const { width, height, treeSize } = this.props;
    const { zoomedOut, processedTreeData, selectedNode } = this.state;
    const labelProps = zoomedOut
      ? {
          // Reduce separation to bring the nodes closer, and hide label
          separation: { siblings: 0.5, nonSiblings: 0.7 },
          nodeLabelComponent: { render: <NodeLabel hidden />, foreignObjectWrapper: { y: -17.5, x: -17.5 } }
        }
      : {
          separation: { siblings: 1, nonSiblings: 1 },
          nodeLabelComponent: {
            render: <NodeLabel selectedNode={selectedNode && selectedNode.position} />,
            foreignObjectWrapper: { y: -30, x: 15 }
          }
        };
    return (
      <div style={{ width, height, margin: "-1rem" }}>
        <div style={{ position: "absolute", top: 2, left: 2 }}>{this.renderTensorMessage()}</div>
        <Tree
          {...labelProps}
          allowForeignObjects
          data={processedTreeData}
          orientation="vertical"
          collapsible
          // Reduce lag for big tree
          transitionDuration={treeSize > 100 ? 0 : 500}
          onUpdate={e => this.updateTreeState(e)}
        />
      </div>
    );
  }
}

export default BBTree;
