import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { hot } from 'react-hot-loader';
import intl from 'react-intl-universal';
import { ToastContainer } from 'react-toastify';
import { enUS } from '../../locales/en-US';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});

const locales: { [key: string]: any } = {
  en: enUS,
};

const COMMON_LOCALE_DATA_URLS = {
  en: '/locale-data/en.js',
};

interface IAppWrapperState {
  readonly initDone: boolean;
}

class AppWrapper extends React.Component<{children?: any}, IAppWrapperState> {
  protected sheetManager: any = new Map();
  constructor(props?: any) {
    super(props);
    this.state = { initDone: false };
  }
  public componentDidMount() {
    this.loadLocales();
  }
  private loadLocales() {
    intl.init({
      locales,
      currentLocale: 'en',
      commonLocaleDataUrls: COMMON_LOCALE_DATA_URLS,
    }).then(() => {
      this.setState({ initDone: true });
    });
  }
  public render(): React.ReactNode {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <React.Fragment>
            {this.state.initDone && this.props.children}
          </React.Fragment>
        </CssBaseline>
        <ToastContainer
          hideProgressBar={false}
          newestOnTop={true}
          pauseOnHover={false}
          autoClose={4000}
        />
      </MuiThemeProvider>
    );
  }
}

export default hot(module)(AppWrapper);
