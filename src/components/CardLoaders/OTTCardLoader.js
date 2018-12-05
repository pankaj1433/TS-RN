import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import ContentLoader from './ContentLoader';
import {Circle, Rect} from 'react-native-svg'

const OTTCardLoader = () => {
    let { width } = Dimensions.get('window');
    let eachBlock = (width - 20) / 4;
    let eachPadding = (eachBlock - 40) / 2;
    return (
        <ContentLoader height={ 100 } width={ width } duration={1000}>
            <Rect x={ eachPadding } y="10" width="50" height="50"/>
            <Rect x={ eachBlock*1 + eachPadding } y="10" width="50" height="50"/>
            <Rect x={ eachBlock*2 + eachPadding } y="10" width="50" height="50"/>
            <Rect x={ eachBlock*3 + eachPadding } y="10" width="50" height="50"/>
        </ContentLoader>
    );
};

export default OTTCardLoader;