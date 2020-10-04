import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-sept';
import moment from 'moment';

import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './ViewBookings.module.css';

// import actions from '../../store/actions/booking'
export class ViewBookings extends Component {
  state = {
    bookings: null,
    defaultBookings:null,
    loading: false,
    error: null,
    filters: {'complete': false, 'pending': false, 'cancelled': false} 
  };

  componentDidMount() {
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    };

    this.setState({ ...this.state, loading: true });
    let user = "";
    //admin not done yet
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

    let userId = (user === "admin") ? "" : this.props.userId

    axios.get(`/api/booking/${user}/${userId}`, config)
      .then((response) => {
        this.setState({
          ...this.state,
          defaultBookings: response.data,
          bookings: response.data,
          loading: false,
        });
      })
      .catch((error) => {
          console.log(error);
        this.setState({
          ...this.state,
          error: 'Error retrieving bookings.',
          loading: false,
        });
      });
  }

  componentDidUpdate(prevProps, prevState){
      const changeBookings = () => {
        let cancelled = this.state.defaultBookings.filter(x => x.status === "cancelled");
        let complete = this.state.defaultBookings.filter(x => x.status === "complete");
        let pending = this.state.defaultBookings.filter(x => x.status === "pending");

        let filteredBookings = []; 

        if(this.state.filters.cancelled){
            filteredBookings.push(...cancelled);
            console.log(filteredBookings);
        }
        if(this.state.filters.complete){
            filteredBookings.push(...complete);
            console.log(filteredBookings);
        }
        if(this.state.filters.pending){
            filteredBookings.push(...pending);
            console.log(filteredBookings);
        }

        //default when nothing is ticked is show all of them
        if (!this.state.filters.cancelled && !this.state.filters.complete && !this.state.filters.pending && filteredBookings.length === 0) {
            filteredBookings = this.state.defaultBookings;
        }

        this.setState({
            ...this.state, 
            bookings: filteredBookings 
        });

    }
      if(prevState.filters !== this.state.filters){
        changeBookings();
      }
  }


  render() {
    let bookings = null;

    if (this.state.bookings !== null) {
        bookings = this.state.bookings.map((bookings) => {
        return (
          <tr key={bookings.id}>
            <td>{moment(bookings.startTime).format('DD/MM/yyyy')}</td>
            <td>{moment(bookings.startTime).format('HH:mm')}</td>
            <td>{moment(bookings.endTime).format('HH:mm')}</td>
            <td>{bookings.service.name}</td>
            <td>{bookings.employee.firstName} {bookings.employee.lastName}</td>
            <td>{bookings.status.substring(0,1).toUpperCase() + bookings.status.substring(1)}</td>
          </tr>
        );
      });
    }

    if (this.state.loading) {
      bookings = <Spinner />;
    }

    if (this.state.error) {
      bookings = this.state.error;
    }
        
    const handleStatusChange = (event) =>{
        let checkbox = event.target.value;
        this.setState({
            ...this.state,
            filters: {...this.state.filters, [checkbox]: event.target.checked}
        });
    }

    return (
      <div className='container' style={{display: "flex"}}>
        <div className={classes.filter}>
            <h4>Filter by...</h4>
            <div className="row">
                <div className="col">
                    <a data-toggle="collapse" href="#statusAccordion" aria-expanded="false" aria-controls="statusAccordion">Status</a>
                    <div className="collapse multi-collapse" id="statusAccordion">
                        <div className="">
                            <input type="checkbox" name="Completed" value="complete" onChange={handleStatusChange}/>
                            <label for="Completed"> &nbsp; Complete</label><br/>
                            <input type="checkbox" name="Pending" value="pending" onChange={handleStatusChange}/>
                            <label for="Pending"> &nbsp; Pending</label><br/>
                            <input type="checkbox" name="Cancelled" value="cancelled" onChange={handleStatusChange}/>
                            <label for="Cancelled">  &nbsp; Cancelled</label><br/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <a data-toggle="collapse" href="#dateAccordion" aria-expanded="false" aria-controls="dateAccordion">Date</a>
                    <div className="collapse multi-collapse" id="dateAccordion">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-sm-2" for="from">From:</label>
                            <div class="col-sm-10">
                                <input type="date" class="form-control" id="from"/>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2" for="to">To:</label>
                            <div class="col-sm-10">
                                <input type="date" class="form-control" id="to"/>
                            </div>
                        </div>
                        <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-primary">Go!</button>
                        </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <br />
        <br />
        <br />
        <div style={{"flex-grow":1}}>
            <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Service</th>
                    <th>Employee</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>{bookings}</tbody>
            </table>
        </div>   
      </div>
    );
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
    // return {
    //   onFetchBookings: (token) => dispatch(actions.fetchBookings(token)),
    // };
  };
  

export default connect(mapStateToProps, mapDispatchToProps)(ViewBookings);
