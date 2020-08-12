import intl from 'react-intl-universal';
import IntlMessageFormat from 'intl-messageformat';
import { enUS } from '../locales/en-US';
import { schema } from '../schemas/schema';

interface Itemplate {
  error: string | undefined;
  isError: boolean;
}

export const template: Itemplate = {
  error: undefined,
  isError: false,
};

interface IvalidatorError {
  isError: boolean;
  count: number;
  errors: {
    [key: string]: Itemplate;
  }
}

export const validatorError: IvalidatorError = {
  isError: false,
  count: 0,
  errors: {},
};

interface Ivalidator {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  address?: string;
  password?: string;
  confirmPassword?: {
    password?: string;
    confirmPassword?: string;
  };
}

export const masterValidator = (values: Ivalidator) => {
  let validator = { ...validatorError };
  const keys = Object.keys(values) as Array<keyof Ivalidator>;
  for (let key of keys) {
    validator.errors[key] = validationDistributor(key, values[key]);
    if ((validator.errors[key] as Itemplate).isError) {
      validator.isError = true;
      validator.count++;
    }
  }
  return validator;
};

export const validationDistributor = (key: string, value: any): Itemplate => {
  switch (key) {
    case 'firstName':
      return firstNameValidator(value);
    case 'lastName':
      return lastNameValidator(value);
    case 'email':
      return emailValidator(value);
    case 'phoneNo':
      return phoneNoValidator(value);
    case 'address':
      return addressValidator(value);
    case 'password':
      return passwordValidator(value);
    case 'confirmPassword':
      return confirmPasswordValidator(value.password, value.confirmPassword);
    default:
      return template;
  }
};

export const dFormat = (key: string, num: number) => {
  return new IntlMessageFormat(key, 'en-US').format({ num });
};

export const emailValidator = (email: string): Itemplate => {
  let validator = { ...template };
  if (email === '') {
    validator.isError = true;
    validator.error = intl.get('ERROR.EMAIL_CANT_BE_EMPTY').d(enUS.ERROR.EMAIL_CANT_BE_EMPTY);
  } else if (!(schema.email.regexp.test(email))) {
    validator.isError = true;
    validator.error = intl.get('ERROR.INVALID_EMAIL_ADDRESS').d(enUS.ERROR.INVALID_EMAIL_ADDRESS);
  } else if (email.length > schema.email.maxLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.EMAIL_ADDRESS_BE_LESS_THAN_X_CHARACTERS').d(enUS.ERROR.EMAIL_ADDRESS_BE_LESS_THAN_X_CHARACTERS);
  }
  return validator;
};

export const passwordValidator = (password: string): Itemplate => {
  let validator = { ...template };
  if (password === '') {
    validator.isError = true;
    validator.error = intl.get('ERROR.PASSWORD_CANT_BE_EMPTY').d(enUS.ERROR.PASSWORD_CANT_BE_EMPTY);
  } else if (password.length < schema.password.minLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.PASSWORD_MUST_BE_MORE_THAN_X_CHARACTERS', {
      num: schema.password.minLength,
    }).d(dFormat(enUS.ERROR.PASSWORD_MUST_BE_MORE_THAN_X_CHARACTERS, schema.password.minLength));
  } else if (password.length > schema.password.maxLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.PASSWORD_MUST_BE_LESS_THAN_X_CHARACTERS', {
      num: schema.password.maxLength,
    }).d(dFormat(enUS.ERROR.PASSWORD_MUST_BE_LESS_THAN_X_CHARACTERS, schema.password.maxLength));
  }
  return validator;
};

export const confirmPasswordValidator = (password: string, confirmPassword: string) => {
  let validator = { ...template };
  if (password !== confirmPassword) {
    validator.isError = true;
    validator.error = intl.get('ERROR.PASSWORD_SHOULD_MATCH_CONFIRM_PASSWORD').d(
      enUS.ERROR.PASSWORD_SHOULD_MATCH_CONFIRM_PASSWORD,
    );
  }
  return validator;
};

export const firstNameValidator = (firstName: string) => {
  let validator = { ...template };
  if (firstName.length === 0) {
    validator.isError = true;
    validator.error = intl.get('ERROR.FIRST_NAME_CANT_BE_EMPTY').d(
      enUS.ERROR.FIRST_NAME_CANT_BE_EMPTY,
    );
  } else if (firstName.length > schema.nameExtraLong.maxLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.FIRST_NAME_MUST_BE_LESS_THAN_X_CHARACTER', {
      num: schema.nameExtraLong.maxLength,
    }).d(dFormat(enUS.ERROR.FIRST_NAME_MUST_BE_LESS_THAN_X_CHARACTER, schema.nameExtraLong.maxLength));
  }
  return validator;
};

export const lastNameValidator = (lastName: string) => {
  let validator = { ...template };
  if (lastName.length === 0) {
    validator.isError = true;
    validator.error = intl.get('ERROR.LAST_NAME_CANT_BE_EMPTY').d(
      enUS.ERROR.LAST_NAME_CANT_BE_EMPTY,
    );
  } else if (lastName.length > schema.nameExtraLong.maxLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.LAST_NAME_MUST_BE_LESS_THAN_X_CHARACTER', {
      num: schema.nameExtraLong.maxLength,
    }).d(dFormat(enUS.ERROR.LAST_NAME_MUST_BE_LESS_THAN_X_CHARACTER, schema.nameExtraLong.maxLength));
  }
  return validator;
};

export const phoneNoValidator = (phoneNo: string) => {
  let validator = { ...template };
  if (phoneNo.length === 0) {
    validator.isError = true;
    validator.error = intl.get('ERROR.PHONE_NUMBER_CANT_BE_EMPTY').d(
      enUS.ERROR.PHONE_NUMBER_CANT_BE_EMPTY,
    );
  } else if (phoneNo.length < schema.phoneNo.minLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.PHONE_NUMBER_MUST_BE_MORE_THAN_X_CHARACTER', {
      num: schema.phoneNo.maxLength,
    }).d(dFormat(enUS.ERROR.PHONE_NUMBER_MUST_BE_MORE_THAN_X_CHARACTER, schema.phoneNo.minLength));
  } else if (phoneNo.length > schema.phoneNo.maxLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.PHONE_NUMBER_MUST_BE_LESS_THAN_X_CHARACTER', {
      num: schema.phoneNo.maxLength,
    }).d(dFormat(enUS.ERROR.PHONE_NUMBER_MUST_BE_LESS_THAN_X_CHARACTER, schema.phoneNo.maxLength));
  }
  return validator;
};

export const addressValidator = (address: string) => {
  let validator = { ...template };
  if (address.length === 0) {
    validator.isError = true;
    validator.error = intl.get('ERROR.ADDRESS_CANT_BE_EMPTY').d(
      enUS.ERROR.ADDRESS_CANT_BE_EMPTY,
    );
  } else if (address.length > schema.nameExtraLong.maxLength) {
    validator.isError = true;
    validator.error = intl.get('ERROR.ADDRESS_MUST_BE_LESS_THAN_X_CHARACTER', {
      num: schema.nameExtraLong.maxLength,
    }).d(dFormat(enUS.ERROR.ADDRESS_MUST_BE_LESS_THAN_X_CHARACTER, schema.nameExtraLong.maxLength));
  }
  return validator;
};
