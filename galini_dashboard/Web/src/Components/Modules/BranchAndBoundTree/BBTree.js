// @flow
import React from "react";
import Tree from "react-d3-tree";
import { Table, Button } from "semantic-ui-react";
import { format } from "d3-format";
import NodeLabel from "./NodeLabel";
import { findNode, addAttributeToNodes } from "./Utils";

type Props = {
  treeData: Array,
  treeSize: number,
  size: {
    height: number,
    width: number
  },
  addToModuleList: Object => void
};

type State = {
  selectedNode: {
    tensorMessage: Object,
    position: Array
  }
};

class BBTree extends React.Component<Props, State> {
  state = { treeData: {}, treeSize: {}, selectedNode: { tensorMessage: {}, position: [] } };

  constructor(props: Props) {
    super(props);
    let { treeData, treeSize } = this.cloneTree([0]);
    treeData = addAttributeToNodes(treeData[0], { setTensorMessage: this.setTensorMessage });
    this.state = { ...this.state, treeData, treeSize };
  }

  cloneTree = (position: Array) => {
    const { treeData } = this.props;
    const { node } = findNode(treeData, position);
    const childClone = JSON.parse(JSON.stringify(node)); // This doesn't clone function pointers correctly
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

  setTensorMessage = (tensorMessage: Object, position: Array) => {
    this.setState({ selectedNode: { tensorMessage, position } });
  };

  renderTensorMessage() {
    const {
      selectedNode: {
        tensorMessage: { lower_bounds = [], upper_bounds = [], solution = [] },
        position
      }
    } = this.state;
    const { addToModuleList, allowOpen } = this.props;
    const maxLength = Math.max(lower_bounds.length, upper_bounds.length, solution.length);
    return maxLength > 0 ? (
      <Table definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            {[...Array(maxLength).keys()].map(v => (
              <Table.HeaderCell>
                x<sub>{v}</sub>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Solutions</Table.Cell>
            {solution.map(v => (
              <Table.Cell>{format(".2")(v)}</Table.Cell>
            ))}
          </Table.Row>
          <Table.Row>
            <Table.Cell>Lower Bound</Table.Cell>
            {lower_bounds.map(v => (
              <Table.Cell>{format(".2")(v)}</Table.Cell>
            ))}
          </Table.Row>
          <Table.Row>
            <Table.Cell>Upper Bound</Table.Cell>
            {upper_bounds.map(v => (
              <Table.Cell>{format(".2")(v)}</Table.Cell>
            ))}
          </Table.Row>
        </Table.Body>
        {allowOpen ? (
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={maxLength + 1}>
                <Button
                  floated="right"
                  onClick={() => {
                    const { treeData, treeSize } = this.cloneTree(position);
                    addToModuleList(this.renderTree(treeData, treeSize));
                  }}
                >
                  Open as root
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        ) : null}
      </Table>
    ) : null;
  }

  renderTree = (treeData: Array, treeSize: number) => {
    const { width, height, addToModuleList } = this.props;
    return (
      <BBTree
        width={width}
        height={height}
        treeData={treeData}
        treeSize={treeSize}
        addToModuleList={addToModuleList}
        allowOpen={false}
      />
    );
  };

  render() {
    const { width, height } = this.props;
    const { treeData, treeSize } = this.state;
    return (
      <div style={{ width, height, margin: "-1rem" }}>
        <div style={{ position: "absolute", top: 2, left: 2 }}>{this.renderTensorMessage()}</div>
        <Tree
          data={treeData}
          orientation="vertical"
          collapsible
          separation={{ siblings: 1, nonSiblings: 1 }}
          allowForeignObjects
          nodeLabelComponent={{ render: <NodeLabel />, foreignObjectWrapper: { y: -20, x: 15 } }}
          // Reduce lag for big tree
          transitionDuration={treeSize > 100 ? 0 : 500}
        />
      </div>
    );
  }
}

export default BBTree;
