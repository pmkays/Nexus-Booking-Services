import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from './containers/Login/Login';
import Logout from './containers/Login/Logout/Logout';
import Layout from './containers/Layout/Layout';
import Home from './containers/Home/Home';
import Profile from './containers/Profile/Profile';
import EditProfile from './containers/Profile/EditProfile/EditProfile';
import RegisterProfile from './containers/Register/Register';
import Employees from './containers/Admin/Employees/Employees';
import AddEmployee from './containers/Admin/AddEmployee/AddEmployee';

import AboutUs from './containers/AboutUs/AboutUs';
import ContactUs from './containers/ContactUs/ContactUs';
import * as actions from './store/actions/actions';
import HowItWorks from './containers/HowItWorks/HowItWorks';
import Availabilites from './containers/Availabilites/Availabilites';

class App extends Component {
  // Upon loading the app check if local storage has user details
  componentDidMount() {
    this.props.onTryAutoSignin();
  }

  render() {
    let routes = null;
    if (this.props.isAdmin && this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/employees' component={Employees} />
          <Route path='/addEmployee' component={AddEmployee} />
          <Route path='/profile' component={Profile} />
          <Route path='/editProfile' component={EditProfile} />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='/howitworks' component={HowItWorks} />
          <Route path='/' component={Home} />
        </Switch>
      );
    } else if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/profile' component={Profile} />
          <Route path='/editProfile' component={EditProfile} />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='/howitworks' component={HowItWorks} />
          <Route path='/availabilities' component={Availabilites} />
          <Route path='/' component={Home} />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={RegisterProfile} />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='/howitworks' component={HowItWorks} />
          <Route path='/' component={Home} />
        </Switch>
      );
    }
    return <Layout>{routes}</Layout>;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.authority === 'ROLE_ADMIN',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignin: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
