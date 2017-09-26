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
  FlatList,
  TouchableOpacity
} from 'react-native';
import Code from "./Code";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
import Storage from '../utils/Storage';
let dbAdapter = new DBAdapter();
let db;
export default class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
        Search:"",
    };
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
  componentDidMount(){
    let priductData=[];
    dbAdapter.selectAidCode('1').then((rows)=>{
        for(let i =0;i<rows.length;i++){
            var row = rows.item(i);
            priductData.push(row);
        }
        alert(JSON.stringify(row))
         this.setState({
             data:priductData,
         })
    });
  }
  _renderItem(item,index){
      return(
          <View style={styles.Block}>
              <Text style={styles.BlockText}>{item.item.ProdName}</Text>
          </View>
      )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Title}>
            <TextInput
             style={styles.Search}
             value={this.state.Number}
             returnKeyType="search"
             placeholder="搜索商品名称"
             placeholderColor="#afafaf"
             underlineColorAndroid='transparent'
             onChangeText={(value)=>{
                 this.setState({
                     Search:value
                 })
             }}
             />
            <View style={styles.Right}>
                <TouchableOpacity onPress={this.Code.bind(this)} style={styles.HeaderImage1}>
                    <Image source={require("../images/sm.png")}></Image>
                </TouchableOpacity>
                <Text style={styles.Text}  onPress={this.pressPop.bind(this)}>取消</Text>
            </View>
        </View>
        <View style={styles.list}>
            <Text style={styles.ListText}>搜索“{this.state.Search}”相关内容</Text>
        </View>
        <View style={styles.BlockList}>
           <FlatList
                numColumns={3}
                key={item => item.Pid}
                renderItem={this._renderItem.bind(this)}
                search={this.state.data}
           />
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
