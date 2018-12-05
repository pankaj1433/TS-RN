import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import AlertBox from './../Alert';

const MainScreenBackground = ({ children, gifType }) => {

    const { height, width } = Dimensions.get('window');

    const tvAnim = () => {
        return (
            <View style={{ position: 'absolute', flex: 1, bottom: 0, left: 0, right: 0, top: 0, backgroundColor: 'transparent' }}>
                <Image source={ require('./../../assets/img/login_anim.gif') }  resizeMode='stretch' style={{ height: height, width: width }} />
            </View>
        );
    }

    const plugAnim = () => {
        return (
            <View style={{ position: 'absolute', flex: 1, bottom: 0, left: 0, right: 0, top: 0, backgroundColor: 'transparent' }}>
                <Image source={ require('./../../assets/img/plug-loader.gif') }  resizeMode='cover' style={{ height: height, width: width }} />
            </View>
        );
    }
    let animatedGif = null;
    switch (gifType) {
        case 'plug': 
            animatedGif = plugAnim;
        break;
        case 'tv':
            animatedGif = tvAnim;
        break;
        default:
            animatedGif = null;

    }
    return (
        <View style={{flex: 1}}>
            {/* <Image source={ require('./../../assets/img/loginpage.gif') }/> */}
            <Image source={ require('./../../assets/img/background/bg.jpg') } resizeMode='cover' style={{ flex: 1, width: null, height: null }} />
            <View style={{ position: 'absolute', flex: 1, bottom: -40, left: 0, right: 0 }}>
                <Image source={ require('./../../assets/img/building/buildingBg.png') }  resizeMode='cover' style={{ height: 350, width: width }}/>
            </View>
            {/* { animatedGif && animatedGif() } */}
            {/* <Image source={ require('./../../assets/img/login_anim.gif') }  resizeMode='cover' style={{ height: height, width: width, backgroundColor: 'transparent' }} /> */}
            <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, flex: 1 }}>
                <AlertBox />
                <KeyboardAwareScrollView enableOnAndroid={ true } >
                    { children }
                </KeyboardAwareScrollView>
            </View>
        </View>
    );
};

export default MainScreenBackground;