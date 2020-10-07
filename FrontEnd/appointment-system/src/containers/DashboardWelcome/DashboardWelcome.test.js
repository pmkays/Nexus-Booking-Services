import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { DashboardWelcome } from './DashboardWelcome';

configure({ adapter: new Adapter() });

describe('<DashboardWelcome/>', () => {
  let wrapper = shallow(
    <DashboardWelcome profileDetails={{ firstName: 'joe' }} />
  );

  it('should render 2 columns', () => {
    expect(wrapper.find('.col')).toHaveLength(2);
  });

  it('should render 4 rows', () => {
    expect(wrapper.find('.row')).toHaveLength(4);
  });
});
