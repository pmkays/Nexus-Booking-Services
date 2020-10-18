import React from 'react';
import Layout from '../Layout/Layout';

const ContactUs = (props) => {
  const redirectAbout = () => {
    props.history.push('/about');
  };
  return (
    <Layout>
      <div className='container'>
        <br />
        <h2 className='text-center'>Contact Us</h2>
        <hr />
        <br />
        <div className='d-flex justify-content-between'>
          <div className='d-flex flex-column'>
            <h4 className='text-center'>
              <i className='fas fa-phone'></i> Phone
            </h4>
            <p>
              Prefer to talk directly to someone? Contact us via the phone on XXXX-XXX-XXX.
            </p>
          </div>
          <div className='d-flex flex-column'>
            <div className='container'></div>
          </div>
          <div className='d-flex flex-column'>
            <h4 className='text-center'>
              <i className='fas fa-envelope'></i> Email
            </h4>
            <p>
              Or, email us at XXXX@XXXXXXXX.XXX for other enquiries.
            </p>
          </div>
        </div>
        <hr />
        <br />
        <div className='d-flex justify-content-center'>
          <button className='btn btn-link text-center' onClick={redirectAbout}>
            About Us
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
