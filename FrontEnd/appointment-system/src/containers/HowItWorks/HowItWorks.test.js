import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import HowItWorks from "./HowItWorks";

configure({ adapter: new Adapter() });

describe("<HowItWorks/>", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<HowItWorks />);
  });

  it("should render contact us page", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
