import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import intl from 'react-intl-universal';
import { hot } from 'react-hot-loader';
import RegisterComponent from './RegisterComponent';
import { redirect } from '../../helpers/history';
import { Dispatch } from 'redux';
import { valueAction } from '../../typings/common/actions';
import { UserObject } from '../../typings/common/reducers';
import { RootState } from '../../reducers';
import { masterValidator } from '../../helpers/validator';
import { enUS } from '../../locales/en-US';
import { errorAPI } from '../../helpers/errors';
import { IAccountReducerState } from '../../reducers/reducer_account';
import { setAccountLoading, register, registerSuccess, registerFailure, setRegisterError, clearRegisterError } from '../../actions/account';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  submit: (values: IAccountReducerState) => {
    dispatch(clearRegisterError());
    const { firstName, lastName, email, password, confirm, phoneNo, address } = values;
    const validate = masterValidator({
      email,
      password,
      confirmPassword: { password, confirmPassword: confirm },
      firstName,
      lastName,
      phoneNo,
      address
    });
    dispatch(setRegisterError({
      emailError: validate.errors.email.error,
      passwordError: validate.errors.password.error,
      confirmError: validate.errors.confirm.error,
      firstNameError: validate.errors.firstName.error,
      lastNameError: validate.errors.lastName.error,
      phoneNoError: validate.errors.phoneNo.error,
      addressError: validate.errors.address.error,
    }));
    if (!validate.isError) {
      dispatch(setAccountLoading());
      const toastId = toast.info(intl.get('REGISTERING').d(enUS.REGISTERING));
      dispatch(register({ email, password, firstName, lastName, phoneNo, address }))
        .then((response: valueAction<UserObject>) => {
          if (response.payload.status === 201 && response.payload.items !== undefined) {
            const { id } = response.payload.items[0];
            dispatch(registerSuccess({ userId: id }));
            redirect('/home');
          } else if (response.payload.status === undefined) {
            toast.dismiss(toastId);
            const noInternet = intl.get('NO_INTERNET').d(enUS.NO_INTERNET);
            toast.error(noInternet);
            dispatch(registerFailure(noInternet));
          } else if (response.payload.error !== undefined) {
            toast.dismiss(toastId);
            toast.error(errorAPI(response.payload.error));
            dispatch(registerFailure(response.payload.error.message));
          }
        });
    }
  },
});

const mapStateToProps = (state: RootState) => ({
  account: state.account,
});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(RegisterComponent));
