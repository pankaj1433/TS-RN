const initialState = {
    data: {},
    paymentInitFlag: false,
    timeout: false,
    paymentStatusData: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_PAYMENT_INIT_DATA': {
            if (action.data) {
                return { ...state, data: action.data, paymentInitFlag: true };
            }
        }
        break;
        case 'RESET_PAYMENT_STATE': {
            return { ...state, ...initialState };
        }
        case 'STORE_PAYMENT_STATUS_DATA': {
            return { ...state, paymentStatusData: action.paymentStatusData };
        }
        break;
        case 'TIMEOUT_PAYMENT':
            return { ...state, timeout: true };
        break;
        case 'RESET_TIMEOUT_PAYMENT':
            return { ...state, timeout: false };
        break;
        default: 
            return state;
    }
};