import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { Dispatch } from 'redux';
import { RootState } from '../../reducers';
import { publicAuth, privateAuth } from '../../helpers/auth';
import RequireAuthComponent from './RequireAuthComponent';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  auth: (
    props: any,
    auth: 'private' | 'public' | undefined,
    callback: (success: boolean) => void,
  ) => {
    return (auth === 'public' ?
      publicAuth(dispatch, props, callback)
      :
      privateAuth(dispatch, props, callback)
    );
  },
});
const mapStateToProps = (state: RootState) => ({
  account: state.account,
});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(RequireAuthComponent));
