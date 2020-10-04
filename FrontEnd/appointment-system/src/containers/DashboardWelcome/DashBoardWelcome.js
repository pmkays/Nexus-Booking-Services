import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import classes from './DashboardWelcome.module.css';
import welcomeImage from './images/welcome.svg';
import axios from '../../axios-sept';

import Spinner from '../../components/UI/Spinner/Spinner';
import PreviousBooking from '../../components/UI/PreviousBooking/PreviousBooking';
import Card from '../../components/UI/Card/Card';

export class DashboardWelcome extends Component {
  state = {
    bookings: null,
    error: null,
  };

  //As soon as this component loads it will attempt to grab the current profile
  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings() {
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    };

    const url = '/api/booking/customer/' + this.props.userId;

    axios
      .get(url, config)
      .then((response) => {
        console.log(response.data);
        this.setState({
          ...this.state,
          bookings: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error:
            'Error retrieving the services. Possibly no services available on this date.',
          services: [],
          loading: false,
        });
      });
  }

  render() {
    let profile = <Spinner />;

    let previousBookings = null;
    let count = 0;
    if (this.state.bookings) {
      previousBookings = this.state.bookings.map((booking, index) => {
        let card = null;
        if (count != 3 && booking.status === 'complete') {
          card = (
            <PreviousBooking
              key={index}
              serviceName={booking.service.name}
              employeeName={
                booking.employee.firstName + ' ' + booking.employee.lastName
              }
              startTime={booking.startTime}
            />
          );
          count++;
        }
        return card;
      });
    }

    if (count === 0) {
      previousBookings = 'No previous bookings.';
    }

    let upcomingBookings = null;
    if (this.state.bookings) {
      count = 0;
      upcomingBookings = this.state.bookings.map((booking, index) => {
        let card = null;
        if (count != 5 && booking.status === 'complete') {
          card = (
            <Card
              key={index}
              imgUrl={booking.service.img}
              serviceName={booking.service.name}
              employeeName={
                booking.employee.firstName + ' ' + booking.employee.lastName
              }
              startTime={booking.startTime}
            />
          );
          count++;
        }
        return card;
      });
    }

    if (count === 0) {
      upcomingBookings = 'No upcoming bookings.';
    }

    // If not loading and the profile is present, it will render the details
    if (!this.props.loading && this.props.profileDetails !== null) {
      profile = (
        <React.Fragment>
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
                    {previousBookings}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className={classes.UpcomingBookingsText}>
              <h4>Upcoming Bookings</h4>
              <div className={classes.Flex}>{upcomingBookings}</div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    if (this.props.error) {
      profile = this.props.error;
    }

    return <div>{profile}</div>;
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardWelcome);
