import Service from './AjaxService';
import {
    BMS_APP_PYTHON_SERVICE,
    MDH_APP_PYTHON_SERVICE,
} from '../constants/apiBaseUrl';

export const getBoundingBoxData = (_queryParam) => {
    return Service.get(
        'http://localhost' +
            '/pbr/udh/get_data?fileId=BatchRecordExample2Pfd_page-0.jpeg.json&pageId=1',
        _queryParam
    ).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const savePbrTemplate = (request) => {
    return Service.put(
        'http://localhost' + '/pbr/udh/save_records',
        request
    ).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};

export const getPbrReviewerData = (_queryParam) => {
    return Service.get(
        MDH_APP_PYTHON_SERVICE + '/pbr/udh/get_cpv_pbr_data',
        _queryParam
    ).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error.response.data;
        }
    );
};
