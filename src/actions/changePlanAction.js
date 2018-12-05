import fetchIntercept from "../utils/FetchIntercept";
import API from "../config/constants/APIConstants";
import { showLoader, hideLoader } from "./Loader";

export const postChangePlan = (payload) => {
    return (dispatch) => {
        dispatch(showLoader(false));
        fetchIntercept( API.CHANGE_PLAN, { method: 'POST', body: JSON.stringify(payload) } )
        .then(res => {
            dispatch(hideLoader());
            if (res) {
                if (res.status === 1) {
                    console.log(res.data);
                    let { invoiceId } = res.data;
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message || '', alertType: 'success' });
                    dispatch({ type: 'STORE_CHANGE_PLAN_DATA', invoiceId });
                }
                else {
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message || '' });
                }
            }
        });
    };
};

export const resetChangePlanData = () => ({
    type: 'RESET_CHANGE_PLAN_DATA'
});