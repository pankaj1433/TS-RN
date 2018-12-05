import React, { Component } from 'react';
import { View, Image, Dimensions, Animated } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import SplashScreenNative from 'react-native-splash-screen';
import MainScreenBackground from './UI/MainScreenBackground';

class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fadeInAnim: new Animated.Value(0)
        }
    }

    componentDidMount() {
        SplashScreenNative.hide();
        this.props.startAsync()
        .then(() => {
            setTimeout(() => this.props.onFinish(), 5000);
        });
    }

    imageFade = () => {
        Animated.timing(
            this.state.fadeInAnim,
            {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true
            }
        ).start();
    };

    render() {
        let { width, height } = Dimensions.get('window');
        if (this.props.visible) {
            console.log('render Splash')
            return (
                <LinearGradient 
                    colors={['#284397', '#A62871']}
                    start={[0.5, 1]}
                    end={[0, 0.5]}
                    style={{ padding: 0, flex: 1}}>
                    <View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'transparent'}} >
                        <MainScreenBackground gifType="plug">
                            <View style={{ justifyContent: 'center', alignItems: 'center', height: height - 70, width }}>
                                <Animated.Image
                                    style={{ height: 40, opacity: this.state.fadeInAnim }}
                                    source={require('./../assets/img/logo_sky.png')}
                                    resizeMode='contain'
                                    onLoad = { this.imageFade }
                                />
                            </View>
                        </MainScreenBackground>
                    </View>
                </LinearGradient>
            );
        }
        return null;
    }
};

const mapDispatchToProps = () => ({});
const mapStateToProps = (state) => ({
    visible: state.splash.visible
});

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);