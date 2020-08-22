import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Login from "./containers/Login/Login";
import Logout from "./containers/Login/Logout/Logout";
import Layout from "./containers/Layout/Layout";
import * as actions from "./store/actions/actions";

class App extends Component {
  // Upon loading the app check if local storage has user details
  componentDidMount() {
    this.props.onTryAutoSignin();
  }

  render() {
    return (
      <Layout>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <Route path="/" render={() => <p>hello world</p>} />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignin: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
