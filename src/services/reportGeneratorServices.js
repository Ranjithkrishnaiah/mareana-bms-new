import {
    BMS_APP_PYTHON_SERVICE,
} from '../constants/apiBaseUrl';
import Service from './AjaxService';



let login_response = JSON.parse(localStorage.getItem('login_details'));
const request_headers = {
    'content-type': 'application/json',
    'x-access-token': login_response.token ? login_response.token : '',
    'resource-name': 'REPORT_GENERATOR',
};

export const saveReportGenerator = (request) => {
    return Service.put(BMS_APP_PYTHON_SERVICE + '/report-variant', request, request_headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const getReportGenerator = (request) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/report-variant', request).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const getChartData = (request) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/chart', request).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const loadReportGen = (request, headers) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/report-load', request, request_headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};
