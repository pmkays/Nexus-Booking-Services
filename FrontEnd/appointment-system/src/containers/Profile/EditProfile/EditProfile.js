import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import * as actions from "../../../store/actions/actions";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";

class EditProfile extends Component{
    state = {
        controls: {
          firstName: {
            labelName: "First Name",
            elementType: "input",
            elementConfig: {
              type: "text",
              placeholder: "Firstname",
            },
            value: "",
            // validation: {
            //   required: true,
            //   minLength: 3,
            // },
            // valid: false,
            // touched: false,
          },
          lastName: {
            labelName: "Last Name",
            elementType: "input",
            elementConfig: {
              type: "text",
              placeholder: "Lastname",
            },
            value: this.props.profileDetails == null ? "" : this.props.profileDetails.lastName,
            validation: {
              required: true,
              minLength: 6,
            },
            valid: false,
            touched: false,
          },
          email: {
            labelName: "Email",
            elementType: "input",
            elementConfig: {
              type: "email",
              placeholder: "Email",
            },
            value: this.props.profileDetails == null ? "" : this.props.profileDetails.email,
            // validation: {
            //   required: true,
            //   minLength: 6,
            // },
            // valid: false,
            // touched: false,
          },
          address: {
            labelName: "Address",
            elementType: "input",
            elementConfig: {
              type: "text",
              placeholder: "Address",
            },
            value: this.props.profileDetails == null ? "" : this.props.profileDetails.address,
            // validation: {
            //   required: true,
            //   minLength: 6,
            // },
            // valid: false,
            // touched: false,
          },
          phoneNumber: {
            labelName: "Phone number",
            elementType: "input",
            elementConfig: {
              type: "text",
              placeholder: "Phonenumber",
            },
            value: this.props.profileDetails == null ? "" : this.props.profileDetails.phoneNo,
            // validation: {
            //   required: true,
            //   minLength: 6,
            // },
            // valid: false,
            // touched: false,
          },
        }
    }
    
    componentDidMount(){
        this.f1();
    }

    // fillInValue(){
    //     this.props.onFetchProfile(this.props.token);
    // }

    async f1(){
        await this.props.onFetchProfile(this.props.token);
        await this.getValue();
    }

    getValue = () => {
        const updatedControls = {
            ...this.state.controls,
            firstName: {
                ...this.state.controls.firstName,
                value: this.props.profileDetails == null ? "" : this.props.profileDetails.firstName
            }
        };

        this.setState({
            controls: updatedControls
        });
    }



    // Checks validity of user input
//   checkValidity(value, rules) {
//     let isValid = true;

//     if (rules.required) {
//       isValid = value.trim() !== "" && isValid;
//     }
//     if (rules.minLength) {
//       isValid = value.length >= rules.minLength && isValid;
//     }
//     if (rules.maxLength) {
//       isValid = value.length <= rules.maxLength && isValid;
//     }

//     if (rules.isEmail) {
//       const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
//       isValid = pattern.test(value) && isValid;
//     }

//     if (rules.isNumeric) {
//       const pattern = /^\d+$/;
//       isValid = pattern.test(value) && isValid;
//     }
//     return isValid;
//   }

  // Updates value and validity of input in state when interacted with by the user
  inputChangedHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        // valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        // touched: true,
      },
    };

    this.setState({ controls: updatedControls });
  };

  // Runs when submitted and calls the redux action
  editProfileHandler = (event) => {
    event.preventDefault();

    let formData = {
        firstName: this.state.controls.firstName.value,
        lastName: this.state.controls.lastName.value,
        email: this.state.controls.email.value,
        phoneNo: this.state.controls.phoneNumber.value,
        address: this.state.controls.address.value
    }
    
    this.props.onEditProfile(formData, this.props.token);
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    // Creates an input element with configurations from state
    let form = formElementsArray.map((formElement) => (
      <Input
        key={formElement.id}
        label={formElement.config.labelName}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        changed={(event) => this.inputChangedHandler(event, formElement.id)}
        // invalid={!formElement.config.valid}
        // shouldValidate={formElement.config.validation}
        // touched={formElement.config.touched}
      />
    ));

    // Renders a spinning icon if loading
    if (this.props.loading) {
      form = <Spinner />;
    }

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
        <form onSubmit={this.editProfileHandler}>
          <div class="form-group">
            {form}
            {errorMessage}
            <Button classes="btn btn-primary">SUBMIT</Button>
          </div>
        </form>
        <span>{this.props.profileDetails == null ? "" : this.props.profileDetails.firstName}</span>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
    return {
      loading: state.profile.loading,
      error: state.profile.error,
      profileDetails: state.profile.profileDetails,
      token: state.auth.token
    };
  };
  
const mapDispatchToProps = (dispatch) => {
  return {
    onEditProfile: (formData, token) => dispatch(actions.editProfile(formData, token)),
    onFetchProfile: (token) => dispatch(actions.fetchProfile(token)),
  };
};

  

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
