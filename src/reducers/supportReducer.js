const initialState = {
    data: {},
    list: {},
    supportAPIFlag: false
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_SUPPORT_DATA': {
            if (action.data !== '') {
                return { ...state, data: action.data }
            }
            return state;
        }
        break;
        case 'STORE_SUPPORT_DATA_LIST': {
            if (action.data !== '') {
                return { ...state, list: action.data }
            }
            return state;
        }
        break;
        case 'SET_SUPPORT_API_FLAG': {
            return { ...state, supportAPIFlag: true };
        }
        break;
        case 'UNSET_SUPPORT_API_FLAG': {
            return { ...state, supportAPIFlag: false };
        }
        break;
        default: 
            return state;
    }
};