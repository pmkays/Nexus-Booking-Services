import * as actionTypes from "./actionTypes";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const clearProfileUponLogout = () => {
  return {
    type: actionTypes.CLEAR_PROFILE,
  };
};

export const fetchProfileStart = () => {
  return {
    type: actionTypes.FETCH_PROFILE_START,
  };
};

export const fetchProfileSuccess = (profileDetails) => {
  return {
    type: actionTypes.FETCH_PROFILE_SUCCESS,
    profileDetails: profileDetails,
  };
};

export const fetchProfileFail = (error) => {
  return {
    type: actionTypes.FETCH_PROFILE_FAIL,
    error: error,
  };
};

export const fetchProfile = (token) => {
  return (dispatch) => {
    let decodedJwt = jwtDecode(token);

    let url = "";
    switch (decodedJwt.roles[0].authority) {
      case "ROLE_ADMIN":
        url = "admins";
        break;
      case "ROLE_EMPLOYEE":
        url = "employees";
        break;
      case "ROLE_CUSTOMER":
        url = "customers";
        break;
      default:
        return "";
    }

    const userId = decodedJwt.userId;

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .get("http://54.144.245.48:8080/api/" + url + "/" + userId, config)
      .then((response) => {
        console.log(response);
        dispatch(fetchProfileSuccess(response.data));
      })
      .catch((error) => {
        dispatch(
          fetchProfileFail("Error reaching server. Please try again later.")
        );
      });
  };
};

export const editProfileStart = () => {
  return {
    type: actionTypes.EDIT_PROFILE_START,
  };
};

export const editProfileFail = (error) => {
  return {
    type: actionTypes.EDIT_PROFILE_FAIL,
    error: error,
  };
};

export const editProfileSuccess = (profileDetails) => {
  return {
    type: actionTypes.EDIT_PROFILE_SUCCESS,
    profileDetails: profileDetails,
  };
};

export const editProfile = (formData, token, history) => {
  return (dispatch) => {
    let decodedJwt = jwtDecode(token);

    let url = "";
    switch (decodedJwt.roles[0].authority) {
      case "ROLE_ADMIN":
        url = "admins";
        break;
      case "ROLE_EMPLOYEE":
        url = "employees";
        break;
      case "ROLE_CUSTOMER":
        url = "customers";
        break;
      default:
        return "";
    }

    const userId = decodedJwt.userId;

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .put("http://54.144.245.48:8080/api/" + url + "/" + userId, formData, config)
      .then((response) => {
        console.log(response);
        dispatch(editProfileSuccess(response.data));
      })
      .then(() => {
        //link them back to profile page
        history.push("/profile");
      })
      .catch((error) => {
        dispatch(
          editProfileFail("Error reaching server. Please try again later.")
        );
      });
  };
};

//

export const addProfileStart = () => {
  return {
    type: actionTypes.ADD_PROFILE_START,
  };
};

export const addProfileFail = (error) => {
  return {
    type: actionTypes.ADD_PROFILE_FAIL,
    error: error,
  };
};

export const addProfileSuccess = (profileDetails, type) => {
  if (type === "employees") {
    return {
      type: actionTypes.ADD_PROFILE_SUCCESS,
      profileDetails: null,
    };
  }
  return {
    type: actionTypes.ADD_PROFILE_SUCCESS,
    profileDetails: profileDetails,
  };
};

export const addProfile = (formData, history, type, token) => {
  return (dispatch) => {
    dispatch(addProfileStart());

    let userData = {
      username: formData.username,
      password: formData.password,
      type: type,
    };

    axios
      .post("http://54.144.245.48:8080/users/signup", userData)
      .then((response) => {
        console.log(response);
        dispatch(fetchAccountNo(formData, history, type, token));
      })
      .catch((error) => {
        dispatch(
          addProfileFail("Error reaching server. Please try again later.")
        );
      });
  };
};

export const fetchAccountNo = (formData, history, type, token) => {
  return (dispatch) => {
    let profileData = {
      username: formData.username,
    };

    axios
      .post("http://54.144.245.48:8080/users/accountno", profileData)
      .then((response) => {
        console.log(response);
        let updatedProfileData = { ...formData, accountNo: response.data };
        dispatch(
          addProfileDetailsToUser(updatedProfileData, history, type, token)
        );
      })
      .catch((error) => {
        dispatch(
          addProfileFail("Error reaching server. Please try again later.")
        );
      });
  };
};

export const addProfileDetailsToUser = (formData, history, type, token) => {
  return (dispatch) => {
    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNo: formData.phoneNo,
      address: formData.address,
    };

    console.log(profileData);

    let config = null;

    if (type === "employees") {
      console.log("Employee adding...", token);
      config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
    }

    axios
      .put(
        "http://54.144.245.48:8080/api/" + type + "/" + formData.accountNo,
        profileData,
        config
      )
      .then((response) => {
        console.log(response);
        dispatch(addProfileSuccess(response.data, type));
      })
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        dispatch(
          addProfileFail("Error reaching server. Please try again later.")
        );
      });
  };
};

export const fetchAvailabilitiesStart = () => {
  return {
    type: actionTypes.FETCH_AVAILABILITIES_START,
  };
};

export const fetchAvailabilitiesSuccess = (availabilities) => {
  return {
    type: actionTypes.FETCH_AVAILABILITIES_SUCCESS,
    availabilities: availabilities,
  };
};

export const fetchAvailabilitiesFail = (error) => {
  return {
    type: actionTypes.FETCH_AVAILABILITIES_FAIL,
    error: error,
  };
};

export const fetchAvailabilities = (token) => {
  return (dispatch) => {
    let decodedJwt = jwtDecode(token);

    const userId = decodedJwt.userId;

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .get("http://54.144.245.48:8080/api/availability/employee/" + userId, config)
      .then((response) => {
        console.log(response);
        dispatch(fetchAvailabilitiesSuccess(response.data));
      })
      .catch((error) => {
        dispatch(
          fetchAvailabilitiesFail(
            "Error reaching server. Please try again later."
          )
        );
      });
  };
};

export const addAvailabilitiesStart = () => {
  return {
    type: actionTypes.ADD_AVAILABILITIES_START,
  };
};

export const addAvailabilitiesSuccess = (availabilities) => {
  return {
    type: actionTypes.ADD_AVAILABILITIES_SUCCESS,
    availabilities: availabilities,
  };
};

export const addAvailabilitiesFail = (error) => {
  return {
    type: actionTypes.ADD_AVAILABILITIES_FAIL,
    error: error,
  };
};

export const addAvailabilities = (startTime, endTime, token, history) => {
  return (dispatch) => {
    let decodedJwt = jwtDecode(token);

    const data = {
      employeeId: decodedJwt.userId,
      startTime,
      endTime,
    };

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    console.log(
      "employeeId" + data.employeeId + " startTime: " + data.startTime
    );

    axios
      .post("http://54.144.245.48:8080/api/availability", data, config)
      .then((response) => {
        console.log(response);
        dispatch(addAvailabilitiesSuccess(response.data));
      })
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        console.log(error.response);
        //"Error adding availability. You must not already have an availability on the day(s) you have chosen."
        const reason =
          error.response.data +
          " You already have an availability on this day.";
        dispatch(addAvailabilitiesFail(reason));
      });
  };
};

export const fetchWorkingTimeStart = () => {
  return {
    type: actionTypes.FETCH_WORKING_TIME_START,
  };
};

export const fetchWorkingTimeSuccess = (workingTime) => {
  return {
    type: actionTypes.FETCH_WORKING_TIME_SUCCESS,
    workingTime: workingTime,
  };
};

export const fetchWorkingTimeFail = (error) => {
  return {
    type: actionTypes.FETCH_WORKING_TIME_FAIL,
    error: error,
  };
};

export const fetchWorkingTime = (startTime, endTime, token) => {
  return (dispatch) => {
    let decodedJwt = jwtDecode(token);

    const userId = decodedJwt.userId;

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .get("http://54.144.245.48:8080/api/workingTIme/employee/" + userId, config)
      .then((response) => {
        console.log(response);
        dispatch(fetchWorkingTimeSuccess(response.data));
      })
      .catch((error) => {
        dispatch(
          fetchWorkingTimeFail("Error reaching server. Please try again later.")
        );
      });
  };
};

export const addWorkingTimeStart = () => {
  return {
    type: actionTypes.ADD_WORKING_TIME_START,
  };
};

export const addWorkingTimeSuccess = (availabilities) => {
  return {
    type: actionTypes.ADD_WORKING_TIME_SUCCESS,
    availabilities: availabilities,
  };
};

export const addWorkingTimeFail = (error) => {
  return {
    type: actionTypes.ADD_WORKING_TIME_FAIL,
    error: error,
  };
};

export const addWorkingTime = (startTime, endTime, token) => {
  return (dispatch) => {
    let decodedJwt = jwtDecode(token);

    const data = {
      employeeId: decodedJwt.userId,
      startTime,
      endTime,
    };

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .post("http://54.144.245.48:8080/api/workingTime", data, config)
      .then((response) => {
        console.log(response);
        dispatch(addWorkingTimeSuccess(response.data));
      })
      .catch((error) => {
        dispatch(
          addWorkingTimeFail("Error reaching server. Please try again later.")
        );
      });
  };
};
