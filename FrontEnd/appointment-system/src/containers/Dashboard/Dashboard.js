import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import classes from './Dashboard.module.css';
import { NavLink } from 'react-router-dom';
import { Animated } from 'react-animated-css';

import DashboardIcon from './DashboardIcon/DashboardIcon';
import DrawerToggle from '../../components/Navigation/DrawerToggle/DrawerToggle';
import DashboardWelcome from '../../containers/DashboardWelcome/DashBoardWelcome';
import Employees from '../Admin/Employees/Employees';
import AddEmployee from '../Admin/AddEmployee/AddEmployee';
import WorkingTimes from '../WorkingTimes/WorkingTimes';
import Availabilities from '../../containers/Availabilites/Availabilites';
import Login from '../../containers/Login/Login';
import Profile from '../../containers/Profile/Profile';
import EditProfile from '../../containers/Profile/EditProfile/EditProfile';
import Booking from '../Booking/Booking';
import Spinner from '../../components/UI/Spinner/Spinner';

export class Dashboard extends Component {
  state = {
    content: null,
    error: null,
  };

  //As soon as this component loads it will attempt to grab the current profile
  componentDidMount() {
    this.props.onFetchProfile(this.props.token);
  }

  contentToRender = () => {
    let content = null;

    switch (this.props.content) {
      case 'welcome':
        content = <DashboardWelcome />;
        break;
      case 'employees':
        content = <Employees />;
        break;
      case 'addemployee':
        content = <AddEmployee />;
        break;
      case 'workingtimes':
        content = <WorkingTimes />;
        break;
      case 'booking':
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <Booking />
          </Animated>
        );
        break;
      case 'availabilities':
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <Availabilities />
          </Animated>
        );
        break;
      case 'login':
        content = <Login />;
        break;
      case 'profile':
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <Profile />
          </Animated>
        );
        break;
      case 'editprofile':
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <EditProfile />
          </Animated>
        );
        break;
      default:
        break;
    }

    return content;
  };

  render() {
    let profile = <Spinner />;
    let content = this.contentToRender();

    // If not loading and the profile is present, it will render the details
    if (!this.props.loading && this.props.profileDetails !== null) {
      profile = (
        <React.Fragment>
          <div className={classes.NoMargin + ' row'}>
            <div className={classes.Toolbar}>
              <div className={classes.NoMargin + ' row'}>
                <img
                  className={classes.Avatar}
                  src={this.props.profileDetails.img}
                  alt='avatar'
                />
              </div>

              <DashboardIcon
                name='Dashboard'
                classes='fas fa-home'
                to='dashboard'
              />
              <br />
              {this.props.authority === 'ROLE_ADMIN' ? (
                <React.Fragment>
                  <DashboardIcon
                    name='Employees'
                    classes='fas fa-users'
                    to='employees'
                  />
                  <br />
                  <DashboardIcon
                    name='Workhours'
                    classes='fas fa-hourglass-half'
                    to='workingtimes'
                  />
                  <br />
                </React.Fragment>
              ) : null}
              {this.props.authority === 'ROLE_CUSTOMER' ? (
                <React.Fragment>
                  <DashboardIcon
                    name='Bookings'
                    classes='fas fa-book'
                    to='bookings'
                  />
                  <br />
                </React.Fragment>
              ) : null}

              {this.props.authority === 'ROLE_EMPLOYEE' ? (
                <React.Fragment>
                  <DashboardIcon
                    name='Availabilities'
                    classes='fas fa-calendar-check'
                    to='availabilities'
                  />
                  <br />
                </React.Fragment>
              ) : null}
              <DashboardIcon
                name='Settings'
                classes='fas fa-cog'
                to='profile'
              />
              <br />
              <DashboardIcon
                name='Logout'
                classes='fas fa-sign-out-alt'
                to='logout'
              />
            </div>
            <div className={classes.MainContent}>{content}</div>
          </div>
        </React.Fragment>
      );
    }

    if (this.props.error) {
      profile = this.props.error;
    }

    return (
      <div className={classes.Dashboard}>
        <div className={classes.MenuLogo}>
          <DrawerToggle />
          <div className={classes.Float}>
            <NavLink to='/' exact>
              <div className={classes.Logo}>
                <span className={classes.NavLogo}>
                  NE<span className={classes.Blue}>X</span>US
                </span>
                <span className={classes.Slogan}>BOOKING - SYSTEM</span>
              </div>
            </NavLink>
          </div>
        </div>
        {profile}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    authority: state.auth.authority,
    profileDetails: state.profile.profileDetails,
    loading: state.profile.loading,
    error: state.profile.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: (token) => dispatch(actions.fetchProfile(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
