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
  ScrollableTabView,
  ScrollView
} from 'react-native';
//第二页面
export default class list extends Component {
  constructor(props){
        super(props);
    }
  pressPop(){
      this.props.navigator.pop();
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.pressPop.bind(this)}>
          <Text style={styles.login}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container:{
          flex:1,
          backgroundColor:"#f1f5f6",
      },
      login:{
          marginLeft:60,
          marginRight:60,
          marginTop:40,
          paddingTop:12,
          paddingBottom:12,
          backgroundColor:"#f47882",
          color:"#ffffff",
          borderRadius:3,
          textAlign:"center",
          fontSize:18,
      },
      header:{
        height:60,
        backgroundColor:"#ffffff",
        paddingTop:20,
        paddingBottom:20,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb"
      },
      cont:{
        flexDirection:"row",
        marginLeft:25,
        marginRight:25,
      },
      HeaderImage1:{
        marginRight:25,
      },
      HeaderList:{
        flex:6,
        textAlign:"center",
      },
      scrollview:{
        width:120,
        backgroundColor:"#ffffff",
      }
});