import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import classes from './Dashboard.module.css';
import userImage from './images/user.svg';
import bookImage from './images/bookmark.svg';
import gearImage from './images/gear.svg';
import logoutImage from './images/logout.svg';
import { NavLink } from 'react-router-dom';

import DashboardWelcome from '../../containers/DashboardWelcome/DashBoardWelcome';
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
      case 'booking':
        content = <Booking />;
        break;
      case 'availabilities':
        content = <Availabilities />;
        break;
      case 'login':
        content = <Login />;
        break;
      case 'profile':
        content = <Profile />;
        break;
      case 'editprofile':
        content = <EditProfile />;
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
              <div className='row'>
                <div
                  className={
                    classes.BoldedText +
                    ' ' +
                    classes.White +
                    ' ' +
                    classes.Center
                  }
                >
                  Leslie {this.props.hello}
                </div>
              </div>
              <div>
                <NavLink to='/dashboard'>
                  <img className={classes.Icon} src={userImage} alt='user' />
                </NavLink>
              </div>
              <br />
              <div>
                <NavLink to='/bookings'>
                  <img
                    className={classes.Icon}
                    src={bookImage}
                    alt='bookings'
                  />
                </NavLink>
              </div>
              <br />
              <div>
                <NavLink to='/profile'>
                  <img
                    className={classes.Icon}
                    src={gearImage}
                    alt='settings'
                  />
                </NavLink>
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <div>
                <NavLink to='/logout'>
                  <img
                    className={classes.Icon}
                    src={logoutImage}
                    alt='logout'
                  />
                </NavLink>
              </div>
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
        <NavLink to='/' exact>
          <div className={classes.Logo}>
            <span className={classes.NavLogo}>
              NE<span className={classes.Blue}>X</span>US
            </span>
            <span className={classes.Slogan}>BOOKING - SYSTEM</span>
          </div>
        </NavLink>
        {profile}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
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
