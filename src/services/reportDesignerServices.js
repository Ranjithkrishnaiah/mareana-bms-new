import {
    BMS_APP_PYTHON_SERVICE,
} from '../constants/apiBaseUrl';
import Service from './AjaxService';


let login_response = JSON.parse(localStorage.getItem('login_details'));

const request_headers = {
    'content-type': 'application/json',
    'x-access-token': login_response.token ? login_response.token : '',
    'resource-name': 'REPORT_DESIGNER',
};

export const getViews = (request) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/views-list', request,request_headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const getCharts = (request) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/chart-list/' + request).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const getReports = (request) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/reports', request).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const saveReportDesign = (request) => {
    return Service.put(BMS_APP_PYTHON_SERVICE + '/put-report-data', request, request_headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const PublishReport = (request) => {
    return Service.put(BMS_APP_PYTHON_SERVICE + '/put-report-data', request, request_headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const loadReport = (request, headers) => {
    return Service.get(BMS_APP_PYTHON_SERVICE + '/report-load', request, request_headers).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};


