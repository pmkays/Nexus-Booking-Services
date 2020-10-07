import * as actionTypes from './actionTypes';

export const updateRedirect = (content, redirect) => {
  return {
    type: actionTypes.UPDATE_REDIRECT,
    content: content,
    redirect: redirect,
  };
};

export const resetRedirect = () => {
  return {
    type: actionTypes.RESET_REDIRECT,
  };
};
