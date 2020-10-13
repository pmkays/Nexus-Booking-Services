import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EditWorkingTimes } from './EditWorkingTimes';

configure({ adapter: new Adapter() });

describe('<EditWorkingTimes/>', () => {
  let wrapper = shallow(<EditWorkingTimes />);

  it("should render EditWorkingTimes page", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render 6 columns', () => {
    expect(wrapper.find('.col')).toHaveLength(6);
  });

  it('should render 4 rows', () => {
    expect(wrapper.find('.row')).toHaveLength(4);
  });
});
