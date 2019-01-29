// @flow
import React from "react";
import Dashboard from "./Components/Dashboard";
import { initialize } from "./Utils/Network";
import { Menu, Header, Grid, Icon, Label } from "semantic-ui-react";
import store from "./Store/index";
import { addLog } from "./Actions/index";
import { connect } from "react-redux";

const mapStateToProps = state => {
  return { logsList: state.logsList };
};

window.store = store;
window.addLog = addLog;

type Props = { logsList: Array };

type State = { selected: string, logsList: Array };

export class App extends React.Component<Props, State> {
  state = {};
  componentDidMount() {
    initialize();
  }

  renderSideBar() {
    const { selected } = this.state;
    const { logsList } = this.props;
    const items =
      logsList && logsList.length > 0
        ? logsList.map((val, index) => (
            <Menu.Item key={index} active={selected === val} onClick={e => this.setState({ selected: val })}>
              {val}
            </Menu.Item>
          ))
        : [<Menu.Header key={0}>No logs yet</Menu.Header>];
    return logsList ? (
      <React.Fragment>
        <Header inverted style={{ paddingTop: "1rem" }}>
          Run Logs
        </Header>
        <Menu inverted vertical fluid secondary>
          {items}
        </Menu>
      </React.Fragment>
    ) : null;
  }

  render() {
    const { selected } = this.state;
    return (
      <Grid padded>
        <Grid.Row color="teal" style={{ height: "8vh" }} verticalAlign="middle">
          <Grid.Column width={3} textAlign="center">
            <Label
              href="https://optimisation.doc.ic.ac.uk/grant/galini-global-algorithms-for-mixed-integer-nonlinear-optimisation-of-industrial-systems/"
              target="_blank"
              size="big"
            >
              <Icon name="info" />
              More information!
            </Label>
          </Grid.Column>
          <Grid.Column width={10} textAlign="center">
            <Header as="h1">GALINI Dashboard</Header>
          </Grid.Column>
          <Grid.Column width={3} textAlign="center">
            <Label href="https://www.github.com" target="_blank" size="big">
              Contribute <Icon name="github" />
            </Label>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ height: "92vh", overflow: "hidden", padding: 0 }}>
          <Grid.Column width={3} color="black">
            {this.renderSideBar()}
          </Grid.Column>
          <Grid.Column width={13} style={{ padding: 0 }}>
            <Dashboard selected={selected} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps)(App);
