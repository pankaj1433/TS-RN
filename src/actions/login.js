import FetchIntercept from './../utils/FetchIntercept';
import { showLoader, hideLoader } from './Loader';
import API from '../config/constants/APIConstants';
// import firebase from 'react-native-firebase';
// import TrackMixpanel from '../utils/TrackMixpanel';

export const login = ( payload, mode = 'normal' ) => {
    return (dispatch, getState) => {
        dispatch({ type: 'HIDE_FIRST_TIME_LOGIN' });
        if (mode === 'normal') {
            dispatch(showLoader());
        }
        console.log("***** payload is :",payload)
        dispatch(setLoginType(payload.loginType));
        FetchIntercept(API.LOGIN, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => {
            if (res.status && res.status === 1) {
                if(payload.username && payload.password){
                    // firebase.analytics().logEvent('Login',{customerId:res.data.customerId});
                }
                let { token, firstTimeLogin, customerId, email, telephone, name, screenCards} = res.data;
                console.log(token);
                dispatch({type: 'GET_CARD_ORDER' , screenCards:screenCards})
                if (firstTimeLogin === true) {
                    if (mode === 'silent') {
                        dispatch({ type: 'HIDE_SPLASH_SCREEN', visible: false });
                        dispatch({ type: 'HIDE_FIRST_TIME_LOGIN' });
                    }
                    else {
                        dispatch(hideLoader());
                        dispatch({ type: 'SHOW_FIRST_TIME_LOGIN' });
                    }
                    dispatch(setRefreshUserToken(token));
                }
                else {
                    dispatch({ type: 'HIDE_FIRST_TIME_LOGIN' });
                    // TrackMixpanel.setPeople({name, $email: email, telephone});
                    // TrackMixpanel.identify(customerId);
                    dispatch(setRefreshUserToken(token));
                    dispatch(setCustomerId(customerId));
                    let tokenSet = getState()['login']['userToken'];
                    if(tokenSet) {
                        console.log('login after token set');
                        dispatch(loginUser());
                        if ( mode === 'silent' ) {
                            dispatch({ type: 'HIDE_SPLASH_SCREEN', visible: false });
                        }
                        else {
                            dispatch(hideLoader());
                        }
                    }
                }
            }
            else {
                console.log('login error', res);
                if( mode === 'silent' ) {
                    dispatch({ type: 'HIDE_SPLASH_SCREEN', visible: false });
                    dispatch(logout());
                }
                else {
                    dispatch(hideLoader());
                    dispatch({ type: 'SHOW_ALERT', showAlert: true, alertType: 'error', alertMessage: res.message })
                }
            }
        })
        .catch(err => {
            console.log('Login Api Error', err);
            dispatch(hideLoader());
            dispatch({ type: 'SHOW_ALERT', showAlert: true, alertType: 'error' })
        })
    };
};

export const logout = () => {
    return (dispatch) => {
        // TrackMixpanel.reset();
        dispatch(showLoader());
        dispatch(setRefreshUserToken(''));
        dispatch(clearData());
        dispatch(logoutUser());
        dispatch(hideLoader());
    }
};

export const setRefreshUserToken = userToken => ({
    type: 'SET_REFRESH_TOKEN',
    userToken
});

export const loginUser = () => ({
    type: 'LOG_IN',
    isLoggedIn: true
});

export const logoutUser = () => ({
    type: 'LOG_OUT',
    isLoggedIn: false
});

export const setLoginType = (loginType) => ({
    type: 'SET_LOGIN_TYPE',
    loginType
});

export const setCustomerId = (customerId) => ({
    type: 'SET_CUSTOMER_ID',
    customerId
});

export const clearData = () => ({
    type: 'CLEAR_DATA'
});