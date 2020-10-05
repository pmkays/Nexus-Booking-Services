import React, { Component } from 'react';
import NavigationBar from '../../components/Navigation/NavigationBar';
import classes from './Layout.module.css';

class Layout extends Component {
  render() {
    return (
      <div className={classes.Background}>
        <NavigationBar />
        <main className='container-fluid'>{this.props.children}</main>
      </div>
    );
  }
}

//</div>footer className={classes.Foot}>Copyright © 2020 <br/> Design by Ian Nguyen <br/> Software Engineering Process and Tools: Group 7</footer>
export default Layout;
