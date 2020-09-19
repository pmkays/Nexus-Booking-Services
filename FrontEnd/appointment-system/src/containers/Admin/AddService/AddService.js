import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

import * as actions from "../../../store/actions/actions";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";

export class AddService extends Component {
  state = {
    services: null,
    employeeServices: null,
    loading: false,
    error: null,
    selected: null,
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
          error: "Error retrieving the employees services.",
          loading: false,
        });
      });

    axios
      .get(
        "http://localhost:8080/api/employees/" +
          this.props.employeeId +
          "/services",
        config
      )
      .then((response) => {
        this.setState({
          ...this.state,
          employeeServices: response.data._embedded.services,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: "Error retrieving the employees services.",
          loading: false,
        });
      });
  }

  // Runs when submitted and calls the redux action
  addServiceHandler = (event) => {
    event.preventDefault();

    let formData = {
      employeeId: this.props.employeeId,
      serviceName: this.state.selected,
    };

    this.props.onAddService(formData, this.props.token);
  };

  // Runs when new service is selected
  updateSelectedHandler = (event) => {
    event.preventDefault();
    if (event.target.value === "Choose Service") {
      this.setState({ ...this.props.state, selected: null });
    } else {
      this.setState({ ...this.props.state, selected: event.target.value });
    }
  };

  render() {
    let form = null;

    let services = null;

    if (this.state.services !== null) {
      services = this.state.services.map((service) => {
        for (let employeeService in this.state.employeeServices) {
          if (
            service.name === this.state.employeeServices[employeeService].name
          ) {
            return;
          }
        }
        return <option>{service.name}</option>;
      });
    }

    if (this.props.loading) {
      form = <Spinner />;
    } else {
      form = (
        <form onSubmit={this.addServiceHandler}>
          <div className="form-group container">
            <select id="dropdown" onChange={this.updateSelectedHandler}>
              <option>Choose Service</option>
              {services}
            </select>
          </div>
          <div className="form-group container">
            <Button disabled={!this.state.selected} classes="btn btn-primary">
              Add Service
            </Button>
          </div>
        </form>
      );
    }

    console.log(this.state.selected);

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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.service.loading,
    error: state.service.error,
    token: state.auth.token,
    employeeId: state.service.employeeId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddService: (formData, token) =>
      dispatch(actions.addService(formData, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddService);
