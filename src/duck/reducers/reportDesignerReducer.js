import {SELECTED_REPORT_ID,SCREEN_CHANGE,LOGIN_DETAILS} from '../../constants/actionTypes';

const initialState = {
    reportData:{},
    screen:false,
    loginDetails:{}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SELECTED_REPORT_ID:
            return { ...state,reportData: action.payload };
        case SCREEN_CHANGE:
            return { ...state,screen: action.payload };
        default:
            return state;
    }
};
