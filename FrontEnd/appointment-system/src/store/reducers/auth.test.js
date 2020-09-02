import * as actionTypes from "../actions/actionTypes";
import reducer from "../reducers/auth";

const initialState = {
  token: null,
  userId: null,
  authority: null,
  error: null,
  loading: false,
  authRedirect: "/",
};

describe("auth reducer", () => {
  it("should return initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should store token if login success", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.AUTH_SUCCESS,
        token: "myToken",
        userId: "myUserId",
        authority: "user",
      })
    ).toEqual({ ...initialState, token: "myToken", userId: "myUserId", authority: "user" });
  });

  it("should be error if failed to log in", () => {
    expect(
      reducer(initialState, {
        type: actionTypes.AUTH_FAIL,
        error: "My error message.",
      })
    ).toEqual({ ...initialState, error: "My error message." });
  });
});
