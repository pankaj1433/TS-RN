const initialState = {
    otts: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_OTT_DATA': {
            if (action.otts && action.otts.length > 0) {
                return { ...state, otts: action.otts };
            }
            return state;
        }
        break;
        default:
            return state;
    }
};