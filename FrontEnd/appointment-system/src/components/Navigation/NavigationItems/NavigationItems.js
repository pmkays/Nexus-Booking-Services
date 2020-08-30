import React from "react";
import NavigationItem from "./NavigationItem/NavigationItem";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

export const NavigationItems = (props) => {
  let navItems = null;
  if (props.isAuthenticated) {
    navItems = (
      <ul className="navbar-nav ml-auto">
        <NavigationItem link="/" exact>
          Home
        </NavigationItem>
        <NavigationItem link="/about">About</NavigationItem>
        <NavigationItem link="/howitworks">How It Works</NavigationItem>
        <NavigationItem link="/contact">Contact</NavigationItem>
        <NavigationItem link="/profile">Profile</NavigationItem>
        <NavigationItem link="/logout">Log Out</NavigationItem>
      </ul>
    );
  } else {
    navItems = (
      <ul className="navbar-nav ml-auto">
        <NavigationItem link="/" exact>
          Home
        </NavigationItem>
        <NavigationItem link="/about">About</NavigationItem>
        <NavigationItem link="/howitworks">How It Works</NavigationItem>
        <NavigationItem link="/contact">Contact</NavigationItem>
        <NavigationItem link="/login">Login</NavigationItem>
        <NavigationItem link="/register">Register</NavigationItem>
      </ul>
    );
  }

  return (
    <React.Fragment>
      <NavLink className="navbar-brand" to="/" exact>
        NEXUS
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        {navItems}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(NavigationItems);
