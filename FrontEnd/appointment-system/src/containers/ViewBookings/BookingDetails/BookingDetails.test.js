import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { BookingDetails } from './BookingDetails';

configure({ adapter: new Adapter() });

describe('<BookingDetails/>', () => {
  let wrapper = shallow(<BookingDetails location={{ pathname: 'asdasd' }} match={{ params: { id: '' } }} />);

  it('should render 0 columns on no data', () => {
    expect(wrapper.find('.col')).toHaveLength(0);
  });

  it('should render 0 rows on no data', () => {
    expect(wrapper.find('.row')).toHaveLength(0);
  });
});
