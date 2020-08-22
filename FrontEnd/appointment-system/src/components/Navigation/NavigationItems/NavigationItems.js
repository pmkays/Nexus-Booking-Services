import React from "react";
import NavigationItem from "./NavigationItem/NavigationItem";
import { connect } from "react-redux";

const navigationItems = (props) => {
  let navItems = null;
  if (props.isAuthenticated) {
    navItems = (
      <ul>
        <NavigationItem link="/" exact>
          Home
        </NavigationItem>
        <NavigationItem link="/logout">Log Out</NavigationItem>
      </ul>
    );
  } else {
    navItems = (
      <ul>
        <NavigationItem link="/" exact>
          Home
        </NavigationItem>
        <NavigationItem link="/login">Login</NavigationItem>
      </ul>
    );
  }

  return navItems;
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(navigationItems);
