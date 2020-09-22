import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import WorkingTimes from "./WorkingTimes";
import { Provider } from "react-redux";

import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import authReducer from "../../store/reducers/auth";
import profileReducer from "../../store/reducers/profile";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
});

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));

configure({ adapter: new Adapter() });

describe("<WorkingTimes/>", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Provider store={store}>
        <WorkingTimes
          state={{
            auth: {
              token: "token",
            }
          }}
          addWorkingTime={() => {}}
        />
      </Provider>
    ).dive();
  });

  it("should render availabilities page", () => {
    expect(wrapper).toMatchSnapshot();
  });

  // it('should find starting time and finishing time', () => {
  //   expect(wrapper.find('p')).toHaveLength(2);
  //   expect(wrapper.find('p')[0]).to.contain("Starting Time");
  //   expect(wrapper.find('p')[1]).to.contain("Finishing Time");
  // });

  // it('should find add button', () => {
  //   expect(wrapper.find('button.btn')).toBeDefined();
  // });

  // it('should find left and right arrows', () => {
  //   expect(wrapper.find('i.fa-arrow-left')).toBeDefined();
  //   expect(wrapper.find('i.fa-arrow-right')).toBeDefined();
  // });
});
