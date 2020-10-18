import React from 'react';
import classes from './Success.module.css';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';

const success = (props) => {
  let redirect = null;
  if (!props.content) {
    redirect = <Redirect to={'/dashboard'} />;
  }

  const resetSuccessHandler = () => {
    props.resetSuccessPage();
  };

  return (
    <div className={classes.SuccessBox}>
      {redirect}
      <h1>Success</h1>
      <p>{props.content}</p>
      <Link to={props.redirect} onClick={resetSuccessHandler}>
        Return
      </Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    content: state.redirect.content,
    redirect: state.redirect.redirect,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetSuccessPage: () => dispatch(actions.resetRedirect()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(success);
