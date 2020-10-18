import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DashboardIcon from './DashboardIcon';

configure({ adapter: new Adapter() });

describe('<DashboardIcon/>', () => {
  let wrapper = shallow(<DashboardIcon to='/dummy' id='dummy-id' />);

  it('should render 1 icon only', () => {
    expect(wrapper.find('.Icon')).toHaveLength(1);
  });
});
