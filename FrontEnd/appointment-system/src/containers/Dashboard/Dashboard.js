import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import { NavLink } from 'react-router-dom';
import classes from './Dashboard.module.css';
import welcomeImage from './images/welcome.svg';
import userImage from './images/user.svg';
import bookImage from './images/bookmark.svg';
import gearImage from './images/gear.svg';
import logoutImage from './images/logout.svg';

import Spinner from '../../components/UI/Spinner/Spinner';

export class Dashboard extends Component {
  //As soon as this component loads it will attempt to grab the current profile
  componentDidMount() {
    this.props.onFetchProfile(this.props.token);
  }

  render() {
    let profile = <Spinner />;

    // If not loading and the profile is present, it will render the details
    if (!this.props.loading && this.props.profileDetails !== null) {
      profile = (
        <React.Fragment>
          <div className={classes.NoMargin + ' row'}>
            <div className='col-sm-1'>
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
                  Leslie
                </div>
              </div>
              <div>
                <img className={classes.Icon} src={userImage} alt='user' />
              </div>
              <br />
              <div>
                <img className={classes.Icon} src={bookImage} alt='bookings' />
              </div>
              <br />
              <div>
                <img className={classes.Icon} src={gearImage} alt='settings' />
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
                <img className={classes.Icon} src={logoutImage} alt='logout' />
              </div>
            </div>
            <div className={classes.MainContent + ' col-sm-11'}>
              <div className='row'>
                <div className='col-sm-6'>
                  <div className={classes.WelcomeBox + ' row'}>
                    <div className='col-sm-5'>
                      <div className={classes.WelcomeBoxText}>
                        <h3>
                          Welcome{' '}
                          <span className={classes.BoldText}>
                            {this.props.profileDetails.firstName}!
                          </span>
                        </h3>
                        <p>Many new services added daily. Have a look!</p>
                      </div>
                    </div>
                    <div className='col-sm-7'>
                      <img
                        className={classes.WelcomeImage}
                        src={welcomeImage}
                        alt='computer'
                      />
                    </div>
                  </div>
                </div>
                <div className='col-sm-6'>
                  <div className={classes.PrevBookings + ' row'}>
                    <div className='col-sm-12'>
                      <div className={classes.PrevBookingsText}>
                        <h3>Previous Bookings</h3>
                        <p>No previous bookings found!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className={classes.UpcomingBookingsText}>
                  <h4>Upcoming Bookings</h4>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    if (this.props.error) {
      profile = this.props.error;
    }

    return <div className={classes.Dashboard}>{profile}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
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
