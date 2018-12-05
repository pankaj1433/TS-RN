const initialState = {
    usageData: [],
    monthlyData:[],
    weeklyData:[],
    basePlan: '',
    addOns: [],
    APIResponse: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'STORE_USAGE_DATA':
            if (action.data && Object.keys(action.data).length > 0) {
                console.log('reducer', action.data);
                return { ...state, 
                    usageData: action.data.dailyDataUsages || initialState.usageData, 
                    monthlyData: action.data.monthlyDataUsages || initialState.monthlyData,
                    weeklyData: action.data.weeklyDataUsages || initialState.weeklyData,
                    basePlan: action.data.basePlan || initialState.basePlan,
                    addOns: action.data.addOns || initialState.addOns
                }
            }
            return state;
        break;
        case 'SET_API_RESPONSE':
            return { ...state, APIResponse: true };
        break;
        case 'RESET_API_RESPONSE':
            return { ...state, APIResponse: false };
        break;
        default:
            return state;
    }
}