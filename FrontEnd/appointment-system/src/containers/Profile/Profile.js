import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import { NavLink } from 'react-router-dom';
import classes from './Profile.module.css';
import axios from '../../axios-sept';
import Spinner from '../../components/UI/Spinner/Spinner';

export class Profile extends Component {
  state = {
    service: null,
  };
  //As soon as this component loads it will attempt to grab the current profile
  componentDidMount() {
    this.props.onFetchProfile(this.props.token);
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    };

    if (this.props.userType === 'ROLE_EMPLOYEE') {
      axios
        .get(`/api/employees/${this.props.userId}/services`, config)
        .then((response) => {
          this.setState({
            ...this.state,
            service: response.data,
          });
        })
        .catch((error) => {
          this.setState({
            ...this.state,
            error: 'Error retrieving service for employee',
            loading: false,
          });
        });
    }
  }

  render() {
    const extractServiceNames = () => {
      let services = this.state.service._embedded.services;
      let names = '';
      services.map((x) => (names += `${x.name}, `));

      //cut out the , and space at the end
      return names.slice(0, names.length - 2);
    };

    const service = () => {
      if (this.state.service != null) {
        return (
          <React.Fragment>
            <dt className="col-sm-12 col-md-4">Services</dt>
            <dd className="col-sm-12 col-md-8">{extractServiceNames()}</dd>
          </React.Fragment>
        );
      } else {
        return null;
      }
    };

    let description = null;
    if (this.props.userType === 'ROLE_EMPLOYEE') {
      description = (
        <React.Fragment>
          <dt className="col-sm-12 col-md-4">Description</dt>
          <dd className="col-sm-12 col-md-8">{this.props.profileDetails.description}</dd>
        </React.Fragment>
      );
    }

    let profile = <Spinner />;

    // If not loading and the profile is present, it will render the details
    if (!this.props.loading && this.props.profileDetails !== null) {
      profile = (
        <React.Fragment>
          <h1>My Profile</h1>
          <p>
            <NavLink to="/editprofile">Edit Profile</NavLink>
          </p>
          <hr />
          <div className={classes.ProfileDetails}>
            <dl className="row">
              <dt className="col-sm-12 col-md-4">First Name</dt>
              <dd className="col-sm-12 col-md-8">{this.props.profileDetails.firstName}</dd>
              <dt className="col-sm-12 col-md-4">Last Name</dt>
              <dd className="col-sm-12 col-md-8">{this.props.profileDetails.lastName}</dd>
              <dt className="col-sm-12 col-md-4">Address</dt>
              <dd className="col-sm-12 col-md-8">{this.props.profileDetails.address}</dd>
              <dt className="col-sm-12 col-md-4">Email</dt>
              <dd className="col-sm-12 col-md-8">{this.props.profileDetails.email}</dd>
              <dt className="col-sm-12 col-md-4">Phone Number</dt>
              <dd className="col-sm-12 col-md-8">{this.props.profileDetails.phoneNo}</dd>
              {service()}
              {description}
            </dl>
            <div>
              <img
                className={classes.Avatar}
                src={this.props.profileDetails.img}
                alt={this.props.profileDetails.firstName}
              />
            </div>
          </div>
        </React.Fragment>
      );
    }

    if (this.props.error) {
      profile = this.props.error;
    }

    return (
      <div className={classes.ProfileBox}>
        <div className={classes.Profile}>{profile}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    profileDetails: state.profile.profileDetails,
    loading: state.profile.loading,
    error: state.profile.error,
    userType: state.auth.authority,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: (token) => dispatch(actions.fetchProfile(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
