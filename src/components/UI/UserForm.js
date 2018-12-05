import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableHighlight, TouchableOpacity, Alert, Platform } from 'react-native';
import { Location, Permissions } from 'expo';
import { Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';

import PrimaryButton from './ButtonPrimary';
import Localize from './../../config/i18n/Localize';
import config from './../../config/config';
import { Validation } from '../../utils/Validations';

class UserFormScreen extends Component {

    constructor () {
        super();
        this.state = {
            // name: this.props.userDataDetail.name,
            name:'',
            mobile: '',
        };
    };

    submit = () => {
        if(!Validation.isMobileNumber(this.state.mobile)) {
            this.props.showAlert('warn', Localize.t('REFER_FRIEND.invalid_mobile'));
        }else{
            this.props.onSubmitUserDetails(this.state.name,this.state.mobile);
        }
    };

    _validateForm = () => {
        let validState = true;
        
        return validState;
    };

    render () {
        return (
            
                <View style={styles.container}>
                    <View style={styles.loginContainer}>
                    <View style={{  paddingHorizontal: 10, paddingVertical:20}}>
                        <View style={{}}>
                            
                        </View>
                        <View>
                            <Text style={[styles.pinkHeading,{lineHeight: 14.7}]}>{Localize.t('REFER_FRIEND.yourName')}</Text>
                            <View style={{paddingVertical: 10, flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row', borderBottomColor: '#3583BF', borderBottomWidth: 1.3,justifyContent:'center',alignItems:'center' ,paddingBottom:10}}>
                                    <TextInput
                                        accessible={true}
                                        accessibilityLabel="name"
                                        onChangeText={(name) => { this.setState({name}) }}
                                        value={this.state.name}
                                        underlineColorAndroid={'transparent'}
                                        style={{flex:1,lineHeight:17.7,paddingHorizontal: 5, fontSize: 15, fontWeight: '700', }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <Text style={[styles.pinkHeading,{lineHeight: 14.7}]}>{Localize.t('REFER_FRIEND.yourMobile')}</Text>
                            <View style={{paddingVertical: 10, flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row', borderBottomColor: '#3583BF', borderBottomWidth: 1.3,justifyContent:'center',alignItems:'center' ,paddingBottom:10}}>
                                    <TextInput
                                        accessible={true}
                                        accessibilityLabel="mobile"
                                        onChangeText={(mobile) => { this.setState({mobile}) }}
                                        value={this.state.mobile}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        underlineColorAndroid={'transparent'}
                                        style={{flex:1,lineHeight:17.7,paddingHorizontal: 5, fontSize: 15, fontWeight: '700', }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                                
                            <Text>{Localize.t('REFER_FRIEND.sub_text')} <Text style={styles.boldText}>₹ 300 </Text>cashback </Text>
                            <View style={{ marginBottom: 40, marginTop: 20 }}>
                                <PrimaryButton 
                                    disabled={!this.state.name || !this.state.mobile}
                                    accessible={true}
                                    accessibilityLabel="submitButton"
                                    onClick = {()=> this.submit()}
                                    title={Localize.t('REFER_FRIEND.submit')}
                                    scheme="dark"
                                    from="lslsls"
                                />
                            </View>
                    </View>
                </View>
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
    boldText:{
        color: '#ff2b30',
        fontFamily:'sky-text-medium',
        fontSize:16
    },
    userfieldInput: {
        flex: 1,
        color: 'black',
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
    userDataDetail: state.homeAPIData.userDataDetail
});

const mapDispatchToProps = (dispatch) => ({
    // postNewConnection: (payload) => dispatch(postNewConnection(payload)),
    // showAlert: (message) => { dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: message }) }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserFormScreen);