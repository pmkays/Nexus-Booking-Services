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
      .get("http://localhost:8080/api/" + url + "/" + userId, config)
      .then((response) => {
        console.log(response);
        dispatch(fetchProfileSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchProfileFail("Error reaching server. Please try again later."));
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
      .put("http://localhost:8080/api/" + url + "/" + userId, formData, config)
      .then((response) => {
        console.log(response);
        dispatch(editProfileSuccess(response.data));
      })
      .then(() => {
        //link them back to profile page
        history.push("/profile");
      })
      .catch((error) => {
        dispatch(editProfileFail("Error reaching server. Please try again later."));
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

export const addProfileSuccess = (profileDetails) => {
  return {
    type: actionTypes.ADD_PROFILE_SUCCESS,
    profileDetails: profileDetails,
  };
};

export const addProfile = (formData, history, type) => {
  return (dispatch) => {
    let userData = null;

    if (type === "customers") {
      userData = {
        username: formData.username,
        password: formData.password,
        type: type,
      };
    } else {
      userData = {
        username: formData.username,
        password: "abc123",
        type: type,
      };
    }

    axios
      .post("http://localhost:8080/users/signup", userData)
      .then((response) => {
        console.log(response);
        dispatch(fetchAccountNo(formData, history, type));
      })
      .catch((error) => {
        dispatch(addProfileFail("Error reaching server. Please try again later."));
      });
  };
};

export const fetchAccountNo = (formData, history, type) => {
  return (dispatch) => {
    let profileData = {
      username: formData.username,
    };

    axios
      .post("http://localhost:8080/users/accountno", profileData)
      .then((response) => {
        console.log(response);
        let updatedProfileData = { ...formData, accountNo: response.data };
        dispatch(addProfileDetailsToUser(updatedProfileData, history, type));
      })
      .catch((error) => {
        dispatch(addProfileFail("Error reaching server. Please try again later."));
      });
  };
};

export const addProfileDetailsToUser = (formData, history, type) => {
  return (dispatch) => {
    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNo: formData.phoneNo,
      address: formData.address,
    };

    console.log(profileData);

    axios
      .put("http://localhost:8080/api/" + type + "/" + formData.accountNo, profileData)
      .then((response) => {
        console.log(response);
        dispatch(addProfileSuccess(response.data));
      })
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        dispatch(addProfileFail("Error reaching server. Please try again later."));
      });
  };
};
