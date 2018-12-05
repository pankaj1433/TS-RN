import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';

export const getRecharge = () => {
    return (dispatch) => {
        dispatch({ type: 'UNSET_RECHARGE_API_FLAG' });
        FetchIntercept(API.GET_RECHARGE, {method: 'GET'})
        .then((res) => {
            if (res) {
                if (res.status && res.status === 1) {
                    dispatch({ type: 'SET_RECHARGE_API_FLAG' });
                    dispatch({ type: 'STORE_GET_RECHARGE', data: res.data || {} });
                }
            }
        }).catch(err => {
            dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: 'Server error', alertType: 'error' });
            console.log('Get Recharge Api Error', err);
        })
    };
};