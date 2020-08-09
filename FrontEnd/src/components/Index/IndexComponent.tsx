import * as React from 'react';
import { hot } from 'react-hot-loader';
import IndexNav from '../IndexNav/IndexNav';
import { IAccountReducerState } from '../../reducers/reducer_account';
import './Index.scss';

export interface IIndexComponentProps {
  account: IAccountReducerState;
}

class IndexComponent extends React.Component<IIndexComponentProps, {}> {
  constructor(props: IIndexComponentProps) {
    super(props);
  }
  public render() {
    return (
      <div className="page">
        <IndexNav />
        <h1>Welcome to index page</h1>
      </div>
    );
  }
}

export default hot(module)(IndexComponent);
