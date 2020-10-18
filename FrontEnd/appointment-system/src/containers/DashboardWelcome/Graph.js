import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/actions";
import { withRouter } from "react-router";

import Spinner from "../../components/UI/Spinner/Spinner";
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
  }

  render() {

    const getBarData = () =>{

        //organise initial booking data
        let filteredData = [];
        filteredData = this.state.bookings;
        filteredData.sort((a, b) =>
          moment(a.startTime).diff(moment(b.startTime))
        );

        let dataSet= new Map();

        if(this.props.dates != null){
            //get only the relevant bookings
            var lastDate = this.props.dates[this.props.dates.length - 1];
            filteredData = filteredData.filter( x =>
                moment(x.startTime).isSameOrAfter(this.props.dates[0], "day") &&
                moment(x.startTime).isSameOrBefore(lastDate, "day")
            );
            //set up x-axis
            this.props.dates.map(x=> dataSet.set(x.format("DD/MM/yyyy"), 0));
        } else{
            //all means we won't show days that have no bookings
            filteredData.map(x=> dataSet.set(moment(x.startTime).format("DD/MM/yyyy"), 0));
        }
        
        //populate the keys with the date
        filteredData.forEach(x=>{
            var count = dataSet.get(moment(x.startTime).format("DD/MM/yyyy"));
            dataSet.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
        })
    
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
                    },
                    gridLines: {
                        display:false
                    }
                  }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Amount of Bookings',
                        fontSize: 18
                    },
                    ticks: {
                        min: 0
                    },
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

        if(this.props.dates != null){
            var lastDate = this.props.dates[this.props.dates.length - 1];
            filteredData = this.state.bookings.filter( x =>
                moment(x.startTime).isSameOrAfter(this.props.dates[0], "day") &&
                moment(x.startTime).isSameOrBefore(lastDate, "day")
            );
        }

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
        return data;
    }

    const getLineData = () =>{

        //organise initial data
        let filteredData = [];
        filteredData = this.state.bookings;
        filteredData.sort((a, b) =>
            moment(a.startTime).diff(moment(b.startTime))
        );

        //each service will be its own data set so it's better we separate them
        let service1 = new Map();
        let service2 =  new Map();
        let service3 = new Map(); 
        let service4 = new Map(); 


        if(this.props.dates != null){

            //filter only relevant dates and set up our x-axis dates
            var lastDate = this.props.dates[this.props.dates.length - 1];
            filteredData = this.state.bookings.filter( x =>
                moment(x.startTime).isSameOrAfter(this.props.dates[0], "day") &&
                moment(x.startTime).isSameOrBefore(lastDate, "day")
            );
            this.props.dates.forEach(x=> {
                service1.set(x.format("DD/MM/yyyy"), 0);
                service2.set(x.format("DD/MM/yyyy"), 0);
                service3.set(x.format("DD/MM/yyyy"), 0);
                service4.set(x.format("DD/MM/yyyy"), 0);
            });
        } else{
            //all has been selected so we don't care about the days that have no bookings
            filteredData.forEach(x=> {
                service1.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
                service2.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
                service3.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
                service4.set(moment(x.startTime).format("DD/MM/yyyy"), 0);
            });
        }
        
        //group the services and count
        filteredData.forEach(x=>{
            if(x.service.id === 1){
                let count = service1.get(moment(x.startTime).format("DD/MM/yyyy"));
                service1.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
            }else if(x.service.id === 2){
                let count = service2.get(moment(x.startTime).format("DD/MM/yyyy"));
                service2.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
            }else if(x.service.id === 3){
                let count = service3.get(moment(x.startTime).format("DD/MM/yyyy"));
                service3.set(moment(x.startTime).format("DD/MM/yyyy"), ++count);
            } else if(x.service.id === 4){
                let count = service4.get(moment(x.startTime).format("DD/MM/yyyy"));
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
                lineTension: 0,           
                borderColor: "#F7B2AD"
              },
              {
                label: "Construction",
                data: [...service2.values()],
                fill: false,
                lineTension: 0,           
                borderColor: "#bcdee5"
              },
              {
                label: "Repair",
                data: [...service3.values()],
                fill: false,
                lineTension: 0,           
                borderColor: "#49a8cc"
              },
              {
                label: "Makeup",
                data: [...service4.values()],
                fill: false,
                lineTension: 0,           
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
                    },
                    gridLines: {
                        display:false
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
