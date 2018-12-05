const initialState = {
    visible: true
};

export default (state = initialState, action) => {
    switch( action.type ) {
        case 'SHOW_SPLASH_SCREEN': 
            if (action.visible === true) {
                return { ...state, visible: true }
            }
            return state;
            break;
        case 'HIDE_SPLASH_SCREEN':
            if (action.visible === false) {
                return { ...state, visible: false }
            }
            return state;
            break;
        default: 
            return state;
    }
};