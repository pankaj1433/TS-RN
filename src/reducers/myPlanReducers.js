const initialState = {
    data: {},
    allAddOns: {},
    allPlans: {},
    reviewCurrentPlanData: {},
    myPlanAPIFlag: false,
};

export default (state = initialState, action) => {
    switch(action.type) {
        case 'MY_PLAN': {
            if (action.data !== '') {
                return { ...state, data: action.data }
            }
            return state;
        }
        break;
        case 'ALL_ADDONS': {
            if (action.data !== '') {
                return { ...state, allAddOns: action.data.addons }
            }
            return state;
        }
        break;
        case 'AVAILABLE_PLANS': {
            if (action.data !== '') {
                return { ...state, allPlans: action.data }
            }
            return state;
        }
        break;
        case 'STORE_REVIEW_CURRENT_PLAN': {
            if (action.data && Object.keys(action.data).length > 0) {
                return { ...state, reviewCurrentPlanData: action.data };
            }
            return state;
        }
        break;
        case 'SET_MYPLAN_API_FLAG': {
            return { ...state, myPlanAPIFlag: true };
        }
        break;
        case 'UNSET_MYPLAN_API_FLAG': {
            return { ...state, myPlanAPIFlag: false };
        }
        break;
        default: 
            return state;
    }
};