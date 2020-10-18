import * as actionTypes from "./actionTypes";
import axios from "../../axios-sept";

export const fetchEmployeeStart = () => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_START,
  };
};

export const fetchEmployeeSuccess = (profileDetails) => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_SUCCESS,
    profileDetails: profileDetails,
  };
};

export const fetchEmployeeFail = (error) => {
  return {
    type: actionTypes.FETCH_EMPLOYEE_FAIL,
    error: error,
  };
};

export const fetchEmployee = (id, token, history) => {
  return (dispatch) => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .get("/api/employees/" + id, config)
      .then((response) => {
        dispatch(fetchEmployeeSuccess(response.data));
      })
      .then(() => {
        history.push("editemployee/" + id);
      })
      .catch((error) => {
        dispatch(fetchEmployeeFail("Error reaching server. Please try again later."));
      });
  };
};
