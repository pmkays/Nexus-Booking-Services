import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import axios from '../../../axios-sept';
import classes from './AddService.module.css';

import * as actions from '../../../store/actions/actions';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';

export class AddService extends Component {
  state = {
    services: null,
    employeeServices: null,
    loading: false,
    error: null,
    addSelected: null,
    removeSelected: null,
  };

  componentDidMount() {
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    };

    this.setState({ ...this.state, loading: true });

    axios
      .get('/api/services/', config)
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
          error: 'Error retrieving the services.',
          loading: false,
        });
      });

    axios
      .get('/api/employees/' + this.props.employeeId + '/services', config)
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
          error: 'Error retrieving the employees services.',
          loading: false,
        });
      });
  }

  // Runs when submitted and calls the redux action
  addServiceHandler = (event) => {
    event.preventDefault();

    let formData = {
      employeeId: this.props.employeeId,
      serviceName: this.state.addSelected,
    };

    this.props.onAddService(formData, this.props.token, this.props.history);
  };

  // Runs when submitted and calls the redux action
  removeServiceHandler = (event) => {
    event.preventDefault();

    let formData = {
      employeeId: this.props.employeeId,
      serviceName: this.state.removeSelected,
    };

    this.props.onRemoveService(formData, this.props.token, this.props.history);
  };

  // Runs when new service is selected to be added
  updateAddSelectedHandler = (event) => {
    event.preventDefault();
    if (event.target.value === 'Choose Service') {
      this.setState({ ...this.props.state, addSelected: null });
    } else {
      this.setState({ ...this.props.state, addSelected: event.target.value });
    }
  };

  // Runs when new service is selected to be removed
  updateRemoveSelectedHandler = (event) => {
    event.preventDefault();
    if (event.target.value === 'Choose Service') {
      this.setState({ ...this.props.state, removeSelected: null });
    } else {
      this.setState({ ...this.props.state, removeSelected: event.target.value });
    }
  };

  render() {
    let form = null;
    let removeForm = null;

    let services = null;
    let servicesToRemove = null;

    if (this.state.services !== null) {
      services = this.state.services.map((service) => {
        for (let employeeService in this.state.employeeServices) {
          if (
            service.name === this.state.employeeServices[employeeService].name
          ) {
            return null;
          }
        }
        return <option>{service.name}</option>;
      });
    }

    if (this.state.services !== null) {
      servicesToRemove = this.state.services.map((service) => {
        for (let employeeService in this.state.employeeServices) {
          if (
            service.name === this.state.employeeServices[employeeService].name
          ) {
            return <option>{service.name}</option>;
          }
        }
        return null;
      });
    }

    // Renders error message if there is any errors
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error}</p>;
    }

    if (this.props.loading) {
      form = <Spinner />;
    } else {
      form = (
        <React.Fragment>
          <form onSubmit={this.addServiceHandler}>
            <div className='form-group'>
              <select
                className='form-control'
                id='dropdown'
                onChange={this.updateAddSelectedHandler}
              >
                <option>Choose Service</option>
                {services}
              </select>
            </div>
            <div className='form-group'>
              <Button disabled={!this.state.addSelected} classes='btn btn-primary'>
                Add Service
              </Button>
            </div>
          </form>
        </React.Fragment>
      );

      removeForm = (
        <React.Fragment>
          <form onSubmit={this.removeServiceHandler}>
            <div className='form-group'>
              <select
                className='form-control'
                id='dropdown'
                onChange={this.updateRemoveSelectedHandler}
              >
                <option>Choose Service</option>
                {servicesToRemove}
              </select>
            </div>
            <div className='form-group'>
              <Button disabled={!this.state.removeSelected} classes='btn btn-primary'>
                Remove Service
              </Button>
            </div>
          </form>
        </React.Fragment>
      );
    }

    // Redirects user if already logged in
    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    return (
      <div className={classes.AddServiceBox}> 
      <h1>Edit Services</h1>
      {authRedirect}
        <div>
          {form}
        </div>
        <div>
          {removeForm}
        </div>
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
    onAddService: (formData, token, history) =>
      dispatch(actions.addService(formData, token, history)),
    onRemoveService: (formData, token, history) =>
    dispatch(actions.removeService(formData, token, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddService));
