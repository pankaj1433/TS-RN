const initialState = {
    data: {},
    subtypesData: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_CREATE_REQUEST_OR_COMPLAINT': {
            if (action.data !== '') {
                return { ...state, data: action.data }
            }
            return state;
        }
        case 'STORE_REQUEST_OR_COMPLAINT_SUBTYPES': {
            if (action.data !== '') {
                return { ...state, subtypesData: action.data }
            }
            return state;
        }        
        break;
        case 'CLEAR_CREATE_REQUEST_OR_COMPLAINT': 
            return { ...state, ...initialState  }
        break;
        default:
            return state;
    }
};