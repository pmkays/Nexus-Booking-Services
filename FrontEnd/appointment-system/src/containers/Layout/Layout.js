import React, { Component } from "react";
import NavigationBar from "../../components/Navigation/NavigationBar";

class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        <NavigationBar />
        <main className="container">{this.props.children}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
