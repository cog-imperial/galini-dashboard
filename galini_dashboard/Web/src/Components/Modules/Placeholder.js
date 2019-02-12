// @flow
import React from "react";
import { Segment, Header, Icon } from "semantic-ui-react";

const Placeholder = props => (
  <Segment placeholder style={{ height: "100%", marginTop: "0" }}>
    <Header icon>
      No relevant data available yet
      <div style={{ height: "10px" }} />
      <Icon loading name="spinner" />
    </Header>
  </Segment>
);
export default Placeholder;
