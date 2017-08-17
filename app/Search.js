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
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import Code from "./Code";
export default class Search extends Component {
  constructor(props){
          super(props);
          this.state = {text: ''};
      }
    pressPop(){
        this.props.navigator.pop();
    }
   Code(){
        var nextRoute={
            name:"主页",
            component:Code
        };
        this.props.navigator.push(nextRoute)
    }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Title}>
            <TextInput  keyboardType="default" returnKeyType="search" onChangeText={(text) => this.setState({text})} placeholder="搜索商品名称" placeholderColor="#afafaf" underlineColorAndroid='transparent' style={styles.Search}></TextInput>
            <View style={styles.Right}>
                <TouchableOpacity onPress={this.Code.bind(this)} style={styles.HeaderImage1}>
                    <Image source={require("../images/sm.png")}></Image>
                </TouchableOpacity>
                <Text style={styles.Text}  onPress={this.pressPop.bind(this)}>取消</Text>
            </View>
        </View>
        <View style={styles.list}>
            <Text style={styles.ListText}>搜索“{this.state.text}”相关内容</Text>
        </View>
        <View style={styles.BlockList}>
            <View style={styles.Row}>
                <View style={styles.Block}>
                    <Text style={styles.BlockText}>YTT</Text>
                </View>
                <View style={styles.Block}>
                    <Text style={styles.BlockText}>YTT</Text>
                </View>
                <View style={styles.Block}>
                    <Text style={styles.BlockText}>YTT</Text>
                </View>
            </View>
            <View style={styles.Row}>
                <View style={styles.Block}>
                    <Text style={styles.BlockText}>YTT</Text>
                </View>
                <View style={styles.Block}>
                    <Text style={styles.BlockText}>YTT</Text>
                </View>
                <View style={styles.Block}>
                    <Text style={styles.BlockText}>YTT</Text>
                </View>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f6',
  },
  Title:{
    height:60,
    backgroundColor:"#ffffff",
    paddingLeft:25,
    paddingRight:25,
    paddingTop:13,
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor:"#cacccb"
  },
  Search:{
    borderRadius:5,
    backgroundColor:"#f2f5f6",
    color: "#323232",
    height:35,
    flex:7,
  },
  Right:{
    flex:2
  },
  HeaderImage1:{
    width:23,
    height:23,
    position:"absolute",
    right:60,
    top:4,
  },
  Text:{
    position:"absolute",
    right:0,
    top:4,
    fontSize:16,
  },
  BlockList:{
    flex:1,
    flexDirection: "column",
    backgroundColor:"#ffffff"
  },
  Row:{
    flexDirection:"row",
  },
  list:{
    height:60,
    paddingLeft:25,
    paddingRight:25,
  },
  ListText:{
    color:"#323232",
    fontSize:16,
    marginTop:20,
  },
  Block:{
    flex:3,
    paddingTop:40,
    paddingBottom:40,
    height:75,
    borderWidth:1,
    borderColor:"#e5e5e5",
    backgroundColor:"#ffffff"
  },
  BlockText:{
    textAlign:"center"
  }
});