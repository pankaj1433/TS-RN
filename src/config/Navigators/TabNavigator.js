import React, { Component } from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';
import { TabNavigator, TabBarBottom , NavigationActions } from 'react-navigation';
import { LinearGradient } from 'expo';
import config from './../config';

import { HomeStackNavigator, RechargeStackNavigator, ContactSupportStackNavigator, MyPlanStackNavigator, ProfileStackNavigator } from './StacksForTabNavigation'
// import TrackMixpanel from '../../utils/TrackMixpanel';


class tabBarBottomWrapper extends Component {

    render() {
        return (
            <LinearGradient 
                colors={[ '#A62871','#284397']} 
                // x1='0' 
                // x2='0' 
                // y1='0' 
                // y2='0' 
                start={[0, 0]} 
                end={[0, 1]}
                //locations = {[0,0.25,0.5,1]}
                >
                <TabBarBottom {...this.props}/>
            </LinearGradient>
        );
    }
} 

// const focusedTab = (path,focusedPath,focused) => {
//     return(
//     (focused)?
//     (Platform.OS === 'ios')?
//     //ios selected tab
//     <View style={{position:'relative'}}>
//         <LinearGradient colors={['#284397', '#A62871']} x1='1' x2='1' y1='0' y2='1' start={[0.5, 1]} end={[0, 0.5]} style={styles.focusedContainer}>
//             {/* <Stop offset='10%' stopColor='#284397' stopOpacity='1'>
//             <Stop offset='100%' stopColor='#A62871' stopOpacity='1'> */}
//             <Image style={styles.iconStyle} source={focusedPath} resizeMode='contain' />
//         </LinearGradient>
//     </View>:
//     //android selected tab
//     <View style={styles.androidContainer}>
//         <View style={{position:'absolute',backgroundColor:config.UI.greyBackground,top:0,bottom:0,left:0,right:0}}></View>
//         <View style={{position:'absolute',bottom:0,height:50,left:0,right:0,backgroundColor:'#fff',borderTopWidth: StyleSheet.hairlineWidth}}></View>
//         <View>
//             <LinearGradient style={styles.androidGradient} colors={['#284397', '#A62871']} x1='1' x2='1' y1='0' y2='1' start={[0.5, 1]} end={[0, 0.5]}>
//                 <Image style={styles.iconStyle} source={focusedPath} resizeMode='contain' />
//             </LinearGradient>
//         </View>
//     </View>:
//     (Platform.OS === 'ios')?
//     //ios non selected tab
//     <View style={{position:'relative'}} >
//         <View style={styles.focusedContainer}>
//             <Image style={styles.iconStyle} source={path} resizeMode='contain' />
//         </View>
//     </View>:
//     //android non selected tab
//     <View style={styles.androidContainer}>
//     <View style={{position:'absolute',backgroundColor:config.UI.greyBackground,top:0,bottom:0,left:0,right:0}}></View>
//         <View style={{position:'absolute',bottom:0,height:50,left:0,right:0,backgroundColor:'#fff',borderTopWidth: StyleSheet.hairlineWidth}}></View>
//         <View>
//             <View style={styles.androidGradient} >
//                 <Image style={styles.iconStyle} source={path} resizeMode='contain' />
//             </View>
//         </View>
//     </View>
//     )
// }

const styles = StyleSheet.create({
//     focusedContainer: {
//         borderTopRightRadius:5,
//         justifyContent:'center',
//         alignItems:'center',
//         borderTopLeftRadius:5,
//         overflow:'hidden',
//         position:'absolute',
//         bottom:-32,
//         left:-32,
//         width:65,
//         height:73,
//     },
    // androidContainer: {
    //     flex:1,
    //     position:'absolute',
    //     bottom:0,
    //     left:0,
    //     top:0,
    //     right:0,
    //     alignItems: 'center',
    //     justifyContent: 'flex-end',
    //     backgroundColor: 'transparent',
    // },
//     androidGradient: {
//         borderTopRightRadius:5,
//         justifyContent:'center',
//         alignItems:'center',
//         borderTopLeftRadius:5,
//         width:65,
//         height:57,
//         backgroundColor: 'transparent'
//     },
//     iconStyle: {
//         marginBottom:8,
//         ...Platform.select({
//             android: {
                
//             }
//         })
//     }
})
const focusedTab = (path,focusedPath,focused,title) => {
    return(
        (focused)?
        <Image accessible={true} accessibilityLabel={title} source={focusedPath} resizeMode='contain' />
        :<Image accessible={true} accessibilityLabel={title} source={path} resizeMode='contain' />
    )
}
const tabNavigationOptions = {
    navigationOptions: ({navigation}) => ( {
        tabBarOnPress: ({ scene, jumpToIndex }) => {
            //if tab is not active
            //if (!scene.focused) {
                //if stack ,navigate to top of the stack 
                if((scene.route.routes && scene.route.routes.length > 1) || scene.index == 0) {
                    jumpToIndex(scene.index);
                    navigation.popToTop();
                }//navigate to tab 
                else {
                    navigation.dispatch(NavigationActions.navigate({
                        routeName: scene.route.key,
                        action: NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({
                                routeName: scene.route.routes[0].routeName
                            })]
                        })
                    }))
                }
            // }
            // else {
            //     jumpToIndex(scene.index);
            // }
        },
    }),
    tabBarPosition: 'bottom',
    animationEnabled: true,
    tabBarComponent: tabBarBottomWrapper,
    tabBarOptions: {
        labelStyle: {
            fontSize: 12,
            // ...Platform.select({
            //     android: {
            //         position:'absolute',
            //         alignSelf: 'center'
            //     }
            // })
        },
        tabStyle: {
            // position: 'absolute',
            // top:0 , bottom : 0,left :0,right:0,
            // backgroundColor: 'blue',
            // ...Platform.select({
            //     android: {
            //         backgroundColor: 'transparent',
            //     }
            // })
        },
        activeTintColor: 'white',
        //activeBackgroundColor: 'transparent',
        inactiveBackgroundColor: 'white',
        style: {
            // position: 'relative'
            //height: 49,
            backgroundColor: 'transparent',
            // ...Platform.select({
            //     android: {
            //         height:57,
            //         borderTopWidth : 0,
            //     }
            // })
        }
    },
    initialRouteName: 'HomeTab',
    lazy: true,
    swipeEnabled: false
};

const RootTabNavigator = TabNavigator({
    HomeTab: {
        screen: HomeStackNavigator,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({ tintColor,focused }) => focusedTab(require('./../../assets/img/icHome/icHome.png'),require('./../../assets/img/icHomeFocus/icHomeFocus.png'),focused,'Home'),
        }   
    },
    MyPlanTab: {        
        screen: MyPlanStackNavigator,
        navigationOptions: {
            tabBarLabel: 'Plan',
            tabBarIcon: ({ tintColor,focused }) => focusedTab(require('./../../assets/img/icPlans/icPlans.png'),require('./../../assets/img/icPlansFocus/icPlansFocus.png'),focused,'Plan'),
        }
    },
    RechargeTab: {
        screen: RechargeStackNavigator,
        path: 'recharge',
        navigationOptions: {
            tabBarLabel: 'Recharge',
            tabBarIcon: ({ tintColor,focused }) => focusedTab(require('./../../assets/img/icRecharge/icRecharge.png'),require('./../../assets/img/icRechargeFocus/icRechargeFocus.png'),focused,'Recharge'),
        
        }
    },
    SupportTab: {
        screen: ContactSupportStackNavigator,
        navigationOptions: {
            tabBarLabel: 'Support',
            tabBarIcon: ({ tintColor,focused }) => focusedTab(require('./../../assets/img/icSupport/icSupport.png'),require('./../../assets/img/icSupportFocus/icSupportFocus.png'),focused,'Support'),
        
        }
    },
    ProfileTab: {
        screen: ProfileStackNavigator,
        navigationOptions: {
            tabBarLabel: 'Profile',
            tabBarIcon: ({ tintColor,focused }) => focusedTab(require('./../../assets/img/icProfile/icProfile.png'),require('./../../assets/img/icProfileFocus/icProfileFocus.png'),focused,'Profile'),
        }
    },
},
tabNavigationOptions);

export default class TabNavigatorWrapper extends Component {
    constructor(props){
        super(props)
    }

    componentDidMount () {
        // TrackMixpanel.track('HomeTab');
        // TrackMixpanel.track('HomeScreen');
    }

    handleNavigationStateChange = (prev, curr) => {
        if (prev.index !== curr.index) {
            let currTab = curr.routes[curr.index];
            // TrackMixpanel.track(currTab['routeName'])
            // TrackMixpanel.track(currTab.routes[currTab.index]['routeName']);
        }
        else {
            let prevTab = prev.routes[prev.index];
            let currTab = curr.routes[curr.index];
            if (currTab.index !== prevTab.index) {
                // TrackMixpanel.track(currTab.routes[currTab.index]['routeName']);
            }
        }

        
    }

    render () {
        return (
            <RootTabNavigator 
                onNavigationStateChange = { this.handleNavigationStateChange }
                alreadyLoggedIn = {this.props.alreadyLoggedIn}
            />
        );
    }
};