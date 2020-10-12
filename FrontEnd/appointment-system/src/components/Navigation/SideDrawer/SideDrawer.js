import React from 'react';
import { connect } from 'react-redux';
import classes from './SideDrawer.module.css';
import DashboardIcon from '../../../containers/Dashboard/DashboardIcon/DashboardIcon';
import Backdrop from '../../UI/Backdrop/Backdrop';

const sideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }
  return (
    <React.Fragment>
      <Backdrop show={props.open} cancel={props.closed} />
      <div className={attachedClasses.join(' ')} onClick={props.closed}>
        <div className={classes.Float + ' ' + classes.NoDecoration}>
          <div className={classes.Logo}>
            <span className={classes.NavLogo}>
              NE<span className={classes.Blue}>X</span>US
            </span>
            <span className={classes.Slogan}>
              <br />
              BOOKING - SYSTEM
            </span>
          </div>
        </div>
        <nav className={classes.FlexDown}>
          <DashboardIcon name="Dashboard" id="dashboard-sd" classes="fas fa-home" to="dashboard" />
          <br />
          <DashboardIcon name="Bookings" id="ViewBookings-sd" classes="fas fa-book" to="viewbookings" />
          <br />
          {props.authority === 'ROLE_ADMIN' ? (
            <React.Fragment>
              <DashboardIcon name="Employees" id="Employees-sd" classes="fas fa-users" to="employees" />
              <br />
              <DashboardIcon name="Workhours" id="Workhours-sd" classes="fas fa-hourglass-half" to="workingtimes" />
              <br />
              <DashboardIcon name="View Working Times" id="ViewWorkingTimes-sd" classes="fas fa-briefcase" to="viewworkingtimes" />
              <br />
            </React.Fragment>
          ) : null}
          {props.authority === 'ROLE_CUSTOMER' ? (
            <React.Fragment>
              <DashboardIcon name="Booking" id="Bookings-sd" classes="fas fa-book" to="bookings" />
              <br />
            </React.Fragment>
          ) : null}

          {props.authority === 'ROLE_EMPLOYEE' ? (
            <React.Fragment>
              <DashboardIcon name="Schedule" id="Schedule-sd" classes="fas fa-calendar-alt" to="schedule" />
              <br />
              <DashboardIcon
                name="Availabilities"
                id="Availabilities-sd"
                classes="fas fa-calendar-check"
                to="availabilities"
              />
              <br />
            </React.Fragment>
          ) : null}
          <DashboardIcon name="Settings" id="Settings-sd" classes="fas fa-cog" to="profile" />
          <br />
          <DashboardIcon name="Logout" id="Logout-sd" classes="fas fa-sign-out-alt" to="logout" />
        </nav>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    authority: state.auth.authority,
  };
};

export default connect(mapStateToProps)(sideDrawer);
