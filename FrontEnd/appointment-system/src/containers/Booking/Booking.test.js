import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Booking } from './Booking';

configure({ adapter: new Adapter() });

describe('<Booking/>', () => {
  let wrapper = shallow(<Booking />);

  it('should render booking field for services', () => {
    const updateServiceAndEmployeeDropDownHandler = () => null;
    const services = null;
    expect(
      wrapper.contains(
        <div className='form-group'>
          <label>What service you require:</label>
          <select
            className='custom-select'
            id='serviceDropdown'
            onChange={updateServiceAndEmployeeDropDownHandler}
          >
            <option>Choose Service</option>
            {services}
          </select>
        </div>
      )
    );
  });
});
