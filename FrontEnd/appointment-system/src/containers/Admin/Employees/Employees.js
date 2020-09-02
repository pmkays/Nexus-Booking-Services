import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

class Employees extends Component {
  state = {
    employees: null,
  };

  componentDidMount() {
    const config = {
      headers: {
        Authorization: "Bearer " + this.props.token,
      },
    };

    axios
      .get("http://localhost:8080/api/employees/", config)
      .then((response) => {
        console.log(response.data._embedded.employees);
        this.setState({
          ...this.state,
          employees: response.data._embedded.employees,
        });
      })
      .catch((error) => {
        console.log("Error poop");
      });
  }

  render() {
    let employees = null;

    if (this.state.employees !== null) {
      console.log("lol");
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

    return (
      <React.Fragment>
        <br />
        <h3>Employees</h3>
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
