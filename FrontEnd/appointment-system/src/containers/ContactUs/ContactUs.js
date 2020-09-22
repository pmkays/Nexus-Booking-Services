import React from 'react';

const ContactUs = (props) => {
  const redirectAbout = () => {
    props.history.push('/about');
  };
  return (
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
  );
};

export default ContactUs;
