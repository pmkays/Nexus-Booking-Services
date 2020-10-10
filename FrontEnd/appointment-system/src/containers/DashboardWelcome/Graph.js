import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/actions";
import classes from "./DashboardWelcome.module.css";
import welcomeImage from "./images/welcome.svg";
import axios from "../../axios-sept";
import { withRouter } from "react-router";

import Spinner from "../../components/UI/Spinner/Spinner";
import Button from "../../components/UI/Button/Button";
import PreviousBooking from "../../components/UI/PreviousBooking/PreviousBooking";
import Card from "../../components/UI/Card/Card";
import { Animated } from "react-animated-css";
import moment from "moment";
import {Bar, Line, Pie} from "react-chartjs-2";

export class Graph extends Component {
  state = {
    bookings: null,
    error: null,
  };

  //As soon as this component loads it will attempt to grab the current profile
  componentDidMount() {
    this.setState({
        ...this.state,
        bookings: this.props.bookings,
        loading: false
    });
    //   const config = {
    //     headers: {
    //       Authorization: "Bearer " + this.props.token,
    //     },
    //   };
  
    //   axios
    //     .get(`/api/booking/admin`, config)
    //     .then((response) => {
    //       this.setState({
    //         ...this.state,
    //         bookings: response.data,
    //         loading: false,
    //       });
    //     })
    //     .catch((error) => {
    //       this.setState({
    //         ...this.state,
    //         error: "Error retrieving the services. Possibly no services available on this date.",
    //         loading: false,
    //       });
    //     });

    console.log("State:" + this.state.bookings);
  }

  render() {

    const getBarData = () =>{
        let filteredData = [];
        filteredData = this.state.bookings;
        filteredData.sort((a, b) =>
          moment(a.startTime).diff(moment(b.startTime))
        );
        // filteredData = filteredData.filter( x =>
        //     moment(x.startTime).isSameOrAfter(moment(this.props.from), "day") &&
        //     moment(x.startTime).isSameOrBefore(moment(this.props.to), "day")
        // );

        let dataSet= new Map();
    
        //populate the keys with the date
        filteredData.map(x=> dataSet.set(moment(x.startTime).format("DD/MM/yyyy"), 0));
        filteredData.forEach(x=>{
            var count = dataSet.get(moment(x.startTime).format("DD/MM/yyyy"));
            dataSet.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
        })
        console.log(dataSet);
    
        const data = {
            labels: [...dataSet.keys()],
            datasets: [{
                    label: '',
                    data: [...dataSet.values()],
                    fill: true,
                    backgroundColor: "#49a8cc",
                    borderColor: "rgba(75,192,192,1)"
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Date',
                      fontSize: 18
                    }
                  }],
                yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Amount of Bookings',
                    fontSize: 18
                }
                }]
            },
            legend: {
                display:false
            }
        };

        let toReturn = [data, options];
        return toReturn;
    }

    const getPieData = () =>{
        let filteredData = [];
        filteredData = this.state.bookings;
        // filteredData = filteredData.filter( x =>
        //     moment(x.startTime).isSameOrAfter(moment(this.props.from), "day") &&
        //     moment(x.startTime).isSameOrBefore(moment(this.props.to), "day")
        // );

        let dataSet= new Map();
        
        //populate the keys with the date
        filteredData.map(x=> dataSet.set(`${x.employee.firstName} ${x.employee.lastName}`, 0));
        filteredData.forEach(x=>{
            var count = dataSet.get(`${x.employee.firstName} ${x.employee.lastName}`);
            dataSet.set(`${x.employee.firstName} ${x.employee.lastName}`, ++count);
        })
    
        const data = {
            labels: [...dataSet.keys()],
            datasets: [
              {
                label: "Employees",
                data: [...dataSet.values()],
                fill: true,
                backgroundColor: ["#bcdee5","#F7B2AD", "#49a8cc", "#d1cbc6"],
              }
            ]
          };

        const options = {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: "Amount of bookings this",
                position: "top"
            },
            scales: {
                xAxes: [
                    {
                        type:'time'
                    }

                ],
                yAxes:[
                    {
                        type:'amount'
                    }

                ]
            }
        };
        return data;
    }

    const getLineData = () =>{
        let filteredData = [];
        filteredData = this.state.bookings;
        // filteredData = filteredData.filter( x =>
        //     moment(x.startTime).isSameOrAfter(moment(this.props.from), "day") &&
        //     moment(x.startTime).isSameOrBefore(moment(this.props.to), "day")
        // );

        let service1 = new Map();
        let service2 =  new Map();
        let service3 = new Map(); 
        let service4 = new Map(); 

        filteredData.map(x=> {
            service1.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
            service2.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
            service3.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
            service4.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
        });
    
    
        filteredData.forEach(x=>{
            if(x.service.id === 1){
                var count = service1.get(moment(x.startTime).format("DD/MM/yyyy"));
                service1.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
            }else if(x.service.id === 2){
                var count = service2.get(moment(x.startTime).format("DD/MM/yyyy"));
                service2.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
            }else if(x.service.id === 3){
                var count = service3.get(moment(x.startTime).format("DD/MM/yyyy"));
                service3.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
            } else if(x.service.id === 4){
                var count = service4.get(moment(x.startTime).format("DD/MM/yyyy"));
                service4.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
            }
        })
    
        const data = {
            labels: [...service1.keys()],
            datasets: [
              {
                label: "Design",
                data: [...service1.values()],
                fill: false,
                borderColor: "#F7B2AD"
              },
              {
                label: "Construction",
                data: [...service2.values()],
                fill: false,
                borderColor: "#bcdee5"
              },
              {
                label: "Repair",
                data: [...service3.values()],
                fill: false,
                borderColor: "#49a8cc"
              },
              {
                label: "Makeup",
                data: [...service4.values()],
                fill: false,
                borderColor: "#d1cbc6"
              }
            ]
          };

          const options = {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    scaleLabel: {
                      display: true,
                      labelString: 'Date',
                      fontSize: 18
                    }
                  }],
                yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Amount of Bookings',
                    fontSize: 18
                }
                }]
            },
        };

        var toReturn = [data, options];
        return toReturn;
    }

    const getBar = () => {
        let configs = getBarData(); 
        console.log(configs);
        return(
            <Bar data = {configs[0]} width={this.props.width} height={this.props.height} options={configs[1]}/>
        );
    }

    const getPie = () => {
        let data = getPieData(); 
        return(
            <Pie data = {data} width={this.props.width} height={this.props.height} options={{maintainAspectRatio: false}}/>
        );
    }

    const getLine = () => {
        let configs = getLineData(); 
        return(
            <Line data = {configs[0]} width={this.props.width} height={this.props.height} options={configs[1]}/>
        );
    }

    const getGraph = () => {
        switch(this.props.type){
            case "bar":
                return getBar();
            case "line":
                return getLine();
            case "pie":
                return getPie();
            default:
                return null;
        }
    }

    let canvas = <Spinner />;
    if(this.state.bookings != null && !this.state.loading){
        canvas = getGraph();
    }

    if (this.props.error) {
        canvas = this.props.error;
    }

    return <div>{canvas}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userId: state.auth.userId,
    authority: state.auth.authority,
    loading: state.profile.loading,
    error: state.profile.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchProfile: (token) => dispatch(actions.fetchProfile(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Graph));
