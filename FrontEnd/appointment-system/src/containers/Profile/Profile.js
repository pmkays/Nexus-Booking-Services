import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/actions';
import { NavLink } from 'react-router-dom';

import Spinner from '../../components/UI/Spinner/Spinner';

export class Profile extends Component {
  //As soon as this component loads it will attempt to grab the current profile
  componentDidMount() {
    this.props.onFetchProfile(this.props.token);
  }

  render() {
    let profile = <Spinner />;

    // If not loading and the profile is present, it will render the details
    if (!this.props.loading && this.props.profileDetails !== null) {
      profile = (
        <React.Fragment>
          <h2>My Profile</h2>
          <p>
            <NavLink to='/editprofile'>Edit Profile</NavLink>
          </p>
          <hr />
          <dl className='row'>
            <dt className='col-sm-2'>First Name</dt>
            <dd className='col-sm-10'>{this.props.profileDetails.firstName}</dd>
            <dt className='col-sm-2'>Last Name</dt>
            <dd className='col-sm-10'>{this.props.profileDetails.lastName}</dd>
            <dt className='col-sm-2'>Address</dt>
            <dd className='col-sm-10'>{this.props.profileDetails.address}</dd>
            <dt className='col-sm-2'>Email</dt>
            <dd className='col-sm-10'>{this.props.profileDetails.email}</dd>
            <dt className='col-sm-2'>Phone Number</dt>
            <dd className='col-sm-10'>{this.props.profileDetails.phoneNo}</dd>
          </dl>
        </React.Fragment>
      );
    }

    if (this.props.error) {
      profile = this.props.error;
    }

    return <div className='container'>{profile}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    profileDetails: state.profile.profileDetails,
    loading: state.profile.loading,
    error: state.profile.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: (token) => dispatch(actions.fetchProfile(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
