import fetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';

export const getRecentTransaction = () => {
    return (dispatch) => {
        fetchIntercept(API.RECENT_TRANSACTION, { method: 'GET' })
        .then(res => {
            if (res) {
                console.log(res, 'check')
                if (res.status && res.status === 1) {
                    console.log(res.data, 'recent transction');

                    dispatch({ type: 'STORE_RECENT_TRANSACTION_DATA', recentTransactionData: res.data });
                }
            }
        });
    };
};