import { combineReducers } from 'redux';

import { setLanguage, setConfig } from './AppInit';
import Loader from './Loader';
import Alert from './Alert'
import NewConnection from './newConnectionReducer';
import Login from './loginReducer';
import Splash from './Splash';
import OTT from './OTTReducers';
import Home from './homeReducers';
import Support from './supportReducer';
import Profile from './profileReducer';
import MyPlan from './myPlanReducers'
import CreateRequestList from './CreateRequestListReducer'
import CreateRequestOrComplaint from './CreateRequestOrComplaintReducer'
import DataUsage from './dataUsageReducer';
import RecentTransaction from './recentTransactionReducer';
import paymentReducer from './paymentReducer';
import Recharge from './rechargeReducer';
import ResetPassword from './resetPasswordReducer';
import ChangePlan from './changePlanReducer';
import AddAddon from './addAddonReducer';
import ReferFriendReducer from './referFriendsReducer';


let appReducer = combineReducers({
    init: setLanguage,
    config: setConfig,
    loader: Loader,
    alert: Alert,
    newConnectionApiResponse: NewConnection,
    login: Login,
    splash: Splash,
    ott: OTT,
    homeAPIData: Home,
    supportAPIData: Support,
    profileAPIData: Profile,
    dataUsageAPIData: DataUsage,
    myPlanAPIData: MyPlan,
    createRequestListAPIData: CreateRequestList,
    createRequestOrComplaintAPIData: CreateRequestOrComplaint,
    recentTransactionAPIData: RecentTransaction,
    paymentAPIData: paymentReducer,
    rechargeAPIData: Recharge,
    resetPasswordAPIData: ResetPassword,
    changePlanAPIData: ChangePlan,
    addAddonAPIData: AddAddon,
    ReferFriendAPIData: ReferFriendReducer

});



const rootReducer = (state, action) => {
    if (action.type === 'CLEAR_DATA') {
      state = undefined
    }  
    return appReducer(state, action)
}

export default rootReducer;