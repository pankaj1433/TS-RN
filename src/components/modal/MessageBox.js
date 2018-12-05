import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity} from 'react-native';
import config from '../../config/config';
import PropTypes from 'prop-types';
// import TrackMixpanel from '../../utils/TrackMixpanel';

const MessageBox = ({type, title, hasOverlayBackground = false, description, buttonText, handler, visible = false, titleStyle ,source = "Not specified"}) => {
    const showTracking = () =>{
        // TrackMixpanel.trackWithProperties('MessageBoxOpen',{ MessageType: type||'success', source });
    }
    const hideTracking = () => {
        // TrackMixpanel.trackWithProperties('MessageBoxClose',{ MessageType: type||'success', source });
    }
    const buttonHandler = () => {
        visible = false; 
        // TrackMixpanel.trackWithProperties('MessageBoxAction',{ MessageType: type||'success', action: buttonText, source });
        handler();
    }
    const styles = StyleSheet.create({
        container: {
            flex:1,
            justifyContent:'center',
            paddingHorizontal: 30,            
        },
        innerContainer: {
            backgroundColor:'#fff',
            borderRadius: 5,
            overflow: 'hidden'
        },
        modalHeader: {
            padding: 30,
            alignItems: 'center',
            marginBottom: 18,
        },
        iconStyle: {
            alignItems:'center',
            marginBottom: 20,
            width: 70,
            height:70
        },
        titleStyle: {
            lineHeight:23.3,
            marginBottom: 20,
            fontSize:18.7, 
            textAlign:'center',
            fontFamily: 'sky-text-regular'
        },
        descriptionStyle: {
            fontSize:15.7, 
            color: config.UI.textGrey, 
            textAlign:'center',
            fontFamily: 'sky-text-regular'
        },
        buttonStyle: {
            flexGrow: 1,
            flexBasis: 50,
            backgroundColor: config.UI.buttonGrey,
            alignItems: 'center',
            justifyContent: 'center'
        },
        buttonTextStyle: {
            color: config.UI.textBlue,
            fontSize: 18,
            fontFamily: 'sky-text-medium'
        },
    });

    let topIcon = require('./../../assets/img/thumbsUp/thumbsUp.png');
    switch (type) {
        case 'success': 
            topIcon = require('./../../assets/img/thumbsUp/thumbsUp.png');
        break;
        case 'noInternet':
            topIcon = require('./../../assets/img/icNoNetwork/icNoNetwork.png');
        break;
        case 'failure':
            topIcon = require('./../../assets/img/icFailure/icFailure.png');
        break;
        case 'warning':
            topIcon = '';
        break;
        default:
            topIcon = require('./../../assets/img/thumbsUp/thumbsUp.png');
    }

    return (
        <Modal onShow={() => showTracking()} onDismiss={() => hideTracking()} transparent={true} visible={ visible } animationType='fade'>
            <View style={[styles.container,hasOverlayBackground ? {backgroundColor: '#5b5b5b90'} : null]}>
                <View style={styles.innerContainer}>
                <View style={styles.modalHeader}>
                    <View style={styles.iconStyle}>
                        <Image resizeMode='cover' source={ topIcon } />
                    </View>
                    <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
                    {
                        (description)?
                        <Text style={styles.descriptionStyle}>{description}</Text>
                        :null
                    }
                    
                </View>
                <View style={styles.modalFooter}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => buttonHandler()}>
                        <Text style={styles.buttonTextStyle}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
                </View>   
            </View>
        </Modal>
    );
}

MessageBox.propTypes = {
    type : PropTypes.string,
    title: PropTypes.string,
    source: PropTypes.string,
    description: PropTypes.string,
    buttonText: PropTypes.string,
    handler: PropTypes.func,
    visible: PropTypes.bool,
};

export default MessageBox;