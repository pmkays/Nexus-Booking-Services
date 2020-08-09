import * as React from 'react';
import { hot } from 'react-hot-loader';
import intl from 'react-intl-universal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { enUS } from '../../locales/en-US';
import { redirect } from '../../helpers/history';

const AuthTabs = (props: any) => {
  const login = () => { redirect('/login'); };
  const register = () => { redirect('/register'); };
  return (
    <Tabs
      value={props.value}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
      centered={true}
    >
      <Tab
        label={intl.get('LOGIN').d(enUS.LOGIN)}
        value="login"
        onClick={login}
      />
      <Tab
        label={intl.get('REGISTER').d(enUS.REGISTER)}
        value="register"
        onClick={register}
      />
    </Tabs>
  );
};

export default hot(module)(AuthTabs);
