import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class Card extends Component {
    render() {
        return (
            <View style={[styles.card, this.props.style]}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white', 
        borderWidth: 1, 
        borderColor: 'white', 
        borderRadius: 3.3, 
        padding: 10, 
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.3, 
        elevation: 2
    }
});

export default Card;