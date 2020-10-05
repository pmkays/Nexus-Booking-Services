import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import classes from './AddEmployee.module.css';

import * as actions from '../../../store/actions/actions';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import ErrorMessage from '../../../components/UI/Input/ErrorMessage';
import { checkValidity, errorMessageToDisplay } from '../../../utility/utility';

export class AddEmployee extends Component {
  state = {
    controls: {
      username: {
        labelName: 'Username',
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Username',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
      firstName: {
        labelName: 'First Name',
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Firstname',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
      lastName: {
        labelName: 'Last Name',
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Lastname',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
      email: {
        labelName: 'Email',
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email',
        },
        value: '',
        validation: {
          required: true,
          isEmail: true,
        },
        valid: true,
        touched: false,
      },
      address: {
        labelName: 'Address',
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Address',
        },
        value: '',
        validation: {
          required: true,
        },
        valid: true,
        touched: false,
      },
      phoneNumber: {
        labelName: 'Phone number',
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Phonenumber',
        },
        value: '',
        validation: {
          required: true,
          isNumeric: true,
          exactLength: 10,
        },
        valid: true,
        touched: false,
      },
      avatar: {
        labelName: 'Avatar',
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Paste image url here',
        },
        value: '',
        validation: {
          required: false,
        },
        valid: true,
        touched: false,
      },
    },
    isFormValid: true,
  };

  // Updates value and validity of input in state when interacted with by the user
  inputChangedHandler = (event, controlName) => {
    let updatedControls = null;

    if (controlName === 'password') {
      updatedControls = {
        ...this.state.controls,
        [controlName]: {
          ...this.state.controls[controlName],
          value: event.target.value,
          valid: event.target.value === this.state.controls.passwordAgain.value,
          touched: true,
        },
        passwordAgain: {
          ...this.state.controls.passwordAgain,
          valid: event.target.value === this.state.controls.passwordAgain.value,
        },
      };
    } else if (controlName === 'passwordAgain') {
      updatedControls = {
        ...this.state.controls,
        [controlName]: {
          ...this.state.controls[controlName],
          value: event.target.value,
          valid: event.target.value === this.state.controls.password.value,
          touched: true,
        },
        password: {
          ...this.state.controls.password,
          valid: event.target.value === this.state.controls.password.value,
        },
      };
    } else {
      updatedControls = {
        ...this.state.controls,
        [controlName]: {
          ...this.state.controls[controlName],
          value: event.target.value,
          valid: checkValidity(
            event.target.value,
            this.state.controls[controlName].validation
          ),
          touched: true,
        },
      };
    }

    let formIsValid = true;
    for (let identifier in updatedControls) {
      formIsValid = updatedControls[identifier].valid && formIsValid;
    }

    this.setState({ isFormValid: formIsValid, controls: updatedControls });
  };

  // Runs when submitted and calls the redux action
  addProfileHandler = (event) => {
    event.preventDefault();

    if (!this.state.isFormValid) {
      return false;
    }

    let formData = {
      username: this.state.controls.username.value,
      password: 'abc123',
      firstName: this.state.controls.firstName.value,
      lastName: this.state.controls.lastName.value,
      email: this.state.controls.email.value,
      phoneNo: this.state.controls.phoneNumber.value,
      address: this.state.controls.address.value,
      avatar: this.state.controls.avatar.value,
    };

    this.props.onAddNewProfile(formData, this.props.history, this.props.token);
  };

  render() {
    let form = null;

    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    // Creates an input element with configurations from state
    let formElements = formElementsArray.map((formElement) => (
      <React.Fragment key={formElement.id}>
        <Input
          key={formElement.id}
          label={formElement.config.labelName}
          elementType={formElement.config.elementType}
          elementConfig={formElement.config.elementConfig}
          value={formElement.config.value}
          changed={(event) => this.inputChangedHandler(event, formElement.id)}
          invalid={!formElement.config.valid}
          shouldValidate={formElement.config.validation}
          touched={formElement.config.touched}
        />
        {formElement.config.valid ? null : (
          <ErrorMessage
            key={formElement.id + 'Error'}
            message={errorMessageToDisplay(formElement.id)}
          />
        )}
      </React.Fragment>
    ));

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

    //displays error message beneath the submit button
    let errorMsg = null;
    if (!this.state.isFormValid) {
      errorMsg = (
        <p className='text-danger'>
          Please make sure all fields are filled and valid.
        </p>
      );
    }

    form = (
      <form onSubmit={this.addProfileHandler}>
        <div className='form-group'>
          {formElements}
          {errorMessage}
          <Button disabled={!this.state.isFormValid} classes='btn btn-primary'>
            Submit
          </Button>
          {errorMsg}
        </div>
      </form>
    );

    // Renders a spinning icon if loading
    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.AddEmployeeBox}>
        {authRedirect}
        <h1>Add Employee</h1>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.profile.loading,
    error: state.profile.error,
    profileDetails: state.profile.profileDetails,
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAddNewProfile: (formData, history, token) =>
      dispatch(actions.addProfile(formData, history, 'employees', token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddEmployee));
