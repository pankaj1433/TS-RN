import React, { Component } from 'react';
import { View, Text, StyleSheet,Platform,Dimensions } from 'react-native';
import { LinearGradient, Constants } from 'expo';
import config from './../../config/config'

class GenericScreenBackground extends Component {
    constructor(props) {
        super(props);
        this.gradientViewFlex = this.props.gradientViewFlex ? this.props.gradientViewFlex : 0.33
    }
    render() {
        return (
            <View style={ styles.container }>
                <LinearGradient 
                    colors={['#284397', '#63276f']}
                    start={[0.5, 1]}
                    end={[0, 0.5]}
                    style={{ padding: 0, flex: this.gradientViewFlex}}>
                </LinearGradient>
                <View style={ [styles.greyArea, {flex: 1-this.gradientViewFlex}] }></View>
                <View style={ styles.overlayChild }>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    greyArea: {
        // flex: 2,
        backgroundColor: config.UI.greyBackground
    },
    overlayChild: {
        flex: 1, 
        backgroundColor: 'transparent', 
        padding: 10, 
        paddingTop: Constants.statusBarHeight ,
        position: 'absolute', 
        zIndex: 1, 
        left: 0, 
        top: 0, 
        right: 0, 
        bottom: 0 ,
        ...Platform.select({
            android: {
                paddingBottom: 0,
            }
        })
    }
});

export default GenericScreenBackground;