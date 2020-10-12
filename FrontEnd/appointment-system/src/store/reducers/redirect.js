import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility/utility';

const initialState = {
  content: null,
  redirect: null,
};

const update = (state, action) => {
  return updateObject(state, {
    content: action.content,
    redirect: action.redirect,
  });
};

const reset = (state, action) => {
  return updateObject(state, { content: null });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_REDIRECT:
      return update(state, action);
    case actionTypes.RESET_REDIRECT:
      return reset(state, action);
    default:
      return state;
  }
};

export default reducer;
