import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableHighlight, TouchableOpacity, Alert, Platform } from 'react-native';
import { Location, Permissions } from 'expo';
import { Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';

import ButtonPrimary from './../components/UI/ButtonPrimary';
import MainScreenBackground from './../components/UI/MainScreenBackground';

import MessageModal from './../components/modal/MessageBox';
import Localize from './../config/i18n/Localize';

import { postNewConnection } from './../actions/newConnectionAction';

// import TrackMixpanel from './../utils/TrackMixpanel';

class NewConnectionScreen extends Component {

    constructor () {
        super();
        this.state = {
            name: '',
            mobile: '',
            pincode: '',
            formError: [],
            showMessage: false,
            messageType: '',
            message: {
                title: '',
                desc: ''
            }
        };
        this.alertReference;
    };


    _getLocationAsync = async () => {
        try {
            console.log('get location')
            let { status } = await Permissions.getAsync(Permissions.LOCATION);
            if (status === 'undetermined') {
                return {}
            }
            else {
                let { status } = await Permissions.askAsync(Permissions.LOCATION);
                console.log('status', status)
                if (status !== 'granted') {
                    console.log('status', status)
                    this.setState({
                        errorMessage: 'Permission to access location was denied',
                    });
                    return {};
                }
                let location = await Location.getCurrentPositionAsync({});
                this.setState({ location });
                console.log('location', {location})
                return location;
            }
        }
        catch (e) {
            console.log('Error fetching Location');
            return {};
        }
      };

    submit = () => {
        // TrackMixpanel.track('New Connection Clicked')
        this.setState({formError: []}, () =>{
            let formValid = this._validateForm();
            if (formValid) {
                this._getLocationAsync()
                    .then(location => {
                        console.log('location', location);
                        let coordinates = {};
                        if(location.coords) {
                            coordinates.latitude = location.coords.latitude;
                            coordinates.longitude = location.coords.longitude;
                        }
                        this.props.postNewConnection({name: this.state.name, mobileNumber: this.state.mobile, pinCode: this.state.pincode, coordinates})
                    });

            }
            else {
                return false;
            }
        });
    };

    backToLogin = () => {
        this.setState({ showMessage: false }, () => {
            this.props.navigation.goBack();
        });
    };

    handleApiResponse = (data) => {
        if(data.status && data.status === 1) {
            if (data.data) {
                this.setState({ 
                    messageType: 'success',
                    showMessage: true, 
                    message: { 
                        title: data.data.primaryMessage, 
                        desc: data.data.secondaryMessage 
                    } 
                });
            }
            console.log(data);
        }
        else {

        }
    };

    componentWillReceiveProps (nextProps) {
        if (Object.keys(nextProps.newConnectionApiResponse).length > 0) {
            console.log(nextProps.newConnectionApiResponse)
            this.handleApiResponse(nextProps.newConnectionApiResponse);
        }
    };

    _validateForm = () => {
        let validState = true;
        let formError = [];
        if (this.state.name === '' || this.state.mobile === '' || this.state.pincode === '') {
            formError.push(Localize.t('NEW_CONNECTION.form_error.field_required'));
            validState = false;
        }
        if (this.state.mobile.length < 10 && this.state.mobile.length > 0) {
            formError.push(Localize.t('NEW_CONNECTION.form_error.mobile_length'));
            validState = false;
        }
        this.setState({ formError });
        if (formError.length > 0) {
            this.props.showAlert(formError.join("\n"));
        }
        return validState;
    };

    render () {
        return (
            <MainScreenBackground gifType="tv">
                <MessageModal 
                    source="New Connection"
                    type={ this.state.messageType } 
                    visible={ this.state.showMessage } 
                    title={ this.state.message.title } 
                    description={ this.state.message.desc } 
                    handler = { () => { this.backToLogin() } } 
                    buttonText={ Localize.t('NEW_CONNECTION.back_to_login') } 
                
                />
                <View style={styles.container}>
                    <View style={{paddingHorizontal: 10, paddingVertical: 20,marginTop:10}}>
                        <View>
                            <TouchableHighlight onPress={ () => this.props.navigation.goBack() } underlayColor='transparent' >
                                <Feather style={{color: 'white'}} name='arrow-left' size={ 24 } />
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={ styles.logoContainer }>
                        <Image 
                            style={{height: 40}}
                            source={ require('./../assets/img/logo_sky.png') }
                            resizeMode='contain'
                        />
                    </View>
                    <View>
                        <View style={ styles.formTextContainer }>
                            <Text style={ styles.formText }>{ Localize.t('NEW_CONNECTION.connection_form_message') }</Text>
                        </View>
                        <View style={styles.loginContainer}>
                            <View style={styles.userfield}>
                                <TextInput
                                    style={styles.userfieldInput}
                                    onChangeText={(name) => { this.setState({name}) }}
                                    value={this.state.name}
                                    underlineColorAndroid={'transparent'}
                                    placeholder={ Localize.t('NEW_CONNECTION.full_name') }
                                    placeholderTextColor='white'
                                    maxLength={ 50 }
                                    returnKeyType='next'
                                    onSubmitEditing={ (e) => { this.refs.mobileField.focus() } }
                                />
                            </View>
                            <View style={styles.userfield}>
                                <TextInput
                                    ref='mobileField'
                                    style={styles.userfieldInput}
                                    onChangeText={(mobile) => { this.setState({mobile}) }}
                                    value={this.state.mobile}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType='numeric'
                                    placeholder={ Localize.t('NEW_CONNECTION.mobile_no') }
                                    placeholderTextColor='#fff'
                                    maxLength={10}
                                    returnKeyType='done'
                                    onSubmitEditing={ (e) => { this.refs.pincodeField.focus() } }
                                />
                            </View>
                            <View style={styles.userfield}>
                                <TextInput
                                    ref='pincodeField'
                                    style={[styles.userfieldInput, { borderBottomWidth: 0 }]}
                                    onChangeText={(pincode) => { this.setState({pincode}) }}
                                    value={this.state.pincode}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType='numeric'
                                    placeholder={ Localize.t('NEW_CONNECTION.pin_code') }
                                    placeholderTextColor='#fff'
                                    maxLength={6}
                                    returnKeyType='done'
                                    onSubmitEditing={ () => { this.submit() } }
                                />
                            </View>
                            <View style={{ marginBottom: 40, marginTop: 20 }}>
                                <ButtonPrimary 
                                    title = { Localize.t('NEW_CONNECTION.send_details') }
                                    onClick = { () => { this.submit() } }
                                    scheme = "light"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </MainScreenBackground>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoContainer: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    formTextContainer: {
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: 'transparent',
        marginVertical: 20
    },
    formText: {
        fontFamily: "sky-text-regular",
        fontSize: 18.7,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 23.3,
        letterSpacing: 0,
        textAlign: "center",
        color: "#ffffff",
        paddingHorizontal: 60
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
        flex: 0.1
    },
    userfieldInput: {
        flex: 1,
        color: 'white',
        fontFamily: 'sky-text-regular',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        lineHeight: 27,
        letterSpacing: 0,
        height: 70,
        borderBottomColor: 'white',
        borderBottomWidth: 1
    },
    loginBtn: {
        flex: 0.9,
        alignItems: 'center',
        marginTop: 30
    },
    errorMessage: {
        color: 'red',
        backgroundColor: 'transparent',
        fontSize: 15,
        fontFamily: 'sky-text-regular',
        fontWeight: 'normal'
    }
});

const mapStateToProps = (state) => ({
    newConnectionApiResponse: state.newConnectionApiResponse.data
});

const mapDispatchToProps = (dispatch) => ({
    postNewConnection: (payload) => dispatch(postNewConnection(payload)),
    showAlert: (message) => { dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: message }) }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewConnectionScreen);