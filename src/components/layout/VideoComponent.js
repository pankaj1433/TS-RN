import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
// import PropTypes from 'prop-types';

import { Video } from 'expo'

class VideoComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            playbackObject : null
        }
    }

    _handleVideoRef = component => {
        if(component){
            this.setState({
                playbackObject:component
            })
        }
    };

    componentWillMount(){
        this.blurSubscription =
            this.props.navigation.addListener(
            'willBlur',
            () => {
                if (this.state.playbackObject !== null) {
                    this.state.playbackObject.pauseAsync();
                }
            }
            )
    }

    componentWillUnmount(){
       this.blurSubscription.remove()
    }


    _handlePlayback = playbackStatus => {
        if(playbackStatus.isPlaying){   // if video is playing stop autoplay of swiper
            this.props.setAutoplay(false)
        }else{
            this.props.setAutoplay(true)
        }   


        if(playbackStatus.didJustFinish){  // if video is completed start autoplay of swiper
            this.props.setAutoplay(true)
        }
    };

    render(){
        return(
            <Video
                ref={this._handleVideoRef}
                // key={index}
                source={{uri:`${this.props.source}`}}
                rate={1.0}
                volume={1.0}
                muted={false}
                resizeMode="contain"
                shouldPlay={false}
                isLooping={false}
                useNativeControls={this.props.source ? true :false}
                style={{flex:1}}
                onPlaybackStatusUpdate = {this._handlePlayback}
            />
        )
    }


}

// VideoComponent.propTypes = {
//     source: PropTypes.string.isRequired,
//     setAutoplay: Proptypes.func.isRequired
    
// };

export default VideoComponent;

