import React from 'react';
import classes from './DashboardIcon.module.css';
import { NavLink } from 'react-router-dom';
import { Animated } from 'react-animated-css';

const dashboardIcon = (props) => {
  const appear = (element) => {
    var x = document.getElementById(element);
    x.style.display = 'block';
  };

  const dissappear = (element) => {
    var x = document.getElementById(element);
    x.style.display = 'none';
  };

  return (
    <div className={classes.Center + ' ' + classes.Flex}>
      <div className={classes.IconMargin}>
        <NavLink
          activeClassName={classes.IconActive}
          className={classes.Icon}
          to={props.to}
        >
          <i
            className={props.classes}
            onMouseOver={() => appear(props.to)}
            onMouseLeave={() => dissappear(props.to)}
          ></i>
        </NavLink>
      </div>
      <div id={props.to} className={classes.Index + ' ' + classes.Hide}>
        <Animated
          className={classes.Flex}
          animationIn='fadeInLeft'
          animationInDuration={200}
        >
          <div className={classes.DashboardLabel}>{props.name}</div>
          <div className={classes.DashboardLabelHighLight}></div>
        </Animated>
      </div>
    </div>
  );
};

export default dashboardIcon;
