import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ViewWorkingTimes } from './ViewWorkingTimes';

configure({ adapter: new Adapter() });

describe('<ViewWorkingTimes/>', () => {
  let wrapper = shallow(<ViewWorkingTimes />);

  it("should render ViewWorkingTimes page", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render select for employee', () => {
    expect(wrapper.find('.custom-select')).toHaveLength(1);
  });
});
