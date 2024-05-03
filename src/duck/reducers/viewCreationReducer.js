import { FUNCTION_TEXT, MOLECULE_ID } from '../types/types';
import {
	SAVE_FUNCTIONS,
	SAVE_AS_FUNCTIONS,
	MATH_EDITOR,
	FUNCTION_NAME,
	FUNCTION_MAP,
	PARAMETER_MAP,
	VIEW_PARAM_DATA,
	SELECTED_PARAM_DATA,
	BATCH_COVERAGE_DATA,
	SELECTED_VARIABLE,
	SUMMARY_TABLE_DATA,
	SELECTED_PARAM_TYPE,
	VIEW_FUNCTION_MAP,
	VIEW_PARAM_MAP,
	IS_LOAD_VIEW,
	RESET_VIEW,
} from '../../constants/actionTypes';

const initState = {
	textName: '',
	molecule_id: '',
	save: '',
	saveAs: '',
	funDetails: '',
	functionName: '',
	functionMap: {},
	parameterMap: {},
	paramData: [],
	selectedParamData: [],
	batchCoverageData: {},
	selectedVariable: [],
	summaryTableData: [],
	selectedParamType: '',
	functions: {},
	parameters: {},
	isLoad: false,
};

export default (state = initState, action) => {
	switch (action.type) {
		case FUNCTION_TEXT:
			return { ...state, textName: action.payload };
		case MOLECULE_ID:
			return { ...state, molecule_id: action.payload };
		case SAVE_FUNCTIONS:
			return { ...state, save: action.payload };
		case SAVE_AS_FUNCTIONS:
			return { ...state, saveAs: action.payload };
		case MATH_EDITOR:
			return { ...state, funDetails: action.payload };
		case FUNCTION_NAME:
			return { ...state, functionName: action.payload };
		case FUNCTION_MAP:
			return { ...state, functionMap: action.payload };
		case PARAMETER_MAP:
			return { ...state, parameterMap: action.payload };
		case VIEW_PARAM_DATA:
			return { ...state, paramData: action.payload };
		case SELECTED_PARAM_DATA:
			return { ...state, selectedParamData: action.payload };
		case BATCH_COVERAGE_DATA:
			return { ...state, batchCoverageData: action.payload };
		case SELECTED_VARIABLE:
			return { ...state, selectedVariable: action.payload };
		case SUMMARY_TABLE_DATA:
			return { ...state, summaryTableData: action.payload };
		case SELECTED_PARAM_TYPE:
			return { ...state, selectedParamType: action.payload };
		case VIEW_FUNCTION_MAP:
			return { ...state, functions: action.payload };
		case VIEW_PARAM_MAP:
			return { ...state, parameters: action.payload };
		case IS_LOAD_VIEW:
			return { ...state, isLoad: action.payload };
		case RESET_VIEW:
			return initState;
		default:
			return state;
	}
};
