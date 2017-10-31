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
  TouchableOpacity,
  DeviceEventEmitter
} from 'react-native';
import Index from "./Index";
import Code from "./Code";
import OrderDetails from "./OrderDetails";
import OrderDetails2 from "./OrderDetails2";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
import Storage from '../utils/Storage';

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
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
      var nextRoute={
         name:"主页",
         component:Index,
      };
      this.props.navigator.push(nextRoute);
  }

  Code(){
      RNScannerAndroid.openScanner();
      DeviceEventEmitter.addListener("code", (reminder) => {
          dbAdapter.selectAidCode(reminder,1).then((rows)=>{
              var ShopCar = rows.item(0).ProdName;
              this.props.navigator.push({
                  component:OrderDetails2,
                  params:{
                      ProdName:rows.item(0).ProdName,
                      ShopPrice:rows.item(0).StdPrice,
                      Pid:rows.item(0).Pid,
                      countm:rows.item(0).ShopNumber,
                      promemo:rows.item(0).promemo,
                      prototal:rows.item(0).prototal,
                      ProdCode:rows.item(0).ProdCode,
                      DepCode:rows.item(0).DepCode1,
                  }
              })
          })
      })
  }

  inputOnBlur(value){
      dbAdapter.selectAidCode(value,1).then((rows)=>{
          this.dataRows=[];
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
              <TouchableOpacity onPress={()=>this.OrderDetails(rowData)}>
                 <Text style={styles.BlockText}>{rowData.ProdName}</Text>
              </TouchableOpacity>
          </View>
      );
  }

  OrderDetails(rowData){
     this.props.navigator.push({
        component:OrderDetails2,
        params:{
            ProdName:rowData.ProdName,
            ShopPrice:rowData.StdPrice,
            Pid:rowData.Pid,
            countm:rowData.ShopNumber,
            promemo:rowData.promemo,
            prototal:rowData.prototal,
            ProdCode:rowData.ProdCode,
            DepCode:rowData.DepCode1,
        }
     })
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
                 this.inputOnBlur(value)
             }}
             />
            <View style={styles.Right}>
                <TouchableOpacity onPress={this.Code.bind(this)} style={styles.HeaderImage1}>
                    <Image source={require("../images/sm.png")}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Text1}><Text style={styles.Text} onPress={this.pressPop.bind(this)}>取消</Text></TouchableOpacity>
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
                ref="myInput"
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
    paddingLeft:15,
    paddingRight:15,
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
    flex:5,
  },
  Right:{
    flex:2,
    flexDirection:"row",
    paddingTop:3,
    paddingLeft:6
  },
  HeaderImage1:{
      flex:1,
      marginLeft:20,
  },
  Text1:{
    flex:1,
  },
  Text:{
    fontSize:16,
    marginTop:2
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
    BlockText:{
      fontSize:16,
    }
});
