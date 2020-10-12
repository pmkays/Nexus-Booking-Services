import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "../../../axios-sept";

import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";

import * as actions from "../../../store/actions/actions";
import classes from "./Employees.module.css";

export class Employees extends Component {
  state = {
    employees: null,
    loading: false,
    error: null,
  };

  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    this.setState({ ...this.state, loading: true });

    axios
      .get("/api/employees/", config)
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
          error: "Error retrieving employees.",
          loading: false,
        });
      });
  }

  addService = (employeeId) => {
    this.props.addService(employeeId);
    this.props.history.push("/addservice");
  };

  editEmployee = (employeeId) => {
    this.props.onFetchEmployee(employeeId, this.props.token, this.props.history);
  };

  viewSchedule = (employeeId) => {
    this.props.history.push("/schedule/"+employeeId);
  };

  render() {
    let employees = null;
    let tbody = null;
    let employeeTable = null;

    if (this.state.employees !== null) {
      employees = this.state.employees.map((employee) => {
        return (
          <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>{employee.email}</td>
            <td>{employee.phoneNo}</td>
            <td>{employee.address}</td>
            <td>
              <Button clicked={() => this.viewSchedule(employee.id)} classes="btn btn-primary">
                View
              </Button>
            </td>
            <td>
              <Button clicked={() => this.addService(employee.id)} classes="btn btn-primary">
                Edit
              </Button>
            </td>
            <td>
              <Button clicked={() => this.editEmployee(employee.id)} classes="btn btn-primary">
                Edit
              </Button>
            </td>
          </tr>
        );
      });
    }

    tbody = <tbody>{employees}</tbody>;
    employeeTable = (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone No.</th>
            <th scope="col">Address</th>
            <th scope="col">Schedule</th>
            <th scope="col">Service</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        {tbody}
      </table>
    );

    if (this.state.loading) {
      employeeTable = <Spinner />;
    }

    if (this.state.error) {
      employeeTable = this.state.error;
    }

    return (
      <div className={classes.EmployeesBox}>
        <div className="container">
          <h1>Employees</h1>
          <Link className="btn btn-secondary btn-sm" to="/addemployee">
            Add Employee
          </Link>
          <br />
          <br />
          {employeeTable}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    employeeId: state.service.employeeId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addService: (employeeId) => dispatch(actions.updateEmployeeId(employeeId)),
    onFetchEmployee: (id, token, history) => dispatch(actions.fetchEmployee(id, token, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Employees));
