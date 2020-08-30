import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import ContactUs from "./ContactUs";

configure({ adapter: new Adapter() });

describe("<ContactUs/>", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ContactUs />);
  });

  it("should render contact us page", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
