const initialState = { 
    isLoggedIn: false,
    forgotResponse: {},
    userToken: '',
    loginType: '',
    customerId: '',
    firstTimeLogin: false,
    screenCards : []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'LOG_IN': {
            if (state.isLoggedIn === false) {
                return { ...state, isLoggedIn: true }
            }
            return state;
        }
        break;
        case 'LOG_OUT': {
            if (state.isLoggedIn === true) {
                return { ...state, isLoggedIn: false }
            }
            return state;
        }
        break;
        case 'FORGOT_PASS':{
            if (action.data) {
                return { ...state, forgotResponse: action.data }
            }
            return state;
        }
        break;
        case 'SET_REFRESH_TOKEN': {
            console.log('tokecn reducer', action.userToken)
            if (action.userToken) {
                return { ...state, userToken: action.userToken }
            }
            else {
                return { ...state, userToken: '' }
            }
        }
        break;
        case 'SET_LOGIN_TYPE': {
            if( action.loginType ) {
                return { ...state, loginType: action.loginType }
            }
            return state;
        }
        break;
        case 'SET_CUSTOMER_ID': {
            if (action.customerId) {
                return { ...state, customerId: action.customerId }
            }
            return state;
        }
        break;
        case 'SHOW_FIRST_TIME_LOGIN': {
            return { ...state, firstTimeLogin: true };
        }
        break;
        case 'HIDE_FIRST_TIME_LOGIN': {
            return { ...state, firstTimeLogin: false };
        }
        break;
        case 'GET_CARD_ORDER':{
            return {...state,screenCards: action.screenCards}
        }
        default:
            return state;
    }
};