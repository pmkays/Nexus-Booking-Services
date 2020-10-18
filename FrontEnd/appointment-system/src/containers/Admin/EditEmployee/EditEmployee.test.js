import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EditEmployee } from './EditEmployee';
import Input from '../../../components/UI/Input/Input';

configure({ adapter: new Adapter() });

describe('<EditEmployee/>', () => {
  let wrapper = shallow(
    <EditEmployee
      onFetchEmployee={() => null}
      match={{ params: { id: 3 } }}
      token={3}
    />
  );

  it('should render 7 Input fields', () => {
    expect(wrapper.find(Input)).toHaveLength(7);
  });
});
