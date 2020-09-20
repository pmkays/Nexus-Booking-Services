import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import axios from "axios";

import * as actions from "../../store/actions/actions";
import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";

export class Booking extends Component {
  state = {
    time: moment(),
    services: null,
    service: null,
    bookingDate: null,
    bookingTime: null,
    employees: null,
    employeeId: null,
    loading: false,
    error: null,
    dates: null,
  };

  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    this.setState({ ...this.state, loading: true });

    axios
      .get("http://localhost:8080/api/services/", config)
      .then((response) => {
        this.setState({
          ...this.state,
          services: response.data._embedded.services,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: "Error retrieving the services.",
          loading: false,
        });
      });
  }

  // Runs when new date is selected
  updateDateHandler = (event) => {
    event.preventDefault();
    if (event.target.value === "Choose Date") {
      this.setState({ ...this.props.state, bookingDate: null });
    } else {
      this.setState({ ...this.props.state, bookingDate: event.target.value });
    }
  };

  updateDateHandler2 = (event) => {
    // update dropdown box for services
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };
    const url = "http://localhost:8080/api/service/findAllByDate";

    let formData = {
      startTime: `${this.state.bookingDate}T00:00:00`,
    };

    console.log("sHIIIIIIIIIIIIIIIIIIIT " + formData.startTime);

    axios
      .post(url, formData, config)
      .then((response) => {
        console.log(response.data[0].name);
        console.log("yeet1");
        console.log(response.data);
        console.log("yeet");
        this.setState({
          ...this.state,
          services: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: "Error retrieving the services.",
          loading: false,
        });
      });

    // console.log(" SERVICESSSSSS ============== " + this.state.services);
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
    const url =
      "http://localhost:8080/api/services/" + event.target.value + "/employees";
    console.log(url);
    axios
      .get(url, config)
      .then((response) => {
        this.setState({
          ...this.state,
          employees: response.data._embedded.employees,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: "Error retrieving the employees.",
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
    // adding 30 minutes to the end, as every booking is 30 minutes
    // so, simply changing the end of the string to 30 instead of 00
    const newEnd = `${
      this.state.bookingDate
    }T${this.state.bookingTime.substring(0, 6)}30`;

    console.log(newStart);
    console.log(newEnd);

    let formData = {
      employeeId: this.state.employeeId,
      serviceId: this.state.service,
      startTime: newStart,
      endTime: newEnd,
    };

    this.props.onAddBooking(formData, this.props.token);
  };

  render() {
    console.log(this.state.time.format("YYYY-MM-DD"));

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

    // Adding times to time drop down
    const populateTimes = () => {
      const times = [];
      for (let i = 0; i <= 24; i++) {
        // console.log(i);
        let str = null;
        if (i < 10) {
          str = `0${i}:00`;
        } else {
          str = `${i}:00`;
        }
        times.push(str);
      }
      return times.map((time) => (
        <option value={`${time}:00`} key={time}>
          {time}
        </option>
      ));
    };

    // adding services to service drop down
    let services = null;

    if (this.state.services !== null) {
      services = this.state.services.map((service) => {
        console.log(service.id);
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

    let form = null;

    // console.log("SERVICESSSS =========== " + this.state.services);

    if (this.props.loading) {
      form = <Spinner />;
    } else {
      form = (
        <form onSubmit={this.addBookingHandler}>
          <div className="form-group container">
            <select
              className="custom-select"
              id="dateDropdown"
              onChange={this.updateDateHandler}
            >
              {populateDates()}
            </select>
            <select
              className="custom-select"
              id="serviceDropdown"
              onChange={this.updateServiceAndEmployeeDropDownHandler}
            >
              <option>Choose Service</option>
              {services}
            </select>
            <select
              className="custom-select"
              id="employeeDropdown"
              onChange={this.updateEmployeeHandler}
            >
              <option>Choose Employee</option>
              {employees}
            </select>
            <select
              className="custom-select"
              id="timeDropdown"
              onChange={this.updateBookingTimeHandler}
            >
              <option>Choose Time</option>
              {populateTimes()}
            </select>
          </div>
          <div className="form-group container">
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
              Add Service
            </Button>
          </div>
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
      <div>
        {authRedirect}
        {form}

        {errorMessage}
        <Button clicked={this.updateDateHandler2} classes="btn btn-primary">
          Render
        </Button>
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
    onAddBooking: (formData, token) =>
      dispatch(actions.addBooking(formData, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Booking);
