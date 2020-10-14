import React from 'react';
import Layout from '../Layout/Layout';

const AboutUs = (props) => {
  const redirectContact = () => {
    props.history.push('/contact');
  };
  return (
    <Layout>
      <div>
        <br />
        <h2 className='text-center'>Appointment Bookings Done Correctly</h2>
        <hr />
        <br />
        <div className='container'>
          <div className='row'>
            <div className='col col-md-2 h5'>
              <p>
                <i className='fas fa-check'></i> Benifit One
              </p>
            </div>
            <div className='col'>
              <p>
                Manage your company's employees and customers with ease.
              </p>
            </div>
          </div>
          <div className='row'>
            <div className='col col-md-2 h5'>
              <p>
                <i className='fas fa-check'></i> Benifit Two
              </p>
            </div>
            <div className='col'>
              <p>
                Use our charts and graphs to view detailed statistics about your company's performance.
              </p>
            </div>
          </div>
          <div className='row'>
            <div className='col col-md-2 h5'>
              <p>
                <i className='fas fa-check'></i> Benifit Three
              </p>
            </div>
            <div className='col'>
              <p>
                Simple user interface that makes using the website fun and intuitive.
              </p>
            </div>
          </div>
          <div className='row'>
            <div className='col col-md-2 h5'>
              <p>
                <i className='fas fa-check'></i> Benifit Four
              </p>
            </div>
            <div className='col'>
              <p>
                Easily keep track of all your company's bookings, both in the past and future.
              </p>
            </div>
          </div>
        </div>
        <hr />
        <br />
        <p className='text-center'>Questions?</p>
        <div className='d-flex justify-content-center'>
          <button
            className='btn btn-link text-center'
            onClick={redirectContact}
          >
            Contact Us
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
