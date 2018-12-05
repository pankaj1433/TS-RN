const initialState = {
    recentTransactionData: [],
    recentTransactionAPICount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'STORE_RECENT_TRANSACTION_DATA':
            if (action.recentTransactionData && action.recentTransactionData.length > 0) {
                let recentTransactionAPICount = state.recentTransactionAPICount + 1;
                return { ...state, recentTransactionData: action.recentTransactionData, recentTransactionAPICount  };
            }
            return state;
        break;
        default:
            return state;
    }
};