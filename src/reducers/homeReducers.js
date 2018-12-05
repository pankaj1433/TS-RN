const initialState = {
    banners: [],
    userDataDetail: {},
    recentTransaction: [],
    homeAPIFlag: false,
    bannerNavigation: {}
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'STORE_IMAGE_SLIDER_DATA': {
            if ( action.banners && action.banners.length > 0 ) {
                return { ...state, banners: action.banners };
            }
            return state;
        }
        break;
        case 'STORE_USER_DATA_DETAIL': {
            if ( Object.keys(action.userDataDetail).length > 0 ) {
                return { ...state, userDataDetail: action.userDataDetail };
            }
            return state;
        }
        break;
        case 'STORE_HOME_RECENT_TRANSACTION': {
            if ( action.recentTransaction ) {
                return { ...state, recentTransaction: action.recentTransaction };
            }
            return state;
        }
        break;
        case 'SET_HOME_API_FLAG': {
            return { ...state, homeAPIFlag: true };
        }
        break;
        case 'UNSET_HOME_API_FLAG': {
            return { ...state, homeAPIFlag: false };
        }
        break;
        case 'GET_BANNER_NAVIGATION_STATUS': {
            console.log("*** reducer Banner navigation :",action.data)
            return { ...state, bannerNavigation: action.data }
        }
        break;
        case 'RESET_BANNER_NAVIGATION': {
            return { ...state, bannerNavigation: []}
        }
        break;
        case 'RESET_HOME_API_DATA':
            return { ...state, ...initialState };
        default:
            return state;
    }
};