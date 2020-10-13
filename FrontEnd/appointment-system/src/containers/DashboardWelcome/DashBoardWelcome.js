import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import classes from './DashboardWelcome.module.css';
import welcomeImage from './images/welcome.svg';
import axios from '../../axios-sept';
import { withRouter } from 'react-router';

import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import PreviousBooking from '../../components/UI/PreviousBooking/PreviousBooking';
import Card from '../../components/UI/Card/Card';
import { Animated } from 'react-animated-css';
import moment from 'moment';

export class DashboardWelcome extends Component {
  state = {
    bookings: null,
    error: null,
  };

  goToBooking = () => {
    this.props.history.push('/bookings');
  };

  goToSchedule = () => {
    this.props.history.push('/schedule');
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

    let userType = null;
    if (this.props.authority === 'ROLE_CUSTOMER') userType = 'customer';
    if (this.props.authority === 'ROLE_EMPLOYEE') userType = 'employee';

    const url = '/api/booking/' + userType + '/' + this.props.userId;

    axios
      .get(url, config)
      .then((response) => {
        this.setState({
          ...this.state,
          bookings: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: 'Error retrieving the services. Possibly no services available on this date.',
          services: [],
          loading: false,
        });
      });
  }

  onClickHandler = (id) => {
    this.props.history.push('/booking/' + id);
  };

  viewBookingHandler = () => {
    this.props.history.push('/viewbookings');
  };

  render() {
    let profile = <Spinner />;

    let previousBookings = null;
    let count = 0;
    if (this.state.bookings) {
      previousBookings = this.state.bookings.map((booking, index) => {
        let card = null;
        if (count !== 3 && booking.status === 'complete') {
          card = (
            <PreviousBooking
              key={index}
              clicked={() => this.onClickHandler(booking.id)}
              serviceName={booking.service.name}
              employeeName={
                this.props.authority === 'ROLE_CUSTOMER'
                  ? booking.employee.firstName + ' ' + booking.employee.lastName
                  : booking.customer.firstName + ' ' + booking.customer.lastName
              }
              startTime={
                moment(booking.startTime).format('DD/MM/yyyy') + ', ' + moment(booking.startTime).format('HH:mm')
              }
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
        if (count !== 5 && booking.status === 'pending') {
          card = (
            <Card
              key={index}
              clicked={() => this.onClickHandler(booking.id)}
              imgUrl={booking.service.img}
              serviceName={booking.service.name}
              employeeName={
                this.props.authority === 'ROLE_CUSTOMER'
                  ? booking.employee.firstName + ' ' + booking.employee.lastName
                  : booking.customer.firstName + ' ' + booking.customer.lastName
              }
              startTime={
                moment(booking.startTime).format('DD/MM/yyyy') + ', ' + moment(booking.startTime).format('HH:mm')
              }
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

    let welcomeText = null;

    if (this.props.authority === 'ROLE_CUSTOMER') {
      welcomeText = (
        <React.Fragment>
          <p className={classes.Slogan}>Many new services added daily. Have a look!</p>
          <Button clicked={this.goToBooking} classes={classes.Button}>
            BOOK
          </Button>
        </React.Fragment>
      );
    } else {
      welcomeText = (
        <React.Fragment>
          <p className={classes.Slogan}>Please make sure you check your schedule and update if needed!</p>
          <Button clicked={this.goToSchedule} classes={classes.Button}>
            Schedule
          </Button>
        </React.Fragment>
      );
    }

    // If not loading and the profile is present, it will render the details
    if (!this.props.loading && this.props.profileDetails !== null) {
      profile = (
        <React.Fragment>
          <div className={'row ' + classes.NoMargin}>
            <Animated
              className={classes.WelcomeBox + ' col-sm-12 col-md-5 '}
              animationIn="zoomIn"
              animationInDuration={400}
            >
              <div className={classes.Margin}>
                <div className={classes.WelcomeBoxText}>
                  <h1>
                    Welcome <span className={classes.BoldedText}>{this.props.profileDetails.firstName}!</span>
                  </h1>
                  {welcomeText}
                </div>
              </div>
              <div>
                <img className={classes.WelcomeImage} src={welcomeImage} alt="computer" />
              </div>
            </Animated>
            <Animated
              className={classes.PrevBookings + ' col-sm-12 col-md-5'}
              animationIn="zoomIn"
              animationInDuration={400}
            >
              <div className={classes.PrevBookingsText}>
                <h3 className={classes.Clickable} onClick={this.viewBookingHandler}>
                  Previous Bookings <i className={classes.MoreIcon + ' fas fa-chevron-circle-right'}></i>
                </h3>
                {previousBookings}
              </div>
            </Animated>
          </div>
          <div className="row">
            <div className={classes.UpcomingBookingsText}>
              <Animated animationInDelay={400} animationIn="fadeInRight" animationInDuration={600}>
                <h4 className={classes.Clickable} onClick={this.viewBookingHandler}>
                  Upcoming Bookings <i className={classes.MoreIcon + ' fas fa-chevron-circle-right'}></i>
                </h4>
                <div className={classes.Flex}>{upcomingBookings}</div>
              </Animated>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DashboardWelcome));
