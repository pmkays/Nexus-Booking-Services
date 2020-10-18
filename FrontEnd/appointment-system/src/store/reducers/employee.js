import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility/utility';

const initialState = {
  profileDetails: null,
  error: null,
  loading: false,
  availabilities: null,
  workingTime: null,
};

const fetchEmployeeStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const fetchEmployeeSuccess = (state, action) => {
  return updateObject(state, {
    profileDetails: action.profileDetails,
    error: null,
    loading: false,
  });
};

const fetchEmployeeFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EMPLOYEE_START:
      return fetchEmployeeStart(state, action);
    case actionTypes.FETCH_EMPLOYEE_SUCCESS:
      return fetchEmployeeSuccess(state, action);
    case actionTypes.FETCH_EMPLOYEE_FAIL:
      return fetchEmployeeFail(state, action);
    default:
      return state;
  }
};

export default reducer;
