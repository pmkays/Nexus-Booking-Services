import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Dashboard } from './Dashboard';
import DashboardIcon from '../Dashboard/DashboardIcon/DashboardIcon';

configure({ adapter: new Adapter() });

describe('<Dashboard/>', () => {
  let wrapper = shallow(
    <Dashboard
      profileDetails={{ img: 'lol', firstName: 'poo' }}
      onFetchProfile={() => null}
    />
  );

  it('should render 5 Input fields', () => {
    expect(wrapper.find(DashboardIcon)).toHaveLength(4);
  });
});
