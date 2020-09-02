import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Availabilites from "./Availabilites";
import { Provider } from "react-redux";

import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import authReducer from "./../../store/reducers/auth";
import profileReducer from "./../../store/reducers/profile";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

configure({ adapter: new Adapter() });

describe("<Availabilites/>", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Provider store={store}>
        <Availabilites />
      </Provider>
    );
  });

  it("should render availabilities page", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
