import React from 'react';
import classes from './DrawerToggle.module.css';

const drawerToggle = (props) => {
  return (
    <div className={classes.DrawerToggle} onClick={props.openSideDrawHandler}>
      <i class='fas fa-bars'></i>
    </div>
  );
};

export default drawerToggle;
