import React, { Component } from 'react';
import { View, ActivityIndicator, Text, StyleSheet,ScrollView,Dimensions, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';
// import firebase from 'react-native-firebase';

import GenericScreenBackground from './../components/UI/GenericScreenBackground';
import HeaderTransparent from './../components/layout/HeaderTransparent';
import EditableField from './../components/UI/EditableField';
import Divider from './../components/UI/Divider';
import Card from './../components/UI/Card';
import Alert from '../components/Alert';
import ProfileLoader from '../components/CardLoaders/ProfileLoader';

import Localize from './../config/i18n/Localize';
import config from './../config/config';

import { updateCustomerProfile } from '../actions/profileAction';
import { getCustomerProfile } from './../actions/profileAction';
import { showLoader, hideLoader} from './../actions/Loader';
import { logout } from './../actions/login';

// import TrackMixpanel from '../utils/TrackMixpanel';
import { Validation } from '../utils/Validations';
import { camelCase } from './../utils/Filters';

import index from '../store/index';

const window = Dimensions.get('window');

class ProfileScreen extends Component {

    constructor(){
        super();
        this.state = {
            pageRefreshing: false,
            edit: [false,false,false,false],
            isupdating: [false,false,false,false],
            'Email': '',
            'Alternate Number': '',
            'Landline': '',
            'Mobile': ''
        }
        this.isEditable = ['Email','Alternate Number','Landline','Mobile'];
        this.isMobile = ['Alternate Number','Mobile'];
    }

    componentWillMount () {
        // firebase.analytics().setCurrentScreen('Profile');
        this.props.getProfileData();
    }

    componentWillReceiveProps(nextProps) {
        if ( this.props.APIFlag !== nextProps.APIFlag && nextProps.APIFlag === true ) {
            this.setState({pageRefreshing: false})
        }
        if (nextProps.profileData !== '') {
                let {
                    mobile,
                    email,
                    alternateNumber,
                    landline,
                } = nextProps.profileData;
                this.setState ( {
                    'Email': email,
                    'Alternate Number': alternateNumber,
                    'Landline': landline,
                    'Mobile': mobile,
                    isupdating: [false,false,false,false]
                })
        }
    }

    track (type,label) {
        // TrackMixpanel.trackWithProperties('ProfileClick',{ action: 'Edit profile', editType: type, editField: label });
    }

    fontStyle (Fcolor,Fsize,Fweight='normal',Ffamily='sky-text-regular') {
        return {
            color: Fcolor,
            fontSize: Fsize,
            fontFamily: Ffamily
        }
    }

    handelEditableClose() {
        //track editing canceled
        if (this.state.edit[0])   
            this.track('cancel','Mobile');
        else if (this.state.edit[1])   
            this.track('cancel','Email');
        else if (this.state.edit[2])   
            this.track('cancel','Alternate Number');
        else if (this.state.edit[3])   
            this.track('cancel','Landline');

        if (!this.state.isupdating[0] && !this.state.isupdating[1] && !this.state.isupdating[2] && !this.state.isupdating[3]) {
            if(this.props.profileData) {
                let {
                    mobile,
                    email,
                    alternateNumber,
                    landline,
                } = this.props.profileData;
                this.setState({
                    edit: [false,false,false,false],
                    'Email': email,
                    'Alternate Number': alternateNumber,
                    'Landline': landline,
                    'Mobile': mobile
                })
            }
            else {
                edit: [false,false,false,false]
            }
        }
    }
    
    editHandler = (index) => {
        //track editing started
        switch(index) {
            case 0:     this.track('editing','Mobile');  break;
            case 1:     this.track('editing','Email');  break;
            case 2:     this.track('editing','Alternate Number');  break;
            case 3:     this.track('editing','Landline');  break;
            default:    break;
        }
        let temp = [false,false,false,false];
        temp[index] = true;
        this.setState({edit : temp})
    }

    logoutHandler = () => {
        this.props.logout();
    }

    onRefresh = () => {
        // TrackMixpanel.trackWithProperties('PullToRefresh',{refreshedScreen: 'Profile Screen'});
        this.setState({ pageRefreshing: true }, () => {
            this.props.getProfileData({});
        });
    };
    
    editSubmit = (label,index) => {
        if(this.props.profileData) {
            let {mobile, email, alternateNumber, landline } = this.props.profileData;
            let updating = [false,false,false,false];
            updating[index] = true;
            //track editing submit
            this.track('submit',label);
            if(this.validateData(label)) {
                this.setState({
                    edit: [false,false,false,false],
                    isupdating: updating,
                },()=>{
                        val = this.state[label].trim();
                        switch(label){
                            case 'Email': {
                                if(this.state[label] != email)  {
                                    this.props.update ({email: val});
                                }
                                else {
                                    this.setState ( { isupdating: [false,false,false,false] }) 
                                }
                            }
                            break;
                            case 'Mobile':{
                                if(this.state[label] != mobile)  {
                                    this.props.update ({mobile: val});
                                }
                                else {
                                    this.setState ( { isupdating: [false,false,false,false] }) 
                                }
                            }
                            break;
                            case 'Alternate Number': {
                                if(this.state[label] != alternateNumber)  {
                                    this.props.update ({alternateNumber: val});
                                }
                                else {
                                    this.setState ( { isupdating: [false,false,false,false] }) 
                                }
                            }
                            break;
                            case 'Landline': {
                                if(this.state[label] != landline)  {
                                    this.props.update ({landline: val});
                                }
                                else {
                                    this.setState ( { isupdating: [false,false,false,false] }) 
                                }
                            }
                            break;
                            default:
                                break;
                        }
                })
            }
        }
    }

    validateData (label) {
            switch(label) {
                case 'Email': {
                    if(!Validation.isEmail(this.state[label])) {
                        this.props.showAlert('Invalid Email Address')
                        return false;
                    }
                }
                break;
                case 'Mobile':
                case 'Alternate Number': {
                    if(!Validation.isMobileNumber(this.state[label])) {
                        this.props.showAlert('Invalid Mobile Number')
                        return false;
                    }
                }
                break;
                case 'Landline': {
                    if(!Validation.isLandLine(this.state[label])) {
                        this.props.showAlert('Invalid Landline Number')
                        return false;
                    }
                }
                break;
                default:
                    return false;
            }
            return true;
    }

    editableField(label,data,index) {
        if (this.state.isupdating[index]) {
            let prefix = (this.isMobile.indexOf(label) > -1)?"+91 ":'';
            let value = (label === 'Landline') ? data.substr(0,3)+" "+data.substr(3,data.length) :data
            return (
                <View style={styles.profileItemContainer}>
                        <View>
                            <Text style={{ fontSize:14,color: '#8b8b8b',marginBottom: 6,fontFamily:'sky-text-regular'}}>{label}</Text>
                            <Text style={{minHeight:30,fontSize: 16,color: config.UI.ticketTextGrey,fontFamily:'sky-text-medium'}}>{prefix+value}</Text>
                        </View>
                        <View>
                            <ActivityIndicator/>
                        </View>
                </View>
            )
        }
        if((this.isEditable.indexOf(label) > -1)){
            let prefix = (this.isMobile.indexOf(label) > -1)?"+91 ":'';
            let value = (label === 'Landline') ? data.substr(0,3)+" "+data.substr(3,data.length) :data
            return(
                <TouchableOpacity onPress={()=>this.editHandler(index)} style={styles.profileItemContainer}>
                    <View>
                        <Text style={{ fontSize:14,color: '#8b8b8b',marginBottom: 6,fontFamily:'sky-text-regular'}}>{label}</Text>
                        <Text style={{minHeight:30,fontSize: 16,color: config.UI.ticketTextGrey,fontFamily:'sky-text-medium'}}>{prefix+value}</Text>
                    </View>
                    <View>
                        <Image source={require('./../assets/img/icEdit/icEdit.png')}/>
                    </View>
                </TouchableOpacity> 
            )
        }
        return(
            <View style={styles.profileItemContainer}>
                    <View>
                        <Text style={{ fontSize:14,color: '#8b8b8b',marginBottom: 6,fontFamily:'sky-text-regular'}}>{label}</Text>
                        <Text style={{minHeight:30,fontSize: 16,color: config.UI.ticketTextGrey,fontFamily:'sky-text-medium'}}>{data}</Text>
                    </View>
            </View>
        );     
    }

    inputField(label,index) {
        if((this.isMobile.indexOf(label) > -1)) {
            return (
            <View style={styles.prefixWithInput}>
            <View style={{justifyContent:'center',height: 30,borderBottomWidth: 1, borderColor: config.UI.textBlue}}>
                <Text style={styles.initialText}>+91</Text>
            </View>
                <TextInput
                    style={[styles.fieldInput,{width: window.width-130}]}
                    onChangeText={ (value)=>{this.setState({[label]: value})} }
                    value={this.state[label]}
                    maxLength = {10}
                    keyboardType='numeric'
                    returnKeyType='done'
                    underlineColorAndroid={'transparent'}
                    onSubmitEditing = {()=>this.editSubmit(label,index)}
                />
            </View>)
        }

        if(label === 'Landline') {
            return(
            <TextInput
                style={styles.fieldInput}
                onChangeText={ (value)=>{
                    this.setState({[label]: value})} 
                }
                value={this.state[label]}
                underlineColorAndroid={'transparent'}
                maxLength = {11}
                keyboardType='numeric'
                onSubmitEditing = {()=>this.editSubmit(label,index)}
            />);
        }
        return(
            <TextInput
                style={styles.fieldInput}
                onChangeText={ (value)=>{this.setState({[label]: value})} }
                value={this.state[label]}
                underlineColorAndroid={'transparent'}
                onSubmitEditing = {()=>this.editSubmit(label,index)}
            />
        )
    }

    RenderField (label,value,index) {
        let profileData = this.props.profileData
        let tempdata =  {
            'Email': profileData.email,
            'Alternate Number': profileData.alternateNumber,
            'Landline': profileData.landline,
            'Mobile': profileData.mobile
        };
        return (
            <View >
                {
                    (this.state.edit[index]) ?
                    <View style={styles.profileItemContainer}>
                        <View>
                            <Text style={{ fontSize:14,color: '#8b8b8b',marginBottom: 6,fontFamily:'sky-text-regular'}}>{label}</Text>
                            {this.inputField(label,index)}
                        </View>
                        {
                            (this.state[label] != tempdata[label])?
                            <TouchableOpacity onPress={()=>this.editSubmit(label,index)} style = {{backgroundColor:config.UI.profilePinkHeader,padding:1,borderRadius:3,overflow:'hidden'}}>
                                <Feather name="check" size={20} color="white" />
                            </TouchableOpacity>:
                            null
                        }
                    </View>
                    :
                    <View>
                        {this.editableField(label,value,index)}
                    </View>
                }
            </View>
        );
    }

    _renderProfileContent () {
            let userData = [];
            if (this.props.profileData !== '') {
                let {
                    name,
                    status,
                    customerId,
                    mobile,
                    email,
                    alternateNumber,
                    landline,
                    address, 
                    pincode,
                    city
                } = this.props.profileData;
                userData = [];
                userData = [
                    {'label': Localize.t('PROFILE.mobile'),'value':this.state.Mobile||''},
                    {'label': Localize.t('PROFILE.email'),'value':this.state.Email||''},
                    {'label': Localize.t('PROFILE.alt'),'value':this.state['Alternate Number']||''},
                    {'label': Localize.t('PROFILE.landline'),'value':this.state.Landline||''},
                    {'label': Localize.t('PROFILE.add'),'value':address||''},
                    {'label': Localize.t('PROFILE.pin'),'value':pincode||''},
                    {'label': Localize.t('PROFILE.city'),'value':city||''},
                ];
            }
            else {
                userData = [
                    {'label': Localize.t('PROFILE.mobile'),'value':'XXXXXXXXXX'},
                    {'label': Localize.t('PROFILE.email'),'value':'xxx.xxx@xxx.com'},
                    {'label': Localize.t('PROFILE.alt'),'value':'XXXXXXXXXX'},
                    {'label': Localize.t('PROFILE.landline'),'value':'0XX XXXXXX'},
                    {'label': Localize.t('PROFILE.add'),'value':'Tower X, House no. XX, Xxxxxxx.'},
                    {'label': Localize.t('PROFILE.pin'),'value':'1xxxxx'},
                    {'label': Localize.t('PROFILE.city'),'value':'Xxxxxx'}
                ];
            }

            let profileContent = userData.map((item,index)=>{
                return (
                    <View key ={index}>
                        { this.RenderField( item.label,item.value ,index) }
                    </View>
                )
            })
            return profileContent;
    }

    renderStatus = () => {
        if ( this.props.profileData !== '' ) {
            let { status } = this.props.profileData;            
            let subscriptionStatus = status.toLowerCase()            

            return (                
                <View>
                { subscriptionStatus === 'active'  ? 
                    <View style = {{flexDirection: 'row', marginLeft: 5}}>
                        <View style = {{alignSelf: 'center',height: 7, width: 7, borderRadius: 3.5, backgroundColor: '#b4ff05'}}/>                        
                        <Text style={[{marginLeft: 5, fontFamily: 'sky-text-medium', fontSize: 12, fontWeight: 'normal', color: '#b4ff05'}]}>{camelCase(subscriptionStatus)}</Text>
                    </View>
                 :        
                    <View style = {{flexDirection: 'row', marginLeft: 5}}>
                        <Text style={[this.fontStyle('yellow',12)]}>{camelCase(subscriptionStatus)}</Text>
                    </View>                                 
                }
                </View>
            );
        }
        else {
            return null;
        }
    }

    render() {
        let data = {
            'name' : 'Axxxx Dxxxxx',
            'status': 'Active',
            'cust_id': 'Cxxxxxxxx',
        };
        if ( this.props.profileData !== '' ) {
            let { name, status, customerId } = this.props.profileData;
            data = {
                name: camelCase(name),
                status: camelCase(status),
                customerId: '#'+customerId
            }
        }
        return (
            <View style={{flex: 1, position: 'relative'}}>
                    <Alert/>                
                    <GenericScreenBackground>
                    <ScrollView 
                        refreshControl = { 
                            <RefreshControl 
                                refreshing={this.state.pageRefreshing }
                                onRefresh={ () => { this.onRefresh() } }
                                tintColor = "#fff"
                            /> }
                        showsVerticalScrollIndicator = {false}
                    >
                            <TouchableWithoutFeedback onPress = {()=>this.handelEditableClose()}>
                                <View>
                                    <HeaderTransparent title = "My Profile" />
                                    
                                    {
                                        this.props.profileData !== '' ?
                                        <Card style={styles.container}>

                                        {/* ProfileHeader */}
                                        <View style={styles.headerContainer}>
                                            <View style={styles.columnContainer}>
                                                <Text style={[this.fontStyle(config.UI.secondaryColor,18.3,'900','sky-text-medium')]}>{data.name}</Text>
                                                <View style={{ flexDirection:'row' }}>
                                                    <Text style={[this.fontStyle(config.UI.secondaryColor,12)]}>{Localize.t('PROFILE.status')}:</Text>
                                                    {this.renderStatus()}
                                                </View>
                                            </View>
                                            <View style={styles.columnContainer}>
                                                <Text style={[{textAlign:'right',marginBottom:2},this.fontStyle(config.UI.secondaryColor,12)]}>{Localize.t('PROFILE.cust_id')}</Text>
                                                <Text style={[{textAlign:'right'},this.fontStyle(config.UI.secondaryColor,14.9,'700','sky-text-medium')]}>{data.customerId}</Text>
                                            </View>
                                            <View style={styles.whiteOverlay}></View>
                                        </View>

                                        {/* Profile Content */}
                                        <View style={styles.content}>
                                            { this._renderProfileContent() }
                                        </View>
                                    </Card>:
                                    <ProfileLoader/>
                                    }

                                    <Card style={styles.logoutButton}>
                                        <TouchableOpacity onPress={()=>this.logoutHandler()} style={{paddingVertical:15,justifyContent:'center',alignItems:'center'}}>
                                            <Text style={{color:config.UI.textBlue}}>Logout</Text>
                                        </TouchableOpacity>
                                    </Card>
                                    
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </GenericScreenBackground>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: config.UI.secondaryColor,
        alignItems: 'center',
        padding: 0,
        overflow: 'hidden',
        borderWidth: 0
    },
    headerContainer: {
        height: 100,
        width: window.width - 20,
        backgroundColor: config.UI.profilePinkHeader,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingTop: 20,
        position: 'relative'
      },
      columnContainer: {
          justifyContent: 'space-between',
          alignSelf: 'flex-start',
      },
      whiteOverlay : {
        width: window.width-20,
        position: 'absolute',
        borderBottomColor: config.UI.secondaryColor,
        borderLeftColor: 'transparent',
        borderStyle: 'solid',
        borderBottomWidth: 30,
        borderLeftWidth: window.width-20,
        bottom: 0
      },
    content: {
        flex: 1,
        padding: 10,
        paddingBottom: 0,
    },
    logoutButton: {
        marginVertical: 9,
        padding: 0
    },
    profileItemContainer: {
        width: window.width - 20,
        flexShrink: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
    },
    fieldInput: {
        flex: 1,
        fontSize: 16,
        width: window.width - 100,
        color: config.UI.textBlue,
        fontFamily:'sky-text-medium',
        height: 30,
        borderBottomWidth: 1,
        borderColor: config.UI.textBlue
    },
    initialText: {
        fontSize: 16,
        width: 30,
        color: config.UI.textBlue,
        fontFamily:'sky-text-medium',
        marginBottom:1
    },
    prefixWithInput: {
        flexDirection:'row',
        width:window.width-100,
        alignItems:'center'
    }
})


const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
    getProfileData: () => dispatch(getCustomerProfile()),
    callAlert: () => dispatch({ type: 'SHOW_ALERT', showAlert: true }),
    showAlert: (message, title, type) => dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: message, alertType: type, alertTitle: title }),
    update: (payload) => dispatch(updateCustomerProfile(payload)),
});

const mapStateToProps = (state) => ({
    profileData: state.profileAPIData.data,
    APIFlag: state.profileAPIData.profileAPIFlag
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);