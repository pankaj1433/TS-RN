import React from 'react';
import { View, Dimensions } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect } from 'react-native-svg';


const HomeRecentTransactionLoader = () => {
    let { width } = Dimensions.get('window');
    return (
        <ContentLoader height={ 70 } width={ width } duration={1000}>
            <Rect x="10" y="10" width="250" height="10"/>
            <Rect x="10" y="30" width="200" height="10"/>
            {/* <Rect x="10" y="50" width="150" height="10"/> */}
        </ContentLoader>
    );
};

export default HomeRecentTransactionLoader;