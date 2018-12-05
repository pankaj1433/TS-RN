// import React, { Component } from 'react';
// import { LinearGradient, Svg } from 'expo';
// import config from '../../config/config';
// import { Dimensions, View } from 'react-native';

// const {height, width} = Dimensions.get('window');

// const GradientText = ({text = "Gradient",fontSize = "26",fontWeight = "900"}) => {
//     let svgWidth = fontSize/1.4*text.length
//     return (
//         <Svg height={30} width={svgWidth} >
//             <Svg.Defs>
//                 <Svg.LinearGradient id="grad" x1="0" y1="0" x2={svgWidth} y2="0">
//                     <Svg.Stop offset="0" stopColor={config.UI.textGradient.colorOne} stopOpacity="1" />
//                     <Svg.Stop offset="0.25" stopColor={config.UI.textGradient.colorTwo} stopOpacity="1" />
//                     <Svg.Stop offset="0.5" stopColor={config.UI.textGradient.colorThree} stopOpacity="1" />
//                     <Svg.Stop offset="0.75" stopColor={config.UI.textGradient.colorFour} stopOpacity="1" />
//                 </Svg.LinearGradient>
//             </Svg.Defs>
//             <Svg.G originY={svgWidth/2}>
//                 <Svg.Text
//                     fill="url(#grad)"
//                     fontSize={fontSize}
//                     fontWeight={fontWeight}
//                     fontFamily= "sky-text-bold"
//                     textAnchor="middle"
//                     x={svgWidth/2}
//                     // x="4"
//                     // y="-4"
//                 >{text}</Svg.Text>
//             </Svg.G>
//         </Svg>
//     );
// }

// export default GradientText;

import React, { Component } from 'react';
// import { LinearGradient, Svg } from 'expo';
import config from '../../config/config';
import { Dimensions, View } from 'react-native';
import { Defs, Svg, Stop, Text, G, LinearGradient } from 'react-native-svg';
import PropTypes from 'prop-types'
const {height, width} = Dimensions.get('window');

const GradientText = ({text = "Gradient",fontSize = "26",fontWeight = "900"}) => {
    let svgWidth = fontSize/1.4*text.length
    return (
        <Svg height={30} width={svgWidth} >
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2={svgWidth} y2="0">
                    <Stop offset="0" stopColor={config.UI.textGradient.colorOne} stopOpacity="1" />
                    <Stop offset="0.25" stopColor={config.UI.textGradient.colorTwo} stopOpacity="1" />
                    <Stop offset="0.5" stopColor={config.UI.textGradient.colorThree} stopOpacity="1" />
                    <Stop offset="0.75" stopColor={config.UI.textGradient.colorFour} stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <G originY={svgWidth/2}>
                <Text
                    fill="url(#grad)"
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    fontFamily= "sky-text-bold"
                    textAnchor="middle"
                    x={svgWidth/2}
                    // x="4"
                    // y="-4"
                >{text}</Text>
            </G>
        </Svg>
    );
}
GradientText.PropTypes = {
    text: PropTypes.string,
    fontSize: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    fontWeight: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
};
export default GradientText;