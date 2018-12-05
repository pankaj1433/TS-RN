const initialState = {
    language: 'en'
};

export const setLanguage = (state = initialState, action) => {
    switch(action.type) {
        case 'SET_LANGUAGE': {
            if (!action.language) {
                return state;
            }
            console.log('2', Object.assign({}, state, {language: action.language}));
            return Object.assign({}, state, {language: action.language});
        }
        break;
        default: {
            return state;
        }
    }
};

const configInitialState = {
    data: ''
};
export const setConfig = (state = configInitialState, action) => {
    switch(action.type) {
        case 'SET_CONFIG':
            if ( action.data !== '' ) {
                return { ...state, data: action.data }
            }
            else {
                return state;
            }
        default: 
            return state;
    }
};