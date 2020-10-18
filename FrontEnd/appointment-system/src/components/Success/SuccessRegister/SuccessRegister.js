import React from 'react';
import classes from './SuccessRegister.module.css';
import { Link } from 'react-router-dom';
import Layout from '../../../containers/Layout/Layout';

const successRegister = (props) => {
  return (
    <Layout>
      <div className={classes.SuccessRegisterBox}>
        <h1>Success</h1>
        <p>
          Thank you for registering. Please log in to begin using our services!
        </p>
        <Link to={'/login'}>Login</Link>
      </div>
    </Layout>
  );
};

export default successRegister;
