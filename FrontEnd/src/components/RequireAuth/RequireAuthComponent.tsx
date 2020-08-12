import * as React from 'react';
import { hot } from 'react-hot-loader';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IAccountReducerState } from '../../reducers/reducer_account';
import { getToken } from '../../helpers/token';

interface IRequireAuthComponentState {
  readonly authDone: boolean;
}

interface IRequireAuthComponentProps {
  auth: (
    props: any,
    auth: 'private' | 'public' | undefined,
    callback: (success: boolean) => void,
  ) => void;
  account: IAccountReducerState;
  type?: 'private' | 'public' | undefined;
  children?: any;
}

class RequireAuthComponent extends React.Component<
  IRequireAuthComponentProps,
  IRequireAuthComponentState
> {
  // tslint:disable-next-line:variable-name
  private _mounted: boolean = false;
  public get mounted(): boolean {
    return this._mounted;
  }
  public set mounted(value: boolean) {
    this._mounted = value;
  }
  constructor(props: any) {
    super(props);
    const data = getToken();
    const authDone = this.props.type === 'public' && data.error !== undefined ? true : false;
    this.state = { authDone };
  }
  public componentDidMount() {
    this.mounted = true;
  }
  public componentWillUnmount() {
    this.mounted = false;
  }
  public render() {
    return (
      <React.Fragment>
        {this.state.authDone ?
          this.props.children
          :
          <LinearProgress
            color="primary"
            style={{
              display: 'absolute',
              top: '0',
              left: '0',
              right: '0',
            }}
          />
        }
      </React.Fragment>
    );
  }
}

export default hot(module)(RequireAuthComponent);
