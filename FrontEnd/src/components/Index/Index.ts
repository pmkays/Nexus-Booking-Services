import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import IndexComponent from './IndexComponent';
import { RootState } from '../../reducers';

const mapStateToProps = (state: RootState) => ({
  account: state.account,
});

export default hot(module)(connect(mapStateToProps, null)(IndexComponent));
