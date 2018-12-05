import React, { Component } from 'react';
import { View, AsyncStorage, Animated, Image, StatusBar, Platform } from 'react-native';
import { Font, Asset } from 'expo';
// import { getLanguages } from 'react-native-i18n'
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase'

import StackNavigator from './config/Navigators/StackNavigator';
import TabNavigator from './config/Navigators/TabNavigator';
import Loader from './components/Loader';

import { setLanguage } from './actions/AppInit';
import { login, logoutUser, setRefreshUserToken, setLoginType } from './actions/login';
import Store from './store/index';
import { getConfigData } from './actions/AppInit';

import SplashScreen from './components/SplashScreen';
import NoInternetModal from './components/modal/NoInternetModal';
import AlertBox from './components/Alert';

class AppEntry extends Component {

    constructor () {
        super();
        this.state = {
            isReady: false,
            fadeAnim: new Animated.Value(0),
            silentLogin: false,
            alreadyLoggedIn: false
        };
    }
    
    onFinishProcess = async () => {
        if ( this.state.silentLogin === false ) {
            // console.log('not a silent login')
            this.setState({isReady: true});
            this.props.hideSplash();
        }
    };

    getUserToken = async () => {
        try {
            let userToken = await AsyncStorage.getItem('@tataskybroadband:userToken');
            return userToken
        }
        catch (error) {
            console.log('Error in fetching User Token from ASYNC Storage: ', error);
        }
    };

    getLoginType = async () => {
        try {
            let loginType = await AsyncStorage.getItem('@tataskybroadband:loginType');
            return loginType;
        }
        catch ( error ) {
            console.log('Error in fetching loginType from ASYNC Storage: ', error);
        }
    };

    setLoginType = (loginType) => {
        AsyncStorage.setItem('@tataskybroadband:loginType', loginType);
    };

    cacheImages = ( images ) => {
        return Promise.all(
                Object
                .keys(images)
                .map( imageKey => {
                    if ( typeof images[imageKey] === 'string' ) {
                        return Image.prefetch(images[imageKey])
                    }
                    else {
                        return Asset.fromModule(images[imageKey]).downloadAsync()
                    }
                })
            );
    };

    startAsyncProcess = async () => {
        // return getLanguages()
        //         .then(languages => { console.log(languages); return languages[0]; })
        //         .then(this.props.setLanguage)
        try {
            this.props.getConfig();
            let loginType = await this.getLoginType();
            let userToken = await this.getUserToken();
            // console.log('user token', userToken);
            if (userToken !== null) {
                this.props.setRefreshUserToken(userToken);
                this.props.logIn({ token: userToken, loginType }, 'silent');
                this.setState({ silentLogin: true });
            }
            else {
                this.setState({ silentLogin: false });
            }
            await Font.loadAsync({
                'sky-text-regular': require('./assets/fonts/sky-text-regular.ttf'),
                'sky-text-medium': require('./assets/fonts/sky-text-medium.ttf'),
                'sky-text-bold': require('./assets/fonts/sky-text-bold.ttf'),
                'sky-text-italics': require('./assets/fonts/sky-text-italic.ttf')
            });
            await this.cacheImages({
                'background-image': require('./assets/img/background/bg.jpg'),
                'building-vector': require('./assets/img/building/buildingBg.png'),
                'loader': require('./assets/img/loading.gif'),
                'plug-loader': require('./assets/img/plug-loader.gif'),
                'tv-anim': require('./assets/img/login_anim.gif')
            }); 

            this.setState({isReady: true});
        }
        catch (e) {
            // console.log('Error in Start Async Process', e);
        }
    };

    animateHomeTransition () {
        this.setState({ fadeAnim: new Animated.Value(0) }, () => {
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }
            ).start()
        });
    }

    componentWillReceiveProps(nextProps) {
        if ( nextProps.userToken === '' ) {
            // console.log('User Token remove')
            AsyncStorage.removeItem('@tataskybroadband:userToken');
        }
        else if( this.props.userToken !== nextProps.userToken ) {
            // console.log('token not match', this.props.userToken, nextProps.userToken);
            AsyncStorage.setItem('@tataskybroadband:userToken', nextProps.userToken);
        }
        // console.log('token match', this.props.userToken, nextProps.userToken);
        // console.log(Store.getState())
        if ( nextProps.loginType !== '' && this.props.loginType !== nextProps.loginType ) {
            this.setLoginType(nextProps.loginType);
        }
        if (this.props.loggedIn !== nextProps.loggedIn && nextProps.loggedIn === true ) {
            this.animateHomeTransition();
        }
        // console.log("*************** this.props",this.props.loggedIn,"*********** nextProps",nextProps.loggedIn)
    }

    render() {
        console.disableYellowBox = true;
        if (this.props.splashVisible || !this.state.isReady) {
            return (
                <View style={{ flex: 1 }}>
                    <SplashScreen 
                        startAsync={ this.startAsyncProcess }
                        onFinish={ this.onFinishProcess }
                        onError={ () => {} }
                    />
                </View>
            );
        }
        else {
            if ( this.props.loggedIn === true ) {
                let { fadeAnim } = this.state;  
                
                return (
                    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                        <StatusBar barStyle='light-content'/>
                        {/* <AlertBox /> */}
                        <TabNavigator/>
                        {/* <SplashScreen /> */}
                        {/* <DataUsageChartNew /> */}
                        <Loader />
                        <NoInternetModal />
                    </Animated.View>
                );
            }
            else {    
                StatusBar.setBarStyle('light-content');      
                return ( 
                    <View style={{ flex: 1 }}>
                        <StatusBar barStyle='light-content'/>
                        <StackNavigator />
                        <Loader />
                        <NoInternetModal />
                    </View>
                );
            }
        }
    }
}

const mapStateToProps = (state, myProps) => ({
    language: state.init.language,
    loggedIn: state.login.isLoggedIn,
    config: state.config.data,
    userToken: state.login.userToken,
    loginType: state.login.loginType,
    splashVisible: state.splash.visible
})

const mapDispatchToProps = (dispatch) => ({
    setLanguage: (language) => dispatch(setLanguage(language)),
    getConfig: () => dispatch(getConfigData()),
    logIn: (payload, mode) => dispatch(login(payload, mode)),
    logOut: () => dispatch({ type: 'LOG_OUT' }),
    showSplash: () => dispatch({ type: 'SHOW_SPLASH_SCREEN', visible: true }),
    hideSplash: () => dispatch({ type: 'HIDE_SPLASH_SCREEN', visible: false }),
    setRefreshUserToken: (userToken) => dispatch(setRefreshUserToken(userToken))
})

export default connect(mapStateToProps, mapDispatchToProps)(AppEntry);