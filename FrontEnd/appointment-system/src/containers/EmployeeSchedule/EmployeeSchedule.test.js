import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EmployeeSchedule } from './EmployeeSchedule';
import classes from './EmployeeSchedule.module.css';

configure({ adapter: new Adapter() });

describe('<EmployeeSchedule/>', () => {
  let wrapper = shallow(<EmployeeSchedule />);

  it('should render warning message if next 7 days not set', () => {
    wrapper.setState({ next7DaysSet: false });
    expect(
      wrapper.find(
        <p className={classes.Warning}>
          Note: It seems you have no availabilities next week! Please add your times in if this is not correct.
        </p>
      )
    );
  });

  it('should not render warning message if next 7 days set', () => {
    wrapper.setState({ next7DaysSet: false });
    expect(
      !wrapper.find(
        <p className={classes.Warning}>
          Note: It seems you have no availabilities next week! Please add your times in if this is not correct.
        </p>
      )
    );
  });

  it('should render 0 tables if no data loaded', () => {
    expect(wrapper.find('.table')).toHaveLength(0);
  });
});
