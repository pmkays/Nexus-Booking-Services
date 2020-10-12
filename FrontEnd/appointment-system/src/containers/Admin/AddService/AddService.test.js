import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { AddService } from './AddService';

configure({ adapter: new Adapter() });

describe('<AddService/>', () => {
  let wrapper = shallow(<AddService />);

  it('should render 2 form groups', () => {
    expect(wrapper.find('.form-group')).toHaveLength(2);
  });
});
