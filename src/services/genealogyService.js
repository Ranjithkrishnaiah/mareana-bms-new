import Service from './AjaxService';
import {
	BMS_APP_PYTHON_SERVICE,
	MDH_APP_PYTHON_SERVICE,
	BMS_PBR_URL,
} from '../constants/apiBaseUrl';
let login_response = JSON.parse(localStorage.getItem('login_details'));
const request_headers = {
	'content-type': 'application/json',
	'x-access-token': login_response.token ? login_response.token : '',
	'resource-name': 'GENEALOGY',
};

const request_header_file = {
	'content-type': 'application/json',
	'Content-Type': 'multipart/form-data',
};
//geanealogy plant/product/batch

export const getGeanealogyFilter = _queryParam => {
	return Service.post(
		BMS_APP_PYTHON_SERVICE + '/genealogy-filter',
		_queryParam,
		request_headers
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};

export const getBackwardData = _queryParam => {
	return Service.get(
		MDH_APP_PYTHON_SERVICE + '/mdhgenealogy/v1/genealogy',
		_queryParam,
		request_headers
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};

export const getForwardData = _queryParam => {
	return Service.get(
		MDH_APP_PYTHON_SERVICE + '/mdhgenealogy/v1/genealogy',
		_queryParam,
		request_headers
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};

/**
 * TODO: get batch details from node
 */
export const getBatchInfo = _queryParam => {
	return Service.get(
		MDH_APP_PYTHON_SERVICE + '/mdhgenealogy/v1/batch-info',
		_queryParam,
		request_headers
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};

/**
 * TODO: get Input Proces Order & From Process Order details
 */

export const getProcessInfo = _queryParam => {
	return Service.get(
		MDH_APP_PYTHON_SERVICE + '/mdhgenealogy/v1/process-info',
		_queryParam,
		request_headers
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};

//download data table

export const downloadDataTable = request => {
	return Service.get(
		BMS_APP_PYTHON_SERVICE + '/download-data',
		request,
		request_headers
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};

export const pbrFileUpload = request => {
	return Service.post(
		MDH_APP_PYTHON_SERVICE + '/pbr/udh/ocr_extraction',
		request,
		request_header_file
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};
