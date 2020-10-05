import React, { Component } from 'react';
import * as actions from '../../store/actions/actions';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Layout from '../Layout/Layout';

import { checkValidity } from '../../utility/utility';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';

class Login extends Component {
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
          minLength: 3,
        },
        valid: false,
        touched: false,
      },
      password: {
        labelName: 'Password',
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password',
        },
        value: '',
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
    },
    isSignUp: true,
  };

  // Updates value and validity of input in state when interacted with by the user
  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
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

    this.setState({ controls: updatedControls });
  };

  // Runs when submitted and calls the redux action
  loginHandler = (event) => {
    event.preventDefault();

    this.props.onAuthentication(
      this.state.controls.username.value,
      this.state.controls.password.value,
      this.state.isSignUp
    );
  };

  render() {
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

    //Create form elements
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    // Creates an input element with configurations from state
    let formElements = formElementsArray.map((formElement) => (
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
    ));

    let form = (
      <form onSubmit={this.loginHandler}>
        <div className='form-group container'>
          {formElements}
          {errorMessage}
          <Button classes='btn btn-primary'>SUBMIT</Button>
        </div>
      </form>
    );

    // Renders a spinning icon if loading
    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <Layout>
        <div>{authRedirect}</div>
        {form}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirect,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthentication: (username, password, isSignUp) =>
      dispatch(actions.auth(username, password, isSignUp)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
