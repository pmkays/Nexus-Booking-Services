import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/actions";
import { Redirect } from "react-router-dom";

class Logout extends Component {
  componentDidMount() {
    this.props.clearProfile();
    this.props.onLogout();
  }

  render() {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
    clearProfile: () => dispatch(actions.clearProfileUponLogout()),
  };
};

export default connect(null, mapDispatchToProps)(Logout);
