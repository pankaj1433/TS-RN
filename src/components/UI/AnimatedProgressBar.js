import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config/config';
import { Animated, Dimensions, View, Text } from 'react-native';
import { Svg, Stop, LinearGradient, Defs, ClipPath, Rect, Circle, G } from 'react-native-svg';

const {height, width} = Dimensions.get('window');

class AnimatedProgressBar extends React.Component {

    constructor(props){
        super(props);
        let roundedWidth = Math.floor(this.props.width);
        this.width = roundedWidth % 6 === 0 ? roundedWidth : roundedWidth - (roundedWidth%6);
        this.propsProgress = (this.props.progress / 100 )*this.width
        this.state = {
            progress: new Animated.Value(0)
        };
    }

    
    componentWillUnmount() {
        Animated.timing(                  
            this.state.progress
          ).stop()
    }
    
    componentWillMount() {
        setTimeout(() => {
            Animated.timing(                  
                this.state.progress,            
                {
                    toValue: this.propsProgress,                   
                    duration: this.propsProgress*30,             
                }
              ).start()
        }, 1000);
        
    }

    componentDidMount() {
        this.state.progress.addListener( (progress) => {
            this._myRect && this._myRect.setNativeProps({ width: progress.value.toString() });
        });
    }

    render() {
        console.log(this.width,'>>width')
        const progress = this.state.progress.interpolate({
            inputRange: [0, 100],
            outputRange: [0,this.width]
          })
            let a=[]
            for (var i=0; i<30 ;i++){
                a[i]=(i==0)?2:a[i-1]+6
            }

        return (
            <Svg height="10" width={this.width}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2={this.width} y2="0">
                        <Stop offset="0" stopColor={config.UI.progressBarGradient.colorFour} stopOpacity="1" />
                        <Stop offset="0.25" stopColor={config.UI.progressBarGradient.colorThree} stopOpacity="1" />
                        <Stop offset="0.5" stopColor={config.UI.progressBarGradient.colorTwo} stopOpacity="1" />
                        <Stop offset="0.75" stopColor={config.UI.progressBarGradient.colorOne} stopOpacity="1" />
                    </LinearGradient>
    
                    <ClipPath id="clip">
                        <G x="0" y="0">
                            {
                                a.map((i,index)=>
                                <G key={index}>
                                    <Circle cx={i} cy="2" r="2" />
                                    <Rect x={index*6} y="2" width="4" height="6" />
                                    <Circle cx={i} cy="8" r="2" />
                                </G> 
                                )
                            }
                            
                        </G>
                    </ClipPath>
    
                </Defs>
                
                <Rect
                    x="0"
                    y="0"
                    height="10"
                    width = {this.width}
                    fill="grey"
                    clipPath="url(#clip)"
                />
                <Rect
                    x="0"
                    y="0"
                    height="10"
                    fill="url(#grad)"
                    clipPath="url(#clip)"
                    ref={ ref => this._myRect = ref }
                />
            </Svg>
        )
    }
}
AnimatedProgressBar.propTypes = {
    width: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
};

export default AnimatedProgressBar;