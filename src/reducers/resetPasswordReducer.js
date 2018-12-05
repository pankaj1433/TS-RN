const initialState = {
    flag: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'STORE_CHANGE_PASSWORD_RESPONSE':
            return { ...state, flag: action.flag };
        break;
        case 'RESET_CHANGE_PASSWORD_RESPONSE':
            return { ...state, flag: false };
        break;
        default: 
            return state;
    }
};