import React from 'react';
import Layout from '../Layout/Layout';

const HowItWorks = (props) => {
  const redirectRegister = () => {
    props.history.push('/register');
  };

  return (
    <Layout>
      <div>
        <br />
        <h2 className='text-center'>The booking System of your dreams</h2>
        <hr />
        <br />
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <p>
                Are you a company that struggles with the techy side of things?
              </p>
              <p>
                Or maybe you're still stuck with paper notes to keep track of your company's upcoming appointments?
              </p>
              <p>
                Well fortunately for you, Nexus Booking Services makes your life easy!
              </p>
              <p>
                From storing the information of all the employees and customers, quick and easy booking of appointments, and handling of employee availabilities and working times,
                to in-depth statistics about how your company is performing, Nexus Booking Services provides a brilliant foundation for your company to employ booking of services that
                you offer.
              </p>
              <p>
                To get started, simply sign up! Or, if you have questions, visit the Contact Us page.
              </p>
            </div>
          </div>
        </div>
        <div className='d-flex justify-content-center'>
          <button
            className='btn btn-link text-center'
            onClick={redirectRegister}
          >
            Sign Up
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
