// import React, { Component } from 'react';
// import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
// import { Constants } from 'expo';
// import moment from 'moment';

// import { AreaChart, BarChart, Grid, XAxis } from 'react-native-svg-charts' // 2.2.2
// import { Circle, LinearGradient, Stop, G, Line, Rect, Text, TSpan } from 'react-native-svg'
// import * as shape from 'd3-shape'; // 1.2.0

// import TopTabBar from './layout/TopTabBar';
// import ToggleSwitch from './UI/ToggleSwitch';
// import config from '../config/config';
// import { precisionRound } from '../utils/Filters';

// class DataUsageChart extends Component {

//     constructor(props) {
//         super(props);
//         let chartData = [];
//         let chartDate = [];
//         this.state = {
//             data: props.data,
//             chartData,
//             chartDate,
//             unit:''

//         };
//     }

//     dataUnitToggle = (index) => {
//         switch(index) {
//             case 0:
//                 //case MB
//                 this.alterData('MB');
//             break;
//             case 1:
//                 //case GB
//                 this.alterData('GB');
//             break;
//             default: 
//         }
//     };

//     alterData = (unit) => {
//         if(this.state.data && this.state.data.length){
//             let data = this.props.data;
//             let chartData = [];
//             let chartDate = [];
//             let largest = (unit && unit === 'MB')? data[0].data : precisionRound(data[0].data/1024, 2);
//             data.map(dataObj => {
//                 console.log(precisionRound(dataObj.data/1024, 2), 'precision', dataObj.data/1024)
//                 let x = (unit && unit === 'MB')? dataObj.data : precisionRound(dataObj.data/1024, 2);
//                 let y = dataObj.date;
//                 if (x > largest) {
//                     largest = x;
//                 }
//                 chartData.push(x);
//                 chartDate.push(y);
//             });
//             chartData = [0, ...chartData];
//             chartDate = [0 , ...chartDate];
//             // chartData = [ 0, ...chartData, precisionRound((largest*(110/100)), 2) ];
//             // chartDate = [ 0, ...chartDate, 0 ];
//             // console.log(precisionRound((largest*(110/100)), 2), largest, 'test after');
//             this.setState({
//                 chartData,
//                 chartDate,
//                 unit
//             })
//         }
//     };

//     componentWillMount () {
//         this.alterData('MB');
//     };

//     componentWillReceiveProps(nextProps){
//         if(nextProps.data.length){
//             this.setState({
//                 data: nextProps.data
//             },()=>{
//                 this.alterData(this.state.unit || 'MB');
//             })
//         }
//           // get data in previous selected data form or by default in MB
//     }


//     render() {
//         const CustomGrid = ({ x, y, dataPoints, ticks }) => (
//             <G>
//                 {
//                     // Horizontal grid
//                     ticks.map(tick => (
//                         <Line
//                             key={ 'horizontal' + tick }
//                             x1={ '0%' }
//                             x2={ '100%' }
//                             y1={ y(tick) }
//                             y2={ y(tick) }
//                             stroke={ 'rgba(229, 229, 229, 0.3)' }
//                         />
//                     ))
//                 }
//                 {
//                     // Vertical grid
//                     dataPoints.map((_, index) => (
//                         <Line
//                             key={ 'vertical' + index }
//                             y1={ '0%' }
//                             y2={ '100%' }
//                             x1={ x(index) }
//                             x2={ x(index) }
//                             stroke={ 'rgba(229, 229, 229, 0.3)' }
//                         />
//                     ))
//                 }
//             </G>
//         )
//         let { width } = Dimensions.get('window');
//         if ( this.state.chartData.length > 7 ) {
//             width = (width/7) * this.state.chartData.length;
//         }
//         let dateTextdx = (Platform.OS === 'android')? -48 : -18;
//         let dateTextdy = (Platform.OS === 'android')? 32 : 15;
//         const barData = [
//             {
//                 values: this.state.chartData
//             }
//         ]
//         return (
//             <View style={{ flex: 1, backgroundColor: 'transparent' }}>
//             {
//                 this.props.data && this.props.data.length ?
//                 <View>
//                     <View style={ styles.filterContainer }>
//                     <View style={{flex: 1, alignItems: 'flex-start', paddingHorizontal: 10}}>
//                         <TopTabBar data={ [ {title: 'Daily',handler: (title)=>this.props.handler(title)} ,{title:'Weekly',handler:(title)=> this.props.handler(title)}] }/>
//                     </View>
//                     <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
//                         <ToggleSwitch onToggle={ ({index}) => { this.dataUnitToggle(index) } }/>
//                     </View>
//                 </View>
//                 <ScrollView horizontal={true} directionalLockEnabled={ true} showsHorizontalScrollIndicator={ false } bounces={ false } alwaysBounceHorizontal={ false } style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(229, 229, 229, 0.3)' }}>
//                     { this.props.days == 'Daily' ?
//                     <View>
//                         <BarChart
//                         style={ { height: 300, width: width  } }
//                         data={ barData }
//                         animate = { true }
//                         animationDuration = { 500 }
//                         svg={ {
//                             fill: 'rgba(0, 0, 0, 1)',
//                         } }
//                         spacing = {0.10}
//                         // shadowOffset={5} 
//                         // shadowSvg={ {
//                         //     stroke: 'rgba(134, 65, 244, 0.5)',
//                         //     strokeWidth: 5,
//                         // } }
//                         contentInset={ { top: 40 } }
//                         renderDecorator={ ({ x, y, index, value }) => {
//                             if (index > 0 && index < this.state.chartData.length ) {
//                                 return (
//                                     <G cx={x(index)} cy={y(value)}>
//                                         <Text
//                                             key={ 'valueLabel' + index }
//                                             x={ x(index) + 15 }
//                                             y={ y(value) - 30 }
//                                             fill={ 'white' }
//                                             stroke={ 'white' }
//                                             fontSize="12"
//                                             fontFamily="sky-text-regular"
//                                         >{ this.state.chartData[index] }
//                                         </Text>
//                                         <Circle
//                                             key={ 'valueCircle' + index }
//                                             cx={ x(index) +23}
//                                             cy={ y(value) }
//                                             r={ 7 }
//                                             stroke={ 'rgb(255, 255, 255)' }
//                                             fill={ '#1e4a9a' }
//                                         />
//                                         <Text
//                                             key={ 'date' + index }
//                                             x={ x(index)+6 }
//                                             y={ 260 }
//                                             fill={ 'white' }
//                                             stroke={ 'white' }
//                                             fontSize="12"
//                                             fontFamily="sky-text-regular"
//                                         >
//                                         <TSpan>{ `${moment(this.state.chartDate[index]).format('DD')} ${moment(this.state.chartDate[index]).format('MMM')}`}</TSpan>
//                                             {/* <TSpan>{ moment(this.state.chartDate[index]).format('DD') }</TSpan>
//                                             <TSpan dx={ dateTextdx } dy={ dateTextdy }>{ moment(this.state.chartDate[index]).format('MMM') }</TSpan> */}
//                                         </Text>
//                                     </G>
//                                 )
//                             }
//                             return null;
//                             } }
//                             // curve={ shape.curveLinear }
//                             renderGradient={ ({ id }) => (
//                                 <LinearGradient id={ id } x1={ '0%' } y={ '0%' } x2={ '100%' } y2={ '0%' }>
//                                     <Stop offset='10%'  stopColor={ '#e8001b' } stopOpacity='1' />
//                                     <Stop offset='100%' stopColor={ '#ea0079' }  stopOpacity='1' />
//                                 </LinearGradient>
//                             ) }
//                             // renderGrid={CustomGrid}
//                             /> 
//                             {/* <XAxis
//                                 style={{ height:30,backgroundColor:'grey'}}
//                                 chartType={'bar'}
//                                 values={ this.state.chartDate }
//                                 formatLabel={ (value,index) => moment(value).format('DD MMM')}
//                                 contentInset={{ left: 50 }}
//                                 labelStyle={{ marginTop:10, fontSize: 12, fontFamily:"sky-text-regular",color: 'white' }}
//                             /> */}
//                             </View>:
//                             <View> 
//                             <BarChart
//                                 style={ { height: 300, width: width  } }
//                                 data={ barData }
//                                 animate = { true }
//                                 animationDuration = { 100 }
//                                 svg={ {
//                                     fill: 'rgba(0, 0, 0, 1)',
//                                 } }
//                                 spacing = {this.props.days === 'Weekly' ? 0.10 : 0.65}
//                                 renderDecorator={ ({ x, y, index, value }) => {
//                                     if (index > 0 && index < this.state.chartData.length ) {
//                                         return (
//                                             <G cx={x(index)} cy={y(value)}>
//                                                 <Text
//                                                     key={ 'valueLabel' + index }
//                                                     x={ x(index) + 15 }
//                                                     y={ y(value) - 30 }
//                                                     fill={ 'white' }
//                                                     stroke={ 'white' }
//                                                     fontSize="12"
//                                                     fontFamily="sky-text-regular"
//                                                 >{ this.state.chartData[index] }
//                                                 </Text>
//                                                 <Circle
//                                                     key={ 'valueCircle' + index }
//                                                     cx={ x(index) + 23 }
//                                                     cy={ y(value) }
//                                                     r={ 7 }
//                                                     stroke={ 'rgb(255, 255, 255)' }
//                                                     fill={ '#1e4a9a' }
//                                                 />
//                                                 <Text
//                                                     key={ 'startdate' + index }
//                                                     x={ x(index) + 6 }
//                                                     y={ 259 }
//                                                     fill={ 'white' }
//                                                     stroke={ 'white' }
//                                                     fontSize="11"
//                                                     fontFamily="sky-text-regular"
//                                                 >
//                                                     <TSpan>{ `${moment(this.state.chartDate[index].startDate).format('DD')} ${moment(this.state.chartDate[index].startDate).format('MMM')}`}</TSpan>
//                                                 </Text>
//                                                 <Text
//                                                     key={ 'stroke' + index }
//                                                     x={ x(index) + 35 }
//                                                     y={259}
//                                                     fill={ 'white' }
//                                                     stroke={ 'white' }
//                                                     fontSize="11"
//                                                     fontFamily="sky-text-regular"
//                                                 >
//                                                     <TSpan dx={ dateTextdx } dy={ dateTextdy }>-</TSpan>
//                                                 </Text>
//                                                 <Text
//                                                     key={ 'endDate' + index }
//                                                     x={ x(index) + 6 }
//                                                     y={280}
//                                                     fill={ 'white' }
//                                                     stroke={ 'white' }
//                                                     fontSize="11"
//                                                     fontFamily="sky-text-regular"
//                                                 >
//                                                     <TSpan>{ `${moment(this.state.chartDate[index].endDate).format('DD')} ${moment(this.state.chartDate[index].endDate).format('MMM')}`}</TSpan>
//                                                 </Text>
//                                             </G>
//                                         )
//                                     }
//                                     return null;
//                                     } }
//                                 contentInset={ { top: 40 } }
//                                 renderGradient={ ({ id }) => (
//                                     <LinearGradient id={ id } x1={ '0%' } y={ '0%' } x2={ '100%' } y2={ '0%' }>
//                                         <Stop offset='10%'  stopColor={ '#e8001b' } stopOpacity='1' />
//                                         <Stop offset='100%' stopColor={ '#ea0079' }  stopOpacity='1' />
//                                     </LinearGradient>
//                                 ) }
//                             />
//                              {/* <XAxis
//                                 style={{ height:20,backgroundColor:'grey'}}
//                                 chartType={'bar'}
//                                 values={ this.state.chartDate }
//                                 formatLabel={ (value,index) => moment(value.startDate).format('DD MMM') + " - "}
//                                 contentInset={{ left: 50 }}
//                                 labelStyle={{ marginTop:5, fontSize: 12, fontFamily:"sky-text-regular",color: 'white' }}
//                             />
//                             <XAxis
//                                 style={{ height:20,backgroundColor:'grey'}}
//                                 chartType={'bar'}
//                                 values={ this.state.chartDate }
//                                 formatLabel={ (value,index) => moment(value.endDate).format('DD MMM')}
//                                 contentInset={{ left: 50 }}
//                                 labelStyle={{ marginTop:4,marginBottom:5, fontSize: 12, fontFamily:"sky-text-regular",color: 'white' }}
//                             /> */}
//                             </View>
//                             }
//                 </ScrollView>
//                 </View> :
//                 <View style={{ backgroundColor: 'transparent', paddingVertical: 150 }}></View>
//             }
                
//             </View>
//         )
//     }

// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     filterContainer: {
//         flexDirection: 'row',
         
//     },
// });

// export default DataUsageChart;


import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { Constants } from 'expo';
import moment from 'moment';

import { AreaChart, BarChart, Grid } from 'react-native-svg-charts' // 2.2.2
import { Circle, LinearGradient, Stop, G, Line, Rect, Text, TSpan } from 'react-native-svg'
import * as shape from 'd3-shape'; // 1.2.0

import TopTabBar from './layout/TopTabBar';
import ToggleSwitch from './UI/ToggleSwitch';
import config from '../config/config';
import { precisionRound } from '../utils/Filters';

class DataUsageChart extends Component {

    constructor(props) {
        super(props);
        let chartData = [];
        let chartDate = [];
        this.state = {
            data: props.data,
            chartData,
            chartDate,
            unit:''
        };
    }

    dataUnitToggle = (index) => {
        switch(index) {
            case 0:
                //case MB
                this.alterData('MB');
            break;
            case 1:
                //case GB
                this.alterData('GB');
            break;
            default: 
        }
    };

    alterData = (unit) => {
        if(this.state.data && this.state.data.length){
            let data = this.state.data;
            let chartData = [];
            let chartDate = [];
            let largest = (unit && unit === 'MB')? data[0].data : precisionRound(data[0].data/1024, 2);
            data.map(dataObj => {
                let x = (unit && unit === 'MB')? dataObj.data : precisionRound(dataObj.data/1024, 2);
                let y = (this.props.days === 'Daily') ? dataObj.date : {startDate:dataObj.startDate,endDate:dataObj.endDate};
                if (x > largest) {
                    largest = x;
                }
                chartData.push(x);
                chartDate.push(y);
            });
            chartData = [ 0, ...chartData];
            chartDate = [ 0, ...chartDate ];
            // chartData =  (this.props.days === 'Daily') ? [ 0, ...chartData, precisionRound((largest*(110/100)), 2) ] : [ 0, ...chartData];
            // chartDate =  (this.props.days === 'Daily') ? [ 0, ...chartDate, 0 ] : [ 0, ...chartDate ]
            // console.log(precisionRound((largest*(110/100)), 2), largest, 'test after');
            this.setState({
                chartData,
                chartDate,
                unit
            })
        }
    };
    componentWillMount () {
        this.alterData('MB');
    };

    componentWillReceiveProps(nextProps){
        if(nextProps.data.length){
            this.setState({
                data: nextProps.data
            },()=>{
                this.alterData(this.state.unit || 'MB');
            })
        }
          // get data in previous selected data form or by default in MB
    }

    render() {
        const CustomGrid = ({ x, y, dataPoints, ticks }) => (
            <G>
                {
                    // Horizontal grid
                    ticks.map(tick => (
                        <Line
                            key={ 'horizontal' + tick }
                            x1={ '0%' }
                            x2={ '100%' }
                            y1={ y(tick) }
                            y2={ y(tick) }
                            stroke={ 'rgba(229, 229, 229, 0.3)' }
                        />
                    ))
                }
                {
                    // Vertical grid
                    dataPoints.map((_, index) => (
                        <Line
                            key={ 'vertical' + index }
                            y1={ '0%' }
                            y2={ '100%' }
                            x1={ x(index) }
                            x2={ x(index) }
                            stroke={ 'rgba(229, 229, 229, 0.3)' }
                        />
                    ))
                }
            </G>
        )
        let { width } = Dimensions.get('window');
        if ( this.state.chartData.length > 7 ) {
            width = (width/7) * this.state.chartData.length;
        }
        let dateTextdx = (Platform.OS === 'android')? -48 : -18;
        let dateTextdy = (Platform.OS === 'android')? 32 : 15;
        const barData = [
            {
                values: this.state.chartData
            }
        ]
        return (
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            {
                this.props.data && this.props.data.length ?
                <View>
                    <View style={ styles.filterContainer }>
                    <View style={{flex: 1, alignItems: 'flex-start', paddingHorizontal: 10}}>
                        <TopTabBar data={ [ {title: 'Daily',handler: (title)=>this.props.handler(title)} ,{title:'Weekly',handler:(title)=> this.props.handler(title)}] }/>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <ToggleSwitch onToggle={ ({index}) => { this.dataUnitToggle(index) } }/>
                    </View>
                </View>
                <ScrollView horizontal={true} directionalLockEnabled={ true} showsHorizontalScrollIndicator={ false } bounces={ false } alwaysBounceHorizontal={ false } style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(229, 229, 229, 0.3)' }}>
                    { this.props.days == 'Daily' ?
                        <BarChart
                        style={ { height: 300, width: width  } }
                        data={ barData }
                        animate = { true }
                        animationDuration = { 500 }
                        svg={ {
                            fill: 'rgba(0, 0, 0, 1)',
                        } }
                        spacing = {0.10}
                        // shadowOffset={5} 
                        // shadowSvg={ {
                        //     stroke: 'rgba(134, 65, 244, 0.5)',
                        //     strokeWidth: 5,
                        // } }
                        contentInset={ { top: 40 } }
                        renderDecorator={ ({ x, y, index, value }) => {
                            if (index > 0 && index < this.state.chartData.length ) {
                                return (
                                    <G cx={x(index)} cy={y(value)}>
                                        <Text
                                            key={ 'valueLabel' + index }
                                            x={ x(index) + 15 }
                                            y={ y(value) - 30 }
                                            fill={ 'white' }
                                            stroke={ 'white' }
                                            fontSize="12"
                                            fontFamily="sky-text-regular"
                                        >{ this.state.chartData[index] }
                                        </Text>
                                        <Circle
                                            key={ 'valueCircle' + index }
                                            cx={ x(index) +23}
                                            cy={ y(value) }
                                            r={ 7 }
                                            stroke={ 'rgb(255, 255, 255)' }
                                            fill={ '#1e4a9a' }
                                        />
                                        <Text
                                            key={ 'date' + index }
                                            x={ x(index)+6 }
                                            y={ 260 }
                                            fill={ 'white' }
                                            stroke={ 'white' }
                                            fontSize="12"
                                            fontFamily="sky-text-regular"
                                        >
                                        <TSpan>{ `${moment(this.state.chartDate[index]).format('DD')} ${moment(this.state.chartDate[index]).format('MMM')}`}</TSpan>
                                            {/* <TSpan>{ moment(this.state.chartDate[index]).format('DD') }</TSpan>
                                            <TSpan dx={ dateTextdx } dy={ dateTextdy }>{ moment(this.state.chartDate[index]).format('MMM') }</TSpan> */}
                                        </Text>
                                    </G>
                                )
                            }
                            return null;
                            } }
                            // curve={ shape.curveLinear }
                            renderGradient={ ({ id }) => (
                                <LinearGradient id={ id } x1={ '0%' } y={ '0%' } x2={ '100%' } y2={ '0%' }>
                                    <Stop offset='10%'  stopColor={ '#e8001b' } stopOpacity='1' />
                                    <Stop offset='100%' stopColor={ '#ea0079' }  stopOpacity='1' />
                                </LinearGradient>
                            ) }
                            // renderGrid={CustomGrid}
                            /> : 
                            <BarChart
                                style={ { height: 300, width: width  } }
                                data={ barData }
                                animate = { true }
                                animationDuration = { 100 }
                                svg={ {
                                    fill: 'rgba(0, 0, 0, 1)',
                                } }
                                spacing = {this.props.days === 'Weekly' ? 0.10 : 0.65}
                                renderDecorator={ ({ x, y, index, value }) => {
                                    if (index > 0 && index < this.state.chartData.length ) {
                                        return (
                                            <G cx={x(index)} cy={y(value)}>
                                                <Text
                                                    key={ 'valueLabel' + index }
                                                    x={ x(index) + 15 }
                                                    y={ y(value) - 30 }
                                                    fill={ 'white' }
                                                    stroke={ 'white' }
                                                    fontSize="12"
                                                    fontFamily="sky-text-regular"
                                                >{ this.state.chartData[index] }
                                                </Text>
                                                <Circle
                                                    key={ 'valueCircle' + index }
                                                    cx={ x(index) + 23 }
                                                    cy={ y(value) }
                                                    r={ 7 }
                                                    stroke={ 'rgb(255, 255, 255)' }
                                                    fill={ '#1e4a9a' }
                                                />
                                                <Text
                                                    key={ 'startdate' + index }
                                                    x={ x(index) + 6 }
                                                    y={ 259 }
                                                    fill={ 'white' }
                                                    stroke={ 'white' }
                                                    fontSize="11"
                                                    fontFamily="sky-text-regular"
                                                >
                                                    <TSpan>{ `${moment(this.state.chartDate[index].startDate).format('DD')} ${moment(this.state.chartDate[index].startDate).format('MMM')}`}</TSpan>
                                                </Text>
                                                <Text
                                                    key={ 'stroke' + index }
                                                    x={ x(index) + 35 }
                                                    y={259}
                                                    fill={ 'white' }
                                                    stroke={ 'white' }
                                                    fontSize="11"
                                                    fontFamily="sky-text-regular"
                                                >
                                                    <TSpan dx={ dateTextdx } dy={ dateTextdy }>-</TSpan>
                                                </Text>
                                                <Text
                                                    key={ 'endDate' + index }
                                                    x={ x(index) + 6 }
                                                    y={280}
                                                    fill={ 'white' }
                                                    stroke={ 'white' }
                                                    fontSize="11"
                                                    fontFamily="sky-text-regular"
                                                >
                                                    <TSpan>{ `${moment(this.state.chartDate[index].endDate).format('DD')} ${moment(this.state.chartDate[index].endDate).format('MMM')}`}</TSpan>
                                                </Text>
                                            </G>
                                        )
                                    }
                                    return null;
                                    } }
                                contentInset={ { top: 40 } }
                                renderGradient={ ({ id }) => (
                                    <LinearGradient id={ id } x1={ '0%' } y={ '0%' } x2={ '100%' } y2={ '0%' }>
                                        <Stop offset='10%'  stopColor={ '#e8001b' } stopOpacity='1' />
                                        <Stop offset='100%' stopColor={ '#ea0079' }  stopOpacity='1' />
                                    </LinearGradient>
                                ) }
                            />
                            }
                </ScrollView>
                </View> :
                <View style={{ backgroundColor: 'transparent', paddingVertical: 150 }}></View>
            }
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filterContainer: {
        flexDirection: 'row',
         
    },
});

export default DataUsageChart;
