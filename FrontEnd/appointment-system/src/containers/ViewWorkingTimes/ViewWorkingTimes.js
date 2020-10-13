import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-sept";
import moment from "moment";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./ViewWorkingTimes.module.css";

export class ViewWorkingTimes extends Component {
  state = {
    workingTimes: null,
    defaultWorkingTimes: null,
    loading: false,
    error: null,
    filters: {
      allDates: false,
      date: false,
      sort: "descending",
    },
    from: null,
    to: null,
    employeeId: -1,
    employees: [],
  };

  async componentDidMount() {
    const config = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };
    const employees = await axios.get('/api/employees/', config);
    this.setState({
      ...this.state,
      employees: [
        { id: -1, firstName: 'Select a', lastName: ' employee' },
        ...employees.data._embedded.employees,
      ],
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const changeWorkingTimes = () => {
      let allDates = this.state.defaultWorkingTimes;

      //filter by date
      if (this.state.from !== null && this.state.to !== null) {
        allDates = allDates.filter(
          (x) =>
            moment(x.startTime).isSameOrAfter(this.state.from, "day") &&
            moment(x.startTime).isSameOrBefore(this.state.to, "day")
        );
      }

      let filteredWorkingTimes = [];

      //sort the results
      if (this.state.filters.sort === "ascending") {
        filteredWorkingTimes.sort((a, b) =>
          moment(a.startTime).diff(moment(b.startTime))
        );
      } else if (this.state.filters.sort === "descending") {
        filteredWorkingTimes.sort((a, b) =>
          moment(b.startTime).diff(moment(a.startTime))
        );
      }
      //populate array to display
      if (this.state.filters.allDates) {
        filteredWorkingTimes.push(...allDates);
      }

      //what happens when there's no statuses
      if (
        !this.state.filters.allDates &&
        filteredWorkingTimes.length === 0
      ) {
        //might need to filter by date though
        if (this.state.from !== null && this.state.to !== null) {
          filteredWorkingTimes = this.state.defaultWorkingTimes.filter(
            (x) =>
              moment(x.startTime).isSameOrAfter(this.state.from, "day") &&
              moment(x.startTime).isSameOrBefore(this.state.to, "day")
          );
        } else {
          filteredWorkingTimes = this.state.defaultWorkingTimes;
        }
      }

      //sort the results
      if (this.state.filters.sort === "ascending") {
        filteredWorkingTimes.sort((a, b) =>
          moment(a.startTime).diff(moment(b.startTime))
        );
      } else if (this.state.filters.sort === "descending") {
        filteredWorkingTimes.sort((a, b) =>
          moment(b.startTime).diff(moment(a.startTime))
        );
      } else {
        filteredWorkingTimes.sort((a, b) => a.id - b.id);
      }

      this.setState({
        ...this.state,
        workingTimes: filteredWorkingTimes,
      });
    };
    if (
      prevState.filters !== this.state.filters ||
      prevState.from !== this.state.from ||
      prevState.to !== this.state.to
    ) {
      changeWorkingTimes();
    }
  }

  render() {
    const employeeList = () => {
      return (
        <select className='custom-select' onChange={setEmployee}>
          {this.state.employees.map((employee) => (
            <option value={employee.id} key={employee.id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
      );
    };
    const setEmployee = async (e) => {
      e.preventDefault();
      this.setState({ ...this.state, loading: true });
      const employeeId = e.target.value;
      const config = {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      };
      try {
        const workingTimesResponse = await axios.get(`/api/workingTime/employee/${e.target.value}`, config);
        this.setState({
          ...this.state,
          defaultWorkingTimes: workingTimesResponse.data.sort((a, b) =>
            moment(b.startTime).diff(moment(a.startTime))
          ),
          workingTimes: workingTimesResponse.data.sort((a, b) =>
            moment(b.startTime).diff(moment(a.startTime))
          ),
          loading: false,
        });
        this.setState({
          employeeId,
          workingTimes: workingTimesResponse.data,
        });
      } catch (error) {
        console.log(error);
        this.setState({
          ...this.state,
          error: "Error retrieving workingTimes.",
          loading: false,
        });
      }
    };

    const timeDiff = (time1, time2) => {
      var duration = moment(time1).diff(moment(time2), "hours");
      if (duration === 1) {
        return `${duration} hour`;
      }
      return `${duration} hours`;
    };

    let workingTimes = null;

    if (this.state.workingTimes !== null) {
      workingTimes = this.state.workingTimes.map((workingTime) => {
        return (
          <tr key={workingTime.id}>
            <td>{moment(workingTime.startTime).format("DD/MM/yyyy")}</td>
            <td>{moment(workingTime.startTime).format("HH:mm")}</td>
            <td>{moment(workingTime.endTime).format("HH:mm")}</td>
            <td>{timeDiff(workingTime.endTime, workingTime.startTime)}</td>
            <td>
              <NavLink to={`/editworkingtimes?employeeId=${this.state.employeeId}&workingTimeId=${workingTime.id}&startTime=${workingTime.startTime}&endTime=${workingTime.endTime}`}>
                Edit
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

    let workingTimesTable = (
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Total Time</th>
            <th>Edit</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{workingTimes}</tbody>
      </table>
    );

    if (this.state.loading) {
      workingTimesTable = <Spinner />;
    }

    if (this.state.error) {
      workingTimes = this.state.error;
    }

    const handleSorting = (event) => {
      this.setState({
        ...this.state,
        filters: { ...this.state.filters, sort: event.target.value },
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
        <h1 className='text-center'>View Working Times for {employeeList()}</h1>
        {this.state.workingTimes && 
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
          <div className="container">{workingTimesTable}</div>
        </div>}
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

export default connect(mapStateToProps)(ViewWorkingTimes);
