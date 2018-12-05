import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableHighlight, TouchableOpacity, Alert, Platform, FlatList } from 'react-native';
import { Location, Permissions } from 'expo';
import { Feather } from '@expo/vector-icons';
import { connect } from 'react-redux';

import PrimaryButton from './ButtonPrimary';
import MessageBox from './../../components/modal/MessageBox';
import Localize from './../../config/i18n/Localize';
import config from './../../config/config';
import { generateReferRequest,clearMessage } from './../../actions/ReferFriendsAction';
import { Validation } from '../../utils/Validations';

class FriendFormScreen extends Component {

    constructor () {
        super();
        this.state = {
            friendsName: '',
            friendsMobile: '',
            friendsList:[],
            referStatusModal: {
                visible: false,
                type: 'success',
                title: '',
                description: ''
            }
        };
    };

    setModalValues (type, title, description, visible) {
        this.setState({ referStatusModal: { type, visible, title, description } });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.apiResponse)
        this.setModalValues('success', Localize.t('REFER_FRIEND.refer_successful'), Localize.t('REFER_FRIEND.refer_successful_description'), true);
    }


    submit = () => {
        if(this.state.friendsMobile && this.state.friendsName){
            if(!Validation.isMobileNumber(this.state.friendsMobile)) {
                this.props.showAlert('warn', Localize.t('REFER_FRIEND.invalid_mobile'));
            }
            else{
                let newArray = this.state.friendsList.slice();
                newArray.push({name:this.state.friendsName, mobileNumber:this.state.friendsMobile});
                this.setState({friendsList:newArray,friendsMobile:'',friendsName:''},()=>{
                    let payload = {
                        name: this.props.name,
                        mobileNumber: this.props.mobile,
                        referrals: this.state.friendsList
                    }
                    this.props.generateReferRequest(payload)
                })
            }
        }
    };


    onAddMoreFriendsClicked = () =>{
        if(this.state.friendsMobile && this.state.friendsName){
            if(!Validation.isMobileNumber(this.state.friendsMobile)) {
                this.props.showAlert('warn', Localize.t('REFER_FRIEND.invalid_mobile'));
            }else{
                this.addFriend(this.state.friendsName,this.state.friendsMobile)
            }
        }
    };


    addFriend = (friendsName, friendsMobile) =>{

        let newArray = this.state.friendsList.slice();
        newArray.push({name:friendsName, mobileNumber:friendsMobile});
        this.setState({friendsList:newArray,friendsMobile:'',friendsName:''})

    }

    modalGoBackHandler = () => {
        this.setState({
            paymentStatusModal: {
                visible: false
            }
        }, () => {
            this.props.clearMessage()
            this.props.navigation.goBack();
        });
    }



    onRemoveFriendClicked = (friendMobile) => {

        let array = [...this.state.friendsList]; // make a separate copy of the array
        let index = array.findIndex(x => x.mobileNumber===friendMobile)
        array.splice(index, 1);
        this.setState({friendsList: array});


    }



    render () {
        return (
            <View style={styles.container}>
                <MessageBox
                    type = { this.state.referStatusModal.type }
                    title = { this.state.referStatusModal.title }
                    description = { this.state.referStatusModal.description }
                    visible = { this.state.referStatusModal.visible }
                    handler = { () => { this.modalGoBackHandler() } }
                    buttonText = { Localize.t('REFER_FRIEND.go_back') }
                    hasOverlayBackground = { true }
                />
                <View style={styles.loginContainer}>

                    <View style={{  paddingHorizontal: 10, paddingVertical:20}}>

                        <FlatList
                            style={{marginTop:10, marginBottom:10, width: '100%', color:'red'}}

                            data={this.state.friendsList}

                            renderItem={  ({item}) => {
                                return (

                                    <View style={styles.listItemStyle}>

                                        <Text style={{flex: 1}}> {`${item.name} - ${item.mobileNumber}`} </Text>

                                        <TouchableOpacity onPress={ ()=> this.onRemoveFriendClicked(item.mobileNumber)}>
                                            <View style={styles.crossIconStyle}>
                                                <Text>x</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.friendsMobile}
                        />

                        <View style={{}}>

                        </View>


                        <View>
                            <Text
                                style={[styles.pinkHeading, {lineHeight: 14.7}]}>{Localize.t('REFER_FRIEND.friends_neighbour_name')}</Text>
                            <View style={{paddingVertical: 10, flexDirection: 'column'}}>
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomColor: '#3583BF',
                                    borderBottomWidth: 1.3,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: 10
                                }}>
                                    <TextInput
                                        accessible={true}
                                        accessibilityLabel="friendsName"
                                        onChangeText={(friendsName) => {
                                            this.setState({friendsName})
                                        }}
                                        value={this.state.friendsName}
                                        underlineColorAndroid={'transparent'}
                                        style={{
                                            flex: 1,
                                            lineHeight: 17.7,
                                            paddingHorizontal: 5,
                                            fontSize: 15,
                                            fontWeight: '700',
                                        }}
                                    />
                                </View>
                            </View>
                        </View>


                        <View style={{marginTop: 10}}>
                            <Text
                                style={[styles.pinkHeading, {lineHeight: 14.7}]}>{Localize.t('REFER_FRIEND.friends_neighbour_mobile_number')}</Text>
                            <View style={{paddingVertical: 10, flexDirection: 'column'}}>
                                <View style={{
                                    flexDirection: 'row',
                                    borderBottomColor: '#3583BF',
                                    borderBottomWidth: 1.3,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: 10
                                }}>
                                    <TextInput
                                        accessible={true}
                                        accessibilityLabel="friendsMobile"
                                        onChangeText={(friendsMobile) => {
                                            this.setState({friendsMobile})
                                        }}
                                        value={this.state.friendsMobile}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        underlineColorAndroid={'transparent'}
                                        style={{
                                            flex: 1,
                                            lineHeight: 17.7,
                                            paddingHorizontal: 5,
                                            fontSize: 15,
                                            fontWeight: '700',
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                    </View>
                    <TouchableOpacity onPress={this.onAddMoreFriendsClicked}>

                        <Text
                            style={(!this.state.friendsName || !this.state.friendsMobile) ? styles.normalText : styles.boldText}>
                            <Text> + </Text>{Localize.t('REFER_FRIEND.add_more_friends_neighbour')}</Text>

                    </TouchableOpacity>
                    <View style={{marginBottom: 40, marginTop: 20}}>
                        <PrimaryButton
                            disabled={!this.state.friendsName || !this.state.friendsMobile}
                            accessible={true}
                            accessibilityLabel="submitButton"
                            onClick={() => this.submit()}
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
    boldText: {
        fontFamily: 'sky-text-bold',
        fontSize: 16,
        color: 'black'
    },
    normalText: {
        fontFamily: 'sky-text-medium',
        fontSize: 16,
        color: 'grey'
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
    },

    listItemStyle: {
        padding: 10,
        flexDirection: 'row',
        backgroundColor: '#ececec',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    crossIconStyle: {
        padding: 5,
        height: 25,
        width: 25,
        backgroundColor: '#A1A1A1',
        borderRadius: 12,
        justifyContent:'center',
        alignItems:'center'
    }
});

const mapStateToProps = (state) => ({

    apiResponse: state.ReferFriendAPIData.message
});

const mapDispatchToProps = (dispatch) => ({
    generateReferRequest: (payload) => dispatch(generateReferRequest(payload)),
    clearMessage: () => dispatch(clearMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendFormScreen);