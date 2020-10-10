import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/actions";
import welcomeImage from "./images/welcome.svg";
import axios from "../../axios-sept";
import { withRouter } from "react-router";

import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";
import PreviousBooking from "../../components/UI/PreviousBooking/PreviousBooking";
import Card from "../../components/UI/Card/Card";
import { Animated } from "react-animated-css";
import moment from "moment";
import Graph from "./Graph"
import Statistic from "./Statistic"
import classes from "./AdminDashboard.module.css"

export class AdminDashboard extends Component {
  state = {
    bookings: null,
    customers: null,
    employees: null,
    profit: null,
    error: null,
    dates: null
  };

    componentDidMount() {
        const config = {
            headers: {
                Authorization: "Bearer " + this.props.token,
            },
        };

        axios
        .get(`/api/booking/admin`, config)
        .then((response) => {
            this.setState({
            ...this.state,
            bookings: response.data,
            loading: false,
            });
        })
        .catch((error) => {
            this.setState({
            ...this.state,
            error: "Error retrieving the services. Possibly no services available on this date.",
            loading: false,
            });
        });

        axios
        .get(`/api/employees`, config)
        .then((response) => {
            this.setState({
            ...this.state,
            employees: response.data._embedded.employees.length,
            loading: false,
            });
        })
        .catch((error) => {
            this.setState({
            ...this.state,
            error: "Error retrieving the services. Possibly no services available on this date.",
            loading: false,
            });
        });

        axios
        .get(`/api/customers`, config)
        .then((response) => {
            this.setState({
            ...this.state,
            customers: response.data._embedded.customers.length,
            loading: false,
            });
        })
        .catch((error) => {
            this.setState({
            ...this.state,
            error: "Error retrieving the services. Possibly no services available on this date.",
            loading: false,
            });
        });
        
        let profit =  Math.floor(Math.random() * (50000 - 30000 + 1) ) + 30000;
        this.setState({
            ...this.state,
            profit: profit
        });

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
            let today = moment();
            let week = moment().add(-7, 'days');
            let fortnight = moment().add(-14, 'days');
            let month = moment().add(-1, 'M');

            var value = event.target.value;

            var dates = [];
            switch(value){
                case "week":
                    dates = getDatesWithinRange(week, today);
                    break;
                case "month":
                    dates = getDatesWithinRange(month, today);
                    break;
                case "fortnight":
                    dates = getDatesWithinRange(fortnight, today);
                    break;
                case "all":
                    dates = null;
                    break;
            }

            this.setState({
                ...this.state,
                dates: dates
            });
        }
        if(this.state.bookings != null && !this.state.loading){
            dashboard = (
                <div className={"container-fluid " + classes.body}>
                    <div className="row">
                        <div className="col-sm-8">
                            <h1 className={classes.title}>Welcome, {this.props.profileDetails.firstName}</h1><br/>
                        </div>
                        <div className="col-sm-3">
                            <div class="form-group row">
                                <label for="filter" class={"col-sm-3 col-form-label " + classes.label}>View:</label>
                                <div class="col-sm-9">
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
                    <div className="row justify-content-md-center">
                        <div className={"col-sm-3 "}> {/*stats*/}
                            <Statistic data= {this.state.bookings.length} description = 'Total bookings'/>
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
                    </div><br/><br/>
                    <div className="row">
                        <div className={"col-sm-7 " + classes.bar}> {/*total bookings bar graph*/}
                            <h2 className = {classes.centerText}>Bookings per Day</h2>
                            <Graph type ="bar" bookings={this.state.bookings} width="100%" height= "750%" dates={this.state.dates}/>
                        </div>
                        <div className="col-sm-5"> {/*column of smaller graphs*/}
                            <div> {/* pie graph */}
                                <h2 className = {classes.centerText}>Bookings per Employee </h2>
                                <Graph type ="pie" bookings={this.state.bookings} width="100%" height="325%" dates= {this.state.dates}/>
                            </div><br/><br/>
                            <div> {/* line graph */}
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
