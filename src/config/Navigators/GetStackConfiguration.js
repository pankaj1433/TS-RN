import React from 'react';
import { Animated, Easing } from 'react-native';

export const GetStackConfiguration =  (inititalRoute) => {
    return({
        headerMode: 'none',
        transitionConfig: () => ({
            transitionSpec: {
            duration: 300,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            },
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;
        
                const height = layout.initHeight;
                const translateY = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [height, 0, 0],
                });
        
                const width = layout.initWidth;
                const translateX = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [width, 0, 0],
                });

                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index],
                    outputRange: [0, 1, 1],
                });

                //No transition for initital screen
                if (scene.route.routeName == inititalRoute){
                    return {opacity};
                }
        
                return { opacity, transform: [{ translateX }] };
            },
        }),
        initialRouteName: inititalRoute
    })
    
};