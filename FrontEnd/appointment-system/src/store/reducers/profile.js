import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  profileDetails: null,
  error: null,
  loading: false,
  availabilities: null,
  workingTime: null,
};

const fetchProfileStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const fetchProfileSuccess = (state, action) => {
  return updateObject(state, { profileDetails: action.profileDetails, error: null, loading: false });
};

const fetchProfileFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const editProfileStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const editProfileSuccess = (state, action) => {
  return updateObject(state, { profileDetails: action.profileDetails, error: null, loading: false });
};

const editProfileFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const addProfileStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const addProfileSuccess = (state, action) => {
  return updateObject(state, { profileDetails: action.profileDetails, error: null, loading: false });
};

const addProfileFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const fetchAvailabilitiesStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const fetchAvailabilitiesSuccess = (state, action) => {
  return updateObject(state, { availabilities: action.availabilities, error: null, loading: false });
};

const fetchAvailabilitiesFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const addAvailabilitiesStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const addAvailabilitiesSuccess = (state, action) => {
  return updateObject(state, { availabilities: action.availabilities, error: null, loading: false });
};

const addAvailabilitiesFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const fetchWorkingTImeStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const fetchWorkingTImeSuccess = (state, action) => {
  return updateObject(state, { workingTime: action.workingTime, error: null, loading: false });
};

const fetchWorkingTImeFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const addWorkingTImeStart = (state, action) => {
  return updateObject(state, { error: null, loading: true });
};

const addWorkingTImeSuccess = (state, action) => {
  return updateObject(state, { workingTime: action.workingTime, error: null, loading: false });
};

const addWorkingTImeFail = (state, action) => {
  return updateObject(state, { error: action.error, loading: false });
};

const clearProfile = (state, action) => {
  return updateObject(state, initialState);
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROFILE_START:
      return fetchProfileStart(state, action);
    case actionTypes.FETCH_PROFILE_SUCCESS:
      return fetchProfileSuccess(state, action);
    case actionTypes.FETCH_PROFILE_FAIL:
      return fetchProfileFail(state, action);
    case actionTypes.EDIT_PROFILE_START:
      return editProfileStart(state, action);
    case actionTypes.EDIT_PROFILE_FAIL:
      return editProfileFail(state, action);
    case actionTypes.EDIT_PROFILE_SUCCESS:
      return editProfileSuccess(state, action);
    case actionTypes.ADD_PROFILE_START:
      return addProfileStart(state, action);
    case actionTypes.ADD_PROFILE_FAIL:
      return addProfileFail(state, action);
    case actionTypes.ADD_PROFILE_SUCCESS:
      return addProfileSuccess(state, action);
    case actionTypes.FETCH_AVAILABILITIES_START:
      return fetchAvailabilitiesStart(state, action);
    case actionTypes.FETCH_AVAILABILITIES_SUCCESS:
      return fetchAvailabilitiesSuccess(state, action);
    case actionTypes.FETCH_AVAILABILITIES_FAIL:
      return fetchAvailabilitiesFail(state, action);
    case actionTypes.ADD_AVAILABILITIES_START:
      return addAvailabilitiesStart(state, action);
    case actionTypes.ADD_AVAILABILITIES_SUCCESS:
      return addAvailabilitiesSuccess(state, action);
    case actionTypes.ADD_AVAILABILITIES_FAIL:
      return addAvailabilitiesFail(state, action);
    case actionTypes.FETCH_WORKING_TIME_START:
      return fetchWorkingTImeStart(state, action);
    case actionTypes.FETCH_WORKING_TIME_SUCCESS:
      return fetchWorkingTImeSuccess(state, action);
    case actionTypes.FETCH_WORKING_TIME_FAIL:
      return fetchWorkingTImeFail(state, action);
    case actionTypes.ADD_WORKING_TIME_START:
      return addWorkingTImeStart(state, action);
    case actionTypes.ADD_WORKING_TIME_SUCCESS:
      return addWorkingTImeSuccess(state, action);
    case actionTypes.ADD_WORKING_TIME_FAIL:
      return addWorkingTImeFail(state, action);
    case actionTypes.CLEAR_PROFILE:
      return clearProfile(state, action);
    default:
      return state;
  }
};

export default reducer;
