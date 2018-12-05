const initialState = {
    invoiceId: ''
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_ADD_ADDON_DATA':
            return { ...state, invoiceId: action.invoiceId };
        break;
        case 'RESET_ADD_ADDON_DATA':
            return { ...state, ...initialState };
        break;
        default: 
            return state;
    }

};