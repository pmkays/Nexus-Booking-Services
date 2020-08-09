import { schema } from './schema';

export const emailSchema = {
  ...schema.email,
  required: true,
};

export const passwordSchema = {
  ...schema.password,
  required: true,
};

export const phoneNoSchema = {
  ...schema.phoneNo,
  required: true,
};

export const nameSchema = {
  ...schema.nameExtraLong,
  required: true,
};
