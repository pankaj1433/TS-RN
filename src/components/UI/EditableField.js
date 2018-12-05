import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity,Dimensions, TextInput } from 'react-native';
import { Ionicons, Feather, Entypo } from '@expo/vector-icons';
import config from './../../config/config';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {updateCustomerProfile} from './../../actions/profileAction';
import { Validation } from '../../utils/Validations';


const window = Dimensions.get('window');

class EditableField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            edit : false,
            value: this.props.data.value
        }
    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.data.value && nextProps.data.value === this.props.data.value ) {
            return false;
        }
        return true;
    }

    editHandler = (label,value) => {
        this.setState({edit : true})
    }

    editSubmit = () => {
        const label = this.props.data.label;
        if(this.validateData()) {
            this.setState({edit: false},()=>{
                if(this.state.value != this.props.data.value)   {
                    let payload = {};
                    val = this.state.value.trim();
                    switch(label){
                        case 'Email': {
                            payload = {email: val}
                        }
                        break;
                        case 'Mobile':{
                            payload = {mobile: val}
                        }
                        break;
                        case 'Alternate Number': {
                            payload = {alternateNumber: val}
                        }
                        break;
                        case 'Landline': {
                            payload = {landline: val}
                        }
                        break;
                        default:
                            break;
                    }
                    this.props.update (payload);
                }
            })
        }
    }

    validateData () {
        if(this.props.data.label){
            switch(this.props.data.label) {
                case 'Email': {
                    if(!Validation.isEmail(this.state.value)) {
                        this.props.showAlert('Invalid Email Address')
                        return false;
                    }
                }
                break;
                case 'Mobile':
                case 'Alternate Number': {
                    if(!Validation.isMobileNumber(this.state.value)) {
                        this.props.showAlert('Invalid Mobile Number')
                        return false;
                    }
                }
                break;
                case 'Landline': {
                    if(!Validation.isLandLine(this.state.value)) {
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
        return false;
    }

    componentWillReceiveProps (nextProps) {
        this.setState({ value: nextProps.data.value });
        if(nextProps.close) {
            this.setState({
                value: nextProps.data.value,
                edit: false
            })
        }
    }

    editableField(data) {
        if(this.props.isEditable){
            let prefix = (this.props.isMobile)?"+91 ":'';
            let value = (this.props.data.label === 'Landline') ? this.state.value.substr(0,3)+" "+this.state.value.substr(3,this.state.value.length) :this.state.value
            return(
                <TouchableOpacity onPress={()=>this.editHandler(data.label,data.value)} style={styles.profileItemContainer}>
                    <View>
                        <Text style={{ fontSize:14,color: '#8b8b8b',marginBottom: 6,fontFamily:'sky-text-regular'}}>{data.label}</Text>
                        <Text style={{minHeight:30,fontSize: 16,color: config.UI.ticketTextGrey,fontFamily:'sky-text-medium'}}>{prefix+value}</Text>
                    </View>
                    <View>
                        <Image source={require('./../../assets/img/icEdit/icEdit.png')}/>
                    </View>
                </TouchableOpacity> 
            )
        }
        return(
            <View style={styles.profileItemContainer}>
                    <View>
                        <Text style={{ fontSize:14,color: '#8b8b8b',marginBottom: 6,fontFamily:'sky-text-regular'}}>{data.label}</Text>
                        <Text style={{minHeight:30,fontSize: 16,color: config.UI.ticketTextGrey,fontFamily:'sky-text-medium'}}>{this.state.value}</Text>
                    </View>
            </View>
        );     
    }

    inputField() {
        if(this.props.isMobile) {
            return (
            <View style={styles.prefixWithInput}>
            <View style={{justifyContent:'center',height: 30,borderBottomWidth: 1, borderColor: config.UI.textBlue}}>
                <Text style={styles.initialText}>+91</Text>
            </View>
                <TextInput
                    style={[styles.fieldInput,{width: window.width-130}]}
                    onChangeText={ (value)=>{this.setState({value})} }
                    value={this.state.value}
                    maxLength = {10}
                    keyboardType='numeric'
                    returnKeyType='done'
                    underlineColorAndroid={'transparent'}
                    onSubmitEditing = {()=>this.editSubmit()}
                />
            </View>)
        }

        if(this.props.data.label === 'Landline') {
            return(
            <TextInput
                style={styles.fieldInput}
                onChangeText={ (value)=>{
                    this.setState({value})} 
                }
                value={this.state.value}
                underlineColorAndroid={'transparent'}
                maxLength = {11}
                keyboardType='numeric'
                onSubmitEditing = {()=>this.editSubmit()}
            />);
        }
        return(
            <TextInput
                style={styles.fieldInput}
                onChangeText={ (value)=>{this.setState({value})} }
                value={this.state.value}
                underlineColorAndroid={'transparent'}
                onSubmitEditing = {()=>this.editSubmit()}
            />
        )
    }

    render() {
        const {data} = this.props;
        return (
            <View>
                {
                    (this.state.edit) ?
                    <View style={styles.profileItemContainer}>
                        <View >
                            <Text style={{ fontSize:14,color: '#8b8b8b',marginBottom: 6,fontFamily:'sky-text-regular'}}>{data.label}</Text>
                            {this.inputField()}
                        </View>
                        <TouchableOpacity onPress={()=>this.editSubmit()} style = {{backgroundColor:config.UI.profilePinkHeader,padding:1,borderRadius:3,overflow:'hidden'}}>
                            <Feather name="check" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    :
                    <View>
                        {this.editableField(data)}
                    </View>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
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
EditableField.propTypes = {
    data: PropTypes.object,
    isEditable: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
    showAlert: (message, title, type) => dispatch({ type: 'SHOW_ALERT', showAlert: true, alertMessage: message, alertType: type, alertTitle: title }),
    update: (payload) => dispatch(updateCustomerProfile(payload)),
});

export default connect(null, mapDispatchToProps)(EditableField);