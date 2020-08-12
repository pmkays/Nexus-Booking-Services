import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import intl from 'react-intl-universal';
import { hot } from 'react-hot-loader';
import IndexNav from '../IndexNav/IndexNav';
import { enUS } from '../../locales/en-US';
import { emailSchema, passwordSchema } from '../../schemas/inputSchema';
import AuthTabs from '../AuhTabs/AuthTabs';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { masterValidator } from '../../helpers/validator';
import { IAccountReducerState } from '../../reducers/reducer_account';

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

interface LoginComponentProps {
  loadProfile: (props: IAccountReducerState) => void;
  submit: (email: string, password: string, callback: () => void) => any;
  account: IAccountReducerState;
}

const LoginComponent: React.FC<LoginComponentProps> = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const classes = useStyles();
  useEffect(() => {
    const validator = masterValidator({ email });
    setEmailError(validator.errors.email.error);
  }, [email]);
  useEffect(() => {
    const validator = masterValidator({ password });
    setPasswordError(validator.errors.password.error);
  }, [password]);
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!props.account.loading) {
      props.submit(email, password, () => {
        props.loadProfile(props.account);
      });
    }
  }
  return (
    <React.Fragment>
      <IndexNav />
      <Container maxWidth="xs" className={classes.container}>
        <AuthTabs value="login" />
        <form method="POST" onSubmit={submit}>
          <Grid container={true}>
            <Grid item={true} lg={12} md={12} sm={12} xs={12}>
              <TextField
                id="email"
                label={intl.get('EMAIL_ADDRESS').d(enUS.EMAIL_ADDRESS)}
                margin="dense"
                type="email"
                fullWidth={true}
                error={!!emailError}
                inputProps={emailSchema}
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
                type="password"
                onChange={e => setPassword(e.target.value)}
                inputProps={passwordSchema}
                required={passwordSchema.required}
                helperText={passwordError}
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

export default hot(module)(LoginComponent);
