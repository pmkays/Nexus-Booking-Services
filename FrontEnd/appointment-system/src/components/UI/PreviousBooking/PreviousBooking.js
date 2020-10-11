import React from 'react';
import Icon from './images/icon.svg';
import classes from './PreviousBooking.module.css';

const previousBooking = (props) => (
  <div className='row'>
    <hr />
    <div className={classes.Icon + ' col-sm-2'} onClick={props.clicked}>
      <img src={Icon} alt='icon' />
    </div>
    <div className={' col-sm-5'}>
      <span className={classes.Bold}>{props.serviceName}</span>
      <br />
      <p>With {props.employeeName}</p>
    </div>
    <div className='col-sm-5'>
      <p className={classes.Bold}>{props.startTime}</p>
    </div>
  </div>
);

export default previousBooking;
