import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-sept";
import moment from "moment";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./ViewBookings.module.css";

export class ViewBookings extends Component {
  state = {
    bookings: null,
    defaultBookings: null,
    loading: false,
    error: null,
    filters: {
      complete: false,
      pending: false,
      cancelled: false,
      date: false,
      sort: "descending",
    },
    from: null,
    to: null,
  };

  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    this.setState({ ...this.state, loading: true });
    let user = "";
    switch (this.props.userType) {
      case "ROLE_CUSTOMER":
        user = "customer";
        break;
      case "ROLE_EMPLOYEE":
        user = "employee";
        break;
      case "ROLE_ADMIN":
        user = "admin";
        break;
      default:
        user = "";
        break;
    }

    let userId = user === "admin" ? "" : this.props.userId;

    axios
      .get(`/api/booking/${user}/${userId}`, config)
      .then((response) => {
        this.setState({
          ...this.state,
          defaultBookings: response.data.sort((a, b) =>
            moment(b.startTime).diff(moment(a.startTime))
          ),
          bookings: response.data.sort((a, b) =>
            moment(b.startTime).diff(moment(a.startTime))
          ),
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

  componentDidUpdate(prevProps, prevState) {
    const changeBookings = () => {
      //filter by status
      let cancelled = this.state.defaultBookings.filter(
        (x) => x.status === "cancelled"
      );
      let complete = this.state.defaultBookings.filter(
        (x) => x.status === "complete"
      );
      let pending = this.state.defaultBookings.filter(
        (x) => x.status === "pending"
      );

      //filter by date
      if (this.state.from !== null && this.state.to !== null) {
        cancelled = cancelled.filter(
          (x) =>
            moment(x.startTime).isSameOrAfter(this.state.from, "day") &&
            moment(x.startTime).isSameOrBefore(this.state.to, "day")
        );

        complete = complete.filter(
          (x) =>
            moment(x.startTime).isSameOrAfter(this.state.from, "day") &&
            moment(x.startTime).isSameOrBefore(this.state.to, "day")
        );

        pending = pending.filter(
          (x) =>
            moment(x.startTime).isSameOrAfter(this.state.from, "day") &&
            moment(x.startTime).isSameOrBefore(this.state.to, "day")
        );
      }

      let filteredBookings = [];

      //sort the results
      if (this.state.filters.sort === "ascending") {
        filteredBookings.sort((a, b) =>
          moment(a.startTime).diff(moment(b.startTime))
        );
      } else if (this.state.filters.sort === "descending") {
        filteredBookings.sort((a, b) =>
          moment(b.startTime).diff(moment(a.startTime))
        );
      }
      //populate array to display
      if (this.state.filters.cancelled) {
        filteredBookings.push(...cancelled);
      }
      if (this.state.filters.complete) {
        filteredBookings.push(...complete);
      }
      if (this.state.filters.pending) {
        filteredBookings.push(...pending);
      }

      //what happens when there's no statuses
      if (
        !this.state.filters.cancelled &&
        !this.state.filters.complete &&
        !this.state.filters.pending &&
        filteredBookings.length === 0
      ) {
        //might need to filter by date though
        if (this.state.from !== null && this.state.to !== null) {
          filteredBookings = this.state.defaultBookings.filter(
            (x) =>
              moment(x.startTime).isSameOrAfter(this.state.from, "day") &&
              moment(x.startTime).isSameOrBefore(this.state.to, "day")
          );
        } else {
          filteredBookings = this.state.defaultBookings;
        }
      }

      //sort the results
      if (this.state.filters.sort === "ascending") {
        filteredBookings.sort((a, b) =>
          moment(a.startTime).diff(moment(b.startTime))
        );
      } else if (this.state.filters.sort === "descending") {
        filteredBookings.sort((a, b) =>
          moment(b.startTime).diff(moment(a.startTime))
        );
      } else {
        filteredBookings.sort((a, b) => a.id - b.id);
      }

      this.setState({
        ...this.state,
        bookings: filteredBookings,
      });
    };
    if (
      prevState.filters !== this.state.filters ||
      prevState.from !== this.state.from ||
      prevState.to !== this.state.to
    ) {
      changeBookings();
    }
  }

  render() {
    const uppercaseFirstCharacter = (word) => {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    };

    const timeDiff = (time1, time2) => {
      var duration = moment(time1).diff(moment(time2), "hours");
      if (duration === 1) {
        return `${duration} hour`;
      }
      return `${duration} hours`;
    };

    let bookings = null;

    if (this.state.bookings !== null) {
      const customerOrEmployee = (booking) => {
        if (this.props.userType === "ROLE_CUSTOMER") {
          return (
            <td>
              {uppercaseFirstCharacter(booking.employee.firstName)}{" "}
              {uppercaseFirstCharacter(booking.employee.lastName)}
            </td>
          );
        } else if (this.props.userType === "ROLE_EMPLOYEE") {
          return (
            <td>
              {uppercaseFirstCharacter(booking.customer.firstName)}{" "}
              {uppercaseFirstCharacter(booking.customer.lastName)}
            </td>
          );
        } else {
          return (
            <React.Fragment>
              <td>
                {uppercaseFirstCharacter(booking.customer.firstName)}{" "}
                {uppercaseFirstCharacter(booking.customer.lastName)}
              </td>
              <td>
                {uppercaseFirstCharacter(booking.employee.firstName)}{" "}
                {uppercaseFirstCharacter(booking.employee.lastName)}
              </td>
            </React.Fragment>
          );
        }
      };

      bookings = this.state.bookings.map((booking) => {
        return (
          <tr key={booking.id}>
            <td>{moment(booking.startTime).format("DD/MM/yyyy")}</td>
            <td>{moment(booking.startTime).format("HH:mm")}</td>
            <td>{moment(booking.endTime).format("HH:mm")}</td>
            <td>{timeDiff(booking.endTime, booking.startTime)}</td>
            <td>{uppercaseFirstCharacter(booking.service.name)}</td>
            {customerOrEmployee(booking)}
            <td>{uppercaseFirstCharacter(booking.status)}</td>
            <td>
              <NavLink to={`/booking/${booking.id}`}>
                <i
                  className={"fas fa-arrow-right "}
                  style={{ color: "#44CDD6" }}
                ></i>
              </NavLink>
            </td>
          </tr>
        );
      });
    }

    const customerOrEmployeeHeader = () => {
      if (this.props.userType === "ROLE_CUSTOMER") {
        return <th>Employee</th>;
      } else if (this.props.userType === "ROLE_EMPLOYEE") {
        return <th>Customer</th>;
      } else {
        return (
          <React.Fragment>
            <th>Customer</th>
            <th>Employee</th>
          </React.Fragment>
        );
      }
    };

    let bookingsTable = (
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Duration</th>
            <th>Service</th>
            {customerOrEmployeeHeader()}
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{bookings}</tbody>
      </table>
    );

    if (this.state.loading) {
      bookingsTable = <Spinner />;
    }

    if (this.state.error) {
      bookings = this.state.error;
    }

    const handleSorting = (event) => {
      this.setState({
        ...this.state,
        filters: { ...this.state.filters, sort: event.target.value },
      });
    };

    const handleStatusChange = (event) => {
      let checkbox = event.target.value;
      this.setState({
        ...this.state,
        filters: { ...this.state.filters, [checkbox]: event.target.checked },
      });
    };

    let buttonType = null;
    const handleFormSubmit = (event) => {
      event.preventDefault();
      if (buttonType === "go") {
        handleDateSubmit(event);
      } else {
        handleClearDate(event);
      }
    };

    const handleDateSubmit = (event) => {
      event.preventDefault();
      this.setState({
        ...this.state,
        filters: { ...this.state.filters, date: true },
        from: event.target.from.value,
        to: event.target.to.value,
      });
    };

    const handleClearDate = (event) => {
      event.preventDefault();
      event.target.from.value = "";
      event.target.to.value = "";
      this.setState({
        ...this.state,
        filters: { ...this.state.filters, date: false },
        from: null,
        to: null,
      });
    };

    const getButton = (event) => {
      buttonType = event.target.value;
    };

    return (
      <div className={"container " + classes.Display}>
        <h1>View Bookings</h1>
        <div style={{ display: "flex" }}>
          <div className={classes.filter}>
            <h4>Filter by...</h4>
            <hr />
            <div className="row">
              <div className="col">
                <a
                  data-toggle="collapse"
                  href="#sortAccordion"
                  aria-expanded="false"
                  aria-controls="sortAccordion"
                >
                  Sort &#x25BC;
                </a>
                <div className="collapse multi-collapse" id="sortAccordion">
                  <div className="form-group">
                    <label htmlFor="sort">Date:</label>
                    <select
                      className="form-control"
                      name="sort"
                      onChange={handleSorting}
                      defaultValue="descending"
                    >
                      <option value="ascending"> Ascending </option>
                      <option value="descending"> Descending </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <a
                  data-toggle="collapse"
                  href="#statusAccordion"
                  aria-expanded="false"
                  aria-controls="statusAccordion"
                >
                  Status &#x25BC;
                </a>
                <div className="collapse multi-collapse" id="statusAccordion">
                  <div className="">
                    <input
                      type="checkbox"
                      name="Completed"
                      value="complete"
                      onChange={handleStatusChange}
                    />
                    <label htmlFor="Completed"> &nbsp; Complete</label>
                    <br />
                    <input
                      type="checkbox"
                      name="Pending"
                      value="pending"
                      onChange={handleStatusChange}
                    />
                    <label htmlFor="Pending"> &nbsp; Pending</label>
                    <br />
                    <input
                      type="checkbox"
                      name="Cancelled"
                      value="cancelled"
                      onChange={handleStatusChange}
                    />
                    <label htmlFor="Cancelled"> &nbsp; Cancelled</label>
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <a
                  data-toggle="collapse"
                  href="#dateAccordion"
                  aria-expanded="false"
                  aria-controls="dateAccordion"
                >
                  Date &#x25BC;
                </a>
                <div className="collapse multi-collapse" id="dateAccordion">
                  <form className="form" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label htmlFor="from">From:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="from"
                        name="from"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="to">To:</label>
                      <input
                        type="date"
                        className="form-control"
                        id="to"
                        name="to"
                      />
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col text-center">
                          <button
                            type="submit"
                            className="btn"
                            style={{
                              color: "white",
                              backgroundColor: "#44CDD6",
                            }}
                            onClick={getButton}
                            value="go"
                          >
                            Find!
                          </button>
                          <button
                            type="submit"
                            className="btn btn-danger"
                            onClick={getButton}
                            value="clear"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div>{bookingsTable}</div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userType: state.auth.authority,
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps)(ViewBookings);
