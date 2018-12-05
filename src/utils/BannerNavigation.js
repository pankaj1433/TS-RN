const screenMapping = {
    ServiceRequestHistoryScreen : {      // For Support
        screen : 'ServiceRequestHistoryScreen',
        params : [],
        defaultScreen : 'ServiceRequestHistoryScreen',
        isFirstScreen: false // inside tab is this screen is first screen
    },
    // ContactScreen : {
    //     screen : 'ContactScreen',
    //     params : [],
    //     defaultScreen : 'ContactScreen'
    // },
    // CreateRequestOptionsScreen:{
    //     screen : 'CreateRequestOptionsScreen',
    //     params : [],
    //     defaultScreen : 'CreateRequestOptionsScreen'
    // },
    // CreateRequestOrComplaintScreen:{
    //     screen : 'CreateRequestOrComplaintScreen',
    //     params : ['category' , 'title' , 'titleKey'],
    //     defaultScreen : 'CreateRequestOptionsScreen'
    // },
    // MyPlanScreen : {                        // For Plans
    //     screen : 'MyPlanScreen',
    //     params : [],
    //     defaultScreen : 'MyPlanScreen'
    // },
    ChooseAddOnsScreen:{         
        screen : 'ChooseAddOnsScreen',
        params : [],
        defaultScreen : 'ChooseAddOnsScreen',
        isFirstScreen: false
    },
    ChooseBasePlanScreen:{
        screen : 'ChooseBasePlanScreen',
        params : [],
        defaultScreen : 'ChooseBasePlanScreen',
        isFirstScreen: false
    },
    ChangePlanConfirmationScreen : {
        screen : 'ChangePlanConfirmationScreen',
        params : ['secondLine','price','validity','productOfferingId'], 
        defaultScreen : 'ChooseBasePlanScreen',
        isFirstScreen: false
    },
    ReviewAddOnsScreen : {
        screen : 'ReviewAddOnsScreen',
        params : ['secondLine','price','validity','productOfferingId'],
        defaultScreen : 'ChooseAddOnsScreen',
        isFirstScreen : false
    },
    RechargeScreen : {                              // Recharge screen
        screen : 'RechargeScreen',
        params : ['basePlanPrice','nextRechargeDate','recommendedAmount','walletBalance'],
        defaultScreen : null,
        tab: 'RechargeTab',
        isFirstScreen: true
    },
    ProfileScreen:{
        screen : 'ProfileScreen',
        params : [],
        defaultScreen : 'ProfileScreen',
        tab: 'ProfileTab',
        isFirstScreen: true
    },
    CreateRequestOptionsScreen:{
        screen:'CreateRequestOptionsScreen',
        params:[],
        default:'CreateRequestOptionsScreen',
        isFirstScreen: false
    },
    RecentTransactionsScreen : {                        // Recent Transactions screen
        screen : 'RecentTransactionsScreen',
        params : [],
        defaultScreen : 'RecentTransactionsScreen',
        isFirstScreen: false
    },
    DataUsageScreen : {                                // Data Usage screen
        screen : 'DataUsageScreen',
        params : [],
        defaultScreen : 'DataUsageScreen',
        isFirstScreen: false
    },
    ReferFriendScreen : {
        screen : 'ReferFriendScreen',
        params : [],
        defaultScreen : 'ReferFriendScreen',
        isFirstScreen : false
    }
}


export function navigationConfig(screenName,screenParams){
    const screenConfig = screenMapping[screenName];
    
    if(!screenConfig){  // if screenName does not match to any of our routes
        return null; 
    }
    
    if(screenParams!= null){    // if params comming and i need params make api hit
        return screenConfig;
    }else if(screenConfig.params.length){    // if no params and i don't need params then show screen
        const { isFirstScreen, tab } = screenConfig;    
        return {
            routeName: screenConfig.defaultScreen,
            isFirstScreen,
            tab
        }
    }else{
        const { isFirstScreen, tab } = screenConfig;
        return {
           routeName: screenConfig.screen,
           isFirstScreen,
           tab
        }
    }
};


export function apiNavigationHandler(screenPayload){
    const screenConfig = screenMapping[screenPayload.screen];
    const { isFirstScreen, tab } = screenConfig;

    if(screenPayload.status){
        if(screenPayload.params.length >1){
            return {
                routeName: screenConfig.defaultScreen,
                params: screenPayload.params,
                isFirstScreen,
                tab
            }
        }else{
            return {
                routeName: screenConfig.screen,
                params: screenPayload.params[0],
                isFirstScreen,
                tab
            }
        }
    }else{
        return {
            routeName: screenConfig.defaultScreen,
            isFirstScreen,
            tab
        }
    }
}



