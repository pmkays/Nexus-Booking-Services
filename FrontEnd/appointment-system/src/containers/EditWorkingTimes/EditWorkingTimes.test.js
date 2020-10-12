import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EditWorkingTimes } from './EditWorkingTimes';

configure({ adapter: new Adapter() });

describe('<EditWorkingTimes/>', () => {
  let wrapper = shallow(<EditWorkingTimes />);

  it('should render 2 columns', () => {
    expect(wrapper.find('.col')).toHaveLength(4);
  });

  it('should render 4 rows', () => {
    expect(wrapper.find('.row')).toHaveLength(4);
  });
});
