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
    filters: {'complete': false, 'pending': false, 'cancelled': false, 'date':false, 'sort':'default'} ,
    from: null,
    to: null,
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

        //filter by status
        let cancelled = this.state.defaultBookings.filter(x => x.status === "cancelled");
        let complete = this.state.defaultBookings.filter(x => x.status === "complete");
        let pending = this.state.defaultBookings.filter(x => x.status === "pending");

        //filter by date
        if(this.state.from !== null && this.state.to !== null){
            cancelled  = cancelled.filter(x => 
                moment(x.startTime).isSameOrAfter(this.state.from, 'day') && 
                moment(x.startTime).isSameOrBefore(this.state.to, 'day')
            );

            complete  = complete.filter(x => 
                moment(x.startTime).isSameOrAfter(this.state.from, 'day') && 
                moment(x.startTime).isSameOrBefore(this.state.to, 'day')
            );

            pending  = pending.filter(x => 
                moment(x.startTime).isSameOrAfter(this.state.from, 'day') && 
                moment(x.startTime).isSameOrBefore(this.state.to, 'day')
            );
        }       
       
        let filteredBookings = []; 

        //populate array to display
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

        //what happens when there's no statuses
        if (!this.state.filters.cancelled && !this.state.filters.complete && !this.state.filters.pending && filteredBookings.length === 0) {
            //might need to filter by date though
            if(this.state.from !== null && this.state.to !== null){
                filteredBookings = this.state.defaultBookings.filter(x => 
                    moment(x.startTime).isSameOrAfter(this.state.from, 'day') && 
                    moment(x.startTime).isSameOrBefore(this.state.to, 'day'));
                console.log(filteredBookings);
            } else {
                filteredBookings = this.state.defaultBookings;
            }
        }

        //sort the results
        if(this.state.filters.sort === "ascending"){
            filteredBookings.sort((a,b)=>moment(a.startTime).diff(moment(b.startTime)));
        } else if (this.state.filters.sort === "descending"){
            filteredBookings.sort((a,b)=>moment(b.startTime).diff(moment(a.startTime)));
        } else{
            filteredBookings.sort((a,b)=> a.id - b.id);
        }

        this.setState({
            ...this.state, 
            bookings: filteredBookings 
        });

    }
      if(prevState.filters !== this.state.filters || prevState.from !== this.state.from || prevState.to !== this.state.to){
        changeBookings();
      }
  }


  render() {
    const uppercaseFirstCharacter = (word) => {
        return word.substring(0,1).toUpperCase() + word.substring(1);
    }

    const timeDiff = (time1, time2) => {
        var duration = moment(time1).diff(moment(time2), 'hours'); 

        if(duration === 1){
            return `${duration} hour`
        }
        return `${duration} hours`

    }

    let bookings = null;
    if (this.state.bookings !== null) {
        bookings = this.state.bookings.map((bookings) => {
        return (
          <tr key={bookings.id}>
            <td>{moment(bookings.startTime).format('DD/MM/yyyy')}</td>
            <td>{moment(bookings.startTime).format('HH:mm')}</td>
            <td>{moment(bookings.endTime).format('HH:mm')}</td>
            <td>{timeDiff(bookings.endTime, bookings.startTime)}</td>
            <td>{uppercaseFirstCharacter(bookings.service.name)}</td>
            <td>{uppercaseFirstCharacter(bookings.employee.firstName)} {uppercaseFirstCharacter(bookings.employee.lastName)}</td>
            <td>{uppercaseFirstCharacter(bookings.status)}</td>
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

    const handleSorting = (event) =>{
        this.setState({
            ...this.state,
            filters: {...this.state.filters, 'sort': event.target.value}
        });
    }
        
    const handleStatusChange = (event) =>{
        let checkbox = event.target.value;
        this.setState({
            ...this.state,
            filters: {...this.state.filters, [checkbox]: event.target.checked}
        });
    }

    let buttonType = null; 
    const handleFormSubmit = (event) => {
        event.preventDefault(); 
        if(buttonType === "go"){
            handleDateSubmit(event);
        } else {
            handleClearDate(event);
        }
    }

    const handleDateSubmit = (event) => {
        event.preventDefault(); 
        console.log("handlesubmit");
        this.setState({
            ...this.state,
            filters: {...this.state.filters, 'date': true},
            from: event.target.from.value,
            to: event.target.to.value
        });
    }

    const handleClearDate = (event) => {
        event.preventDefault(); 
        event.target.from.value ="";
        event.target.to.value ="";
        this.setState({
            ...this.state,
            filters: {...this.state.filters, 'date': false},
            from: null,
            to: null
        });
    }
    
    const getButton = (event) => {
        buttonType = event.target.value;
    }

    return (
      <div className='container' style={{display: "flex"}}>
        <div className={classes.filter}>
            <h4>Filter by...</h4>
            <hr/>
            <div className="row">
                <div className="col">
                    <a data-toggle="collapse" href="#sortAccordion" aria-expanded="false" aria-controls="sortAccordion">Sort &#x25BC;</a>
                    <div className="collapse multi-collapse" id="sortAccordion">
                        <div className="form-group">
                            <label htmlFor="sort">Date:</label>
                            <select className ="form-control" name="sort" onChange = {handleSorting}>
                                <option value = "default" selected> Default</option>
                                <option value = "ascending" > Ascending </option>
                                <option value = "descending"> Descending</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col">
                    <a data-toggle="collapse" href="#statusAccordion" aria-expanded="false" aria-controls="statusAccordion">Status &#x25BC;</a>
                    <div className="collapse multi-collapse" id="statusAccordion">
                        <div className="">
                            <input type="checkbox" name="Completed" value="complete" onChange={handleStatusChange}/>
                            <label htmlFor="Completed"> &nbsp; Complete</label><br/>
                            <input type="checkbox" name="Pending" value="pending" onChange={handleStatusChange}/>
                            <label htmlFor="Pending"> &nbsp; Pending</label><br/>
                            <input type="checkbox" name="Cancelled" value="cancelled" onChange={handleStatusChange}/>
                            <label htmlFor="Cancelled">  &nbsp; Cancelled</label><br/>
                        </div>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="row">
                <div className="col">
                    <a data-toggle="collapse" href="#dateAccordion" aria-expanded="false" aria-controls="dateAccordion">Date &#x25BC;</a>
                    <div className="collapse multi-collapse" id="dateAccordion">
                        <form className="form" onSubmit={handleFormSubmit}>
                            <div className="form-group">
                                <label htmlFor="from">From:</label>
                                <input type="date" className="form-control" id="from" name="from"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="to">To:</label>
                                <input type="date" className="form-control" id="to" name="to"/>
                            </div>
                            <div className="form-group">
                            <div className="row">
                                <div className="col text-center">
                                    <button type="submit" className="btn btn-primary" onClick = {getButton} value = "go">Go!</button>
                                    <button type="submit" className="btn btn-danger" onClick = {getButton} value ="clear">Clear</button>
                                </div>
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
        <div style={{"flexGrow":1}}>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
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
//     return {
//       onFetchBookings: (token) => dispatch(actions.fetchBookings(token)),
//     };
  };
  

export default connect(mapStateToProps, mapDispatchToProps)(ViewBookings);
