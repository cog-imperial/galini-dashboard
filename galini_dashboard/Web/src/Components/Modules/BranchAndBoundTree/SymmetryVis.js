// @flow
import React from "react";
import { Grid, Header, Dropdown, Table, Button } from "semantic-ui-react";
import _ from "underscore";
import { findNode } from "./Utils";
import { format } from "d3-format";
import LineTo from "./LineTo";

type Props = {
  height: Number,
  symmetryData: Array,
  color: String,
  treeData: Array
};

class SymmetryVis extends React.Component<Props, State> {
  state = { rows: 2, selectedNodes: [], lines: [], selectedVariations: [0] };

  constructor(props) {
    super(props);
    const { symmetryData } = props;
    const allNodes = [];
    symmetryData.forEach(e => {
      const srcExists = allNodes.find(ele => _.isEqual(ele.text, e.src));
      const dstExists = allNodes.find(ele => _.isEqual(ele.text, e.dst));
      if (!srcExists) {
        allNodes.push({ text: e.src, value: e.src.split("_") });
      }
      if (!dstExists) {
        allNodes.push({ text: e.dst, value: e.dst.split("_") });
      }
    });
    this.state = { ...this.state, allNodes };
  }

  updateLines = (row: number, currNode: Object) => {
    const { rows, selectedNodes, lines, selectedVariations } = this.state;
    const { symmetryData } = this.props;
    const linesClone = _.clone(lines);
    const currPos = currNode.attributes.position.join("_");
    let prev,
      next = null;
    if (row > 0) {
      // Check previous
      prev = selectedNodes[row - 1];
    }
    if (row < rows - 1) {
      // Check next
      next = selectedNodes[row + 1];
    }
    let matchedPrev,
      matchedNext = false;
    symmetryData.forEach(x => {
      const { src, dst, variations } = x;
      if (variations.length > 0) {
        if (prev && !matchedPrev) {
          const prevPos = prev.attributes.position;
          if (_.isEqual(prevPos.join("_"), src) && _.isEqual(currPos, dst)) {
            linesClone[row - 1] = variations[selectedVariations[row - 1] % variations.length].map(con => ({
              from: this.getClassName(row - 1, con[0], false),
              to: this.getClassName(row, con[1], true)
            }));
            matchedPrev = true;
          }
        }
        if (next && !matchedNext) {
          const nextPos = next.attributes.position;
          if (_.isEqual(nextPos.join("_"), dst) && _.isEqual(currPos, src)) {
            linesClone[row] = variations[selectedVariations[row] % variations.length].map(con => ({
              from: this.getClassName(row, con[0], false),
              to: this.getClassName(row + 1, con[1], true)
            }));
            matchedNext = true;
          }
        }
      }
    });
    if (!matchedNext) {
      linesClone[row] = [];
    }
    if (!matchedPrev && row > 0) {
      linesClone[row - 1] = [];
    }
    this.setState({ lines: linesClone });
  };

  getClassName = (row: Number, col: Number, isHeader: Boolean) => {
    return `${isHeader ? "h" : "v"}r${row}c${col}`;
  };

  renderNode(row: Number) {
    const { selectedNodes } = this.state;
    const node = selectedNodes[row];
    if (node) {
      const {
        attributes: { solution }
      } = node;
      // BUG: If two or more symmetry vis is open, lines only shown for the first, as classnames are identical
      return solution.length > 0 ? (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              {[...Array(solution.length).keys()].map(v => (
                <Table.HeaderCell className={`hr${row}c${v}`}>
                  x<sub>{v}</sub>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Solutions</Table.Cell>
              {solution.map((v, index) => (
                <Table.Cell className={`vr${row}c${index}`}>{format(".2")(v)}</Table.Cell>
              ))}
            </Table.Row>
          </Table.Body>
        </Table>
      ) : null;
    }
  }

  renderNodeSelection(row: Number) {
    const { selectedNodes, allNodes, rows } = this.state;
    const { treeData, depth } = this.props;
    const node = selectedNodes[row];
    return (
      <div>
        <Header as="h2">Node {row + 1}</Header>
        <Header as="h4">{node ? node.name : "Select a node"}</Header>
        <Dropdown
          placeholder="Select a node position"
          selection
          options={allNodes}
          onChange={(e, data) => {
            const selectedNodesClone = _.clone(selectedNodes);
            selectedNodesClone[row] = findNode([treeData], data.value, depth).node;
            this.setState({ selectedNodes: selectedNodesClone }, this.updateLines(row, selectedNodesClone[row]));
          }}
        />
        <div style={{ height: "10px" }} />
        {row < rows - 1 ? (
          <Button
            basic
            color="black"
            content="Next variation"
            icon="right arrow"
            labelPosition="right"
            onClick={() => {
              const { selectedVariations } = this.state;
              const clone = _.clone(selectedVariations);
              clone[row] += 1;
              this.setState({ selectedVariations: clone }, this.updateLines(row, selectedNodes[row]));
            }}
          />
        ) : null}
      </div>
    );
  }

  render() {
    const { height, color } = this.props;
    const { rows, lines } = this.state;
    return (
      <div style={{ width: 1.25 * height, height, overflow: "hidden" }}>
        <div
          style={{
            background: color,
            width: "100%",
            textAlign: "center",
            borderRadius: "4px",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
        >
          <Header as="h2">Current showing nodes marked as this color</Header>
        </div>
        <div style={{ height: "10px" }} />
        <Grid style={{ width: "100%", height: "100%" }}>
          {[...Array(rows).keys()].map(x => (
            <Grid.Row>
              <Grid.Column width={4}>{this.renderNodeSelection(x)}</Grid.Column>
              <Grid.Column width={12}>{this.renderNode(x)}</Grid.Column>
            </Grid.Row>
          ))}
        </Grid>
        {lines.flatMap(lineGroup =>
          lineGroup.map(line => (
            <LineTo
              borderColor={color}
              delay={0}
              fromAnchor="bottom center"
              toAnchor="top center"
              from={line.from}
              to={line.to}
            />
          ))
        )}
      </div>
    );
  }
}

export default SymmetryVis;
