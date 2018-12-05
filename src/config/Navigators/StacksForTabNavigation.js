import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
//import stack navigator configuration.
import {GetStackConfiguration} from './GetStackConfiguration';

//Import My-plan stack screens.
import MyPlanScreen from './../../screens/MyPlan';
import ChooseAddonsScreen from './../../screens/ChooseAddOns';
import ChooseNewPlan from './../../screens/ChooseNewPlan';
import ChangePlanConfirmationScreen from './../../screens/ChangePlanConfirmation';
import ReviewAddOnsScreen from './../../screens/ReviewAddOns';


//import Home stack screens.
import Home from './../../screens/Home';
import RecentTransactions from './../../screens/RecentTransactions';
import DataUsage from './../../screens/DataUsage'
import ReferFriend from './../../screens/ReferFriend';


//import Recharge stack screens.
import RechargeScreen from './../../screens/Recharge';
import RechargeWebViewScreen from './../../screens/RechargeWebView';

//import Contact Support stack screens.
import ContactScreen from './../../screens/Support';
import CreateRequestOptionsScreen from './../../screens/CreateRequestOptions';
import CreateRequestOrComplaintScreen from './../../screens/CreateRequestOrComplaint'
import ServiceRequestHistory from './../../screens/ServiceRequestHistory';

//import Customer Profile screens.
import ProfileScreen from './../../screens/Profile';

//-----------------------------------------------------//

//MY PLAN STACK NAVIGATOR.
export const MyPlanStackNavigator = StackNavigator({
    MyPlanScreen: {
        screen: MyPlanScreen
    },
    ChooseAddOnsScreen: {
        screen: ChooseAddonsScreen
    },
    ChooseBasePlanScreen: {
        screen: ChooseNewPlan
    },
    ChangePlanConfirmationScreen: {
        screen: ChangePlanConfirmationScreen
    },
    ReviewAddOnsScreen: {
        screen: ReviewAddOnsScreen
    }
},GetStackConfiguration('MyPlanScreen'));

//HOME SCREEN STACK NAVIGATOR.
export const HomeStackNavigator = StackNavigator({
    HomeScreen: {
        screen: Home,
    },
    RecentTransactionsScreen: {
        screen: RecentTransactions
    },
    DataUsageScreen: {
        screen: DataUsage
    },
    ReferFriendScreen: {
        screen: ReferFriend
    }
},GetStackConfiguration('HomeScreen'));

//Recharge SCREEN STACK NAVIGATOR.
export const RechargeStackNavigator = StackNavigator({
    RechargeScreen: {
        screen: RechargeScreen
    },
    RechargeWebViewScreen: {
        screen: RechargeWebViewScreen  
    }
}, GetStackConfiguration('RechargeScreen'));

//Contact Support STACK NAVIGATOR.
export const ContactSupportStackNavigator = StackNavigator({
    ContactScreen: {
        screen: ContactScreen
    },
    CreateRequestOptionsScreen: {
        screen: CreateRequestOptionsScreen
    },
    CreateRequestOrComplaintScreen: {
        screen: CreateRequestOrComplaintScreen
    },
    ServiceRequestHistoryScreen: {
        screen: ServiceRequestHistory
    }
}, GetStackConfiguration('ContactScreen'));

//Customer Profile Stack Navigator

export const ProfileStackNavigator = StackNavigator({
    ProfileScreen: {
        screen: ProfileScreen
    }
}, GetStackConfiguration('ProfileScreen'));