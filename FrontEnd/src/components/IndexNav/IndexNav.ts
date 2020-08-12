import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { RootState } from '../../reducers';
import IndexNavComponent from './IndexNavComponent';

const mapStateToProps = (state: RootState) => ({
  account: state.account,
});

export default hot(module)(connect(mapStateToProps, null)(IndexNavComponent));
