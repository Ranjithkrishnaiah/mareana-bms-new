import { LOGIN_DETAILS, REDIRECT_URL } from '../../constants/actionTypes'



export const sendLoginDetails = (payload) => ({
    type: LOGIN_DETAILS,
    payload,
  });
  export const sendUrl = (payload) => ({
    type: REDIRECT_URL,
    payload,
  });

  