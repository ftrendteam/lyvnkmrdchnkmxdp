/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Navigator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Index from "./Index";
import HistoricalDocument from "./HistoricalDocument";
import ShoppingCart from "./ShoppingCart";
import TabNavigator from "react-native-tab-navigator";
//第二页面
export default class home extends Component {
   constructor(props){
     super(props);
     this.state = {
     	selectedTab:'home'
     };
   }
  render() {
    return (
      <View style={styles.container}>
                  <TabNavigator
                  tabBarStyle={{height:60,}}
                  >
                     <TabNavigator.Item
                     			  	title="历史单据"
                     			    selected={this.state.selectedTab === 'history'}
                     			    selectedTitleStyle={styles.selectedTextStyle}
                     			    titleStyle={styles.textStyle}
                                    renderIcon={() => <Image source={require("../images/documents.png")} resizeMode={"contain"} style={styles.iconStyle}/>}
                     			    renderSelectedIcon={() => <Image source={require("../images/documents1.png")} resizeMode={"contain"} style={styles.iconStyle}/>}
                     			    onPress={() => this.setState({ selectedTab: 'history' })}>
                     			    <HistoricalDocument {...this.props}/>
                     </TabNavigator.Item>
                     <TabNavigator.Item
                      			  	title="商品"
                      			    selected={this.state.selectedTab === 'home'}
                      			    selectedTitleStyle={styles.selectedTextStyle}
                      			    titleStyle={styles.textStyle}
                      			    renderIcon={() => <Image source={require("../images/home.png")} resizeMode={"contain"} style={styles.iconStyle}/>}
                                    renderSelectedIcon={() => <Image source={require("../images/home1.png")} resizeMode={"contain"} style={styles.iconStyle}/>}
                      			    onPress={() => this.setState({ selectedTab: 'home' })}>
                      			    <Index {...this.props}/>
                     </TabNavigator.Item>
                     <TabNavigator.Item
                      			  	title="清单"
                      			    selected={this.state.selectedTab === 'shoppingCart'}
                      			    selectedTitleStyle={styles.selectedTextStyle}
                      			    titleStyle={styles.textStyle}
                      			    renderIcon={() => <Image source={require("../images/shop.png")} resizeMode={"contain"} style={styles.iconStyle1}/>}
                                    renderSelectedIcon={() => <Image source={require("../images/shop1.png")} resizeMode={"contain"} style={styles.iconStyle1}/>}
                      			    onPress={() => this.setState({ selectedTab: 'shoppingCart' })}>
                      			    <ShoppingCart {...this.props}/>
                     </TabNavigator.Item>
                  </TabNavigator>
      </View>
    );
  }
}
const styles = StyleSheet.create({
   container:{
          flex:1,
          backgroundColor:"#f1f5f6",
      },
      iconStyle:{
             width:22,
             height:22,
         },
    iconStyle:{
        width:23,
        height:23,
    },
         textStyle:{
             color:'black',
             fontSize:16,
         },
         selectedTextStyle:{
             color:'#f47882',
             fontSize:16,
         }
});