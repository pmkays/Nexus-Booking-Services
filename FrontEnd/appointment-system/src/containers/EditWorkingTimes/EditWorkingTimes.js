import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "../../axios-sept";
import moment from "moment";
import { NavLink } from "react-router-dom";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./EditWorkingTimes.module.css";

export class EditWorkingTimes extends Component {
  state = {
    loading: false,
    error: null,
    employeeId: (new URLSearchParams(window.location.search)).get('employeeId'),
    workingTimeId: (new URLSearchParams(window.location.search)).get('workingTimeId'),
  };

  async componentDidMount() {
    this.setState({ ...this.state, loading: true });
    const config = {
      headers: {
        Authorization: `Bearer ${this.props.token}`,
      },
    };
    try {
      const workingTimesResponse = await axios.get(`/api/workingTime/employee/${this.state.employeeId}`, config);
      console.log(workingTimesResponse);
      // this.setState({
      //   ...this.state,
      //   defaultWorkingTimes: workingTimesResponse.data.sort((a, b) =>
      //     moment(b.startTime).diff(moment(a.startTime))
      //   ),
      //   workingTimes: workingTimesResponse.data.sort((a, b) =>
      //     moment(b.startTime).diff(moment(a.startTime))
      //   ),
      //   loading: false,
      // });
      // this.setState({
      //   employeeId,
      //   workingTimes: workingTimesResponse.data,
      // });
    } catch (error) {
      console.log(error);
      this.setState({
        ...this.state,
        error: "Error retrieving workingTimes.",
        loading: false,
      });
    }
  }

  render() {
    const timeDiff = (time1, time2) => {
      var duration = moment(time1).diff(moment(time2), "hours");
      if (duration === 1) {
        return `${duration} hour`;
      }
      return `${duration} hours`;
    };

    return (
      <div></div>
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

export default connect(mapStateToProps)(EditWorkingTimes);
