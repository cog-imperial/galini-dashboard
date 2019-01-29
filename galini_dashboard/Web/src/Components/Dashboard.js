// @flow
import React from "react";
import { fetchRawLogs } from "../Utils/Network";
import { Icon, Button, Header } from "semantic-ui-react";

type Props = { selected: String };

type State = { logs: Array, visible: number };

class Dashboard extends React.Component<Props, State> {
  state = { visible: 1 };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selected !== this.props.selected) {
      this.fetchLogs(this.props.selected);
    }
  }

  fetchLogs = async (name: string) => {
    const reader = await fetchRawLogs(name);
    const logs = [];
    await reader.read().then(function processText({ done, value }) {
      if (!done) {
        logs.push(new TextDecoder("utf-8").decode(value));
        return reader.read().then(processText);
      }
    });
    this.setState({ logs });
  };

  renderModulesControl = () => {
    return (
      <div style={controlHeaderStyle}>
        <Button icon basic color="black" size="mini">
          <Icon name="plus" />
        </Button>
        <div style={{ flexGrow: "2", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
          <Header as="a2">Modules</Header>
        </div>
      </div>
    );
  };

  renderModules = () => {
    return <div style={{ flexGrow: 2 }}>Modules will go here.</div>;
  };

  renderRawLogsControl = (visible: number) => {
    return (
      <div style={controlHeaderStyle}>
        <Button.Group size="mini">
          <Button
            icon
            disabled={visible === 0}
            basic
            color="black"
            size="mini"
            onClick={() => this.setState({ visible: visible - 1 })}
          >
            <Icon name="minus" />
          </Button>
          <Button
            icon
            disabled={visible === 2}
            basic
            color="black"
            size="mini"
            onClick={() => this.setState({ visible: visible + 1 })}
          >
            <Icon name="plus" />
          </Button>
        </Button.Group>
        <div style={{ flexGrow: "2", display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
          <Header as="a2">Raw Logs</Header>
        </div>
      </div>
    );
  };

  renderRawLogs = (rawLogs: Array, visible: number) => {
    return visible === 0 ? null : (
      <div
        style={{
          whiteSpace: "pre-wrap",
          overflow: "auto",
          maxHeight: visible === 1 ? "50%" : "100%",
          width: "100%",
          paddingLeft: "10px",
          paddingRight: "10px"
        }}
      >
        {rawLogs}
      </div>
    );
  };

  render() {
    const { logs, visible } = this.state;
    const modules = this.renderModules();
    const modulesControl = this.renderModulesControl();
    const rawLogs = logs ? this.renderRawLogs(logs, visible) : null;
    const rawLogsControl = logs ? this.renderRawLogsControl(visible) : null;
    return (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
        {modulesControl}
        {modules}
        {rawLogsControl}
        {rawLogs}
      </div>
    );
  }
}

const controlHeaderStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row-reverse",
  padding: "7px",
  background: "lightGray"
};

export default Dashboard;
