import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { Dispatch } from 'redux';
import HomeNavComponent from './HomeNavComponent';
import {
  logout,
} from '../../helpers/auth';
import { RootState } from '../../reducers';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout: () => {
    logout(dispatch);
  },
});

const mapStateToProps = (state: RootState) => ({
  account: state.account,
});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(HomeNavComponent));
