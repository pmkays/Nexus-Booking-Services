import * as actionTypes from './actionTypes';
import axios from '../../axios-sept';
import * as actions from './actions';

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
        dispatch(
          actions.updateRedirect(
            'You have succesfully added a service to the employee.',
            '/employees'
          )
        );
        history.push('/success');
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

export const removeServiceStart = () => {
  return {
    type: actionTypes.REMOVE_SERVICES_START,
  };
};

export const removeServiceSuccess = (token) => {
  return {
    type: actionTypes.REMOVE_SERVICES_SUCCESS,
    token: token,
  };
};

export const removeServiceFail = (error) => {
  return {
    type: actionTypes.REMOVE_SERVICES_FAIL,
    error: error,
  };
};

export const removeService = (formData, token, history) => {
  return (dispatch) => {
    dispatch(removeServiceStart);

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
      .post('/api/employee/services/remove', serviceData, config)
      .then((response) => {
        dispatch(removeServiceSuccess(token));
      })
      .then(() => {
        dispatch(
          actions.updateRedirect(
            'You have succesfully removed a service to the employee.',
            '/employees'
          )
        );
        history.push('/success');
      })
      .catch((error) => {
        dispatch(
          removeServiceFail(
            'Error removing Service. Cannot remove a service from employee if they dont have it.'
          )
        );
      });
  };
};
