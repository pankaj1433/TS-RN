const initialState = {
    data: '',
    profileAPIFlag: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'STORE_PROFILE_DATA': 
            if (action.data !== '') {
                return { ...state, data: action.data }
            }
            return state;
        break;
        case 'SET_PROFILE_API_FLAG': {
            return { ...state, profileAPIFlag: true };
        }
        break;
        case 'UNSET_PROFILE_API_FLAG': {
            return { ...state, profileAPIFlag: false };
        }
        break;
        default:
            return state;
    }
}