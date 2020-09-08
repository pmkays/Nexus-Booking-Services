import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Employees } from "./Employees";

configure({ adapter: new Adapter() });

describe("<Employees/>", () => {
  let wrapper;

  const state = {
    employees: [
      {
        id: "3",
        firstName: "Joe",
        lastName: "Test",
        phoneNo: "0411123123",
        address: "12 Test St",
        email: "test@email.com",
      },
    ],
  };

  beforeEach(() => {
    wrapper = shallow(<Employees />);
  });

  it("should output 1 employee", () => {
    wrapper.setState(state);
    expect(
      wrapper.find(
        <tr>
          <td>3</td>
          <td>Joe</td>
          <td>Test</td>
          <td>test@email.com</td>
          <td>0411123123</td>
          <td>12 Test St</td>
        </tr>
      )
    );
  });

  it("should render no employees", () => {
    expect(
      wrapper.find(
        <tr>
          <td>3</td>
          <td>Joe</td>
          <td>Test</td>
          <td>test@email.com</td>
          <td>0411123123</td>
          <td>12 Test St</td>
        </tr>
      )
    ).toHaveLength(0);
  });
});
