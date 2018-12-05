const initialState = {
    visible: false,
    showBackground: true
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'SHOW_LOADER':
            if (action.visible !== initialState) {
                return { ...state, visible: action.visible, showBackground: action.showBackground }
            }
            return state;
            break;
        case 'HIDE_LOADER':
            if (action.visible !== initialState) {
                return { ...state, visible: action.visible, showBackground: action.showBackground }
            }
            return state;
        default:
            return state;
    }
}