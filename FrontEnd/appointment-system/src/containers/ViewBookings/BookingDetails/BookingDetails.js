import React, { Component } from 'react';
import { connect } from 'react-redux';
// import * as actions from '../../store/actions/actions';
// import { NavLink } from 'react-router-dom';
import axios from '../../../axios-sept';
import moment from 'moment';
import Spinner from '../../../components/UI/Spinner/Spinner';
import {uppercaseFirstCharacter, timeDiff} from '../../../utility/utility'

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
                <div style={{float:'left',width:'35%'}}> {/*booking details div*/}
                    <h2>Booking Details</h2>
                    <dl className='row'>
                        <dt className='col-sm-3'>Date</dt>
                        <dd className='col-sm-9'>{moment(this.state.bookingDetails.startTime).format('DD/MM/yyyy')}</dd>
                        <dt className='col-sm-3'>Start Time</dt>
                        <dd className='col-sm-9'>{moment(this.state.bookingDetails.startTime).format('HH:mm')}</dd>
                        <dt className='col-sm-3'>End Time</dt>
                        <dd className='col-sm-9'>{moment(this.state.bookingDetails.endTime).format('HH:mm')}</dd>
                        <dt className='col-sm-3'>Duration</dt>
                        <dd className='col-sm-9'>{timeDiff(this.state.bookingDetails.endTime, this.state.bookingDetails.startTime)}</dd>
                        <dt className='col-sm-3'>Status</dt>
                        <dd className='col-sm-9'>{uppercaseFirstCharacter(this.state.bookingDetails.status)}</dd>
                        <button type="button" className='btn btn-danger'style={{display:'block'}}>Cancel</button>
                        <dd>Note you cannot cancel a booking within 48 hours of the booking time</dd>
                    </dl>
                </div>
                <div style={{float:'right', width:'65%'}}> 
                    <div className="row"> {/*this div is meant to be light green*/}
                        <div className="col-sm-3"> {/*for services*/}
                            <h2>Service</h2>
                        </div>
                        <div className="col-sm-9"> {/*this div is meant to be white*/}
                            <div className="row">
                                <h4>Service Name</h4>
                            </div>
                            <div className="row">
                                <div className="col">
                                    Service Description
                                </div>
                                <div className="col">
                                    Service picture
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row"> {/*this div is meant to be light green*/}
                        <div className="col-sm-3"> {/*for employees/customers */}
                            <h2>Employee</h2>
                        </div>
                        <div className="col-sm-9"> {/*this div is meant to be white*/}
                            <div className="row">
                                <h4>Employee Name - Number</h4>                          
                            </div>
                            <div className="row">
                                <div className="col">
                                    Employee Description
                                </div>
                                <div className="col">
                                    Employee picture
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

    return <div className='container'>{booking}</div>;
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
