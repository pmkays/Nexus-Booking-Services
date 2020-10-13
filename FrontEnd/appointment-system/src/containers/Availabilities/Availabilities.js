import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from 'react-router';

import * as actions from '../../store/actions/actions';
import classes from './Availabilities.module.css';

class Availabilites extends Component {
  state = {
    time: moment(),
    day: null,
    startTime: {
      0: 'Not Available',
      1: 'Not Available',
      2: 'Not Available',
      3: 'Not Available',
      4: 'Not Available',
      5: 'Not Available',
      6: 'Not Available',
    },
    endTime: {
      0: 'Not Available',
      1: 'Not Available',
      2: 'Not Available',
      3: 'Not Available',
      4: 'Not Available',
      5: 'Not Available',
      6: 'Not Available',
    },
    error: [],
  };
  render() {
    const shiftTimes = () => {
      const times = ['Not Available'];
      for (let i = 0; i <= 24; i++) {
        times.push(i);
      }
      return times.map((time) => (
        <option value={time} key={time}>
          {time}
          {time === 'Not Available' ? '' : ':00'}
        </option>
      ));
    };
    const shifts = () => {
      return [
        [0, 'Monday'],
        [1, 'Tuesday'],
        [2, 'Wednesday'],
        [3, 'Thursday'],
        [4, 'Friday'],
        [5, 'Saturday'],
        [6, 'Sunday'],
      ].map((day) => {
        const isDisabled = moment(this.state.time)
          .startOf('isoWeek')
          .add(day[0], 'days')
          .isBefore(moment())
          ? true
          : false;
        return (
          <tr key={day[1]}>
            <th scope='row'>{day[1]}</th>
            <td>
              <select
                className='custom-select'
                id='startTime'
                data-index={day[0]}
                onChange={setTime}
                disabled={isDisabled}
              >
                {shiftTimes()}
              </select>
            </td>
            <td>
              <select
                className='custom-select'
                id='endTime'
                data-index={day[0]}
                onChange={setTime}
                disabled={isDisabled}
              >
                {shiftTimes()}
              </select>
            </td>
          </tr>
        );
      });
    };
    const setTime = (e) => {
      e.preventDefault();
      this.setState({
        [e.target.id]: {
          ...this.state[e.target.id],
          [e.target.dataset.index]: e.target.value,
        },
      });
    };
    const previousWeek = (e) => {
      e.preventDefault();
      this.setState({
        time: moment(this.state.time).subtract('7', 'days'),
      });
    };
    const nextWeek = (e) => {
      e.preventDefault();
      this.setState({
        time: moment(this.state.time).add('7', 'days'),
      });
    };
    const submitAvailabilities = (e) => {
      e.preventDefault();
      const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];
      const errors = [];
      const addAvailabilitiesPromise = [];
      for (let i = 0; i < 7; i++) {
        if (
          this.state.startTime[i] !== 'Not Available' &&
          this.state.endTime[i] !== 'Not Available'
        ) {
          if (
            parseInt(this.state.startTime[i], 10) >
            parseInt(this.state.endTime[i], 10)
          ) {
            errors.push(
              `End Time for day ${days[i]} has to be before start time`
            );
          } else {
            let startTimeText = this.state.startTime[i];
            let endTimeText = this.state.endTime[i];
            if (startTimeText < 10) {
              startTimeText = `0${this.state.startTime[i]}`;
            }
            if (endTimeText < 10) {
              endTimeText = `0${this.state.endTime[i]}`;
            }
            const baseTime = moment(this.state.time)
              .startOf('isoWeek')
              .add(i, 'days')
              .format('YYYY-MM-DD');
            const startTime = `${baseTime}T${startTimeText}:00:00`;
            const endTime = `${baseTime}T${endTimeText}:00:00`;
            addAvailabilitiesPromise.push(
              this.props.addAvailabilities(
                startTime,
                endTime,
                this.props.token,
                this.props.history
              )
            );
          }
        }
      }
      this.setState({ error: errors });
      return Promise.all(addAvailabilitiesPromise);
    };

    // Renders error message if there is any errors
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>{this.props.error}</p>;
    }

    return (
      <div className={classes.AvailabilitiesBox}>
        <h1 className='text-center'>Add Availabilites</h1>
        <div className='text-center'>
          <i className='fas fa-arrow-left btn' onClick={previousWeek}></i>
          From Monday {this.state.time
            .startOf('isoWeek')
            .format('DD/MM/YYYY')}{' '}
          to Sunday {this.state.time.endOf('isoWeek').format('DD/MM/YYYY')}
          <i className='fas fa-arrow-right btn' onClick={nextWeek}></i>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Day</th>
              <th scope='col'>Start Time</th>
              <th scope='col'>Finish Time</th>
            </tr>
          </thead>
          <tbody>{shifts()}</tbody>
        </table>

        <div className='text-center'>
          <button className='btn btn-primary' onClick={submitAvailabilities}>
            Submit
          </button>
        </div>
        <div className='text-center'>
          {errorMessage}
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
    error: state.profile.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAvailabilities: (startTime, endTime, token, history) =>
      dispatch(actions.addAvailabilities(startTime, endTime, token, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Availabilites));
