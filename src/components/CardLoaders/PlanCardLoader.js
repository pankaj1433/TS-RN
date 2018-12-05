import React from 'react';
import { View, Dimensions } from 'react-native';
import ContentLoader from './ContentLoader';
import { Rect } from 'react-native-svg';


const PlanCardLoader = () => {
    let { width } = Dimensions.get('window');
    return (
        <ContentLoader height={ 70 } width={ width } duration={1000}>
            <Rect x="10" y="10" width="250" height="10"/>
            <Rect x="10" y="30" width="250" height="40"/>
        </ContentLoader>
    );
};

export default PlanCardLoader;