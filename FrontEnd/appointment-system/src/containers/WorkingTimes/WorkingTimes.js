import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import axios from "axios";

import * as actions from "../../store/actions/actions";

class WorkingTimes extends Component {
  state = {
    time: moment(),
    incrementDays: 0,
    error: [],
    employeeId: -1,
    employees: [],
    startTime: null,
    endTime: null,
    availabilities: [],
  };

  async componentDidMount() {
    const config = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };
    const employees = await axios.get("http://3.208.71.179:8080/api/employees/", config);
    this.setState({
      ...this.state,
      employees: [{id:-1,firstName:'Select a',lastName:' employee'}, ...employees.data._embedded.employees],
    });
  }

  render() {
    const employeeList = () => {
      return <select className="custom-select" onChange={setEmployee}>{this.state.employees.map(employee => <option value={employee.id} key={employee.id}>{employee.firstName} {employee.lastName}</option>)}</select>;
    }
    const setEmployee = async (e) => {
      e.preventDefault();
      const config = {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      };
      const availabilities = await axios.get("http://3.208.71.179:8080/api/availability/employee/"+e.target.value, config);
      this.setState({
        employeeId: e.target.value,
        availabilities: availabilities,
      });
    }
    const setTime = (e) => {
      e.preventDefault();
      this.setState({
        [e.target.id]: e.target.value, 
      });
    }
    const shiftTimes = () => {
      const times = [];
      for (let i = 0; i <= 24; i++) { times.push(i); }
      return times.map((time) => <option value={time} key={time}>{time}:00</option>);
    };
    const previousDay = (e) => {
      e.preventDefault();
      if (this.state.incrementDays > 0) {
        this.setState({
          time: moment(this.state.time).subtract('1', 'day'),
          incrementDays: this.state.incrementDays - 1,
        });
      }
    }
    const nextDay = (e) => {
      e.preventDefault();
      if (this.state.incrementDays < 7) {
        this.setState({
          time: moment(this.state.time).add('1', 'day'),
          incrementDays: this.state.incrementDays + 1,
        });
      }
    }
    const listAvailabilities = () => {
      return <ul>{this.state.availabilities.map((availability) => <li key={availability.id}>{availability.startTime} - {availability.endTime}</li>)}</ul>;
    }
    const addWorkingTime = (e) => {
      e.preventDefault();
      const errors = [];
      const addWorkingTimesPromise = [];
      console.log(this.state);
      if (this.state.startTime !== null && this.state.endTime !== null && this.state.employeeId !== -1) {
        if (parseInt(this.state.startTime, 10) > parseInt(this.state.endTime, 10)) {
          errors.push(`End Time for day ${this.state.time.format('dddd')} has to be before start time`);
        }

        let startTimeText = this.state.startTime;
        let endTimeText = this.state.endTime;
        if (startTimeText < 10) {
          startTimeText = `0${this.state.startTime}`;
        }
        if (endTimeText < 10) {
          endTimeText = `0${this.state.endTime}`;
        }
        const baseTime = this.state.time.format('YYYY-MM-DD');
        const startTime = `${baseTime}T${startTimeText}:00:00`;
        const endTime = `${baseTime}T${endTimeText}:00:00`;
        addWorkingTimesPromise.push(this.props.addWorkingTime(startTime, endTime, this.props.token));
        errors.push("Working time added successfully");
      } else {
        errors.push("Please select an employee, starting and finishing time.");
      }
      this.setState({ error: errors });
      return Promise.all(addWorkingTimesPromise);
    }
    return (
      <React.Fragment>
        <h2 className="text-center">Add Working Times for {employeeList()}</h2>
        <div className="text-center">
          <i className="fas fa-arrow-left btn" onClick={previousDay}></i>
          On {this.state.time.format('dddd')} - {this.state.time.format('DD/MM/YYYY')}
          <i className="fas fa-arrow-right btn" onClick={nextDay}></i>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md">
              <p>Starting Time</p>
              <select id="startTime" className="custom-select" onChange={setTime}>{shiftTimes()}</select>
            </div>
            <div className="col-md">
              <p>Finishing Time</p>
              <select id="endTime" className="custom-select" onChange={setTime}>{shiftTimes()}</select>
            </div>
          </div>
        </div>
        {listAvailabilities()}
        <div className="text-center">
          <button className="btn btn-primary" onClick={addWorkingTime}>Add</button>
        </div>
        <div className="text-center">
          {this.state.error.length > 0 && <ul className="list-group">{this.state.error.map(error => <li key={Math.random().toString(36)} className="list-group-item">{error}</li>)}</ul>}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addWorkingTime: (startTime, endTime, token) => dispatch(actions.addWorkingTime(startTime, endTime, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkingTimes);
