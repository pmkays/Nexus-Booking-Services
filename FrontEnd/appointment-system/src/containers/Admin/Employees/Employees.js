import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

import Spinner from "../../../components/UI/Spinner/Spinner";

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
      .get("http://localhost:8080/api/employees/", config)
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
      <React.Fragment>
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
              <th></th>
            </tr>
          </thead>
          <tbody>{employees}</tbody>
        </table>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export default connect(mapStateToProps)(Employees);
