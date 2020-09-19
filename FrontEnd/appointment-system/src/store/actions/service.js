import * as actionTypes from "./actionTypes";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { addProfileSuccess } from "./profile";

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

export const addService = (formData, token) => {
  return (dispatch) => {
    dispatch(addServiceStart);

    let serviceData = {
      employeeId: formData.employeeId,
      serviceName: formData.serviceName,
    };

    console.log(
      "employeeId " +
        serviceData.employeeId +
        " serviceName " +
        serviceData.serviceName
    );

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .post("http://localhost:8080/api/employee/services", serviceData, config)
      .then((response) => {
        console.log(response);
        dispatch(addServiceSuccess(token));
      })
      .catch((error) => {
        dispatch(
          addServiceFail(
            "Error adding Service. Cannot add service to employee if they already have it."
          )
        );
      });
  };
};
