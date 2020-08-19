import React, { Component } from "react";
import NavigationBar from "../../components/Navigation/NavigationBar";

class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <main>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
