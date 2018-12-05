const initialState = {
    invoiceId: ''
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_CHANGE_PLAN_DATA':
            return { ...state, invoiceId: action.invoiceId };
        break;
        case 'RESET_CHANGE_PLAN_DATA':
            return { ...state, ...initialState };
        break;
        default: 
            return state;
    }

};