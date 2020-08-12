import intl from 'react-intl-universal';
import { enUS } from '../locales/en-US';
import { ErrorObject } from '../typings/common/reducers';

export const errorAPI = (error: ErrorObject): string => {
  return intl.get(`API_ERRORS.${error.code}`).d(enUS.API_ERRORS[error.code] || error.message);
};
