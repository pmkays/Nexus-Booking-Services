import { action } from 'typesafe-actions';
import { errorType } from '../typings/common/actions';
import { API_URL } from '../constants/const';
import { IRegisterError } from '../reducers/reducer_account';

export const enum AccountActionTypes {
  USER_FROM_TOKEN = 'USER_FROM_TOKEN',
  USER_FROM_TOKEN_SUCCESS = 'USER_FROM_TOKEN_SUCCESS',
  USER_FROM_TOKEN_FAILURE = 'USER_FROM_TOKEN_FAILURE',

  GET_PROFILE = 'GET_PROFILE',
  GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS',
  GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE',

  LOGIN = 'LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',

  REGISTER = 'REGISTER',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',

  SET_REGISTER_ERROR = 'SET_REGISTER_ERROR',
  CLEAR_REGISTER_ERROR = 'CLEAR_REGISTER_ERROR',

  LOGOUT = 'LOGOUT',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'LOGOUT_FAILURE',

  RESET_USER_TOKEN = 'RESET_USER_TOKEN',
  SET_ACCOUNT_LOADING = 'SET_ACCOUNT_LOADING',
  SET_ACCOUNT_ERROR = 'SET_ACCOUNT_ERROR',
  CLEAR_ACCOUNT_ERROR = 'CLEAR_ACCOUNT_ERROR',
}

/* tslint:disable:align */
export const userFromToken = (
  tokenFromStorage: string,
  userId: string,
): any => action(AccountActionTypes.USER_FROM_TOKEN, fetch(`${API_URL}users/${userId}`, {
  method: 'GET',
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenFromStorage}`,
  }),
}).then(response => response.json()));

export const userFromTokenFailure = (
  error: errorType,
) => action(AccountActionTypes.USER_FROM_TOKEN_FAILURE, error);

export const userFromTokenSuccess = (
  user: object,
) => action(AccountActionTypes.USER_FROM_TOKEN_SUCCESS, user);

export const getProfile = (
  tokenFromStorage: string,
  id: string,
  body: object,
): any => action(
  AccountActionTypes.GET_PROFILE,
  fetch(`${API_URL}api/accounts/${id}`, {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenFromStorage}`,
    }),
    body: JSON.stringify(body),
  }).then(response => response.json()),
);

export const getProfileFailure = (
  error: errorType,
) => action(AccountActionTypes.GET_PROFILE_FAILURE, error);

export const getProfileSuccess = (
  business: object,
) => action(AccountActionTypes.GET_PROFILE_SUCCESS, business);

export const login = (
  formValues: object,
): any => action(AccountActionTypes.LOGIN, fetch(`${API_URL}users/signin`, {
  method: 'POST',
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }),
  body: JSON.stringify(formValues),
}).then(response => response.json()));

export const loginSuccess = (
  account: object,
) => action(AccountActionTypes.LOGIN_SUCCESS, account);

export const loginFailure = (
  error: errorType,
) => action(AccountActionTypes.LOGIN_FAILURE, error);

export const register = (
  formValues: object,
): any => action(AccountActionTypes.REGISTER, fetch(`${API_URL}users/register`, {
  method: 'POST',
  headers: new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }),
  body: JSON.stringify(formValues),
}).then(response => response.json()));

export const registerSuccess = (
  user: object,
) => action(AccountActionTypes.REGISTER_SUCCESS, user);

export const registerFailure = (
  error: errorType,
) => action(AccountActionTypes.REGISTER_FAILURE, error);

export const setRegisterError = (
  error: IRegisterError,
) => action(AccountActionTypes.SET_REGISTER_ERROR, error);
export const clearRegisterError = () => action(AccountActionTypes.CLEAR_REGISTER_ERROR);

export const logout = (
  tokenFromStorage: string,
  jti: string,
): any => action(AccountActionTypes.LOGOUT, fetch(`${API_URL}users/logout/${jti}`, {
  method: 'DELETE',
  headers: new Headers({
    Accept: 'application/json, text/plain',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tokenFromStorage}`,
  }),
}).then(response => response));

export const logoutSuccess = () => action(AccountActionTypes.LOGOUT_SUCCESS, null);

export const logoutFailure = (
  error: errorType,
) => action(AccountActionTypes.LOGOUT_FAILURE, error);

export const resetUserToken = (
) => action(AccountActionTypes.RESET_USER_TOKEN);

export const setAccountLoading = (
) => action(AccountActionTypes.SET_ACCOUNT_LOADING);

export const setAccountError = (
  error: errorType,
) => action(AccountActionTypes.SET_ACCOUNT_ERROR, error);

export const clearAccountError = (
) => action(AccountActionTypes.CLEAR_ACCOUNT_ERROR);
