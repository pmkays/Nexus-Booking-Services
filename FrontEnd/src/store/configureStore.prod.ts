import { Store, createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import rootReducer, { RootState } from '../reducers';

const enhancer = applyMiddleware(
  promise,
);

export const configureStore = (initialState?: any): Store<RootState> => {
  return createStore(rootReducer, initialState, enhancer);
};
