import { combineReducers } from 'redux';
import { IAccountReducerState, AccountReducer } from './reducer_account';

// tslint:disable-next-line:interface-name
export interface RootState {
  account: IAccountReducerState;
}

const rootReducer = combineReducers({
  account: AccountReducer,
});

export default rootReducer;
