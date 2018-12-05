const initialState = {
    data: {},
    rechargeAPIFlag: false,
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_GET_RECHARGE': {
            if (action.data !== '') {
                return { ...state, data: action.data }
            }
            return state;
        }
        break;
        case 'SET_RECHARGE_API_FLAG': {
            return { ...state, rechargeAPIFlag: true };
        }
        break;
        case 'UNSET_RECHARGE_API_FLAG': {
            return { ...state, rechargeAPIFlag: false };
        }
        break;
        default: 
            return state;
    }
};