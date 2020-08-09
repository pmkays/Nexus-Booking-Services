import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router';
import AppWrapper from './components/AppWrapper/AppWrapper';
import { history as newHistory } from './helpers/history';
import { configureStore } from './store/configureStore';
import './styles.ts';

// tslint:disable
window.onload  = function() {
  if(window.console || "console" in window) {
    console.log("%c STOP!!!", "color:#FF0000; font-size:40px;");
    console.log("%c This browser feature is for developers only. Please do not copy-paste any code or run any scripts here. It may cause your account to be compromised.", "color:#003087; font-size:12px;");
    console.log("%c For more information, http://en.wikipedia.org/wiki/Self-XSS", "color:#003087; font-size:12px;");
  }
};
// tsling:enable

const store = configureStore();

import Login from './components/Login/Login';
import Register from './components/Register/Register';
import RequireAuth from './components/RequireAuth/RequireAuth';
import Index from './components/Index/Index';
import Profile from './components/Profile/Profile';

// tslint:disable:variable-name
// tslint:disable:max-line-length
const LoginRoute    = (props: any) => <RequireAuth type="public"><Login {...props} /></RequireAuth>;
const RegisterRoute = (props: any) => <RequireAuth type="public"><Register {...props} /></RequireAuth>;

const renderRoutes = () => {
  render(
    <Provider store={store}>
      <Router history={newHistory}>
        <AppWrapper>
          <Switch>
            <Route exact={true} path="/" component={Index} />
            <Route exact={true} path="/profile" component={Profile} />
            <Route exact={true} path="/login" component={LoginRoute} />
            <Route exact={true} path="/register" component={RegisterRoute} />
          </Switch>
        </AppWrapper>
      </Router>
    </Provider>,
    document.getElementById('root') as HTMLElement,
  );
};

// webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('/', () => {});
  renderRoutes();
}
