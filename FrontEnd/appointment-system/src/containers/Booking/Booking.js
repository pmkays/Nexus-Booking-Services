import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import moment from "moment";
import axios from "../../axios-sept";

import * as actions from "../../store/actions/actions";
import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";
import classes from "./Booking.module.css";

export class Booking extends Component {
  state = {
    time: moment(),
    services: null,
    service: null,
    bookingDate: null,
    bookingTime: null,
    employees: null,
    employeeId: null,
    times: null,
    loading: false,
    error: null,
    dates: null,
  };

  // Runs when new date is selected
  updateDateHandler = (event) => {
    // event.preventDefault();
    if (event.target.value === "Choose Date") {
      this.setState({
        ...this.props.state,
        bookingDate: null,
        service: null,
        employeeId: null,
        employees: null,
        times: null,
        bookingTime: null,
      });
    } else {
      this.setState({
        ...this.props.state,
        bookingDate: event.target.value,
        service: null,
        employeeId: null,
        employees: null,
        times: null,
        bookingTime: null,
      });
    }

    // update dropdown box for services
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    const url = "/api/service/findAllByDate";

    let formData = {
      startTime: `${event.target.value}T00:00:00`,
    };


    axios
      .post(url, formData, config)
      .then((response) => {
        this.setState({
          ...this.state,
          services: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error:
            "Error retrieving the services. Possibly no services available on this date.",
          services: [],
          loading: false,
        });
      });

      // resetting service after choosing new date
      let x = document.getElementById("serviceDropdown");
      x.selectedIndex = 0;
  };

  // Runs when new service is selected
  updateServiceAndEmployeeDropDownHandler = (event) => {
    event.preventDefault();
    if (event.target.value === "Choose Service") {
      this.setState({ ...this.props.state, service: null });
    } else {
      this.setState({ ...this.props.state, service: event.target.value });
    }

    // update dropdown box for employees
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    const url = "/api/employee/services/findAllByDate";

    let formData = {
      startTime: `${this.state.bookingDate}T00:00:00`,
      serviceId: event.target.value,
    };

    axios
      .post(url, formData, config)
      .then((response) => {
        this.setState({
          ...this.state,
          employees: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error:
            "Error retrieving the employees. Possibly no employees with this service available on this date.",
          employees: [],
          loading: false,
        });
      });
  };

  // Runs when new service is selected
  updateEmployeeHandler = (event) => {
    event.preventDefault();
    if (event.target.value === "Choose Employee") {
      this.setState({ ...this.props.state, employeeId: null });
    } else {
      this.setState({ ...this.props.state, employeeId: event.target.value });
    }

    // update dropdown box for times
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    const url = "/api/booking/findAvailable";

    let formData = {
      employeeId: event.target.value,
      date: `${this.state.bookingDate}T00:00:00`,
    };

    axios
      .post(url, formData, config)
      .then((response) => {
        this.setState({
          ...this.state,
          times: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error:
            "Error retrieving the times. It's possible this employee is fully booked on this date.",
          times: [],
          loading: false,
        });
      });
  };

  // Runs when new service is selected
  updateBookingTimeHandler = (event) => {
    event.preventDefault();
    if (event.target.value === "Choose Time") {
      this.setState({ ...this.props.state, bookingTime: null });
    } else {
      this.setState({ ...this.props.state, bookingTime: event.target.value });
    }
  };

  // Runs when submitted and calls the redux action
  addBookingHandler = (event) => {
    event.preventDefault();

    const newStart = `${this.state.bookingDate}T${this.state.bookingTime}`;
    // adding 60 minutes to the end, as every booking is 60 minutes

    let oneHour = moment(this.state.bookingTime, "HH:mm:ss")
      .add(1, "hours")
      .format("HH:mm:ss");
    const newEnd = `${this.state.bookingDate}T${oneHour}`;

    let formData = {
      employeeId: this.state.employeeId,
      serviceId: this.state.service,
      startTime: newStart,
      endTime: newEnd,
    };

    this.props.onAddBooking(formData, this.props.token, this.props.history);
  };

  render() {
    const populateDates = () => {
      const dates = ["Choose Date"];
      for (let i = 0; i <= 7; i++) {
        let date = moment(this.state.time).add(i, "days").format("YYYY-MM-DD");
        dates.push(date);
      }
      return dates.map((date) => (
        <option value={date} key={date}>
          {date}
        </option>
      ));
    };

    // adding services to service drop down
    let services = null;

    if (this.state.services !== null) {
      services = this.state.services.map((service) => {
        return <option value={service.id}>{service.name}</option>;
      });
    }

    // adding employees to employee drop down
    let employees = null;

    if (this.state.employees !== null) {
      employees = this.state.employees.map((employee) => {
        return (
          <option value={employee.id}>
            {employee.firstName + " " + employee.lastName}
          </option>
        );
      });
    }

    let times = null;

    if (this.state.times !== null) {
      times = this.state.times.map((time) => {
        return (
          <option value={`${time}:00`} key={time}>
            {time}
          </option>
        );
      });
    }

    let form = null;

    if (this.props.loading) {
      form = <Spinner />;
    } else {
      form = (
        <form onSubmit={this.addBookingHandler}>
          <div className="form-group">
            <label>Pick a day for the booking:</label>
            <select
              className="custom-select"
              id="dateDropdown"
              onChange={this.updateDateHandler}
            >
              {populateDates()}
            </select>
          </div>
          <div className="form-group">
            <label>What service you require:</label>
            <select
              className="custom-select"
              id="serviceDropdown"
              onChange={this.updateServiceAndEmployeeDropDownHandler}
            >
              <option>Choose Service</option>
              {services}
            </select>
          </div>
          <div className="form-group">
            <label>Who do you require:</label>
            <select
              className="custom-select"
              id="employeeDropdown"
              onChange={this.updateEmployeeHandler}
            >
              <option>Choose Employee</option>
              {employees}
            </select>
          </div>
          <div className="form-group">
            <label>What time suits you:</label>
            <select
              className="custom-select"
              id="timeDropdown"
              onChange={this.updateBookingTimeHandler}
            >
              <option>Choose Time</option>
              {times}
            </select>
          </div>
          <Button
            disabled={
              !(
                this.state.service &&
                this.state.employeeId &&
                this.state.bookingDate &&
                this.state.bookingTime
              )
            }
            classes="btn btn-primary"
          >
            Add Booking
          </Button>
        </form>
      );
    }

    // Renders error message if there is any errors
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error}</p>;
    }

    // Redirects user if already logged in
    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.BookNowBox}>
        <div className={classes.BookNow}>
          <h1>Book Now</h1>
          {authRedirect}
          {form}
          {errorMessage}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.booking.loading,
    error: state.booking.error,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddBooking: (formData, token, history) =>
      dispatch(actions.addBooking(formData, token, history)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Booking));
