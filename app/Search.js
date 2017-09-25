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
  ListView,
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
        dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
    };
    this.dataRows = [];
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
  inputOnBlur(){
    dbAdapter.selectAidCode(this.state.Search).then((rows)=>{
        for(let i =0;i<rows.length;i++){
            var row = rows.item(i);
            this.dataRows.push(row);
        }
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
        })
    });
  }
  _renderRow(rowData, sectionID, rowID){
       return (
          <View style={styles.Block}>
             <Text style={styles.BlockText}>{rowData.ProdName}</Text>
          </View>
       );
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
             onSelectionChange={this.inputOnBlur.bind(this)}
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
             <ListView
                dataSource={this.state.dataSource}
                showsVerticalScrollIndicator={true}
                renderRow={this._renderRow.bind(this)}
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
    paddingTop:20,
    paddingBottom:20,
    marginLeft:25,
    marginRight:25,
    borderBottomWidth:1,
    borderBottomColor:"#e5e5e5",
    backgroundColor:"#ffffff"
  },
});
