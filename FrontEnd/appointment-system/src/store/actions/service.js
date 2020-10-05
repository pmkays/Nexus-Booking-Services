import * as actionTypes from './actionTypes';
import axios from '../../axios-sept';

export const updateEmployeeId = (employeeId) => {
  return {
    type: actionTypes.UPDATE_SERVICE_EMPLOYEEID,
    employeeId: employeeId,
  };
};

export const addServiceStart = () => {
  return {
    type: actionTypes.ADD_SERVICES_START,
  };
};

export const addServiceSuccess = (token) => {
  return {
    type: actionTypes.ADD_SERVICES_SUCCESS,
    token: token,
  };
};

export const addServiceFail = (error) => {
  return {
    type: actionTypes.ADD_SERVICES_FAIL,
    error: error,
  };
};

export const addService = (formData, token, history) => {
  return (dispatch) => {
    dispatch(addServiceStart);

    let serviceData = {
      employeeId: formData.employeeId,
      serviceName: formData.serviceName,
    };

    const config = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };

    axios
      .post('/api/employee/services', serviceData, config)
      .then((response) => {
        dispatch(addServiceSuccess(token));
      })
      .then(() => {
        history.push('/employees');
      })
      .catch((error) => {
        dispatch(
          addServiceFail(
            'Error adding Service. Cannot add service to employee if they already have it.'
          )
        );
      });
  };
};