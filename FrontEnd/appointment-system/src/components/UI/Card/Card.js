import React from 'react';
import classes from './Card.module.css';

const card = (props) => (
  <div className={classes.Card} onClick={props.clicked}>
    <div className={classes.NoMargin + ' row'}>
      <img
        className={classes.Image}
        src={props.imgUrl}
        alt={props.serviceName}
      />
    </div>
    <div className={classes.NoMargin + ' row'}>
      <span className={classes.Bold}>{props.serviceName}</span>
    </div>
    <div className={classes.NoMargin + ' row'}>
      <p className={classes.SmallBold}>With {props.employeeName}</p>
    </div>
    <div className={classes.NoMargin + ' row'}>
      <p>{props.startTime}</p>
    </div>
  </div>
);

export default card;
