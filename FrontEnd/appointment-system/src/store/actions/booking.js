import * as actionTypes from "./actionTypes";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const addBookingStart = () => {
  return {
    type: actionTypes.ADD_BOOKING_START,
  };
};

export const addBookingSuccess = (token) => {
  return {
    type: actionTypes.ADD_BOOKING_SUCCESS,
    token: token,
  };
};

export const addBookingFail = (error) => {
  return {
    type: actionTypes.ADD_BOOKING_FAIL,
    error: error,
  };
};

export const addBooking = (formData, token, history) => {
  return (dispatch) => {
    dispatch(addBookingStart);

    let decodedJwt = jwtDecode(token);

    let bookingData = {
      customerId: decodedJwt.userId,
      employeeId: formData.employeeId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      serviceId: formData.serviceId,
    };

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    console.log(bookingData.startTime);
    console.log(bookingData.endTime);
    console.log("customerid" + bookingData.customerId);
    console.log("employeeid" + bookingData.employeeId);

    axios
      .post("http://3.208.71.179:8080/api/booking", bookingData, config)
      .then((response) => {
        console.log(response);
        dispatch(addBookingSuccess(token));
      })
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        dispatch(addBookingFail("Error adding Booking."));
      });
  };
};
