import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import config from './../../config/config';

class ToggleSwitch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            button1: true,
            button2: false
        };
        this.props = props || {};
        this.styles = StyleSheet.create({
            toggleSwitchContainer: {
                flexDirection: 'row'
            },
            toggleButton: {
                borderRadius: 1.7,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                width: 40,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
            },
            toggleButtonActive: {
                backgroundColor: this.props.activeColor || config.UI.primaryColor,
                opacity: 1
            },
            toggleButtonText: {
                fontFamily: 'sky-text-regular',
                fontSize: 12,
                fontWeight: "normal",
                fontStyle: "normal",
                letterSpacing: 0.06,
                textAlign: "center",
                color: '#ffffff',
                opacity: 1
            }
        });
        
    }

    render() {
        return (
            <View style={ this.styles.toggleSwitchContainer }>
                <TouchableOpacity
                    onPress={ () => {
                        this.setState({ button1: true, button2: false });
                        this.props.onToggle && this.props.onToggle({ index: 0 })
                    } }
                >
                    <View style={ [this.styles.toggleButton, this.state.button1 && this.styles.toggleButtonActive ] }>
                        <Text style={ this.styles.toggleButtonText }>MB</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={ () => {
                        this.setState({ button1: false, button2: true });
                        this.props.onToggle && this.props.onToggle({ index: 1 })
                    } }
                >
                    <View style={ [this.styles.toggleButton, this.state.button2 && this.styles.toggleButtonActive ] }>
                        <Text style={ this.styles.toggleButtonText }>GB</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
    
};

export default ToggleSwitch;