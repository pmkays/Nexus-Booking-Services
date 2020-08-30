import React from "react";

const AboutUs = (props) => {
  const redirectContact = () => {
    props.history.push("/contact");
  };
  return (
    <div>
      <br />
      <h2 className="text-center">Appointment Bookings done correctly</h2>
      <hr />
      <br />
      <div className="container">
        <div className="row">
          <div className="col col-md-2 h5">
            <p>
              <i className="fas fa-check"></i> Benifit One
            </p>
          </div>
          <div className="col">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col col-md-2 h5">
            <p>
              <i className="fas fa-check"></i> Benifit Two
            </p>
          </div>
          <div className="col">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col col-md-2 h5">
            <p>
              <i className="fas fa-check"></i> Benifit Three
            </p>
          </div>
          <div className="col">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col col-md-2 h5">
            <p>
              <i className="fas fa-check"></i> Benifit Four
            </p>
          </div>
          <div className="col">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>
      <hr />
      <br />
      <p className="text-center">Questions?</p>
      <div className="d-flex justify-content-center">
        <button className="btn btn-link text-center" onClick={redirectContact}>
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
