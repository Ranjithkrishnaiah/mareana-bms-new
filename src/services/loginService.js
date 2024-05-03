import Service from './AjaxService';
import {
  BMS_APP_PYTHON_SERVICE,
  BMS_APP_LOGIN_PASS
} from '../constants/apiBaseUrl';


export const loginUrl = BMS_APP_LOGIN_PASS + '/login'

export const logoutUrl = BMS_APP_LOGIN_PASS + '/logout'

export const getSession = (request) => {
    return Service.get(BMS_APP_LOGIN_PASS + '/get-session', request,{ withCredentials: true }).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};


export const getAuthenticate = (request,header) => {
    return Service.get(BMS_APP_LOGIN_PASS+ '/login-pass', request, header).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};
