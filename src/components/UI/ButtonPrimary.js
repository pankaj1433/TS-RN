import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';

import config from './../../config/config';
// import TrackMixpanel from '../../utils/TrackMixpanel';

let colorSchemeBackground;
let colorSchemeFont;
let customBorderRadius;

const ButtonPrimary = ({title, onClick, icon, scheme, layout, trackEvent, trackProperties, accessible = true, accessibilityLabel = title, disabled = false }) => {

    switch(layout) {
        case 'rounded': 
            customBorderRadius = 16.3;
            break;
        case 'normal':
            customBorderRadius = 3.3;
            break;
        default:
            customBorderRadius = 3.3;
    }

    switch (scheme) {
        case 'dark':
        case 'DARK': {
            colorSchemeBackground = config.UI.primaryColor;
            colorSchemeFont = config.UI.secondaryColor;
        }
        break;
        case 'light':
        case 'LIGHT': {
            colorSchemeBackground = config.UI.secondaryColor;
            colorSchemeFont = config.UI.primaryColor;
        }
        break;
        default: {
            colorSchemeBackground = config.UI.secondaryColor;
            colorSchemeFont = config.UI.primaryColor;
        }
    }

    const styles = StyleSheet.create({
        button: {
            backgroundColor: colorSchemeBackground,
            borderWidth: 0,
            borderRadius: customBorderRadius,
            elevation: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            alignItems: 'center',
            justifyContent: 'center',
            shadowOffset: {  
                width: 1,  
                height: 2,  
            }, 
            shadowColor: 'black',
            shadowOpacity: 0.5, 
            minWidth: 170
        },
        textContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        },
        text: {
            fontFamily: 'sky-text-medium',
            color: colorSchemeFont,
            fontWeight: "normal",
            fontStyle: "normal",
            fontSize: 16.7,
            letterSpacing: 0,
            textAlign: "left",
            marginHorizontal: 10
        },
        iconContainer: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        icon: {
            color: colorSchemeFont,
            fontFamily: 'sky-text-medium',
            fontWeight: "normal",
            fontStyle: "normal",
            lineHeight: 27
        },
        disabledColor: {
            backgroundColor: 'grey'
        }
    });

    const buttonClick = () => {
        if (trackEvent) {
            if (trackProperties) {
                // TrackMixpanel.trackWithProperties(trackEvent, trackProperties);
            }
            else {
                // TrackMixpanel.track(trackEvent);
            }
        }
        onClick && onClick();
    };

    const renderIcon = icon ? <View style={ styles.iconContainer }><Ionicons name={icon} size={25} style={ styles.icon }/></View> : null;
    return (
        <TouchableOpacity
            accessible={accessible}
            accessibilityLabel={accessibilityLabel}
            onPress={ buttonClick }
            style = { [styles.button, disabled && styles.disabledColor] }
            disabled = { disabled }
        >
            <View style={ styles.textContainer }>
                <Text style={ styles.text }>{ title }</Text>
                {renderIcon}
            </View>
        </TouchableOpacity>
    );
};

ButtonPrimary.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    trackEvent: PropTypes.string,
    trackProperties: PropTypes.object,
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.string
};

export default ButtonPrimary;