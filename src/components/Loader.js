import React, { Component } from 'react';
import { View,  Image, StyleSheet, Text,Animated } from 'react-native';
import { connect } from 'react-redux';

import Localize from './../config/i18n/Localize';

class Loader extends Component {

    constructor(){
        super();
        this.state= {
            fadeAnim: new Animated.Value(0),
        }
    }

    loaderFadeIn () {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }
        ).start()
    }

    loaderFadeOut () {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 0,
                duration: 3000,
                useNativeDriver: true
            }
        ).start()

    }

    componentWillReceiveProps (nextProps) {
        if (this.props.visible !== nextProps.visible) {
            if (nextProps.visible === true) {
                this.loaderFadeIn();
            }
            else {
                this.loaderFadeOut();
            }
        }
    }

    loader() {
        if (this.props.showBackground) {
            return (
                <View style={{flex:1,position:'absolute',top:0,bottom:0,left:0,right:0}}>
                    <Image source={ require('./../assets/img/background/bg.jpg') } resizeMode='cover' style={ styles.background } />
                    <View style={styles.loaderContent}>
                        <View style={ styles.imageContainer }>
                            <Image source={ require('./../assets/img/loading.gif') } resizeMode='stretch' style={ styles.loadingImage } />
                        </View>
                        <View style={ styles.loadingTextContainer }>
                            <Text style={ styles.loadingText }>{ Localize.t('COMMON.loader_text') }</Text>
                            {/* <Text style={ styles.loadingText }>LOADING YOUR EXPERIENCE</Text> */}
                        </View>
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={ [styles.loaderContent, {backgroundColor: '#5b5b5b90'}]}>
                    <View style={ styles.imageContainer }>
                        <Image source={ require('./../assets/img/loading.gif') } resizeMode='stretch' style={ styles.loadingImage } />
                    </View>
                </View>
            )
        }
    }

    render() {
        console.log('in loader', this.props.visible);
        let { fadeAnim } = this.state; 
        if(this.props.visible) {
            return (
                <Animated.View style={{flex:1,position:'absolute',top:0,bottom:0,left:0,right:0,zIndex:150,opacity: fadeAnim}}>
                    {this.loader()}
                </Animated.View>
                )
        }
        else {
            return null;
        }
    };
};

const mapDispatchToProps = () => ({   
});

const mapStateToProps = (state, myProps) => ({
    visible: state.loader.visible,
    showBackground: state.loader.showBackground
});

const styles = StyleSheet.create({
    background: { 
        flex: 1, 
        width: null, 
        height: null 
    },
    loaderContent: { 
        position: 'absolute', 
        flex: 1, 
        left: 0, 
        right: 0,
        top: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderRadius: 100/2,
        backgroundColor: 'transparent',
        elevation: 5,
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.9, 
        backgroundColor: 'black',
        zIndex: 10
    },
    loadingImage: { 
        flex: 1,
        height: null,
        width: null
    },
    loadingTextContainer: {
        paddingVertical: 20,
    },
    loadingText: {
        color: 'white'
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Loader);