import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config/config';
import { Animated, Dimensions, View, Text, StyleSheet } from 'react-native';
import { Svg, Stop, LinearGradient, Defs, ClipPath, Rect, Circle, G, Polygon } from 'react-native-svg';

const {height, width} = Dimensions.get('window');




class MeterAnimation extends React.Component {

    constructor(props) {
        super(props)
        this.evenWidth = Math.floor(this.props.width) % 2 === 0 ? Math.floor(this.props.width):Math.floor(this.props.width)-1
        this.ContainerWidth = this.evenWidth ? this.evenWidth:150
        this.ContainerHeight = this.ContainerWidth/2;
        this.margin = ((this.ContainerWidth/100)*15)
        this.width = this.ContainerWidth-this.margin;
        this.height = this.width/2;
        this.needlePoints = "0,"+(this.ContainerHeight)+" "+(this.ContainerHeight)+","+((this.ContainerHeight)-((this.ContainerHeight/100)*7))+" "+(this.ContainerHeight)+","+((this.ContainerHeight)+((this.ContainerHeight/100)*7))
        this.state = {
            spinValue: new Animated.Value(0),
            animated: this.props.animated == null ? true : this.props.animated
        }
    }

    componentWillMount() {
        if(this.state.animated){
            setTimeout(() => {
                let value = this.props.value || 0;
                if (value < 0) {
                    value = 0;
                }
                else if (value > 100) {
                    value = 100;
                }
                Animated.sequence([
                    Animated.timing(
                        this.state.spinValue,
                    {
                        toValue: 100,
                        duration: 1500,
                        useNativeDriver: true,
                    }
                    ),
                    Animated.timing(this.state.spinValue, {
                        toValue: value,
                        duration: (100 - value) * 30,
                        useNativeDriver: true,
                    }),
                ]).start()    
            }, 1000);
        }
    }
    componentWillUnmount() {
        Animated.timing(                  
            this.state.spinValue
          ).stop()
    }

    _getRotationValue () {
        let deg = (this.props.value/100) * 180
        return deg+"deg"
    }


    render() {
        const spin = this.state.spinValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['0deg', '180deg']
          })

        return (
            <View style={{width:this.ContainerWidth,alignItems:'center',height:this.ContainerHeight+((this.ContainerHeight/100)*7)}}>
                <View style={{position:'absolute'}}>
                    <Svg height={this.ContainerHeight.toString()} width={this.ContainerWidth.toString()}>
                        <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2={this.width.toString()} y2="0">
                                <Stop offset="0" stopColor={config.UI.progressBarGradient.colorFour} stopOpacity="0.1" />
                                <Stop offset="0.25" stopColor={config.UI.progressBarGradient.colorThree} stopOpacity="0.1" />
                                <Stop offset="0.75" stopColor={config.UI.progressBarGradient.colorTwo} stopOpacity="0.1" />
                                <Stop offset="0.95" stopColor={config.UI.progressBarGradient.colorOne} stopOpacity="0.1" />
                            </LinearGradient>
                        </Defs>
                        <Circle cx={this.ContainerHeight.toString()} cy={this.ContainerHeight.toString()} r={this.ContainerHeight.toString()} fill="#fff"/>
                        <Circle cx={this.ContainerHeight.toString()} cy={this.ContainerHeight.toString()} r={(this.ContainerHeight-this.margin/4.5).toString()} fill="url(#grad)" />
                    </Svg>
                </View>
                <View style={{width:this.width,backgroundColor:'transparent',top:this.margin/2,height:this.height,overflow:'hidden',position:'relative'}}>
                    <View style={styles.common}>
                        <Svg height={this.height.toString()} width={this.width.toString()}>
                            <Defs>
                                <LinearGradient id="grad" x1="0" y1="0" x2={this.width.toString()} y2="0">
                                    <Stop offset="0" stopColor={config.UI.progressBarGradient.colorFour} stopOpacity="1" />
                                    <Stop offset="0.25" stopColor={config.UI.progressBarGradient.colorThree} stopOpacity="1" />
                                    <Stop offset="0.5" stopColor={config.UI.progressBarGradient.colorTwo} stopOpacity="1" />
                                    <Stop offset="0.75" stopColor={config.UI.progressBarGradient.colorOne} stopOpacity="1" />
                                </LinearGradient>
                
                                <ClipPath id="clip">
                                    <G x="0" y="0">
                                                <Circle cx={this.height.toString()} cy={this.height.toString()} r={this.height.toString()} />
                                    </G>
                                </ClipPath>
                
                            </Defs>
                            
                            <Rect
                                x="0"
                                y="0"
                                height={this.width.toString()}
                                width = {this.width.toString()}
                                fill="url(#grad)"
                                clipPath="url(#clip)"
                            />
                            <Circle cx={this.height.toString()} cy={this.height.toString()} r={((this.height/100)*76).toString()} height={this.height.toString()} width = {this.width.toString()} fill="#fff" />
                        </Svg>
                    </View>
                    <View style={[styles.common]}>
                    {
                        (this.state.animated)?
                        <Animated.View style={{transform: [{rotate: spin}],width:this.width,height:this.width }}>
                            <Svg height={this.height.toString()} width={this.width.toString()}>
                                <Defs>
                                    <ClipPath id="clip">
                                        <G x="0" y="0">
                                                    <Circle cx={this.height.toString()} cy={this.height.toString()} r={this.height.toString()} />
                                        </G>
                                    </ClipPath>
                                </Defs>
                                    <Rect
                                        x="0"
                                        y="0"
                                        height={this.width.toString()}
                                        width = {this.width.toString()}
                                        fill="#ded8d6"
                                        clipPath="url(#clip)"
                                    />
                                    <Circle cx={this.height.toString()} cy={this.height.toString()} r={((this.height/100)*76).toString()} height={this.height.toString()} width = {this.width.toString()} fill="#fff" />
                            </Svg>
                        </Animated.View>:
                        <View style={{transform: [{rotate: this._getRotationValue()}],width:this.width,height:this.width }}>
                            <Svg height={this.height.toString()} width={this.width.toString()}>
                                <Defs>
                                    <ClipPath id="clip">
                                        <G x="0" y="0">
                                                    <Circle cx={this.height.toString()} cy={this.height.toString()} r={this.height.toString()} />
                                        </G>
                                    </ClipPath>
                                </Defs>
                                    <Rect
                                        x="0"
                                        y="0"
                                        height={this.width.toString()}
                                        width = {this.width.toString()}
                                        fill="#ded8d6"
                                        clipPath="url(#clip)"
                                    />
                                    <Circle cx={this.height.toString()} cy={this.height.toString()} r={((this.height/100)*76).toString()} height={this.height.toString()} width = {this.width.toString()} fill="#fff" />
                            </Svg>
                        </View>
                    }
                        
                    </View>
                </View>
                <View style={{position:'absolute',top:0,bottom:0,left:0,right:0}}>
                {
                    (this.state.animated)?
                    <Animated.View style={{transform: [{rotate: spin}],width:this.ContainerWidth,height:this.ContainerWidth}}>
                        <Svg height={this.ContainerHeight.toString()+((this.ContainerHeight/100)*7)} width={this.ContainerWidth.toString()}>
                            <Circle 
                                cx={this.ContainerHeight} 
                                cy={this.ContainerHeight} 
                                r={((this.ContainerHeight/100)*7).toString()}
                                fill="#404040" />
                            <Polygon
                                points={this.needlePoints}
                                fill="#404040"
                                strokeWidth="1"
                            />
                        </Svg>
                    </Animated.View>:
                    <View style={{transform: [{rotate: this._getRotationValue()}],width:this.ContainerWidth,height:this.ContainerWidth}}>
                        <Svg height={this.ContainerHeight.toString()+((this.ContainerHeight/100)*7)} width={this.ContainerWidth.toString()}>
                            <Circle 
                                cx={this.ContainerHeight} 
                                cy={this.ContainerHeight} 
                                r={((this.ContainerHeight/100)*7).toString()}
                                fill="#404040" />
                            <Polygon
                                points={this.needlePoints}
                                fill="#404040"
                                strokeWidth="1"
                            />
                        </Svg>
                    </View>
                }
                        
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    common: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

MeterAnimation.propTypes = {
    width: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    animated: PropTypes.bool,

};

export default MeterAnimation;