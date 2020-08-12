import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import ProfileComponent from './ProfileComponent';
import { RootState } from '../../reducers';

const mapDispatchToProps = () => ({
});

const mapStateToProps = (state: RootState) => ({
  account: state.account,
});

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(ProfileComponent));
