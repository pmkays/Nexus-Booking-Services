import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utility/utility';

const initialState = {
  employeeId: null,
  services: null,
  error: null,
  loading: false,
};

const updateEmployeeId = (state, action) => {
  return updateObject(state, { employeeId: action.employeeId });
};

const addServiceStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const addServiceSuccess = (state, action) => {
  return updateObject(state, {
    services: action.services,
    error: null,
    loading: false,
  });
};

const addServiceFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const removeServiceStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const removeServiceSuccess = (state, action) => {
  return updateObject(state, {
    services: action.services,
    error: null,
    loading: false,
  });
};

const removeServiceFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_SERVICE_EMPLOYEEID:
      return updateEmployeeId(state, action);
    case actionTypes.ADD_SERVICES_START:
      return addServiceStart(state, action);
    case actionTypes.ADD_SERVICES_SUCCESS:
      return addServiceSuccess(state, action);
    case actionTypes.ADD_SERVICES_FAIL:
      return addServiceFail(state, action);
    case actionTypes.REMOVE_SERVICES_START:
      return removeServiceStart(state, action);
    case actionTypes.REMOVE_SERVICES_SUCCESS:
      return removeServiceSuccess(state, action);
    case actionTypes.REMOVE_SERVICES_FAIL:
      return removeServiceFail(state, action);
    default:
      return state;
  }
};

export default reducer;
