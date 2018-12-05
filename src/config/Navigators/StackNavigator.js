import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { StackNavigator } from 'react-navigation';

import LoginScreen from './../../screens/Login';
import NewConnectionScreen from './../../screens/NewConnection';
import ForgotPassword from './../../screens/ForgotPassword'

import tabBarBottomWrapper from './../Navigators/TabNavigator'
import ResetPasswordScreen from './../../screens/ResetPassword'
// import TrackMixpanel from '../../utils/TrackMixpanel';

const stackNavigatorConfig = {
    headerMode: 'none',
    transitionConfig: () => ({
        transitionSpec: {
          duration: 750,
          easing: Easing.inOut(Easing.poly(4)),
          timing: Animated.timing,
        },
        screenInterpolator: sceneProps => {
            const { position, layout, scene, index, scenes } = sceneProps

            const thisSceneIndex = scene.index
            const height = layout.initHeight
            const width = layout.initWidth
      
            // We can access our navigation params on the scene's 'route' property
            var thisSceneParams = scene.route.params || {}
      
            const translateX = position.interpolate({
              inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
              outputRange: [width, 0, 0]
            })
      
            const opacity_one = position.interpolate({
              inputRange: [thisSceneIndex - 1,  thisSceneIndex],
              outputRange: [0, 1],
            })

            const opacity_two = position.interpolate({
                inputRange: [thisSceneIndex - 1, thisSceneIndex - 0.99, thisSceneIndex],
                outputRange: [0, 1, 1],
            });
      
            const OpacityTransition = { opacity: opacity_one }
            const SlideTransition = { opacity: opacity_two, transform: [{ translateX }] }
            if (scene.route.routeName == 'ResetPassword')
                return SlideTransition;
            return OpacityTransition;
        },
    })
}; 

const ModalStack = StackNavigator({
    Login: {
        screen: LoginScreen
    },    
    ForgotPassword: {
        screen: ForgotPassword
    },
    NewConnection: {
        screen: NewConnectionScreen
    },
    ResetPassword: {
        screen: ResetPasswordScreen
    }

},stackNavigatorConfig);

export default class TabNavigator extends Component {

    componentDidMount () {
        // TrackMixpanel.track('Login');
    }

    handleNavigationStateChange = (prev, curr) => {
        if (prev.index !== curr.index) {
            // TrackMixpanel.track(curr.routes[curr.routes.length-1]['routeName']);
        }
    };

    render () {
        return (
            <ModalStack 
                onNavigationStateChange={ this.handleNavigationStateChange }
            />
        );
    }
};