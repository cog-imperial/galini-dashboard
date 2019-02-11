// @flow
import React from "react";
import { fetchRawLogs, fetchState, fetchText } from "../Utils/Network";
import { Icon, Button, Header, Ref } from "semantic-ui-react";
import { connect } from "react-redux";
import Modules from "./ModulesControl";
import store from "../Store";
import { setModulesHeight, clearSolverEvent } from "../Actions";

const mapStateToProps = state => ({ rawLogs: state.rawLogs, modulesHeight: state.modulesHeight });

type Props = { selected: String, rawLogs: Array, modulesHeight: number };

type State = { rawLogsVisibility: number };

class Dashboard extends React.Component<Props, State> {
  state = { rawLogsVisibility: 1 };
  dashboardRef = null;
  headerRef = null;

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selected !== this.props.selected) {
      store.dispatch(clearSolverEvent());
      fetchState(this.props.selected);
      fetchText(this.props.selected);
      this.setState({ rawLogsVisibility: 1 });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", () => this.updateHeight(this.state.rawLogsVisibility));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => this.updateHeight(this.state.rawLogsVisibility));
  }

  updateHeight = (rawLogsVisibility: number) => {
    const totalHeight = this.dashboardRef ? this.dashboardRef.clientHeight : 0;
    const usedHeight = this.headerRef ? this.headerRef.clientHeight : 0;
    const availableHeight = totalHeight - usedHeight;
    const rawLogsHeight = rawLogsVisibility === 0 ? 0 : rawLogsVisibility === 1 ? availableHeight / 2 : availableHeight;
    this.setState({ rawLogsHeight });
    store.dispatch(setModulesHeight(availableHeight - rawLogsHeight));
  };

  renderModules = () => {
    const { rawLogsVisibility } = this.state;
    const { modulesHeight } = this.props;
    const { selected } = this.props;
    return (
      <div style={{ display: rawLogsVisibility === 2 ? "none" : "block", height: `${modulesHeight}px` }}>
        <Modules selected={selected} />
      </div>
    );
  };

  renderRawLogsControl = (rawLogsVisibility: number) => {
    return (
      <Ref
        innerRef={node => {
          this.headerRef = node;
          this.updateHeight(rawLogsVisibility);
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row-reverse",
            padding: "7px",
            background: "lightGray"
          }}
        >
          <Button.Group size="mini">
            <Button
              icon
              disabled={rawLogsVisibility === 0}
              basic
              color="black"
              size="mini"
              onClick={() =>
                this.setState({ rawLogsVisibility: rawLogsVisibility - 1 }, this.updateHeight(rawLogsVisibility - 1))
              }
            >
              <Icon name="minus" />
            </Button>
            <Button
              icon
              disabled={rawLogsVisibility === 2}
              basic
              color="black"
              size="mini"
              onClick={() =>
                this.setState({ rawLogsVisibility: rawLogsVisibility + 1 }, this.updateHeight(rawLogsVisibility + 1))
              }
            >
              <Icon name="plus" />
            </Button>
          </Button.Group>
          <div style={{ flexGrow: "2", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
            <Header as="h2">Raw Logs</Header>
          </div>
        </div>
      </Ref>
    );
  };

  renderRawLogs = () => {
    const { rawLogs } = this.props;
    const { rawLogsVisibility, rawLogsHeight } = this.state;
    const usedHeight = this.headerRef ? this.headerRef.clientHeight : 0;
    return rawLogs && rawLogs.length > 0 ? (
      <div style={{ height: `${usedHeight + rawLogsHeight}px` }}>
        {this.renderRawLogsControl(rawLogsVisibility)}
        <div
          style={{
            whiteSpace: "pre-wrap",
            overflow: "auto",
            width: "100%",
            paddingLeft: "10px",
            paddingRight: "10px",
            fontFamily: "monospace",
            display: rawLogsVisibility === 0 ? "none" : "block",
            height: `${rawLogsHeight}px`
          }}
        >
          {rawLogs.join("")}
        </div>
      </div>
    ) : null;
  };

  render() {
    const modules = this.renderModules();
    const rawLogs = this.renderRawLogs();
    const { rawLogsVisibility } = this.state;
    const { selected } = this.props;
    return selected ? (
      <Ref
        innerRef={node => {
          this.dashboardRef = node;
          this.updateHeight(rawLogsVisibility);
        }}
      >
        <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
          {modules}
          {rawLogs}
        </div>
      </Ref>
    ) : (
      <div />
    );
  }
}

export default connect(mapStateToProps)(Dashboard);
