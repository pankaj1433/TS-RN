import React from 'react';
import { View, Image,StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const ListLoader = (props) => {
    return (
        <View style={[styles.imageContainer,props.style]}>
             <Image source={require('./../../assets/img/loading.gif')} resizeMode='stretch' style={ styles.loadingImage } />
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: 40,
        height: 40,
        borderRadius: 40/2,
        backgroundColor: 'transparent',
        elevation: 5,
        shadowOffset: {  
            width: 0,  
            height: 0.5,  
        }, 
        shadowColor: 'black',
        shadowOpacity: 0.3, 
        backgroundColor: 'transparent',
        alignSelf: 'center'
    },
    loadingImage: { 
        flex: 1,
        height: null,
        width: null,
    },
});

ListLoader.propTypes = {
    style: PropTypes.object,
};

export default ListLoader;