const initialState = {
    showAlert: false, 
    alertMessage: '', 
    alertTitle: '', 
    alertType: ''
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_ALERT':
            return { ...state, 
                showAlert: true, 
                alertMessage: action.alertMessage,
                alertType: action.alertType || '',
                alertTitle: action.alertTitle || ''
            }
        break;
        case 'HIDE_ALERT':
        return { ...state, ...initialState  }
        break;
        default:
            return state;
    }
};