import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Image, Modal, TouchableOpacity, AsyncStorage, Dimensions } from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { connect } from 'react-redux';

import ButtonPrimary from './../components/UI/ButtonPrimary';
import MainScreenBackground from './../components/UI/MainScreenBackground';
import AnchorLinks from './../components/UI/AnchorLinks';
import AlertBox from './../components/Alert';

import Localize from './../config/i18n/Localize';

import { showLoader, hideLoader } from './../actions/Loader';
import { login } from './../actions/login';

import { Validation } from '../utils/Validations';
import config from '../config/config';

class LoginScreen extends Component {

    constructor() {
        super();
        this.state = {
            userIdMob: '',
            password: '',
            loginType: '',
            hidePassword: true,
            resetPasswordFlow: false,
            formError: []
        };
    }


    toggleShowPassword = () => this.setState({ hidePassword: !this.state.hidePassword })

    // handleResetPassword = () => {
    //     this.setState({ showResetPasswordModal: false }, () => {
    //         this.props.navigation.navigate('MainTabBar')
    //     });        
    // }

    componentWillReceiveProps (nextProps) {
        if (nextProps.firstTimeLogin) {
            let { userIdMob, password, loginType } = this.state;
            this.props.navigation.navigate('ResetPassword', { userIdMob, password, loginType });
            this.setState({ password: '' });
        }
    }

    _validateForm = () => {
        let validState = true;
        let formError = [];
        let loginType = '';
        if ( Validation.isEmpty(this.state.userIdMob) || Validation.isEmpty(this.state.password) ) {
            formError.push(Localize.t('LOGIN.form_error.field_required'));
            validState = false;
        }
        if ( Validation.isMobileNumber(this.state.userIdMob) ) {
            loginType = config.loginTypes.mobile;
        }
        else if ( Validation.isAlphaNumeric(this.state.userIdMob) === true ) {
            loginType = config.loginTypes.customer_id;
        }
        else {
            formError.push(Localize.t('LOGIN.form_error.incorrect_id'));
            validState = false;
        }
        this.setState({ formError, loginType });
        if (formError.length > 0) {
            this.props.showAlert(formError.join("\n"));
        }
        return { validState, loginType };
    };

    loginSubmit() {
        //API call here
        let resetPasswordFlag = false;  //set flag from API response
        if (resetPasswordFlag) {
            this.setState({resetPasswordFlow: true});
        }
        else {
            this.setState({ formError: [] }, () => {
                let validObj = this._validateForm();
                if ( validObj.validState ) {
                    let payload = {
                        username: this.state.userIdMob,
                        password: this.state.password,
                        loginType: validObj.loginType
                    };
                    this.props.login(payload);
                }
                return false;
            });
        }
    }

    render() {
        let { height } = Dimensions.get('window');
        return (
            <MainScreenBackground gifType="tv">
                <View style={styles.container}>
                    <View style={[styles.logoContainer, { marginVertical: ((height)*(1/6) - 20) }]}>
                        <Image
                            style={{ height: 40 }}
                            source={require('./../assets/img/logo_sky.png')}
                            resizeMode='contain'
                        />
                    </View>
                    <View style={styles.loginContainer}>
                        <View>
                            <View style={[styles.userfield, { borderBottomColor: 'white', borderBottomWidth: 1 }]}>
                                <View style={styles.userfieldIcon} >
                                    <Feather name="user" size={20} color="white" />
                                </View>
                                <TextInput
                                    accessible={true}
                                    accessibilityLabel="userID"
                                    style={[styles.userfieldInput]}
                                    onChangeText={(userIdMob) => { this.setState({ userIdMob }) }}
                                    value={this.state.userIdMob}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={ Localize.t('LOGIN.cust_id_mob_num') }
                                    placeholderTextColor='white'
                                    returnKeyType='next'
                                    onSubmitEditing={ (e) => { this.refs.passwordField.focus() } }
                                />
                            </View>
                            <View style={styles.userfield}>
                                <View style={styles.userfieldIcon}>
                                    <Feather name="lock" size={20} color="white" />
                                </View>
                                <TextInput
                                    accessible={true}
                                    accessibilityLabel="password"
                                    ref='passwordField'
                                    secureTextEntry={this.state.hidePassword}
                                    style={styles.userfieldInput}
                                    onChangeText={(password) => { this.setState({ password }) }}
                                    value={this.state.password}
                                    underlineColorAndroid={'transparent'}
                                    placeholder= {this.state.resetPasswordFlow ? Localize.t('LOGIN.temp_password') : Localize.t('LOGIN.your_password')}
                                    placeholderTextColor='white'
                                    returnKeyType='done'
                                    onSubmitEditing={ () => this.loginSubmit() }
                                />
                                <TouchableOpacity accessible={true} accessibilityLabel="showPassword" onPress={this.toggleShowPassword} style={ [ styles.userfieldIcon ] }>
                                    <Ionicons name='md-eye' style={{ color: 'white', opacity: 0.8 }} size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginBottom: 40, marginTop: 20 }} >
                                <ButtonPrimary 
                                    accessible={true}
                                    accessibilityLabel="loginButton"
                                    title = { Localize.t('LOGIN.login') }
                                    icon = "ios-arrow-round-forward-outline"
                                    onClick = { () => this.loginSubmit() }
                                    trackEvent={ 'Login Pressed' }                      
                                />                            
                            </View>
                            <View style={{ justifyContent: 'space-around', flexDirection: 'row' }}>
                                <AnchorLinks accessible={true} accessibilityLabel="forgotPassword" title={Localize.t('LOGIN.forgot_password')} onClick={()=>this.props.navigation.navigate('ForgotPassword')} />
                                <View><Text style={styles.links}>|</Text></View>
                                <AnchorLinks accessible={true} accessibilityLabel="newConnection" title={Localize.t('LOGIN.new_connection')} onClick={() => this.props.navigation.navigate('NewConnection')} />
                            </View>
                        </View>
                    </View>
                </View>
            </MainScreenBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    loginContainer: {
        paddingHorizontal: 30,
        flex: 1
    },
    userfield: {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    userfieldIcon: {
        flex: 0.1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userfieldInput: {
        flex: 0.9,
        color: 'white',
        fontFamily: 'sky-text-regular',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 27,
        letterSpacing: 0,
        height: 70
    },
    showPasswordIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginBtn: {
        flex: 0.9,
        alignItems: 'center',
        marginTop: 30
    },
    links: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 14.7,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 27,
        letterSpacing: 0,
    }
});

const mapStateToProps = (state, myProps) => ({
    firstTimeLogin: state.login.firstTimeLogin
})

const mapDispatchToProps = (dispatch) => ({
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    showAlert: (message, title, type) => dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: message, alertType: type, alertTitle: title }),
    login: (payload) => dispatch(login(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);