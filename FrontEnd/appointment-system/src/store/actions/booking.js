import * as actionTypes from './actionTypes';
import axios from '../../axios-sept';
import jwtDecode from 'jwt-decode';

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

// export const viewBookings = (token) => {

//   return (dispatch) => {
//     let decodedJwt = jwtDecode(token);

//     let url = '';
//     switch (decodedJwt.roles[0].authority) {
//       case 'ROLE_EMPLOYEE':
//         url = 'employees';
//         break;
//       case 'ROLE_CUSTOMER':
//         url = 'customers';
//         break;
//       default:
//         return '';
//     }

//     const userId = decodedJwt.userId;

//     const config = {
//       headers: {
//         Authorization: 'Bearer ' + token,
//       },
//     };

//     axios
//       .get('/api/booking' + url + '/' + userId, config)
//       .then((response) => {
//         console.log(response);
//         // dispatch(editProfileSuccess(response.data));
//       })
//       .catch((error) => {
//         // dispatch();
//           // editProfileFail('Error reaching server. Please try again later.')
//         // );
//       });
//   };

// }

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
        Authorization: 'Bearer ' + token,
      },
    };

    console.log(bookingData.startTime);
    console.log(bookingData.endTime);
    console.log('customerid' + bookingData.customerId);
    console.log('employeeid' + bookingData.employeeId);

    axios
      .post('/api/booking', bookingData, config)
      .then((response) => {
        console.log(response);
        dispatch(addBookingSuccess(token));
      })
      .then(() => {
        history.push('/');
      })
      .catch((error) => {
        dispatch(addBookingFail('Error adding Booking.'));
      });
  };
};
