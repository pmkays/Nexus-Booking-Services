import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from './containers/Login/Login';
import Logout from './containers/Login/Logout/Logout';
import Home from './containers/Home/Home';
import RegisterProfile from './containers/Register/Register';
import AddService from './containers/Admin/AddService/AddService';

import AboutUs from './containers/AboutUs/AboutUs';
import ContactUs from './containers/ContactUs/ContactUs';
import * as actions from './store/actions/actions';
import HowItWorks from './containers/HowItWorks/HowItWorks';
import Dashboard from './containers/Dashboard/Dashboard';

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
          <Route
            path='/dashboard'
            component={() => <Dashboard content='welcome' />}
          />
          <Route
            path='/employees'
            component={() => <Dashboard content='employees' />}
          />
          <Route
            path='/addemployee'
            component={() => <Dashboard content='addemployee' />}
          />
          <Route path='/addService' component={AddService} />
          <Route
            path='/profile'
            component={() => <Dashboard content='profile' />}
          />
          <Route
            path='/workingtimes'
            component={() => <Dashboard content='workingtimes' />}
          />
          <Route
            path='/editprofile'
            component={() => <Dashboard content='editprofile' />}
          />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='/howitworks' component={HowItWorks} />
          <Route path='/' component={Home} />
        </Switch>
      );
    } else if (this.props.isEmployee && this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path='/login' component={Login} />
          <Route
            path='/dashboard'
            component={() => <Dashboard content='welcome' />}
          />
          <Route
            path='/profile'
            component={() => <Dashboard content='profile' />}
          />
          <Route
            path='/editprofile'
            component={() => <Dashboard content='editprofile' />}
          />
          <Route
            path='/availabilities'
            component={() => <Dashboard content='availabilities' />}
          />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='/howitworks' component={HowItWorks} />

          <Route path='/' component={Home} />
        </Switch>
      );
    } else if (this.props.isCustomer && this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route
            path='/login'
            component={() => <Dashboard content='login' />}
          />
          <Route
            path='/dashboard'
            component={() => <Dashboard content='welcome' />}
          />
          <Route
            path='/profile'
            component={() => <Dashboard content='profile' />}
          />
          <Route
            path='/editprofile'
            component={() => <Dashboard content='editprofile' />}
          />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='/howitworks' component={HowItWorks} />
          <Route
            path='/bookings'
            component={() => <Dashboard content='booking' />}
          />

          <Route path='/' component={Home} />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/bookings' component={RegisterProfile} />
          <Route path='/register' component={RegisterProfile} />
          <Route path='/logout' component={Logout} />
          <Route path='/about' component={AboutUs} />
          <Route path='/contact' component={ContactUs} />
          <Route path='/howitworks' component={HowItWorks} />
          <Route path='/' component={Home} />
        </Switch>
      );
    }
    return <React.Fragment>{routes}</React.Fragment>;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.authority === 'ROLE_ADMIN',
    isEmployee: state.auth.authority === 'ROLE_EMPLOYEE',
    isCustomer: state.auth.authority === 'ROLE_CUSTOMER',
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignin: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
