import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";

import * as actions from "../../../store/actions/actions";

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
      .get("http://3.208.71.179:8080/api/employees/", config)
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

  render() {
    let employees = null;

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
              <Button
                clicked={() => this.addService(employee.id)}
                classes="btn btn-primary"
              >
                Add Service(s)
              </Button>
            </td>
          </tr>
        );
      });
    }

    if (this.state.loading) {
      employees = <Spinner />;
    }

    if (this.state.error) {
      employees = this.state.error;
    }

    return (
      <div className="container">
        <br />
        <h3>Employees</h3>
        <Link className="btn btn-secondary btn-sm" to="/addemployee">
          Add Employee
        </Link>
        <br />
        <br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone No.</th>
              <th>Address</th>
              <th>Add Service</th>
            </tr>
          </thead>
          <tbody>{employees}</tbody>
        </table>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Employees);
