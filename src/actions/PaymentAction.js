import fetchIntercept from "../utils/FetchIntercept";
import API from "../config/constants/APIConstants";

export const getTransactionStatus = (transationId) => {
    return (dispatch, getState) => {
        let timeout = getState()['paymentAPIData']['timeout'];
        if (timeout === true) {
            return false;
        }
        fetchIntercept(`${API.PAYMENT_TRANSACTION_STATUS}/${transationId}`, { method: 'GET' })
        .then(res => {
            if (res.status && res.status === 1) {
                if (res.data) {
                    let { transactionStatus, nextCallInterval } = res.data;
                    var tId = res.data.transactionId;
                    // console.log("*** transaction status is :",transactionStatus)
                    if (transactionStatus === 'NEW'|| transactionStatus === 'INPROGRESS') {
                        setTimeout(() => {
                            dispatch(getTransactionStatus(tId));
                        }, nextCallInterval * 1000);
                    }
                    else {
                        dispatch({ type: 'STORE_PAYMENT_STATUS_DATA', paymentStatusData: res.data });
                    }
                }
            }
        });
    };
};

export const postPaymentInit = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'RESET_TIMEOUT_PAYMENT' });
        // console.log("*** payload is :",payload)
        fetchIntercept(API.INITIATE_PAYMENT, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => {
            if (res.status && res.status === 1) {
                if (res.data) {
                    // console.log(res.data);
                    dispatch({ type: 'STORE_PAYMENT_INIT_DATA', data: res.data });
                    dispatch(getTransactionStatus(res.data.transactionId));
                    // console.log("**** transaction timeout is :",res.data.transactionStatusTimeout,res,data.transactionId)
                    setTimeout(() => {
                        dispatch({ type: 'TIMEOUT_PAYMENT', timeout: true });
                    }, res.data.transactionStatusTimeout * 1000);
                }
            }
            else {
                dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: res.message || '' })    
            }
        });
    };
};