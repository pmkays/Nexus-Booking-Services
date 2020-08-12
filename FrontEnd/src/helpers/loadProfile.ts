import intl from 'react-intl-universal';
import { toast } from 'react-toastify';
import { IAccountReducerState } from '../reducers/reducer_account';
import { getToken } from './token';
import {
  userFromToken, userFromTokenSuccess, userFromTokenFailure,
} from '../actions/account';
import { clearLocalStorage, logout } from './auth';
import { Dispatch } from 'redux';
import { valueAction } from '../typings/common/actions';
import { UserObject } from '../typings/common/reducers';
import { enUS } from '../locales/en-US';

const NO_INTERNET = intl.get('NO_INTERNET').d(enUS.NO_INTERNET);

export const loadUserProfile = (
  dispatch: Dispatch,
  props: IAccountReducerState,
  force: boolean = false,
): void => {
  const data = getToken();
  if ((props.email.length === 0
    || props.id === undefined)
    && data.token.length !== 0
    || force) {
    dispatch(userFromToken(data.token, data.id))
      .then((response: valueAction<UserObject>) => {
        if (response.payload.items !== undefined && response.payload.status === 200) {
          const parseData = response.payload.items[0];
          dispatch(userFromTokenSuccess({
            jwt: data.token,
            id: data.id,
            email: parseData.email,
            firstName: parseData.firstName,
            lastName: parseData.lastName,
            phoneNo: parseData.phoneNo,
            address: parseData.address,
            role: data.role,
          }));
        } else if (response.payload.status === 401) {
          clearLocalStorage();
          logout(dispatch);
        } else if (response.payload.status === undefined) {
          toast.error(NO_INTERNET);
          dispatch(userFromTokenFailure(NO_INTERNET));
        } else {
          const FAILED_TO_LOAD_PROFILE = intl.get('PROFILE.FAILED_TO_LOAD_PROFILE').d(
            enUS.PROFILE.FAILED_TO_LOAD_PROFILE,
          );
          toast.error(FAILED_TO_LOAD_PROFILE);
          dispatch(userFromTokenFailure(FAILED_TO_LOAD_PROFILE));
        }
      });
  }
};
