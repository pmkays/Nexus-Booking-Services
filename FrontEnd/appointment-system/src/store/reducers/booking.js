import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  error: null,
  loading: false,
};

const addBookingStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const addBookingSuccess = (state, action) => {
  return updateObject(state, {
    workingTime: action.workingTime,
    error: null,
    loading: false,
  });
};

const addBookingFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_BOOKING_START:
      return addBookingStart(state, action);
    case actionTypes.ADD_BOOKING_SUCCESS:
      return addBookingSuccess(state, action);
    case actionTypes.ADD_BOOKING_FAIL:
      return addBookingFail(state, action);
    default:
      return state;
  }
};

export default reducer;
