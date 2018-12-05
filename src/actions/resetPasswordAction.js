import fetchIntercept from "../utils/FetchIntercept";
import API from './../config/constants/APIConstants';
import { showLoader, hideLoader } from "./Loader";

export const postResetPassword = (payload) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        fetchIntercept(API.CHANGE_PASSWORD, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => {
            dispatch(hideLoader());
            if (res && res.status) {
                if (res.status === 1) {
                    dispatch({ type: 'STORE_CHANGE_PASSWORD_RESPONSE', flag: true });
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertType: 'error' });
                }
            }
        });
    };
};