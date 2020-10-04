import * as actionTypes from './actionTypes';
import axios from '../../axios-sept';
import jwtDecode from 'jwt-decode';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, userId, authority) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    userId: userId,
    authority: authority,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('authority');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (username, password, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());

    const userDetails = {
      username: username,
      password: password,
    };

    let authCode = '';

    axios
      .post('/users/signin', userDetails)
      .then((response) => {
        authCode = response.data;
        let decodedJwt = jwtDecode(authCode);

        const userId = decodedJwt.userId;
        const authority = decodedJwt.roles[0].authority;
        const expirationDate = new Date();
        const secondsToExpire = decodedJwt.exp - decodedJwt.iat;
        expirationDate.setMinutes(
          expirationDate.getMinutes() + secondsToExpire / 60
        );

        localStorage.setItem('token', response.data);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', decodedJwt.userId);
        localStorage.setItem('authority', authority);

        dispatch(authSuccess(response.data, userId, authority));
        dispatch(checkAuthTimeout(secondsToExpire));
      })
      .catch((error) => {
        dispatch(authFail('Username or password is incorrect.'));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId');
        const authority = localStorage.getItem('authority');
        dispatch(authSuccess(token, userId, authority));
        // Expiry in seconds by taking the difference
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
