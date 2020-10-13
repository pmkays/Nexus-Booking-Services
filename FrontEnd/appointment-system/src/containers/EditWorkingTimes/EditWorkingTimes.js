import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-sept";
import moment from "moment";
import classes from "./EditWorkingTimes.module.css";
import { withRouter } from "react-router-dom";

class EditWorkingTimes extends Component {
  state = {
    loading: false,
    error: null,
    startTime: moment((new URLSearchParams(window.location.search)).get('startTime')).format("H"),
    endTime: moment((new URLSearchParams(window.location.search)).get('endTime')).format("H"),
    defaultStartTime: (new URLSearchParams(window.location.search)).get('startTime'),
    defaultEndTime: (new URLSearchParams(window.location.search)).get('endTime'),
    employeeId: (new URLSearchParams(window.location.search)).get('employeeId'),
    workingTimeId: (new URLSearchParams(window.location.search)).get('workingTimeId'),
  }

 

  render() {

    const updateWorkingTimes = async () => {
      this.setState({...this.state, loading: true, error: null });
      const config = {
        headers: {
          Authorization: `Bearer ${this.props.token}`,
        },
      };
  
      try {
        if (
          parseInt(this.state.startTime, 10) > parseInt(this.state.endTime, 10)
        ) {
          this.setState({ error: `End Time has to be before start time`, loading: false });
        } else {
          let startTimeText = this.state.startTime;
          let endTimeText = this.state.endTime;
          if (startTimeText < 10) {
            startTimeText = `0${this.state.startTime}`;
          }
          if (endTimeText < 10) {
            endTimeText = `0${this.state.endTime}`;
          }
          const baseTime = moment(this.state.defaultStartTime).format('YYYY-MM-DD');
          const data = {
            workingTimeId: this.state.workingTimeId,
            startTime: `${baseTime}T${startTimeText}:00:00`,
            endTime: `${baseTime}T${endTimeText}:00:00`,
          };
          await axios.put(`/api/workingTime`, data, config)
          .then(()=>{this.props.history.push("/viewworkingtimes")});
        }
      } catch (error) {
        this.setState({
          error: "Error updating workingTimes. Either this updated time conflicts with the employee's availabilities, or one of their bookings.",
          loading: false,
        });
      }
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
    const setTime = (e) => {
      e.preventDefault();
      this.setState({
        [e.target.id]: e.target.value,
      });
    };

    return (
      <div className={"container " + classes.Display}>
        <h1 className='text-center'>Edit Working Times</h1>
        <div className="d-flex">
          <div className="container">
            <div className="row">
              <div className="col">Date:</div>
              <div className="col">
                {moment(this.state.defaultStartTime).format("DD/MM/yyyy")}
              </div>
            </div>
            <div className="row">
              <div className="col">Start Time:</div>
              <div className="col">
                <select
                  id='startTime'
                  className='custom-select'
                  onChange={setTime}
                  value={this.state.startTime || undefined}
                >
                  {shiftTimes()}
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col">End Time:</div>
              <div className="col">
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
            <div className="row">
              <button type="button" className="btn btn-primary" onClick={updateWorkingTimes}>Edit</button>
            </div>
          </div>
        </div>
        <div className="text-center"><p>{this.state.error}</p></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    userType: state.auth.authority,
    userId: state.auth.userId,
  };
};

export default connect(mapStateToProps)(withRouter(EditWorkingTimes));
