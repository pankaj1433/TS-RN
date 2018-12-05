import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TextInput, TouchableOpacity, Image, Platform, TouchableWithoutFeedback} from 'react-native';
import { LinearGradient, Constants } from 'expo';
import { connect } from 'react-redux';
import {Feather} from '@expo/vector-icons';
// import firebase from 'react-native-firebase';

import Localize from '../config/i18n/Localize';
import HeaderWithBackScreen from './../components/UI/HeaderWithBackScreen'
import GenericScreenBackground from './../components/UI/GenericScreenBackground'
import HeaderWithBack from './../components/layout/HeaderWithBack';
import Card from '../components/UI/Card';
import { getCreateRequestList } from './../actions/CreateRequestListAction';
import config from '../config/config';
import ButtonPrimary from './../components/UI/ButtonPrimary';
import MessageBox from './../components/modal/MessageBox';
import { postRequestOrComplaint, getRequestOrComplaintSubtypes } from './../actions/CreateRequestOrComplaintAction';
import { showLoader, hideLoader } from './../actions/Loader';
import { getSupportApi } from './../actions/supportAction';
// import TrackMixpanel from './../utils/TrackMixpanel';


var subTypeArray = []
var title = ''
var requestOrComplaintKey = ''
var serviceTypeListWidth = 0
var serviceTypeListY = 0
// var category = ''
// var subTypeKey = ''
// var descriptionText = ''
const cardMargin = 12
var successMessage = ''

class CreateRequestOrComplaintScreen extends Component {

    constructor (props) {
        super(props);        
        this.state = {
            selectedTile: 'Mobile',
            showServiceTypeList: false,
            selectedServiceType: '',
            showSuccessBox: false,
            descriptionText:'',
            category:props.navigation.state.params.category,
            subTypeKey:''

        }    
        // this.descriptionText = ''
        // this.category = ''
        // this.subTypeKey = ''        
    }

    componentWillMount () { 
        // firebase.analytics().setCurrentScreen('CreateRequestOrComplaint');
        title = this.props.navigation.state.params.title
        requestOrComplaintKey = this.props.navigation.state.params.titleKey
        // this.category = this.props.navigation.state.params.category
        this.props.getSubtypes(requestOrComplaintKey)
    }

    toggleTileSelection (selection) {
        if ((selection === 'Mobile' && this.state.selectedTile === 'Mobile') || (selection === 'Email' && this.state.selectedTile === 'Email')) {
            return
        }
        // TrackMixpanel.trackWithProperties('CreateService',{ action: 'Communication preference selected', requestType: title, selectedItem: selection });
        (this.state.selectedTile === 'Mobile') ? this.setState({selectedTile: 'Email'}) :
        this.setState({selectedTile: 'Mobile'});
    }

    handleServiceTypeTap () {        
        this.setState({showServiceTypeList: this.state.showServiceTypeList === true ? false : true})
    }

    backButtonPressed = () => {
        this.props.navigation.goBack()
    }

    submitButtonTapped = () => {        
        this.generateRequestOrComplaint()
    }

    generateRequestOrComplaint = () => {
        if (this.validateFields() === false) {
            return
        }
        // TrackMixpanel.trackWithProperties('CreateService',{ action: 'Generate', communicationPreference: this.state.selectedTile, requestType: title, requestSubType: this.state.selectedServiceType, serviceDescription:this.state.descriptionText});
        let payload = {
            communicationPreference: this.state.selectedTile.toLowerCase(),
            category: this.state.category,
            type: requestOrComplaintKey,
            subType: this.state.subTypeKey,
            description: this.state.descriptionText
        }
        //firebase custom Complaint and service request events
        if(payload.category === 'COMP'){
            // firebase.analytics().logEvent('Complaint');
        }else {
            // firebase.analytics().logEvent('ServiceRequest');
        }
       
        this.props.generateRequestOrComplaint(payload)
    }

    validateFields = () => {
        if (this.state.subTypeKey.length === 0) {
            let validationAlertText = Localize.t('CREATE_REQUEST_OR_COMPLAINT.alert_choose_service_type')
            // let validationAlertText = "Please select the type of service"
            this.props.showAlert(validationAlertText)            
            return false    
        }
        return true
    }

    handleMessageBoxTap = () => {
        this.props.clearRequestOrComplaint()
        this.setState({showSuccessBox: false})
        this.props.getSupportData();
        this.props.navigation.popToTop();
    }

    handleRowItemTapped = (key, rowTitle) => {    
        // TrackMixpanel.trackWithProperties('CreateService',{ action: 'Type of service selected',requestType: title, selectedItem: rowTitle });
        this.setState({selectedServiceType: rowTitle, showServiceTypeList: false, subTypeKey: key})
    }

    serviceTypeViewDidlayout = (event) => {
        let {x, y, height, width} = event.nativeEvent.layout

        serviceTypeListY = y + height
        serviceTypeListWidth = width        
    }

    setDescriptionText = (description) => {
        this.setState({
            descriptionText:description
        })
        // this.descriptionText = description
    }

    renderServiceTypeList = () => {
        let cardTopMargin = serviceTypeListY + cardMargin
        let cardRightLeftValue = (Dimensions.get('window').width-serviceTypeListWidth)/2

        return (
            (this.state.showServiceTypeList === true) ?            
                <Card style={[styles.flatlistWrapper, {width: serviceTypeListWidth, top: cardTopMargin, right: cardRightLeftValue, left: cardRightLeftValue}]}>
                    <FlatList showsVerticalScrollIndicator = {false} contentContainerStyle = {{flexDirection: 'column', alignItems: 'center'}} numColumns = {1}
                        data = {subTypeArray}
                        renderItem = { data =>
                            <View style = {[styles.listDataItem, {width: serviceTypeListWidth}]}>                            
                                <TouchableOpacity style = {{flex: 1, justifyContent: 'center'}} onPress = {(key, title) => {this.handleRowItemTapped(data.item.key, data.item.title)}}>
                                    <Text style = {styles.listItemText}>{data.item.title}</Text>                                    
                                </TouchableOpacity>
                                <View style={styles.listSeparator} />
                            </View>
                        }
                    />
                </Card>
            : null
        );
    }

    renderTiles = () => {
        return(
            <View style={{flexDirection:'row'}}>
                {
                    (this.state.selectedTile === 'Mobile')?
                    <Card style={styles.commPreferenceCard}>
                        <TouchableOpacity onPress={()=>this.toggleTileSelection('Mobile')} style={styles.tilesView}>
                            <Image style={{marginBottom:12}} source={require('./../assets/img/icMobileActive/icMobileActive.png')}/>
                            <Text style = {styles.preferredCardText}>{Localize.t('CREATE_REQUEST_OR_COMPLAINT.mobile')}</Text>
                            {/* <Text style = {styles.preferredCardText}>Mobile</Text> */}
                        </TouchableOpacity>
                    </Card>:
                    <Card style={styles.commPreferenceCardDisabled}>
                        <TouchableOpacity onPress={()=>this.toggleTileSelection('Mobile')} style={styles.tilesView}>
                            <Image style={{marginBottom:12}} source={require('./../assets/img/icMobileDeactive/icMobileDeactive.png')}/>
                            <Text style={styles.preferredCardTextDisabled}>{Localize.t('CREATE_REQUEST_OR_COMPLAINT.mobile')}</Text>
                            {/* <Text style={styles.preferredCardTextDisabled}>Mobile</Text> */}
                        </TouchableOpacity>
                    </Card>
                }
                {
                    (this.state.selectedTile === 'Email')?
                    <Card style={styles.commPreferenceCard}>
                        <TouchableOpacity onPress={()=>this.toggleTileSelection('Email')} style={styles.tilesView}>
                            <Image style={{marginBottom:12}} source={require('./../assets/img/icEmailActive/icEmailActive.png')}/>
                            <Text style = {styles.preferredCardText}>{Localize.t('CREATE_REQUEST_OR_COMPLAINT.email')}</Text>                            
                            {/* <Text style = {styles.preferredCardText}>Email</Text> */}
                        </TouchableOpacity>
                    </Card>:
                    <Card style={styles.commPreferenceCardDisabled}>
                        <TouchableOpacity onPress={()=>this.toggleTileSelection('Email')} style={styles.tilesView}>
                            <Image style={{marginBottom:12}} source={require('./../assets/img/icEmailDeactive/icEmailDeactive.png')}/>
                            <Text style={styles.preferredCardTextDisabled}>{Localize.t('CREATE_REQUEST_OR_COMPLAINT.email')}</Text>
                            {/* <Text style={styles.preferredCardTextDisabled}>Email</Text> */}
                        </TouchableOpacity>
                    </Card>
                }
            </View>
        );
    }


    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.apiResponse).length > 0) {            
            if (nextProps.apiResponse.status === 1) {                
                successMessage = nextProps.apiResponse.message
                this.setState({showSuccessBox: true});                
            }
        }

        if (Object.keys(nextProps.subtypesData).length > 0) {
            subTypeArray = []            
            let allKeys = Object.keys(nextProps.subtypesData)
            if (allKeys.length > 0) {
                allKeys.map((val) => {
                    subTypeArray.push({title: nextProps.subtypesData[val], key: val})
                });
            }

            this.setState({selectedTile: 'Mobile'})
        }
    }

    handleEditableClose() {
        this.setState({showServiceTypeList:false})
    }

    renderView() {
        if (subTypeArray.length > 0) {
            return (
                <TouchableWithoutFeedback onPress = {()=>this.handleEditableClose()}>
                    <View style={{flex: 1}}>
                        <Card style = {styles.card}>
                            <View>
                                <Text style = {styles.cardHeading}>{Localize.t('CREATE_REQUEST_OR_COMPLAINT.comm_preference')}</Text>
                                {/* <Text style = {styles.cardHeading}>Communication Preference</Text> */}
                                <View style = {styles.preferenceSuperView}>
                                    {this.renderTiles()}
                                </View>
                            </View>



                            <View style = {{marginTop: 25}} onLayout = {this.serviceTypeViewDidlayout}>
                                <Text style = {styles.cardHeading}>{Localize.t('CREATE_REQUEST_OR_COMPLAINT.service_type')}</Text>
                                {/* <Text style = {styles.cardHeading}>Type of Service</Text> */}
                                <View style = {{marginTop: 5}}>                            
                                    <TouchableOpacity onPress={()=>this.handleServiceTypeTap()} style={{flexDirection: 'row', justifyContent:'space-between', position: 'relative'}}>
                                        <Text>{this.state.selectedServiceType}</Text>
                                        <Feather name='chevron-down' size={15} color='#5087c7'/>                                
                                    </TouchableOpacity>
                                    <View style = {{marginTop: 10}}><View style = {styles.bottomSeparator} /></View>
                                </View>
                            </View>



                            <View style = {{marginTop: 25, zIndex: -1}}>
                                <Text style = {styles.cardHeading}>{Localize.t('CREATE_REQUEST_OR_COMPLAINT.description')}</Text>
                                {/* <Text style = {styles.cardHeading}>Description</Text> */}
                                <View style = {{marginTop: 5}}>
                                    <TextInput
                                        style={[styles.userfieldInput]}
                                        underlineColorAndroid={'transparent'}
                                        onChangeText={(description) => { this.setDescriptionText(description) }}                                
                                        placeholder={ Localize.t('CREATE_REQUEST_OR_COMPLAINT.description') }
                                        // placeholder="Description"
                                        placeholderTextColor='gray'
                                        returnKeyType='default'
                                    />                            
                                </View>
                                <View style = {[styles.shadow,{marginTop: 10}]}><View style = {[styles.bottomSeparator, {backgroundColor: '#3782be'}]} /></View>
                            </View>



                            <View style = {{marginTop: 25, zIndex: -1}}>
                                <ButtonPrimary                         
                                    title = { Localize.t('CREATE_REQUEST_OR_COMPLAINT.submit_btn_title') }  
                                    // title = "Generate"                      
                                    onClick = { () => this.submitButtonTapped() } scheme = 'dark'
                                    disabled = { !this.state.descriptionText || !this.state.selectedServiceType }
                                />
                            </View>                                                

                        </Card>
                        <MessageBox source="Create Service" hasOverlayBackground = {true} visible={this.state.showSuccessBox} title = {successMessage} description = ''
                            buttonText = { Localize.t('CREATE_REQUEST_OR_COMPLAINT.ok') } handler = {this.handleMessageBoxTap}/>
                        

                        {this.renderServiceTypeList()}
                    </View>
                </TouchableWithoutFeedback>
            );            
        } else {
            <Text/>
        }
    }

    render () {
        return (
            <HeaderWithBackScreen title={title} goBack={ this.backButtonPressed }>                
                {this.renderView()}
            </HeaderWithBackScreen>            
        );
    }    
}

const styles = StyleSheet.create({
    card: {
        margin: cardMargin, 
        padding: 25.0, 
        paddingBottom: 20.0
    }, 
    cardHeading: {
        fontFamily: 'sky-text-regular', 
        fontSize: 13.3,         
        color: '#8b8b8b',        
    },
    bottomSeparator: {        
        height: 1,
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: config.UI.dividerGrey        
    },
    preferenceSuperView: {
        marginTop: 12,        
        flexDirection: 'row', 
        justifyContent: 'space-between'        
    },
    userfieldInput: {        
        color: '#3782be',
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,        
    },
    shadow: {
        backgroundColor: 'transparent', 
        borderWidth: 0.5,        
        borderColor: '#3782be', 
        borderRadius: 3.3,          
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: '#6a73ce',
        shadowOpacity: 0.41, 
        elevation: 4
    },
    flatlistWrapper: {
        borderWidth: Platform.OS === 'ios' ? 0.0 : 0.5,
        borderColor: Platform.OS === 'ios' ? 'transparent' : 'gray',
        paddingHorizontal:15,                        
        paddingVertical: 0,
        flexShrink: 1,
        margin: 0, 
        zIndex: 9999, 
        position: 'absolute',         
    },
    commPreferenceCard: {
        overflow:'hidden', 
        padding:0,
        marginRight:12,
        borderColor: 'rgb(213,229,241)', 
        shadowColor: 'rgb(228,242,253)' 
    },
    commPreferenceCardDisabled: {        
        overflow:'hidden', 
        padding:0,
        backgroundColor:'rgb(247,247,247)',
        marginRight:12,
        borderColor: 'rgb(238,235,235)', 
        shadowColor: 'rgb(228,242,253)' 
    },
    preferredCardText: {
        color: 'rgb(66,66,66)', 
        fontFamily: 'sky-text-regular', 
        fontSize: 12,         
    },
    preferredCardTextDisabled: {
        color:'rgb(193,193,193)', 
        fontFamily: 'sky-text-regular', 
        fontSize: 12,         
    },
    listItemText: {
        color: '#3282be',
        fontFamily: 'sky-text-medium',
        fontSize: 15.3,        
        paddingHorizontal: 10,
        alignSelf: 'center'
    },
    listSeparator: {
        backgroundColor: '#e5e5e5', 
        height: 1, 
        position: 'absolute', 
        bottom: 0, 
        left:0, 
        right:0,
    },
    tilesView: {
        paddingVertical:12.3 , 
        width:68.3,
        alignItems:'center',
        justifyContent:'space-between' 
    },
    listDataItem: {
        minHeight: 40.0,         
        justifyContent: 'center',        
    }
});

const mapDispatchToProps = (dispatch) => ({
    getSubtypes: (reqOrCompType) => dispatch(getRequestOrComplaintSubtypes(reqOrCompType)),
    generateRequestOrComplaint: (payload) => dispatch(postRequestOrComplaint(payload)), 
    clearRequestOrComplaint : () => dispatch({type: 'CLEAR_CREATE_REQUEST_OR_COMPLAINT'}),
    showAlert: (message, title, type) => dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: message, alertType: type, alertTitle: title }),
    getSupportData: () => dispatch(getSupportApi())
});
const mapStateToProps = (state) => ({
    apiResponse: state.createRequestOrComplaintAPIData.data,
    subtypesData: state.createRequestOrComplaintAPIData.subtypesData
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRequestOrComplaintScreen);