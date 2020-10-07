import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Profile } from './Profile';

configure({ adapter: new Adapter() });

describe('<Profile/>', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <Profile
        onFetchProfile={(token) => null}
        profileDetails={{
          firstName: 'Joe',
          lastName: 'Mills',
          email: 'hello@test.com',
          address: '12 Chance St',
          phoneNo: '30303920',
        }}
      />
    );
  });

  it('should render 10 dt elements if profile is present', () => {
    expect(wrapper.find('.col-sm-12')).toHaveLength(10);
  });

  it('should render 0 dt elements if profile is not present', () => {
    wrapper = shallow(
      <Profile onFetchProfile={(token) => null} profileDetails={null} />
    );
    expect(wrapper.find('.col-sm-2')).toHaveLength(0);
  });
});
