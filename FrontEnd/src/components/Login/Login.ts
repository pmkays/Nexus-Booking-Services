import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import intl from 'react-intl-universal';
import { hot } from 'react-hot-loader';
import { enUS } from '../../locales/en-US';
import {
  login,
  loginSuccess,
  loginFailure,
  setAccountLoading,
} from '../../actions/account';
import LoginComponent from './LoginComponent';
import { redirect } from '../../helpers/history';
import { getToken, setToken } from '../../helpers/token';
import { valueAction } from '../../typings/common/actions';
import { AuthObject } from '../../typings/common/reducers';
import { RootState } from '../../reducers';
import { masterValidator } from '../../helpers/validator';
import { loadUserProfile } from '../../helpers/loadProfile';
import { IAccountReducerState } from '../../reducers/reducer_account';
import { errorAPI } from '../../helpers/errors';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProfile: (props: IAccountReducerState): void => {
    loadUserProfile(dispatch, props);
  },
  submit: (email: string, password: string, callback: () => void) => {
    const validate = masterValidator({
      email,
      password,
    });
    if (!validate.isError) {
      dispatch(setAccountLoading());
      const toastId = toast.info(intl.get('LOGGING_IN').d(enUS.LOGGING_IN));
      return dispatch(login({ email, password }))
        .then((response: valueAction<AuthObject>) => {
          if (response.payload && response.payload.status === 201) {
            setToken(response.payload.token);
            const data = getToken(response.payload.token);
            dispatch(loginSuccess({ jwt: data.token, id: data.id, role: data.role }));
            callback();
            redirect('/');
          } else if (response.payload.status === undefined) {
            toast.dismiss(toastId);
            toast.error(intl.get('NO_INTERNET').d(enUS.NO_INTERNET));
            dispatch(loginFailure(intl.get('NO_INTERNET').d(enUS.NO_INTERNET)));
          } else if (response.payload.error !== undefined) {
            toast.dismiss(toastId);
            toast.error(errorAPI(response.payload.error));
            dispatch(loginFailure(response.payload.error.message));
          }
        });
    }
  },
});

const mapStateToProps = (state: RootState) => ({
  account: state.account,
});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(LoginComponent));
