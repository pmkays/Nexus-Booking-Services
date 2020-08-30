import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AboutUs from "./AboutUs";

configure({ adapter: new Adapter() });

describe("<AboutUs/>", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AboutUs />);
  });

  it("should render contact us page", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
