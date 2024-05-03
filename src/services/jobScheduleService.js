import Service from './AjaxService';
import {
    BMS_APP_PYTHON_SERVICE,
} from '../constants/apiBaseUrl';




export const getJob = (request,header) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/jobs', request,header).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};


export const putJob = (request,header) => {
    return Service.put(BMS_APP_PYTHON_SERVICE + '/jobs', request,header).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const deleteJob = (request,header) => {
    return Service.del(BMS_APP_PYTHON_SERVICE + '/jobs', request, header).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

