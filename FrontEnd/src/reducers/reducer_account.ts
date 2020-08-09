import { Reducer } from 'redux';
import { AccountActionTypes } from '../actions/account';
import { errorType } from '../typings/common/actions';

export interface IRegisterError {
  emailError?: string;
  passwordError?: string;
  confirmError?: string;
  firstNameError?: string;
  lastNameError?: string;
  phoneNoError?: string;
  addressError?: string;
}

export interface IAccountReducerState {
  readonly jwt: string | undefined;
  readonly role: string;
  readonly id: string | undefined;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phoneNo: string;
  readonly address: string;
  readonly password?: string;
  readonly confirm?: string;
  readonly error: errorType | undefined;
  readonly registerError: IRegisterError;
  readonly loading: boolean;
}

export const INITIAL_STATE: IAccountReducerState = {
  jwt: undefined,
  role: '',
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNo: '',
  address: '',
  password: '',
  confirm: '',
  registerError: {
    emailError: undefined,
    passwordError: undefined,
    confirmError: undefined,
    firstNameError: undefined,
    lastNameError: undefined,
    phoneNoError: undefined,
    addressError: undefined,
  },
  error: undefined,
  loading: false,
};

/* tslint:disable:variable-name */
export const AccountReducer: Reducer<IAccountReducerState> = (
  state = INITIAL_STATE,
  action,
) => {
  const {
    jwt, id, email, firstName, lastName, phoneNo, address, role,
  }: {
    jwt: string;
    id: string | undefined;
    email: string;
    firstName: string;
    lastName: string;
    phoneNo: string;
    address: string;
    password?: string;
    confirm?: string;
    role: string;
  } = (action.payload === undefined
    || action.payload === null
    || typeof action.payload !== 'object') ? {} : action.payload;

  switch (action.type) {
    case AccountActionTypes.USER_FROM_TOKEN:
      return {
        ...state,
        jwt: undefined,
        id: undefined,
        role: '',
        status: 'STORAGE',
        error: undefined,
        loading: true,
      };
    case AccountActionTypes.USER_FROM_TOKEN_SUCCESS:
      return {
        ...state,
        jwt,
        id,
        email,
        firstName,
        lastName,
        phoneNo,
        address,
        role: 'user',
        status: 'AUTHENTICATED',
        error: undefined,
        loading: false,
      };
    case AccountActionTypes.USER_FROM_TOKEN_FAILURE:
      return {
        ...state,
        jwt: undefined,
        id: undefined,
        role: '',
        status: 'STORAGE',
        error: action.payload,
        loading: false,
      };

    case AccountActionTypes.GET_PROFILE:
      return {
        ...state,
        status: AccountActionTypes.GET_PROFILE,
        error: undefined,
        loading: true,
      };
    case AccountActionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        ...action.payload,
        status: AccountActionTypes.GET_PROFILE_SUCCESS,
        error: undefined,
        loading: false,
      };
    case AccountActionTypes.GET_PROFILE_FAILURE:
      return {
        ...state,
        status: AccountActionTypes.GET_PROFILE_FAILURE,
        error: action.payload,
        loading: false,
      };

    case AccountActionTypes.LOGIN:
      return {
        ...state,
        jwt: undefined,
        id: undefined,
        status: AccountActionTypes.LOGIN,
        error: undefined,
        loading: true,
      };
    case AccountActionTypes.LOGIN_SUCCESS:
      // it will contain either business or user object
      return {
        ...state,
        jwt,
        id,
        email,
        firstName,
        lastName,
        phoneNo,
        address,
        role,
        ...action.payload,
        status: AccountActionTypes.LOGIN_SUCCESS,
        error: undefined,
        loading: false,
      };
    case AccountActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        jwt: undefined,
        id: undefined,
        status: AccountActionTypes.LOGIN_FAILURE,
        error: action.payload,
        loading: false,
      };

    case AccountActionTypes.REGISTER:
      return {
        ...state,
        jwt: undefined,
        id: undefined,
        role: '',
        status: AccountActionTypes.REGISTER,
        error: undefined,
        loading: true,
      };
    case AccountActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        jwt: undefined,
        id,
        email,
        firstName,
        lastName,
        phoneNo,
        address,
        role: 'user',
        status: AccountActionTypes.REGISTER_SUCCESS,
        error: undefined,
        loading: false,
      };
    case AccountActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        jwt: undefined,
        id: undefined,
        role: '',
        status: AccountActionTypes.REGISTER_FAILURE,
        error: action.payload,
        loading: false,
      };

    case AccountActionTypes.SET_REGISTER_ERROR:
      return {
        ...state,
        registerError: action.payload,
        loading: false,
      };
    case AccountActionTypes.CLEAR_REGISTER_ERROR:
      return {
        ...state,
        registerError: INITIAL_STATE.registerError,
        loading: false,
      };

    case AccountActionTypes.LOGOUT:
      return {
        ...state,
        status: AccountActionTypes.LOGOUT,
        error: undefined,
        loading: true,
      };
    case AccountActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        status: AccountActionTypes.LOGOUT_SUCCESS,
        error: undefined,
        loading: false,
      };
    case AccountActionTypes.LOGOUT_FAILURE:
      return {
        ...state,
        status: AccountActionTypes.LOGOUT_FAILURE,
        error: action.payload,
        loading: false,
      };

    case AccountActionTypes.RESET_USER_TOKEN:
      return {
        ...state,
        jwt: undefined,
        id: undefined,
        status: 'STORAGE',
        error: undefined,
        loading: false,
      };

    case AccountActionTypes.SET_ACCOUNT_LOADING:
      return {
        ...state,
        loading: true,
        status: AccountActionTypes.SET_ACCOUNT_LOADING,
      };
    case AccountActionTypes.SET_ACCOUNT_ERROR:
      return {
        ...state,
        status: AccountActionTypes.SET_ACCOUNT_ERROR,
        error: action.payload,
      };
    case AccountActionTypes.CLEAR_ACCOUNT_ERROR:
      return {
        ...state,
        status: AccountActionTypes.CLEAR_ACCOUNT_ERROR,
        error: action.payload,
      };
    default:
      return state;
  }
};
