import { FUNCTION_TEXT, MOLECULE_ID } from '../types/types';
import Service from '../../services/AjaxService';
import { BMS_APP_PYTHON_SERVICE } from '../../constants/apiBaseUrl';

export const functionTextName = payload => ({
	type: FUNCTION_TEXT,
	payload,
});

export const moleculeName = payload => ({
	type: MOLECULE_ID,
	payload,
});

export const updateFunction = (request, dispid, version, headers) => {
	return Service.put(
		BMS_APP_PYTHON_SERVICE + `/views/1/${dispid}/${version}`,
		request,
		headers
	).then(
		response => {
			return response.data;
		},
		error => {
			return error.response.data;
		}
	);
};
