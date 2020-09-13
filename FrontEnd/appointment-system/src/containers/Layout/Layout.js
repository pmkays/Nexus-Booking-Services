import React, { Component } from 'react';
import NavigationBar from '../../components/Navigation/NavigationBar';
import classes from './Layout.module.css';

class Layout extends Component {
  render() {
    return (
      <div className={classes.Background}>
        <NavigationBar />
        <main className='container-fluid'>{this.props.children}</main>
        <footer className={classes.Foot}>Copyright © 2020 Ian Nguyen</footer>
      </div>
    );
  }
}

export default Layout;
