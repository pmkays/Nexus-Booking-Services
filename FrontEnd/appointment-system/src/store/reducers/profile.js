import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../utility/utility";

const initialState = {
  profileDetails: null,
  error: null,
  loading: false,
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
    case actionTypes.CLEAR_PROFILE:
      return clearProfile(state, action);
    default:
      return state;
  }
};

export default reducer;
