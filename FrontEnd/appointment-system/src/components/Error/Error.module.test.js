import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Error from './Error';

configure({ adapter: new Adapter() });

describe('<Error/>', () => {
  let wrapper = shallow(<Error />);

  it('should render 0 tables if no data loaded', () => {
    expect(wrapper.find(<p>Oh no error!</p>));
  });
});
