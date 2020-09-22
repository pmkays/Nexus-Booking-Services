import * as actionTypes from "../actions/actionTypes";
import reducer from "../reducers/profile";

const initialState = {
  profileDetails: null,
  error: null,
  loading: false,
  availabilities: null,
  workingTime: null,
};

describe("profile reducer", () => {
  it("should return initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should store profile details if successfully found user", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.FETCH_PROFILE_SUCCESS,
        profileDetails: "My profile details.",
      })
    ).toEqual({ ...initialState, profileDetails: "My profile details." });
  });

  it("should be error if failed to fetch profile", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.FETCH_PROFILE_FAIL,
        error: "My error message.",
      })
    ).toEqual({ ...initialState, error: "My error message." });
  });

  it("should store profile details if successfully found user", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.EDIT_PROFILE_SUCCESS,
        profileDetails: "My profile details.",
      })
    ).toEqual({ ...initialState, profileDetails: "My profile details." });
  });

  it("should be error if failed to fetch profile", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.EDIT_PROFILE_FAIL,
        error: "My error message.",
      })
    ).toEqual({ ...initialState, error: "My error message." });
  });

  it("should store availabilities if request was successfully", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.FETCH_AVAILABILITIES_SUCCESS,
        availabilities: "test",
      })
    ).toEqual({ ...initialState, availabilities: "test" });
  });
  
  it("should be error if failed to fetch availabilities", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.FETCH_AVAILABILITIES_FAIL,
        error: "My error message.",
      })
    ).toEqual({ ...initialState, error: "My error message." });
  });

  it("should store availabilities if request was successfully", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.ADD_AVAILABILITIES_SUCCESS,
        availabilities: "test",
      })
    ).toEqual({ ...initialState, availabilities: "test" });
  });
  
  it("should be error if failed to add availabilities", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.ADD_AVAILABILITIES_FAIL,
        error: "My error message.",
      })
    ).toEqual({ ...initialState, error: "My error message." });
  });
});
