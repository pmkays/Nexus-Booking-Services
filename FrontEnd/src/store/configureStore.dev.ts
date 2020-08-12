import { Store, createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import logger from 'redux-logger';
import rootReducer, { RootState } from '../reducers';

export const configureStore = (initialState?: any): Store<RootState> => {
  
  // @ts-ignore
  const devtools: any = window['__REDUX_DEVTOOLS_EXTENSION__'] ? window['__REDUX_DEVTOOLS_EXTENSION__']() : (f: any) => f;

  const enhancer = applyMiddleware(
    promise,
    logger,
  );

  const store: any = enhancer(devtools(createStore))(rootReducer, initialState);

  if (module.hot !== undefined) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};
