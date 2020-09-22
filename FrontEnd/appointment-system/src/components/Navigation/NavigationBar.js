import React from 'react';
import NavigationItems from './NavigationItems/NavigationItems';
import classes from './NavigationBar.module.css';

const navigationBar = (props) => {
  return (
    <nav
      className={
        classes.NavigationBar + ' navbar navbar-expand-lg navbar-light'
      }
    >
      <NavigationItems />
    </nav>
  );
};

export default navigationBar;
