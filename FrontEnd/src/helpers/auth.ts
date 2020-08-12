import { Dispatch } from 'redux';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';
import * as account from '../actions/account';
import { redirect } from './history';
import { getToken, removeToken, ItokenObject } from './token';
import { valueAction } from '../typings/common/actions';
import { BaseObject, UserObject } from '../typings/common/reducers';
import { enUS } from '../locales/en-US';

type authType = 'private' | 'public';

const noInternet = intl.get('NO_INTERNET').d(enUS.NO_INTERNET);

/**
 * Public Authentication for user
 * public urls = login | register | reset | activate
 * @param {Dispatch} dispatch
 * @param {*} props
 * @returns {Promise<boolean>}
 */
export function publicAuth(dispatch: Dispatch, props: any, callback: (success: boolean) => void) {
  const role = 'user'
  const data = getToken();
  // check if there is no error decrypting token and the token role matches the required role
  if (data.error === undefined || data.role === role) {
    if (props.jwt === data.token
    && props.id === data.id
    && props.role === data.role) {
      // user is logged in
      callback(true);
      role === 'user' ? redirect('/home') : redirect('/admin');
    } else {
      userAuth(dispatch, data, 'public', callback);
    }
  } else {
    removeToken();
    clearLocalStorage();
    dispatch(account.resetUserToken());
    callback(false);
  }
}

/**
 * Private Authentication for user
 * private urls = cards | locations | profile | transactions
 * @param {Dispatch} dispatch
 * @param {*} props
 * @param {(success: boolean) => void} callback
 * @param {boolean} force?
 */
export function privateAuth(
  dispatch: Dispatch,
  props: any,
  callback: (success: boolean) => void,
  force: boolean = false,
) {
  const role = 'user'
  const data = getToken();
  // check is there is any errors or if role doesn't match the required role
  if (data.error !== undefined || data.role !== role) {
    removeToken();
    clearLocalStorage();
    dispatch(account.resetUserToken());
    callback(false);
    redirect('/login');
  } else if (props.jwt === data.token
    && props.id === data.id
    && props.role === data.role
    && !force) {
    // force is used to fetch user from token
    // even when they are already logged in to update specific fields
    // user is logged in
    callback(true);
  } else {
    userAuth(dispatch, data, 'private', callback);
  }
}

/**
 * User Authentication (public|private)
 * @param {Dispatch} dispatch
 * @param {ItokenObject} data
 * @param {authType} type
 * @param {(success: boolean) => void} callback
 */
export function userAuth(
  dispatch: Dispatch,
  data: ItokenObject,
  type: authType,
  callback: (success: boolean) => void,
) {
  // let toastId: undefined | number;
  // Show authenticating message only when it is on public url
  if (type === 'public') {
    // toastId = toast.info(intl.get('AUTHENTICATING').d(enUS.AUTHENTICATING));
  }
  dispatch(account.setAccountLoading());
  dispatch(account.userFromToken(data.token, data.id))
    .then((response: valueAction<UserObject>) => {
      // if user from token was success
      if (response.payload.items !== undefined && response.payload.status === 200) {
        const parseData = response.payload.items[0];
        dispatch(account.userFromTokenSuccess({
          jwt: data.token,
          id: data.id,
          email: parseData.email,
          firstName: parseData.firstName,
          lastName: parseData.lastName,
          phoneNo: parseData.phoneNo,
          address: parseData.address,
          role: data.role,
        }));
        // toast.dismiss(toastId);
        // redirect to home only when it is on public url
        callback(true);
        if (type === 'public') {
          redirect('/home');
        }
        // 401 status error === Invalid jwt token
        // clear localStorage and redirect to login if it is on private url
      } else if (response.payload.status === 401) {
        clearLocalStorage();
        dispatch(account.logoutSuccess());
        callback(false);
        if (type === 'private') {
          redirect('/login');
        }
        // status === undefined is when the fetch request failes when no internet is avaliable
      } else if (response.payload.status === undefined) {
        // toast.dismiss(toastId);
        if (type === 'public') {
          toast.error(noInternet);
        }
        dispatch(account.userFromTokenFailure(noInternet));
        callback(false);
        // if auth wasn't valid and status !== 401 || undefined then just fail
      } else if (response.payload.error !== undefined) {
        // toast.dismiss(toastId);
        // toast.error(intl.get('FAILED_TO_AUTHENTICATE').d(enUS.FAILED_TO_AUTHENTICATE));
        removeToken();
        clearLocalStorage();
        dispatch(account.userFromTokenFailure(response.payload.error.message));
        // if user is in private url then redirect to login
        callback(false);
        if (type === 'private') {
          redirect('/login');
        }
      } else {
        callback(false);
      }
    }).catch(() => {
      // toast.dismiss(toastId);
      // toast.error(intl.get('FAILED_TO_AUTHENTICATE').d(enUS.FAILED_TO_AUTHENTICATE));
      callback(false);
    });
}

/**
 * Logout (user)
 * @param {Dispatch} dispatch
 */
export function logout(dispatch: Dispatch) {
  const data = getToken();
  const role = 'user'
  const toastId = toast.info(intl.get('LOGGING_OUT').d(enUS.LOGGING_OUT));
  // if there is an error or role doesn't match required role
  if (data.error || data.role !== role) {
    removeToken();
    clearLocalStorage();
    dispatch(account.resetUserToken());
    redirect('/login');
  } else {
    dispatch(account.setAccountLoading());
    dispatch(account.logout(data.token, data.jti))
      .then((response: valueAction<BaseObject>) => {
        if (response.payload && response.payload.status === 204) {
          dispatch(account.logoutSuccess());
          removeToken();
          clearLocalStorage();
          toast.dismiss(toastId);
          redirect('/login');
        } else if (response.payload.status === undefined) {
          toast.dismiss(toastId);
          toast.error(noInternet);
          dispatch(account.logoutFailure(noInternet));
        } else if (response.payload.error !== undefined) {
          toast.dismiss(toastId);
          toast.error(intl.get('LOGOUT_FAILED').d(enUS.LOGOUT_FAILED));
          dispatch(account.logoutFailure(response.payload.error.message));
        }
      }).catch(() => {
        toast.dismiss(toastId);
        toast.error(intl.get('LOGOUT_FAILED').d(enUS.LOGOUT_FAILED));
      });
  }
}

/**
 * Clear data in local storage & sessionStorage
 */
export function clearLocalStorage() {
  localStorage.removeItem('jwtToken');
}
