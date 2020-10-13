import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { EditProfile } from './EditProfile';
import Input from '../../../components/UI/Input/Input';
import Button from '../../../components/UI/Button/Button';
import ErrorMessage from '../../../components/UI/Input/ErrorMessage';

configure({ adapter: new Adapter() });

describe('<EditProfile/>', () => {
  let wrapper;

  const shouldShowErrorMessage = {
    firstName: {
      labelName: 'First Name',
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Firstname',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: false,
      touched: true,
    },
    lastName: {
      labelName: 'Last Name',
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Lastname',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: true,
      touched: false,
    },
    email: {
      labelName: 'Email',
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Email',
      },
      value: '',
      validation: {
        required: true,
        isEmail: true,
      },
      valid: true,
      touched: false,
    },
    address: {
      labelName: 'Address',
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Address',
      },
      value: '',
      validation: {
        required: true,
      },
      valid: true,
      touched: false,
    },
    phoneNumber: {
      labelName: 'Phone number',
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Phonenumber',
      },
      value: '',
      validation: {
        required: true,
        isNumeric: true,
        exactLength: 10,
      },
      valid: true,
      touched: false,
    },
    isFormValid: true,
  };

  beforeEach(() => {
    wrapper = shallow(<EditProfile onFetchProfile={(token) => {}} />);
  });

  it('should render 7 Input fields', () => {
    expect(wrapper.find(Input)).toHaveLength(7);
  });

  it('should render no error messages at the start', () => {
    expect(wrapper.find(ErrorMessage)).toHaveLength(0);
  });

  it('should disable button if form is invalid', () => {
    wrapper.setState({ isFormValid: false });
    expect(
      wrapper.contains(
        <Button disabled={false} classes='btn btn-primary'></Button>
      )
    );
  });

  it('should display an error message if form is invalid', () => {
    wrapper.setState({ isFormValid: false });
    expect(
      wrapper.contains(
        <p className='text-danger'>
          Please make sure all fields are filled and valid.
        </p>
      )
    );
  });

  it('should render an error message component if first name is invalid', () => {
    wrapper.setState({ controls: shouldShowErrorMessage });
    expect(
      wrapper.contains(<ErrorMessage key='firstNameError' message='Required' />)
    );
  });
});
