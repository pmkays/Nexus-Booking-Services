import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import classes from './NavigationItems.module.css';

export const NavigationItems = (props) => {
  let navItems = null;
  if (props.isAdmin && props.isAuthenticated) {
    navItems = (
      <ul className='navbar-nav ml-auto'>
        <NavigationItem link='/' exact>
          HOME
        </NavigationItem>

        <NavigationItem link='/about'>ABOUT</NavigationItem>
        <NavigationItem link='/howitworks'>HOW IT WORKS</NavigationItem>
        <NavigationItem link='/contact'>CONTACT</NavigationItem>
        <NavigationItem link='/dashboard'>
          <div className={classes.Dashboard}>
            <span>MY DASHBOARD</span>
          </div>
        </NavigationItem>

      </ul>
    );
  } else if (props.isEmployee && props.isAuthenticated) {
    navItems = (
      <ul className='navbar-nav ml-auto'>
        <NavigationItem link='/' exact>
          HOME
        </NavigationItem>
        <NavigationItem link='/about'>ABOUT</NavigationItem>
        <NavigationItem link='/howitworks'>HOW IT WORKS</NavigationItem>
        <NavigationItem link='/contact'>CONTACT</NavigationItem>
        <NavigationItem link='/dashboard'>
          <div className={classes.Dashboard}>
            <span>MY DASHBOARD</span>
          </div>
        </NavigationItem>

      </ul>
    );
  } else if (props.isCustomer && props.isAuthenticated) {
    navItems = (
      <ul className='navbar-nav ml-auto'>
        <NavigationItem link='/' exact>
          HOME
        </NavigationItem>

        <NavigationItem link='/about'>ABOUT</NavigationItem>
        <NavigationItem link='/howitworks'>HOW IT WORKS</NavigationItem>
        <NavigationItem link='/contact'>CONTACT</NavigationItem>
        <NavigationItem link='/dashboard'>
          <div className={classes.Dashboard}>
            <span>MY DASHBOARD</span>
          </div>
        </NavigationItem>

      </ul>
    );
  } else {
    navItems = (
      <ul className='navbar-nav ml-auto'>
        <NavigationItem link='/' exact>
          HOME
        </NavigationItem>
        <NavigationItem link='/about'>ABOUT</NavigationItem>
        <NavigationItem link='/howitworks'>HOW IT WORKS</NavigationItem>
        <NavigationItem link='/contact'>CONTACT</NavigationItem>
        <NavigationItem link='/login'>LOGIN</NavigationItem>
        <NavigationItem link='/register'>
          <div className={classes.Register}>
            <span>REGISTER</span>
          </div>
        </NavigationItem>
      </ul>
    );
  }

  return (
    <React.Fragment>
      <NavLink className='navbar-brand' to='/' exact>
        <div>
          <span className={classes.NavLogo}>
            NE<span className={classes.Blue}>X</span>US
          </span>
          <br />
          <span className={classes.Slogan}>BOOKING - SYSTEM</span>
        </div>
      </NavLink>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#navbarNav'
        aria-controls='navbarNav'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div className='collapse navbar-collapse' id='navbarNav'>
        {navItems}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.authority === 'ROLE_ADMIN',
    isEmployee: state.auth.authority === 'ROLE_EMPLOYEE',
    isCustomer: state.auth.authority === 'ROLE_CUSTOMER',
  };
};

export default connect(mapStateToProps)(NavigationItems);
