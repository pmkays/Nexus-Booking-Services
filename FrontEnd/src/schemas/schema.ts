
export const schema = {
  nameExtraLong: {
    maxLength: 45,
    minLength: 1,
  },
  password: {
    maxLength: 68,
    minLength: 6,
  },
  phoneNo: {
    maxLength: 11,
    minLength: 11,
  },
  email: {
    regexp: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
    maxLength: 45,
  },
};
