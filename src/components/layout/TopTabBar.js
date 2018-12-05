import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Proptypes from 'prop-types';

import config from './../../config/config';

export default class TopTabBar extends Component {
  
	constructor(props) {
		super(props);
		let nTabs = (props.data && props.data.length) || 0;
		let activeTabIndex = props.activeTabIndex || 0;
		let tmpArr = Array(nTabs).fill(false);
		tmpArr[activeTabIndex] = true;
		this.state = {
			active: tmpArr.slice(),
			dataLength: nTabs
		}
	}
	
	_handleIndexChange = ({val, index}) => {
		let { dataLength } = this.state;
		let tmp = Array(dataLength).fill(false);
		tmp[index] = true;
		this.setState({ active: tmp.slice() })	
		val.handler && val.handler(val.title);
	}

	render() {
		let { active, dataLength } = this.state;
		const tabs = this.props.data.map((val, index) => {
			return (
				<TouchableOpacity key={ index } onPress={ () => { this._handleIndexChange({val, index}) } }>
					<View style={ [ styles.tab, active[index] && styles.tabActive ] }>
						<Text style={ [ styles.tabText, active[index] && styles.tabTextActive ] }>{val.title}</Text>
					</View>
				</TouchableOpacity>
			)
		});
		return (
			<View style={ styles.container }>
				{ tabs }
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: { 
		flexDirection: 'row', 
		justifyContent: 'space-around' 
	},
	tab: {
		borderBottomColor: 'transparent', 
		borderBottomWidth: 1,
		padding: 10
	},
	tabActive: {
		borderBottomColor: '#ffeb50'
	},
	tabText: { 
		textAlign: 'center',
		fontFamily: "sky-text-medium",
		fontSize: 15.3,
		fontWeight: "normal",
		fontStyle: "normal",
		lineHeight: 15.7,
		letterSpacing: 0,
		color: config.UI.textGrey,
		textShadowColor: "#225b91a3",
		textShadowOffset: {
			width: 0.1,
			height: 1.7
		},
		textShadowRadius: 3.3,
		backgroundColor: 'transparent'
	},
	tabTextActive: {
		color: '#ffeb50'
	}
});
