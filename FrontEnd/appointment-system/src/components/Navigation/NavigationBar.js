import React from "react";
import NavigationItems from "./NavigationItems/NavigationItems";

const navigationBar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavigationItems />
    </nav>
  );
};

export default navigationBar;
