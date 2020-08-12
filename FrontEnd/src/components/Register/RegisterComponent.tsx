import React, { useState, useEffect } from 'react';
import intl from 'react-intl-universal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Container from '@material-ui/core/Container';
import { emailSchema, passwordSchema, nameSchema, phoneNoSchema } from '../../schemas/inputSchema';
import { enUS } from '../../locales/en-US';
import { IAccountReducerState } from '../../reducers/reducer_account';
import IndexNav from '../IndexNav/IndexNav';
import AuthTabs from '../AuhTabs/AuthTabs';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { hot } from 'react-hot-loader';
import { masterValidator } from '../../helpers/validator';

const useStyles = makeStyles({
  container: {
    borderTop: "1px solid rgb(229, 227, 221)",
    borderBottom: "1px solid rgb(229, 227, 221)",
    borderLeft: "1px solid rgb(229, 227, 221)",
    borderRight: "1px solid rgb(229, 227, 221)",
    borderRadius: "4px",
    padding: "16px"
  }
});

interface IRegisterComponentProps {
  handleChange: (type: string, value: string) => void;
  redirect: (to: string) => void;
  clearFields: () => void;
  submit: (values: any) => void;
  account: IAccountReducerState;
}

const RegisterComponent: React.FC<IRegisterComponentProps> = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [address, setAddress] = useState('');

  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [lastNameError, setLastNameError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(undefined);
  const [phoneNoError, setPhoneNoError] = useState<string | undefined>(undefined);
  const [addressError, setAddressError] = useState<string | undefined>(undefined);
  
  const [showPassword, setShowPassword] = useState(false);
  
  const classes = useStyles();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }
  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  }
  useEffect(() => {
    const validator = masterValidator({ firstName });
    setFirstNameError(validator.errors.firstName.error);
  }, [firstName]);
  useEffect(() => {
    const validator = masterValidator({ lastName });
    setLastNameError(validator.errors.lastName.error);
  }, [lastName]);
  useEffect(() => {
    const validator = masterValidator({ email });
    setEmailError(validator.errors.email.error);
  }, [email]);
  useEffect(() => {
    const validator = masterValidator({
      password,
      confirmPassword: {
        password,
        confirmPassword,
      }
    });
    setPasswordError(validator.errors.password.error);
    setConfirmPasswordError(validator.errors.confirmPassword.error);
  }, [password, confirmPassword]);
  useEffect(() => {
    const validator = masterValidator({ phoneNo });
    setPhoneNoError(validator.errors.phoneNo.error);
  }, [phoneNo]);
  useEffect(() => {
    const validator = masterValidator({ address });
    setAddressError(validator.errors.address.error);
  }, [address]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!props.account.loading) {
      // props.submit(props.register);
    }
  }
  return (
    <React.Fragment>
      <IndexNav />
      <Container maxWidth="xs" className={classes.container}>
        <AuthTabs value="register" />
        <form method="POST" onSubmit={submit}>
          <Grid container={true}>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="firstName"
                label={intl.get('FIRST_NAME').d(enUS.FIRST_NAME)}
                margin="dense"
                type="text"
                fullWidth={true}
                error={!!firstNameError}
                inputProps={nameSchema}
                defaultValue={firstName}
                onChange={e => setFirstName(e.target.value)}
                required={nameSchema.required}
                helperText={firstNameError}
              />
            </Grid>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="lastName"
                label={intl.get('LAST_NAME').d(enUS.LAST_NAME)}
                margin="dense"
                type="text"
                fullWidth={true}
                error={!!lastNameError}
                inputProps={nameSchema}
                defaultValue={lastName}
                onChange={e => setLastName(e.target.value)}
                required={nameSchema.required}
                helperText={lastNameError}
              />
            </Grid>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="email"
                label={intl.get('EMAIL_ADDRESS').d(enUS.EMAIL_ADDRESS)}
                margin="dense"
                type="email"
                fullWidth={true}
                error={!!emailError}
                inputProps={emailSchema}
                defaultValue={email}
                onChange={e => setEmail(e.target.value)}
                required={emailSchema.required}
                helperText={emailError}
              />
            </Grid>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="password"
                label={intl.get('PASSWORD').d(enUS.PASSWORD)}
                margin="dense"
                fullWidth={true}
                error={!!passwordError}
                type={showPassword ? 'text' : 'password'}
                defaultValue={password}
                onChange={e => setPassword(e.target.value)}
                inputProps={passwordSchema}
                InputProps={{
                  endAdornment: 
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>,
                }}
                required={passwordSchema.required}
                helperText={passwordError}
              />
            </Grid>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="confirm"
                label={intl.get('CONFIRM_PASSWORD').d(enUS.CONFIRM_PASSWORD)}
                margin="dense"
                type="password"
                fullWidth={true}
                error={!!confirmPasswordError}
                inputProps={passwordSchema}
                defaultValue={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required={passwordSchema.required}
                helperText={confirmPasswordError}
              />
            </Grid>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="phoneNo"
                label={intl.get('PHONE_NUMBER').d(enUS.PHONE_NUMBER)}
                margin="dense"
                type="text"
                fullWidth={true}
                error={!!phoneNoError}
                inputProps={phoneNoSchema}
                defaultValue={phoneNo}
                onChange={e => setPhoneNo(e.target.value)}
                required={phoneNoSchema.required}
                helperText={phoneNoError}
              />
            </Grid>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="address"
                label={intl.get('ADDRESS').d(enUS.ADDRESS)}
                margin="dense"
                type="text"
                fullWidth={true}
                error={!!addressError}
                inputProps={nameSchema}
                defaultValue={address}
                onChange={e => setAddress(e.target.value)}
                required={nameSchema.required}
                helperText={addressError}
              />
            </Grid>
            <Button variant="contained" color="primary" type="submit" fullWidth={true}>
              {intl.get('LOGIN').d(enUS.LOGIN)}
            </Button>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  );
};

export default hot(module)(RegisterComponent);
