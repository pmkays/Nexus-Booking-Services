import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/actions";
import axios from "../../axios-sept";
import { withRouter } from "react-router";

import Spinner from "../../components/UI/Spinner/Spinner";
import moment from "moment";
import Graph from "./Graph"
import Statistic from "./Statistic"
import classes from "./AdminDashboard.module.css"
import { Animated } from "react-animated-css";

export class AdminDashboard extends Component {
  state = {
    bookings: null,
    totalBookings:null,
    customers: null,
    employees: null,
    profit: null,
    error: null,
    dates: null
  };

    componentDidMount() {
        let profit =  Math.floor(Math.random() * (50000 - 30000 + 1) ) + 30000;

        const config = {
            headers: {
                Authorization: "Bearer " + this.props.token,
            },
        };

        const fetchBookings = axios.get(`/api/booking/admin`, config);
        const fetchEmployees = axios.get(`/api/employees`, config);
        const fetchCustomers = axios.get(`/api/customers`, config);

        Promise.all([fetchBookings, fetchEmployees, fetchCustomers]).then(([bookings, employees, customers]) => {
            this.setState({
                ...this.state,
                bookings: bookings.data,
                totalBookings: bookings.data.length,
                employees: employees.data._embedded.employees.length,
                customers: customers.data._embedded.customers.length,
                loading: false,
                profit: profit
            })
          }).catch(error => {
                this.setState({
                ...this.state,
                error: "Error retrieving some information. Please try again later",
                loading: false,
            });
          })

    }

    render(){
        let dashboard = <Spinner/>;
        
        const getDatesWithinRange = (date1, date2) =>{
            let dates = [];
            while(!date1.isSame(date2, 'day'))
            {
                let clone = date1.clone();
                dates.push(clone)
                date1.add(1, 'days');
            }
            dates.push(date2);
            return dates;
        }

        const handleFilter = (event) =>{
            var value = event.target.value;
            
            //time related variables for filtering and getting dates
            let today = moment();
            let week = moment().add(-7, 'days');
            let fortnight = moment().add(-14, 'days');
            let month = moment().add(-1, 'M');

            //state-related variables to update
            let profit = 0;
            var dates = [];
            var filteredBookings = [];

            switch(value){
                case "week":
                    dates = getDatesWithinRange(week, today);
                    filteredBookings = this.state.bookings.filter( x =>
                        moment(x.startTime).isSameOrAfter(dates[0], "day") &&
                        moment(x.startTime).isSameOrBefore(dates[dates.length-1], "day"));
                        profit =  Math.floor(Math.random() * (2000 - 1000 + 1) ) + 1000; //profit will be between 1k-2k
                    break;
                case "fortnight":
                    dates = getDatesWithinRange(fortnight, today);
                    filteredBookings = this.state.bookings.filter( x =>
                        moment(x.startTime).isSameOrAfter(dates[0], "day") &&
                        moment(x.startTime).isSameOrBefore(dates[dates.length-1], "day"));
                        profit =  Math.floor(Math.random() * (4000 - 2000 + 1) ) + 2000; //profit between 2k-4k
                    break;
                case "month":
                    dates = getDatesWithinRange(month, today);
                    filteredBookings = this.state.bookings.filter( x =>
                        moment(x.startTime).isSameOrAfter(dates[0], "day") &&
                        moment(x.startTime).isSameOrBefore(dates[dates.length-1], "day"));
                        profit =  Math.floor(Math.random() * (7000 - 5000 + 1) ) + 5000; //profit between 5k-7k
                    break;
                default: //also all
                    dates = null;
                    filteredBookings = this.state.bookings;
                    profit =  Math.floor(Math.random() * (50000 - 30000 + 1) ) + 30000; //profit betweeen 30k-50k
                    break;
            }

            this.setState({
                ...this.state,
                dates: dates,
                totalBookings: filteredBookings.length,
                profit: profit
            });
        }

        if(this.state.bookings != null && !this.state.loading){
            dashboard = (
                <div className={"container-fluid " + classes.body}>
                    <div className="row">
                        <div className="col-sm-8">
                            <h1 className={classes.title}>Welcome, {this.props.profileDetails.firstName}</h1> <hr/>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group row">
                                <label htmlFor="filter" class={"col-sm-3 col-form-label " + classes.label}>View:</label>
                                <div className="col-sm-9">
                                    <div class= {"col-xs-2 " + classes.select}>
                                        <select name ="filter" className="form-control" onChange = {handleFilter}>
                                            <option value = "all" defaultValue>All</option>
                                            <option value = "week">This Week</option>
                                            <option value = "fortnight">This Fortnight</option>
                                            <option value = "month">This Month</option>
                                        </select>
                                    </div> 
                                </div>                                
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <h2 className={classes.subtitle}>Statistics</h2>
                    </div>
                    <Animated animationIn="slideInLeft" animationInDuration={400}>
                        <div className={"row justify-content-md-center " + classes.statsBackground}>
                            <div className={"col-sm-3 "}> {/*stats*/}
                                <Statistic data= {this.state.totalBookings} description = 'Bookings'/>
                            </div>
                            <div className={"col-sm-3 "}> {/*stats*/}
                                <Statistic data= {'$' + this.state.profit} description = 'Profit'/>
                            </div>
                            <div className={"col-sm-3 "}> {/*stats*/}
                                <Statistic data= {this.state.customers} description = 'Customers'/>
                            </div>
                            <div className={"col-sm-3 "}> {/*stats*/}
                                <Statistic data= {this.state.employees} description = 'Employees'/>
                            </div>
                        </div><br/>
                    </Animated>
                    <div className="row">
                        <h2 className={classes.subtitle}>Graphs</h2>
                    </div>
                    <div className="row">
                        <div className={"col-sm-7 " + classes.bar}> {/*total bookings bar graph*/}
                            <div className ={classes.graph}>
                                <h2 className = {classes.centerText}>Bookings per Day</h2>
                                <Graph type ="bar" bookings={this.state.bookings} width="100%" height= "780%" dates={this.state.dates}/>
                            </div>
                        </div>
                        <div className="col-sm-5"> {/*column of smaller graphs*/}
                            <div className={classes.graph}> {/* pie graph */}
                                <h2 className = {classes.centerText}>Bookings per Employee </h2>
                                <Graph type ="pie" bookings={this.state.bookings} width="100%" height="325%" dates= {this.state.dates}/>
                            </div><br/><br/>
                            <div className={classes.graph}> {/* line graph */}
                                <h2 className = {classes.centerText}>Services Booked per Day</h2>
                                <Graph type ="line" bookings={this.state.bookings} width="100%" height="325%" dates= {this.state.dates}/>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        if (this.props.error) {
            dashboard = this.props.error;
        }

        return dashboard;
    }

}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    authority: state.auth.authority,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AdminDashboard));
