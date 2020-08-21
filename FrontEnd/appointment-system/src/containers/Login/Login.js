import React, { Component } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Profile from "../Profile/Profile"

class Login extends Component {
  state = {
    username: "",
    password: "",
    accountId: "",
    account: null,
  };

  usernameTypedHandler = (event) => {
    this.setState({ username: event.target.value });
  };

  passwordTypedHandler = (event) => {
    this.setState({ password: event.target.value });
  };

  loginHandler = (event) => {
    event.preventDefault();

    const userDetails = {
      username: this.state.username,
      password: this.state.password,
    };

    let authCode = "";

    axios.post("http://localhost:8080/users/signin", userDetails).then((response) => {
      console.log(response.data);
      authCode = response.data;

      let accountId = jwtDecode(authCode).userId;

      const config = {
        headers: {
          Authorization: "Bearer " + authCode,
        },
      };

      axios
        .get("http://localhost:8080/api/accounts/" + accountId, config)
        .then((response) => this.setState({ account: response.data }));
    });
  };

  render() {

    let profile = null;

    if (this.state.account) {
      profile = <Profile account = {this.state.account}/>
    }

    return (
      <React.Fragment>
        <form onSubmit={this.loginHandler}>
          <input
            type="text"
            value={this.state.username}
            placeholder="Enter your username"
            onChange={(event) => this.usernameTypedHandler(event)}
          />
          <input
            type="password"
            value={this.state.password}
            placeholder="Enter your password"
            onChange={(event) => this.passwordTypedHandler(event)}
          />
          <button>Log In</button>
        </form>

        {profile}
      </React.Fragment>
    );
  }
}

export default Login;
