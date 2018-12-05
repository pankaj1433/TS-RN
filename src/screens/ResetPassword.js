import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import MainScreenBackground from './../components/UI/MainScreenBackground';
import Divider from './../components/UI/Divider';
import ButtonPrimary from './../components/UI/ButtonPrimary';
import MessageBox from './../components/modal/MessageBox';
import AlertBox from './../components/Alert';
import Localize from './../config/i18n/Localize';
import { postResetPassword } from './../actions/resetPasswordAction';
import { reg } from '../utils/RegEx';

var {width, height} = Dimensions.get('window')

class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            retypePassword: '',
            oldPassword: props.navigation.state.params.password,
            userIdMob: props.navigation.state.params.userIdMob,
            loginType: props.navigation.state.params.loginType,
            hidePassword: true,
            showSuccessBox: false
        };
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.resetPasswordFlag === true && this.props.resetPasswordFlag === false) {
            this.setState({ showSuccessBox: true });
        }
    }

    resetPasswordTapped = () => {
        if (this.validatePassword(this.state.password, this.state.retypePassword)) { 
            // this.setState({showSuccessBox: true})
            let payload = {
                confirmPassword: this.state.retypePassword,
                password: this.state.password,
                oldPassword: this.state.oldPassword,
                username: this.state.userIdMob
            };
            this.props.postResetPassword(payload);
        }        
    };

    toggleShowPassword = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    };

    handleMessageBoxTap =() => {        
        this.setState({showSuccessBox: false},() => {
            this.props.navigation.goBack();
            // this.props.startResetPassword();
        })                
    }
    validatePassword = (password, verifyPassword) => {
        if (password.length ==0 || verifyPassword.length == 0) {
            this.props.showAlert(Localize.t('PASSWORD.RESET.VALIDATION.blank'),Localize.t('PASSWORD.RESET.VALIDATION.valid'))
            
            return false
        }
        if (password.length < 6 || password.length > 16) {
            this.props.showAlert(Localize.t('PASSWORD.RESET.VALIDATION.min_six'),Localize.t('PASSWORD.RESET.VALIDATION.valid'))
           
            return false
        }
        if(!password.match( reg.password )) {
            this.props.showAlert(Localize.t('PASSWORD.RESET.VALIDATION.alpha'),Localize.t('PASSWORD.RESET.VALIDATION.valid'))
            
            return false
        }
        if (password !== verifyPassword) {
            this.props.showAlert(Localize.t('PASSWORD.RESET.VALIDATION.match'))
            
            return false                        
        }
        else {
            return true
        }
    }

    render() {
        return (
            <MainScreenBackground gifType="tv">
                <AlertBox />
                <View style={styles.container}>
                    <View style={{paddingHorizontal: 10, paddingVertical: 25,marginTop:10}}></View>
                    <View style={[styles.logoContainer,styles.topContainer]}>
                            <Image
                                style={{ height: 40}}
                                source={require('./../assets/img/logo_sky.png')}
                                resizeMode='contain'
                            />
                    </View>
                    <View style={{flexShrink:1,marginVertical: 20,alignItems: 'center'}}>
                        <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Image source={ require('./../assets/img/Password/icPassword.png') } resizeMode='center'/>    
                            <Text style = {styles.forgotPasswordText}> {Localize.t('PASSWORD.RESET.set_new')} </Text>
                            
                        </View>
                    </View>
                    <View style={styles.loginContainer}>
                        <View style={styles.userfield}>
                            <TextInput
                                secureTextEntry={this.state.hidePassword}
                                style={styles.userfieldInput}
                                onChangeText={(password) => { this.setState({password}) }}
                                value={this.state.password}
                                underlineColorAndroid={'transparent'}
                                placeholder={Localize.t('PASSWORD.RESET.enter')}
                                placeholderTextColor='white'
                            />
                            <TouchableOpacity onPress={this.toggleShowPassword} style={ [ styles.userfieldIcon ] }>
                                <View>
                                    <Ionicons name='md-eye' style={{ color: 'white' }} size={25} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Divider color="white" />
                        <View style={styles.userfield}>
                            <TextInput
                                style={styles.userfieldInput}
                                onChangeText={(retypePassword) => { this.setState({retypePassword}) }}
                                value={this.state.retypePassword}
                                underlineColorAndroid={'transparent'}
                                placeholder={Localize.t('PASSWORD.RESET.retype')}
                                placeholderTextColor='white'
                            />
                        </View>
                        <View style={{ marginBottom: 40, marginTop: 20 }}>
                            <ButtonPrimary 
                                title = 'Submit'
                                icon = "ios-arrow-round-forward-outline"
                                onClick = { () => { this.resetPasswordTapped();  } }                                
                            />                            
                        </View>
                    </View>
                </View>
                <MessageBox source="Reset Password" visible={this.state.showSuccessBox} title = 'Reset Password Success!' description = 'We have sent you a new temporary password on your registered mobile number / email'
                 buttonText = 'Login Now' handler = {this.handleMessageBoxTap}/>
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
        flex: 0.5
    },
    loginContainer: {
        paddingHorizontal: 30,
        flex: 1
    },
    topContainer: {
        flex:0.2,
    },
    userfield: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
    userfieldIcon: {
        flex: 0.1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center'
    },
    forgotPasswordText: {
        color: 'white',
        fontFamily: 'sky-text-bold',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 27,
        letterSpacing: 0,
        backgroundColor: 'transparent',
        marginLeft: 5
    }
});

const mapStateToProps = (state) => ({
    resetPasswordFlag: state.resetPasswordAPIData.flag
});

const mapDispatchToProps = (dispatch) => ({
    showAlert: (msg,title = '') => dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: msg, alertTitle:title }),
    postResetPassword: (payload) => dispatch(postResetPassword(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordScreen);