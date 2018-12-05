export default (state = {data: ''}, action) => {
    switch(action.type) {
        case 'STORE_NEW_CONNECTION_RESPONSE': {
            if (action.data) {
                return { ...state, data: action.data }
            }
            return state;
        }
        break;
        default:
            return state;
    }
};