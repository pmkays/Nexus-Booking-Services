import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from '../../axios-sept';

import * as actions from '../../store/actions/actions';
import classes from './WorkingTimes.module.css';

class WorkingTimes extends Component {
  state = {
    time: moment(),
    incrementDays: 0,
    error: [],
    employeeId: "-1",
    employees: [],
    startTime: "0",
    endTime: "0",
    availabilities: [],
  };

  async componentDidMount() {
    const config = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };
    const employees = await axios.get('/api/employees/', config);
    this.setState({
      ...this.state,
      employees: [
        { id: -1, firstName: 'Select a', lastName: ' employee' },
        ...employees.data._embedded.employees,
      ],
    });
  }

  render() {
    const employeeList = () => {
      return (
        <select className='custom-select' onChange={setEmployee}>
          {this.state.employees.map((employee) => (
            <option value={employee.id} key={employee.id}>
              {employee.firstName} {employee.lastName}
            </option>
          ))}
        </select>
      );
    };
    const setEmployee = async (e) => {
      e.preventDefault();
      const employeeId = e.target.value;
      const config = {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      };
      const availabilities = await axios.get(
        '/api/employee/next7DaysAvai/' + e.target.value,
        config
      );
      this.setState({
        employeeId,
        availabilities: availabilities.data.sort((a, b) => moment(a.startTime).diff(moment(b.startTime))),
      });
    };

    const setTime = (e) => {
      e.preventDefault();
      this.setState({
        [e.target.id]: e.target.value,
      });
    };
    const shiftTimes = () => {
      const times = [];
      for (let i = 0; i <= 24; i++) {
        times.push(i);
      }
      return times.map((time) => (
        <option value={time} key={time}>
          {time}:00
        </option>
      ));
    };
    const previousDay = (e) => {
      e.preventDefault();
      if (this.state.incrementDays > 0) {
        this.setState({
          time: moment(this.state.time).subtract('1', 'day'),
          incrementDays: this.state.incrementDays - 1,
        });
      }
    };
    const nextDay = (e) => {
      e.preventDefault();
      if (this.state.incrementDays < 7) {
        this.setState({
          time: moment(this.state.time).add('1', 'day'),
          incrementDays: this.state.incrementDays + 1,
        });
      }
    };
    const listAvailabilities = () => {
      if (this.state.employeeId === "-1") {
        return <p>When you select an employee and date, their availabilities will be shown here for that day.</p>;
      } else {
          return (
            <ul className='list-group'>
              {this.state.availabilities.map((availability) => (
                <li key={availability.id} className='list-group-item'>
                  {moment(availability.startTime).format('LLLL')} -{' '}
                  {moment(availability.endTime).format('LLLL')}
                </li>
              ))}
            </ul>
          );
      }
    };
    const addWorkingTime = (e) => {
      e.preventDefault();
      const errors = [];
      const addWorkingTimesPromise = [];
      if (
        this.state.startTime !== null &&
        this.state.endTime !== null &&
        this.state.employeeId !== -1
      ) {
        if (
          parseInt(this.state.startTime, 10) > parseInt(this.state.endTime, 10)
        ) {
          errors.push(
            `End Time for day ${this.state.time.format(
              'dddd'
            )} has to be before start time`
          );
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
        addWorkingTimesPromise.push(
          this.props.addWorkingTime(
            startTime,
            endTime,
            this.state.employeeId,
            this.props.token,
            this.props.history
          )
        );
        errors.push('Working time added successfully');
      } else {
        errors.push('Please select an employee, starting and finishing time.');
      }
      this.setState({ error: errors, startTime: null, endTime: null });
      return Promise.all(addWorkingTimesPromise);
    };
    return (
      <div className={classes.WorkingTimesBox}>
        <h1 className='text-center'>Add Working Times for {employeeList()}</h1>
        <br />
        <div className='text-center'>
          <i className='fas fa-arrow-left btn' onClick={previousDay}></i>
          On {this.state.time.format('dddd')} -{' '}
          {this.state.time.format('DD/MM/YYYY')}
          <i className='fas fa-arrow-right btn' onClick={nextDay}></i>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md'>
              <p>Starting Time</p>
              <select
                id='startTime'
                className='custom-select'
                onChange={setTime}
                value={this.state.startTime || undefined}
              >
                {shiftTimes()}
              </select>
            </div>
            <div className='col-md'>
              <p>Finishing Time</p>
              <select
                id='endTime'
                className='custom-select'
                onChange={setTime}
                value={this.state.endTime || undefined}
              >
                {shiftTimes()}
              </select>
            </div>
          </div>
          <br/>
          <h1 className='text-center'> Availabilities </h1>
          <div className='row flex justify-content-center'>
            {listAvailabilities()}
          </div>
        </div>
        <br />
        <div className='text-center'>
          <button className='btn btn-primary' onClick={addWorkingTime}>
            Add
          </button>
        </div>
        <div className='text-center'>
          {this.state.error.length > 0 && (
            <ul className='list-group'>
              {this.state.error.map((error) => (
                <li
                  key={Math.random().toString(36)}
                  className='list-group-item'
                >
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
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
    addWorkingTime: (startTime, endTime, employeeId, token, history) =>
      dispatch(
        actions.addWorkingTime(startTime, endTime, employeeId, token, history)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkingTimes);
