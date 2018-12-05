import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native';
import config from './../../config/config'

const ExpandableCard = ({visible = true, expanded = false, buttonText, handler}) => {    
    const cardHeight = expanded ? 300 : 190

    return (
        <View style = {{backgroundColor: 'red', marginTop: 8, borderRadius: 3.3, height: cardHeight}}>
            <View style={{backgroundColor: config.UI.buttonGrey, height: 43.0, flexDirection: 'row', position: 'absolute', bottom: 0, left:0, right:0}}>
                    <TouchableHighlight style={{flexGrow: 1, flexBasis: 50, backgroundColor: config.UI.buttonGrey, alignItems: 'center', justifyContent: 'center'}} onPress={()=>handler()}>
                        <Text style={{color: config.UI.textBlue, fontSize: 18}}>{buttonText}</Text>
                    </TouchableHighlight>
            </View>
        </View>
    );
};

export default ExpandableCard