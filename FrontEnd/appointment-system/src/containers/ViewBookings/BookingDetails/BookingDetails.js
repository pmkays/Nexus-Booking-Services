import React, { Component } from 'react';
import { connect } from 'react-redux';
// import * as actions from '../../store/actions/actions';
// import { NavLink } from 'react-router-dom';
import axios from '../../../axios-sept';
import moment from 'moment';
import Spinner from '../../../components/UI/Spinner/Spinner';
import {uppercaseFirstCharacter, timeDiff} from '../../../utility/utility';
import classes from './BookingDetails.module.css';

export class BookingDetails extends Component {
    state = {
        loading: false,
        error: null,
        bookingDetails: null
    };

  //As soon as this component loads it will attempt to grab booking details
  componentDidMount() {
    const config = {
        headers: {
          Authorization: 'Bearer ' + this.props.token,
        },
      };
  
      this.setState({ ...this.state, loading: true });
      let user = "";
      switch(this.props.userType){
          case "ROLE_CUSTOMER":
              user = "customer";
              break;
          case "ROLE_EMPLOYEE":
              user = "employee";
              break;
          case "ROLE_ADMIN":
              user="admin";
              break;
          default:
              user= "";
              break;
      }
    //url is booking/{id}
      let indexOfId = this.props.location.pathname.length-1;
      let bookingId = this.props.location.pathname.substring(indexOfId);
      
      axios.get(`/api/booking/${bookingId}`, config)
        .then((response) => {
          this.setState({
            ...this.state,
            bookingDetails: response.data,
            loading: false
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            ...this.state,
            error: 'Error retrieving bookings.',
            loading: false
          });
        });
  }

  render() {
    // const customerOrEmployee = (booking) => {
    //     if(this.props.userType === "ROLE_CUSTOMER"){
    //         return (<td>{uppercaseFirstCharacter(booking.employee.firstName)} {uppercaseFirstCharacter(booking.employee.lastName)}</td>);
    //     } else if (this.props.userType === "ROLE_EMPLOYEE"){
    //         return (<td>{uppercaseFirstCharacter(booking.customer.firstName)} {uppercaseFirstCharacter(booking.customer.lastName)}</td>);
    //     } else{
    //         return (
    //             <React.Fragment>
    //                 <td>{uppercaseFirstCharacter(booking.customer.firstName)} {uppercaseFirstCharacter(booking.customer.lastName)}</td>
    //                 <td>{uppercaseFirstCharacter(booking.employee.firstName)} {uppercaseFirstCharacter(booking.employee.lastName)}</td>
    //             </React.Fragment>);
    //     }
    // }

    let booking = <Spinner />;

    // If not loading and the profile is present, it will render the details
    if (this.state.bookingDetails != null) {
        booking = (
        <React.Fragment>
            <div style={{display: 'flex'}}>{/*blue-green div*/}
                <hr />
                <div className={classes.bookingDetails}> {/*booking details div*/}
                    <h1>Booking Details</h1><br/>
                    <dl className='row'>
                        <dt className='col-sm-3'>Date:</dt>
                        <dd className='col-sm-9'>{moment(this.state.bookingDetails.startTime).format('DD/MM/yyyy')}</dd>
                        <dt className='col-sm-3'>Start Time:</dt>
                        <dd className='col-sm-9'>{moment(this.state.bookingDetails.startTime).format('HH:mm')}</dd>
                        <dt className='col-sm-3'>End Time:</dt>
                        <dd className='col-sm-9'>{moment(this.state.bookingDetails.endTime).format('HH:mm')}</dd>
                        <dt className='col-sm-3'>Duration:</dt>
                        <dd className='col-sm-9'>{timeDiff(this.state.bookingDetails.endTime, this.state.bookingDetails.startTime)}</dd>
                        <dt className='col-sm-3'>Status:</dt>
                        <dd className='col-sm-9'>{uppercaseFirstCharacter(this.state.bookingDetails.status)}</dd>
                        <button type="button" className={classes.cancelBtn}>Cancel</button><br/>
                        <div className={classes.note}><p>Note you cannot cancel a booking within 48 hours of the booking time</p></div>
                    </dl>
                </div>
                <div className={classes.extraDetails}> 
                    <div className={'row ' + classes.lightGreenContainer}> {/*this div is meant to be light green*/}
                        <div className={'col-sm-3 d-flex justify-content-center text-center ' + classes.title}> {/*for services*/}
                            <h2>Service</h2>
                        </div>
                        <div className={'col-sm-9 ' + classes.whiteContainer}> {/*this div is meant to be white*/}
                            <div className={'row ' + classes.name}>
                                <h4>{uppercaseFirstCharacter(this.state.bookingDetails.service.name)}</h4>
                            </div>
                            <div className="row">
                                 <div className={'col ' + classes.description}>
                                 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </div>
                                <div className={'col ' + classes.image}>
                                    <img src={this.state.bookingDetails.service.img} alt="service"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'row ' + classes.lightGreenContainer}> {/*this div is meant to be light green*/}
                        <div className={'col-sm-3 d-flex justify-content-center text-center ' + classes.title}> {/*for employees/customers */}
                            <h2>Employee</h2>
                        </div>
                        <div className={'col-sm-9 ' + classes.whiteContainer}>{/*this div is meant to be white*/}
                            <div className={'row ' + classes.name}>
                                <h4>{uppercaseFirstCharacter(this.state.bookingDetails.employee.firstName)} {uppercaseFirstCharacter(this.state.bookingDetails.employee.lastName)} - {this.state.bookingDetails.employee.phoneNo}</h4>                          
                            </div>
                            <div className="row">
                                <div className={'col ' + classes.description}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </div>
                                <div className={'col ' + classes.image}>
                                    <img src={this.state.bookingDetails.employee.img} alt="employee"/>
                                </div> 
                            </div>
                        </div>
                    </div>      
                </div> 
            </div>
        </React.Fragment>
      );
    }

    if (this.state.error) {
      booking = this.state.error;
    }

    return <div className={classes.container}>{booking}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userType: state.auth.authority,
    userId: state.auth.userId
  };
};

const mapDispatchToProps = (dispatch) => {
//   return {
//     onFetchProfile: (token) => dispatch(actions.fetchProfile(token)),
//   };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingDetails);
