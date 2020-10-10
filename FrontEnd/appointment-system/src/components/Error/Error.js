import React from 'react';
import classes from './Error.module.css';
import { Link, Redirect } from 'react-router-dom';

const error = (props) => {
  let redirect = null;
  if (!props.content) {
    redirect = <Redirect to={'/dashboard'} />;
  }

  return (
    <div className={classes.ErrorBox}>
      {redirect}
      <h1>Error</h1>
      <p>{props.content}</p>
      <Link to="/">Return to homepage</Link>
    </div>
  );
};

export default error;
