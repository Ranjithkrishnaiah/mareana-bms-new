import {
    BMS_APP_PYTHON_SERVICE,
} from '../constants/apiBaseUrl';
import Service from './AjaxService';


export const eSign = (request,headers) => {
    return Service.post(BMS_APP_PYTHON_SERVICE + '/digital-signature', request,headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};


export const publishEvent = (request,headers) => {
    return Service.put(BMS_APP_PYTHON_SERVICE + '/workflow-publish-event', request,headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

//approve reject 
export const approveRecord = (request) => {
    return Service.put(BMS_APP_PYTHON_SERVICE + '/workflow-status', request).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};





