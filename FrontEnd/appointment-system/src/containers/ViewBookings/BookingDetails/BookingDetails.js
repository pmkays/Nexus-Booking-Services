import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/profile";
import axios from "../../../axios-sept";
import moment from "moment";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { uppercaseFirstCharacter, timeDiff } from "../../../utility/utility";
import classes from "./BookingDetails.module.css";
import { withRouter } from "react-router-dom";

export class BookingDetails extends Component {
  state = {
    loading: false,
    error: null,
    bookingDetails: null,
  };

  //As soon as this component loads it will attempt to grab booking details
  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    this.setState({ ...this.state, loading: true });

    //url is booking/{id}
    let bookingId = this.props.match.params.id;
    axios
      .get(`/api/booking/${bookingId}`, config)
      .then((response) => {
        this.setState({
          ...this.state,
          bookingDetails: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: "Error retrieving bookings.",
          loading: false,
        });
      });

  }

  render() {
    const customerOrEmployeeName = () => {
      let booking = this.state.bookingDetails;
      if (
        this.props.userType === "ROLE_CUSTOMER" ||
        this.props.userType === "ROLE_ADMIN"
      ) {
        return (
          <h4>
            {uppercaseFirstCharacter(booking.employee.firstName)}{" "}
            {uppercaseFirstCharacter(booking.employee.lastName)}
          </h4>
        );
      } else if (this.props.userType === "ROLE_EMPLOYEE") {
        return (
          <h4>
            {uppercaseFirstCharacter(booking.customer.firstName)}{" "}
            {uppercaseFirstCharacter(booking.customer.lastName)}
          </h4>
        );
      }
    };

    const customerOrEmployeeImg = () => {
      if (
        this.props.userType === "ROLE_CUSTOMER" ||
        this.props.userType === "ROLE_ADMIN"
      ) {
        return (
          <img src={this.state.bookingDetails.employee.img} alt="employee" />
        );
      } else if (this.props.userType === "ROLE_EMPLOYEE") {
        return (
          <img src={this.state.bookingDetails.customer.img} alt="customer" />
        );
      }
    };

    const customerOrEmployeeDescription = () => {
      let booking = this.state.bookingDetails;
      if (
        this.props.userType === "ROLE_CUSTOMER" ||
        this.props.userType === "ROLE_ADMIN"
      ) {
        return <p>{booking.employee.description}</p>;
      } else if (this.props.userType === "ROLE_EMPLOYEE") {
        return (
          <div className={classes.customerDesc}>
            <dl className="row">
              <dd className="col-sm-3">Email:</dd>
              <dd className="col-sm-9">{booking.customer.email}</dd>
              <dd className="col-sm-3">Number:</dd>
              <dd className="col-sm-9">{booking.customer.phoneNo}</dd>
              <dd className="col-sm-3">Address:</dd>
              <dd className="col-sm-9">{booking.customer.address}</dd>
            </dl>
          </div>
        );
      }
    };

    let customerOrEmployeeHeader =
      this.props.userType === "ROLE_CUSTOMER" ||
      this.props.userType === "ROLE_ADMIN"
        ? "Employee"
        : "Customer";

    const customerDetailsForAdmin = () => {
      let booking = this.state.bookingDetails;
      if (this.props.userType === "ROLE_ADMIN") {
        return (
          <React.Fragment>
            <dt className="col-sm-4">Customer:</dt>
            <dd className="col-sm-8">
              {uppercaseFirstCharacter(booking.customer.firstName)}{" "}
              {uppercaseFirstCharacter(booking.customer.lastName)}
            </dd>
          </React.Fragment>
        );
      } else {
        return null;
      }
    };

    const handleStatusChange = (event) => {
      let booking = this.state.bookingDetails;
      let bookingToSend = {
        startTime: booking.startTime,
        endTime: booking.endTime,
        employeeId: booking.employee.id,
        customerId: booking.customer.id,
        serviceId: booking.service.id,
      };

      const config = {
        headers: {
          Authorization: "Bearer " + this.props.token,
        },
      };

      let url = `/api/booking/${event.target.id}`;

      axios
        .post(url, bookingToSend, config)
        .then((response) => {
          this.setState({
            ...this.state,
            bookingDetails: response.data,
          });
        })
        .catch((error) => {
          this.setState({
            ...this.state,
            error: "Error retrieving bookings.",
            loading: false,
          });
        });
    };

    let booking = <Spinner />;

    const shouldBeDisabled = () => {
      var time = moment(this.state.bookingDetails.startTime),
        beforeTime = moment(),
        afterTime = moment().add(48, "hours");

      return time.isBetween(beforeTime, afterTime, "hours") || time.isBefore(moment());
    };

    const isInThePast = () => {
      var time = moment(this.state.bookingDetails.endTime),
        currentTime = moment();

      return currentTime.isAfter(time);
    };

    let showBtns = () => {

      let completeBtn = isInThePast() ? (<button
        id="complete"
        type="button"
        className={classes.completeBtn}
        onClick={handleStatusChange}
      > Complete
      </button>) : null;

      if (
        this.state.bookingDetails.status !== "pending" ||
        this.props.userType === "ROLE_ADMIN"
      ) {
        return null;
      } else if (shouldBeDisabled()) {
        return (
          <React.Fragment>
            <button type="button" className={classes.cancelBtn} disabled>
              Cancel
            </button>
            <br/>
            {completeBtn}
            <div className={classes.note}>
              <p>
                Note you cannot cancel a booking within 48 hours of the booking
                time
              </p>
            </div>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <button
              id="cancel"
              type="button"
              className={classes.cancelBtn}
              onClick={handleStatusChange}
            >
              Cancel
            </button>
            <br/>
            {completeBtn}
            <div className={classes.note}>
              <p>
                Note you cannot cancel a booking within 48 hours of the booking
                time
              </p>
            </div>
          </React.Fragment>
        );
      }
    };

    // If not loading and the profile is present, it will render the details
    if (this.state.bookingDetails != null) {
      booking = (
        <React.Fragment>
          <div className="row">
            {/*blue-green div*/}
            <div className={"col-sm-4 " + classes.bookingDetails}>
              {" "}
              {/*booking details div*/}
              <div className={classes.whiteContainer}>
                <h1>Booking Details</h1>
                <hr />
                <dl className="row">
                  <dt className="col-sm-4">Date:</dt>
                  <dd className="col-sm-8">
                    {moment(this.state.bookingDetails.startTime).format(
                      "DD/MM/yyyy"
                    )}
                  </dd>
                  <dt className="col-sm-4">Start Time:</dt>
                  <dd className="col-sm-8">
                    {moment(this.state.bookingDetails.startTime).format(
                      "HH:mm"
                    )}
                  </dd>
                  <dt className="col-sm-4">End Time:</dt>
                  <dd className="col-sm-8">
                    {moment(this.state.bookingDetails.endTime).format("HH:mm")}
                  </dd>
                  <dt className="col-sm-4">Duration:</dt>
                  <dd className="col-sm-8">
                    {timeDiff(
                      this.state.bookingDetails.endTime,
                      this.state.bookingDetails.startTime
                    )}
                  </dd>
                  <dt className="col-sm-4">Status:</dt>
                  <dd className="col-sm-8">
                    {uppercaseFirstCharacter(this.state.bookingDetails.status)}
                  </dd>
                  {customerDetailsForAdmin()}
                  <div>
                    {showBtns()}
                  </div>
                  <br />
                </dl>
              </div>
            </div>
            <div className={"col-sm-8 " + classes.extraDetails}>
              <div className={"row " + classes.lightGreenContainer}>
                {" "}
                {/*this div is meant to be light green*/}
                <div
                  className={
                    "col-sm-3 d-flex justify-content-center text-center " +
                    classes.title
                  }
                >
                  {" "}
                  {/*for services*/}
                  <h2>Service</h2>
                </div>
                <div className={"col-sm-9 " + classes.whiteContainer}>
                  {" "}
                  {/*this div is meant to be white*/}
                  <div className={"row " + classes.name}>
                    <h4>
                      {uppercaseFirstCharacter(
                        this.state.bookingDetails.service.name
                      )}
                    </h4>
                  </div>
                  <hr />
                  <div className="row">
                    <div className={"col " + classes.description}>
                      <p>{this.state.bookingDetails.service.description}</p>
                    </div>
                    <div className={"col " + classes.image}>
                      <img
                        src={this.state.bookingDetails.service.img}
                        alt="service"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={"row " + classes.lightGreenContainer}>
                {" "}
                {/*this div is meant to be light green*/}
                <div
                  className={
                    "col-sm-3 d-flex justify-content-center text-center " +
                    classes.title
                  }
                >
                  {" "}
                  {/*for employees/customers */}
                  <h2>{customerOrEmployeeHeader}</h2>
                </div>
                <div className={"col-sm-9 " + classes.whiteContainer}>
                  {/*this div is meant to be white*/}
                  <div className={"row " + classes.name}>
                    <h4>{customerOrEmployeeName()}</h4>
                  </div>
                  <hr />
                  <div className="row">
                    <div className={"col " + classes.description}>
                      {customerOrEmployeeDescription()}
                    </div>
                    <div className={"col " + classes.image}>
                      {customerOrEmployeeImg()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }

    if (this.state.error) {
      booking = this.state.error;
    }

    return <div className={classes.container}>{booking}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userType: state.auth.authority,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: (token) => dispatch(actions.fetchProfile(token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BookingDetails));
