import fetchIntercept from "../utils/FetchIntercept";
import API from "../config/constants/APIConstants";
import { showLoader, hideLoader } from "./Loader";

export const postAddAddon = (payload) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        fetchIntercept( API.ADD_ADDON, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => {
            dispatch(hideLoader());
            if (res) {
                if (res.status === 1) {
                    console.log(res.data, 'add addon');
                    let { invoiceId } = res.data;
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message || '', alertType: 'success' });
                    dispatch({ type: 'STORE_ADD_ADDON_DATA', invoiceId });
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message || '' });
                }
            }
        });
    };
};

export const resetAddAddon = () => ({
    type: 'RESET_ADD_ADDON_DATA'
});