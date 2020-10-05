import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import classes from './Dashboard.module.css';
import { NavLink } from 'react-router-dom';
import { Animated } from 'react-animated-css';

import DashboardIcon from './DashboardIcon/DashboardIcon';
import DrawerToggle from '../../components/Navigation/DrawerToggle/DrawerToggle';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import DashboardWelcome from '../../containers/DashboardWelcome/DashBoardWelcome';
import Employees from '../Admin/Employees/Employees';
import AddEmployee from '../Admin/AddEmployee/AddEmployee';
import AddService from '../Admin/AddService/AddService';
import WorkingTimes from '../WorkingTimes/WorkingTimes';
import Availabilities from '../../containers/Availabilities/Availabilities';
import Login from '../../containers/Login/Login';
import Profile from '../../containers/Profile/Profile';
import EditProfile from '../../containers/Profile/EditProfile/EditProfile';
import Booking from '../Booking/Booking';
import Spinner from '../../components/UI/Spinner/Spinner';

export class Dashboard extends Component {
  state = {
    content: null,
    error: null,
    showSideDrawer: false,
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
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <Employees />
          </Animated>
        );
        break;
      case 'addemployee':
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <AddEmployee />
          </Animated>
        );
        break;
      case 'addservice':
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <AddService />
          </Animated>
        );
        break;
      case 'workingtimes':
        content = (
          <Animated animationIn='zoomIn' animationInDuration={200}>
            <WorkingTimes />
          </Animated>
        );
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

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  };

  sideDrawerOpenHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
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
                id='Dashboard'
                classes='fas fa-home'
                to='dashboard'
              />
              <br />
              {this.props.authority === 'ROLE_ADMIN' ? (
                <React.Fragment>
                  <DashboardIcon
                    name='Employees'
                    id='Employees'
                    classes='fas fa-users'
                    to='employees'
                  />
                  <br />
                  <DashboardIcon
                    name='Workhours'
                    id='Workhours'
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
                    id='Bookings'
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
                    id='Availabilities'
                    classes='fas fa-calendar-check'
                    to='availabilities'
                  />
                  <br />
                </React.Fragment>
              ) : null}
              <DashboardIcon
                name='Settings'
                id='Settings'
                classes='fas fa-cog'
                to='profile'
              />
              <br />
              <DashboardIcon
                name='Logout'
                id='Logout'
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
          <DrawerToggle openSideDrawHandler={this.sideDrawerOpenHandler} />
          <SideDrawer
            open={this.state.showSideDrawer}
            closed={this.sideDrawerClosedHandler}
          />
          <div className={classes.Float + ' ' + classes.NoDecoration}>
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
