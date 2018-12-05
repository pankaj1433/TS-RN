import FetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';

export const getCustomerProfile = () => {
    return (dispatch) => {
        dispatch({type: 'UNSET_PROFILE_API_FLAG'});
        FetchIntercept(API.PROFILE, {method: 'GET'})
        .then((res) => {
            if (res) {
                if (res.status && res.status === 1) {
                    dispatch({type: 'SET_PROFILE_API_FLAG'});
                    dispatch({ type: 'STORE_PROFILE_DATA', data: res.data || '' });
                }
            }
        })
    };
};

export const updateCustomerProfile = (payload) => {
    return (dispatch) => {
        FetchIntercept(API.UPDATE_PROFILE,  { method: 'POST', body: JSON.stringify(payload) })
        .then((res) => {
            if (res) {
                if (res.status && res.status === 1) {
                    dispatch(getCustomerProfile());
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: 'Profile updated successfully', alertType: 'success' });
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: 'Server error', alertType: 'error' });
                console.log('Update Profile Api Error');
            }
        }).catch(err => {
            dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: 'Server error', alertType: 'error' });
            console.log('Update Profile Api Error', err);
        })
    };
};