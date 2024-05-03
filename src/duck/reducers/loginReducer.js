import {LOGIN_DETAILS,REDIRECT_URL} from '../../constants/actionTypes';

const initialState = {
    loginDetails:{},
    redirectUrl:''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_DETAILS:
            return { ...state,loginDetails: action.payload };
        case REDIRECT_URL:
            return { ...state,redirectUrl: action.payload };
        default:
            return state;
    }
};
