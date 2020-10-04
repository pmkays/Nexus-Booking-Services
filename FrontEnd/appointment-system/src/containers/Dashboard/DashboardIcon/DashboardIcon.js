import React from 'react';
import classes from './DashboardIcon.module.css';

const dashboardIcon = (props) => (
  <div className={classes.Center + ' ' + classes.Flex}>
    <div className={classes.IconMargin}>
      <NavLink
        activeClassName={classes.IconActive}
        className={classes.Icon}
        to='/dashboard'
      >
        <i
          className=' fas fa-home'
          onMouseOver={() => this.appear('dashboard')}
          onMouseLeave={() => this.dissappear('dashboard')}
        ></i>
      </NavLink>
    </div>
    <div id='dashboard' className={classes.Index + ' ' + classes.Hide}>
      <Animated
        className={classes.Flex}
        animationIn='fadeInLeft'
        animationInDuration={200}
      >
        <div className={classes.DashboardLabel}>Dashboard</div>
        <div className={classes.DashboardLabelHighLight}></div>
      </Animated>
    </div>
  </div>
);

export default dashboardIcon;
