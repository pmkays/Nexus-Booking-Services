import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import * as actions from "../../store/actions/actions";

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
  };

  render() {
    const shiftTimes = () => {
      const times = [];
      times.push('Not Available');
      for (let i = 0; i <= 24; i++) { times.push(i); }
      return times.map((time) => <option value={time} key={time}>{time}{time === 'Not Available' ? '':':00'}</option>);
    };
    const shifts = () => {
      return [[0,'Monday'],[1,'Tuesday'],[2,'Wednesday'],[3,'Thursday'],[4,'Friday'],[5,'Saturday'], [6,'Sunday']].map((day) => (
      <tr key={day[1]}>
        <th scope="row">{day[1]}</th>
        <td><select className="custom-select" id="startTime" data-index={day[0]} onChange={setTime}>{shiftTimes()}</select></td>
        <td><select className="custom-select" id="endTime" data-index={day[0]} onChange={setTime}>{shiftTimes()}</select></td>
      </tr>
      ))
    };
    const setTime = (e) => {
      e.preventDefault();
      this.setState({
        [e.target.id]: { ...this.state[e.target.id], [e.target.dataset.index]: e.target.value }, 
      });
    }
    const previousWeek = (e) => {
      e.preventDefault();
      this.setState({
        time: moment(this.state.time).subtract('7', 'days'),
      });
    }
    const nextWeek = (e) => {
      e.preventDefault();
      this.setState({
        time: moment(this.state.time).add('7', 'days'),
      });
    }
    const submitAvailabilities = (e) => {
      e.preventDefault();
      const addAvailabilitiesPromise = [];
      for (let i = 0; i < 7; i++) {
        if (this.state.startTime[i] !== null && this.state.endTime[i] !== null) {
          console.log(i);
          let startTimeText = this.state.startTime[i];
          let endTimeText = this.state.endTime[i];
          if (startTimeText < 10) {
            startTimeText = `0${this.state.startTime[i]}`;
          }
          if (endTimeText < 10) {
            endTimeText = `0${this.state.endTime[i]}`;
          }
          const baseTime = moment(this.state.time).startOf('isoWeek').add(i, 'days').format('YYYY-MM-DD');
          const startTime = `${baseTime}T${startTimeText}:00:00`;
          const endTime = `${baseTime}T${endTimeText}:00:00`;

          if (!(startTimeText === 'Not Available' || endTimeText === 'Not Available')) {
            console.log("adding availability");
            addAvailabilitiesPromise.push(this.props.addAvailabilities(startTime, endTime, this.props.token));
          }
        }
      }
      return Promise.all(addAvailabilitiesPromise);
    }
    return (
      <React.Fragment>
        <h2 className="text-center">Add Availabilites</h2>
        <div className="text-center">
          <i className="fas fa-arrow-left btn" onClick={previousWeek}></i>
          From Monday {this.state.time.startOf('isoWeek').format('DD/MM/YYYY')} to Sunday {this.state.time.endOf('isoWeek').format('DD/MM/YYYY')}
          <i className="fas fa-arrow-right btn" onClick={nextWeek}></i>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Start Time</th>
              <th scope="col">Finish Time</th>
            </tr>
          </thead>
          <tbody>
            {shifts()}
          </tbody>
        </table>
        <div className="text-center">
          <button className="btn btn-primary" onClick={submitAvailabilities}>Submit</button>
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
    addAvailabilities: (startTime, endTime, token) => dispatch(actions.addAvailabilities(startTime, endTime, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Availabilites);
