import React, {Component} from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableHighlight, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Feather } from '@expo/vector-icons';

import MainScreenBackground from './../components/UI/MainScreenBackground';
import Divider from './../components/UI/Divider';
import ButtonPrimary from './../components/UI/ButtonPrimary';
import MessageBox from './../components/modal/MessageBox';
import AlertBox from './../components/Alert';
import Localize from './../config/i18n/Localize';
import {forgotPassword} from './../actions/ForgotPassword';
import Loader from './../components/Loader';
import { showLoader } from './../actions/Loader'
import { Validation } from './../utils/Validations';
import config from './../config/config';

var {width, height} = Dimensions.get('window')

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            mobileNumber: '',
            showSuccessBox: false
        };
    }

    componentWillReceiveProps (nextProps) {
        if (Object.keys(nextProps.forgetPasswordResponse).length > 0 ) {
            this.setState({ showSuccessBox: true });
        }
    }

    resetPasswordTapped = () => {
        let { validState, loginType } = this.validateUserInput(this.state.mobileNumber);
        if ( validState ) {
            let payload = {
                username: this.state.mobileNumber,
                loginType
            };
            this.props.forgotPassword(payload);
        }
    };

    handleMessageBoxTap = () => {
        this.props.resetforgotPasswordState()
        this.setState({showSuccessBox: false}, () => {
            this.props.navigation.goBack(); // go back to login
        })                
    }

    validateUserInput = (userInput) => {
        if (userInput.length == 0) {
            this.props.showAlert(Localize.t('PASSWORD.FORGOT.VALIDATION.blank')+"\n"+Localize.t('PASSWORD.FORGOT.VALIDATION.valid'))
            return { validState: false };
        }
        if (userInput.length < 6) {
            this.props.showAlert(Localize.t('PASSWORD.FORGOT.VALIDATION.min_six'))
            return { validState: false };
        }
        let loginType;
        if ( Validation.isMobileNumber(userInput) ) {
            loginType = config.loginTypes.mobile;
        }
        else if ( Validation.isAlphaNumeric(userInput) === true ) {
            loginType = config.loginTypes.customer_id;
        }
        else {
            this.props.showAlert(Localize.t('PASSWORD.FORGOT.VALIDATION.valid'));
            return { validState: false };
        }
        console.log(loginType, 'loginType Here');
        return { validState: true, loginType };
    }

    render() {
        return (
            <MainScreenBackground gifType="tv">
                <AlertBox />
                <View style={styles.container}>
                    <View style={{paddingHorizontal: 10, paddingVertical: 20,marginTop:10}}>
                        <View>
                            <TouchableHighlight onPress={ () => { this.props.navigation.goBack() } } underlayColor='transparent' >
                                <Feather style={{color: 'white'}} name='arrow-left' size={ 24 } />
                            </TouchableHighlight>
                        </View>
                    </View>
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
                            <Text style = {styles.forgotPasswordText}> {Localize.t('PASSWORD.FORGOT.forgot')} </Text>
                        </View>
                    </View>
                    <View style={styles.loginContainer}>
                        <View style={styles.userfield}>
                            <TextInput
                                style={styles.userfieldInput}
                                onChangeText={(mobileNumber) => { this.setState({mobileNumber}) }}
                                value={this.state.mobileNumber}
                                underlineColorAndroid={'transparent'}
                                placeholder={Localize.t('LOGIN.cust_id_mob_num')}
                                placeholderTextColor='white'
                                returnKeyType='done'
                                onSubmitEditing={() => { this.resetPasswordTapped();  }}
                            />
                        </View>
                        <Divider color="white" />
                        <View style={{ marginBottom: 40, marginTop: 20 }}>
                            <ButtonPrimary 
                                title = {Localize.t('PASSWORD.FORGOT.reset_pswd')}
                                icon = "ios-arrow-round-forward-outline"
                                onClick = { () => { this.resetPasswordTapped();  } }                                
                            />                            
                        </View>
                    </View>
                    <MessageBox
                        visible={this.state.showSuccessBox} 
                        title = {Localize.t('PASSWORD.FORGOT.reset_success')} 
                        description = {Localize.t('PASSWORD.FORGOT.reset_success_message')}
                        buttonText = {Localize.t('PASSWORD.FORGOT.login_now')} 
                        handler = {this.handleMessageBoxTap}
                        source = "Forgot Password"
                    />   
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
        letterSpacing: 0,
        height: 70
    },
    forgotPasswordText: {
        color: 'white',
        fontFamily: 'sky-text-bold',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        backgroundColor: 'transparent',
        marginLeft: 5
    }
});

function mapStateToProps (state) {
    return {
        forgetPasswordResponse: state.login.forgotResponse
    }
}

const mapDispatchToProps = (dispatch) => ({
    forgotPassword: (payload) => dispatch(forgotPassword(payload)),
    resetforgotPasswordState: (data = {}) => dispatch({type: 'FORGOT_PASS', data}),
    showAlert: (msg) => dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: msg }),
    showLoader: () => dispatch(showLoader()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);