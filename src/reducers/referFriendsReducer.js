const initialState = {
    message: ''
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'REFER_FRIEND_SUCCESS':
            return { ...state, message: action.message };
        break;
        case 'REFER_FRIEND_CLEAR_MESSAGE':
            return {...state,message:''};
        default: 
            return state;
    }
};