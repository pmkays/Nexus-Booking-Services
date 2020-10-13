import React, { Component } from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';
import axios from '../../axios-sept';
import moment from 'moment';
import Spinner from '../../components/UI/Spinner/Spinner';
import Button from '../../components/UI/Button/Button'
import classes from './EmployeeSchedule.module.css';
import { timeDiff } from '../../utility/utility';

export class EmployeeSchedule extends Component {
  state = {
    workingTimes: null,
    availabilitiesTimes: null,
    next7DaysSet: false,
    loading: false,
    error: null,
  };

  componentDidMount() {
    this.setState({ ...this.state, loading: true });
    this.fetchWorkingTimes();

    this.setState({ ...this.state, loading: true });
    this.fetchAvailabilities();
  }

  fetchWorkingTimes() {
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    };

    let id = null;

    if(this.props.userType === 'ROLE_ADMIN'){
      id = this.props.match.params.id;
    }else{
      id = this.props.userId;
    }

    axios
      .get(`/api/workingTime/employee/${id}`, config)
      .then((response) => {
        let workingTimes = [];

        let currentDate = moment().startOf('day');

        for (let i = 0; i < 7; ++i) {
          let added = false;
          response.data.forEach((workingTime, index) => {
            if (
              moment(workingTime.startTime).startOf('day').format('YYYY-MM-DDTHH:mm:ss') ===
              currentDate.format('YYYY-MM-DDTHH:mm:ss')
            ) {
              workingTimes.push(workingTime);
              added = true;
            }
          });
          if (!added) {
            workingTimes.push({ startTime: 'Not Set' });
          }
          currentDate.add('1', 'day');
        }

        this.setState({
          ...this.state,
          workingTimes: workingTimes,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: 'Error retrieving bookings.',
          loading: false,
        });
      });
  }

  fetchAvailabilities() {
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
    };

    let id = null;

    if(this.props.userType === 'ROLE_ADMIN'){
      id = this.props.match.params.id;
    }else{
      id = this.props.userId;
    }

    axios
      .get(`/api/availability/employee/${id}`, config)
      .then((response) => {
        let availabilitiesTimes = [];

        let currentDate = moment().startOf('day');

        for (let i = 0; i < 7; ++i) {
          let added = false;
          response.data.forEach((availability, index) => {
            if (
              moment(availability.startTime).startOf('day').format('YYYY-MM-DDTHH:mm:ss') ===
              currentDate.format('YYYY-MM-DDTHH:mm:ss')
            ) {
              availabilitiesTimes.push(availability);
              added = true;
            }
          });
          if (!added) {
            availabilitiesTimes.push({ startTime: 'Not Available' });
          }
          currentDate.add('1', 'day');
        }

        let found = false;
        for (let i = 0; i < 7; ++i) {
          // eslint-disable-next-line
          response.data.forEach((availability, index) => {
            if (
              moment(availability.startTime).startOf('day').format('YYYY-MM-DDTHH:mm:ss') ===
              currentDate.format('YYYY-MM-DDTHH:mm:ss')
            ) {
              found = true;
            }
          });
          currentDate.add('1', 'day');
        }

        this.setState({
          ...this.state,
          availabilitiesTimes: availabilitiesTimes,
          next7DaysSet: found,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          ...this.state,
          error: 'Error retrieving availabilities.',
          loading: false,
        });
      });
  }

  render() {
    let workingTimesData = null;

    if (this.state.workingTimes !== null) {
      workingTimesData = this.state.workingTimes.map((workingTime, index) => {
        return (
          <tr key={index}>
            {workingTime.startTime === 'Not Set' ? (
              <React.Fragment>
                <td>Not Set</td>
                <td></td>
                <td></td>
                <td></td>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <td>{moment(workingTime.startTime).format('DD/MM/yyyy')}</td>
                <td>{moment(workingTime.startTime).format('HH:mm')}</td>
                <td>{moment(workingTime.endTime).format('HH:mm')}</td>
                <td>{timeDiff(workingTime.endTime, workingTime.startTime)}</td>
              </React.Fragment>
            )}
          </tr>
        );
      });
    }

    let workingTimes = (
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{workingTimesData}</tbody>
      </table>
    );

    let availabilitiesTimesData = null;

    if (this.state.availabilitiesTimes !== null) {
      availabilitiesTimesData = this.state.availabilitiesTimes.map((availability, index) => {
        return (
          <tr key={index}>
            {availability.startTime === 'Not Available' ? (
              <React.Fragment>
                <td>Not Available</td>
                <td></td>
                <td></td>
                <td></td>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <td>{moment(availability.startTime).format('DD/MM/yyyy')}</td>
                <td>{moment(availability.startTime).format('HH:mm')}</td>
                <td>{moment(availability.endTime).format('HH:mm')}</td>
              </React.Fragment>
            )}
          </tr>
        );
      });
    }

    let avilabilities = (
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{availabilitiesTimesData}</tbody>
      </table>
    );

    if (this.state.loading) {
      workingTimes = <Spinner />;
      avilabilities = <Spinner />;
    }

    if (this.state.error) {
      workingTimes = this.state.error;
      avilabilities = null;
    }

    let adminExtra = null;
    if(this.props.userType === 'ROLE_ADMIN'){
      adminExtra = (
        <div> 
        <Button classes={classes.MarginRight + ' btn btn-primary'}  clicked={() => {this.props.history.push("/workingTimes")}} >
        Add Working Times
      </Button>
      <Button clicked={() => {this.props.history.goBack()}} classes="btn btn-primary">
        Return
      </Button>
      </div>
      );
    }

    return (
      <div className={classes.EmployeeScheduleBox}>
        <h1>Schedule</h1>
        
        {this.state.next7DaysSet ? null : (
          <p className={classes.Warning}>
            Note: It seems you have no availabilities next week! Please add your times in if this is not correct.
          </p>
        )}
        <div className="row">
          <div className="col-lg-6">
            <h3>Work Time Next 7 Days</h3>
            {workingTimes}
          </div>
          <div className="col-lg-6">
            <h3>Availability Next 7 Days</h3>
            {avilabilities}
          </div>
        </div>
        {adminExtra}
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

export default connect(mapStateToProps)(withRouter(EmployeeSchedule));
