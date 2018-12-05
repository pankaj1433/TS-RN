const initialState = {
    data: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_CREATE_REQUEST_LIST': {
            if (action.data !== '') {
                return { ...state, data: action.data }
            }
            return state;
        }
        break;
        default:
            return state;
    }
};