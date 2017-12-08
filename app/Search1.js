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
  ListView,
  TextInput,
  TouchableOpacity,
  DeviceEventEmitter,
  InteractionManager,
} from 'react-native';

import Index from "./Index";
import ShoppingCart from "./ShoppingCart";
import Code from "./Code";
import OrderDetails from "./OrderDetails2";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let db;
let decodepreprint = new DeCodePrePrint18();

export default class Search extends Component {
  constructor(props){
      super(props);
      this.state = {
          Search:"",
          dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
      };
      this.dataRows = [];
  }

  componentDidMount(){
      InteractionManager.runAfterInteractions(() => {
        Storage.get('Name').then((tags) => {
            this.setState({
                head:tags
            })
        });
        this.Device()
      })
  }

    Device(){
        RNScannerAndroid.openScanner();
        DeviceEventEmitter.addListener("code", (reminder) => {
            var title = this.state.head;
            decodepreprint.init(reminder,dbAdapter);
            if(title ==null){
                this._Emptydata();
            }else {
                if(reminder.length==18&&decodepreprint.deCodePreFlag()){
                    decodepreprint.deCodeProdCode().then((datas)=>{
                        dbAdapter.selectProdCode(datas,1).then((rows)=>{
                            Storage.get('FormType').then((tags)=>{
                                this.setState({
                                    FormType:tags
                                })
                            })

                            Storage.get('LinkUrl').then((tags) => {
                                this.setState({
                                    LinkUrl:tags
                                })
                            })
                            //商品查询
                            Storage.get('userName').then((tags)=>{
                                let params = {
                                    reqCode:"App_PosReq",
                                    reqDetailCode:"App_Client_CurrProdQry",
                                    ClientCode:this.state.ClientCode,
                                    sDateTime:Date.parse(new Date()),
                                    Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                    username:tags,
                                    usercode:this.state.Usercode,
                                    SuppCode:rows.item(0).SuppCode,
                                    ShopCode:this.state.ShopCode,
                                    ChildShopCode:this.state.ChildShopCode,
                                    ProdCode:datas,
                                    OrgFormno:this.state.OrgFormno,
                                    FormType:this.state.FormType,
                                };
                                FetchUtil.post(this.state.LinkUrl,JSON.stringify(params)).then((data)=>{
                                    var countm=JSON.stringify(data.countm);
                                    var ShopPrice=JSON.stringify(data.ShopPrice);
                                    if(data.retcode == 1){
                                        var ShopCar = rows.item(0).ProdName;
                                        this.props.navigator.push({
                                            component:OrderDetails,
                                            params:{
                                                ProdName:rows.item(0).ProdName,
                                                ShopPrice:rows.item(0).ShopPrice,
                                                Pid:rows.item(0).Pid,
                                                countm:rows.item(0).ShopNumber,
                                                promemo:rows.item(0).promemo,
                                                prototal:rows.item(0).prototal,
                                                ProdCode:rows.item(0).ProdCode,
                                                DepCode:rows.item(0).DepCode1,
                                                SuppCode:rows.item(0).SuppCode,
                                                ydcountm:countm,
                                            }
                                        })
                                        DeviceEventEmitter.removeAllListeners();
                                    }else{
                                        alert(JSON.stringify(data))
                                    }
                                },(err)=>{
                                    alert("网络请求失败");
                                })
                            })
                        })
                    });
                }else{
                    dbAdapter.selectAidCode(reminder,1).then((rows)=>{
                        if(rows.length==0){
                            alert("该商品不存在")
                        }else{
                            Storage.get('FormType').then((tags)=>{
                                this.setState({
                                    FormType:tags
                                })
                            })

                            Storage.get('LinkUrl').then((tags) => {
                                this.setState({
                                    LinkUrl:tags
                                })
                            })
                            //商品查询
                            Storage.get('userName').then((tags)=>{
                                let params = {
                                    reqCode:"App_PosReq",
                                    reqDetailCode:"App_Client_CurrProdQry",
                                    ClientCode:this.state.ClientCode,
                                    sDateTime:Date.parse(new Date()),
                                    Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                    username:tags,
                                    usercode:this.state.Usercode,
                                    SuppCode:rows.item(0).SuppCode,
                                    ShopCode:this.state.ShopCode,
                                    ChildShopCode:this.state.ChildShopCode,
                                    ProdCode:rows.item(0).ProdCode,
                                    OrgFormno:this.state.OrgFormno,
                                    FormType:this.state.FormType,
                                };
                                FetchUtil.post(this.state.LinkUrl,JSON.stringify(params)).then((data)=>{
                                    var countm=JSON.stringify(data.countm);
                                    var ShopPrice=JSON.stringify(data.ShopPrice);
                                    if(data.retcode == 1){
                                        var ShopCar = rows.item(0).ProdName;
                                        this.props.navigator.push({
                                            component:OrderDetails,
                                            params:{
                                                ProdName:rows.item(0).ProdName,
                                                ShopPrice:rows.item(0).ShopPrice,
                                                Pid:rows.item(0).Pid,
                                                countm:rows.item(0).ShopNumber,
                                                promemo:rows.item(0).promemo,
                                                prototal:rows.item(0).prototal,
                                                ProdCode:rows.item(0).ProdCode,
                                                DepCode:rows.item(0).DepCode1,
                                                SuppCode:rows.item(0).SuppCode,
                                                ydcountm:countm,
                                            }
                                        })
                                        DeviceEventEmitter.removeAllListeners();
                                    }else{
                                        alert(JSON.stringify(data))
                                    }
                                },(err)=>{
                                    alert("网络请求失败");
                                })
                            })
                        }
                    })
                }
            }
        })
    }


    pressPop(){
      var nextRoute={
         name:"主页",
         component:ShoppingCart,
      };
      this.props.navigator.push(nextRoute);
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
      Storage.get('FormType').then((tags)=>{
          this.setState({
              FormType:tags
          })
      })

      Storage.get('LinkUrl').then((tags) => {
          this.setState({
              LinkUrl:tags
          })
      })
      //商品查询
      Storage.get('userName').then((tags)=>{
          let params = {
              reqCode:"App_PosReq",
              reqDetailCode:"App_Client_CurrProdQry",
              ClientCode:this.state.ClientCode,
              sDateTime:Date.parse(new Date()),
              Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
              username:tags,
              usercode:this.state.Usercode,
              SuppCode:rowData.SuppCode,
              ShopCode:this.state.ShopCode,
              ChildShopCode:this.state.ChildShopCode,
              ProdCode:rowData.ProdCode,
              OrgFormno:this.state.OrgFormno,
              FormType:this.state.FormType,
          };
          FetchUtil.post(this.state.LinkUrl,JSON.stringify(params)).then((data)=>{
              var countm=JSON.stringify(data.countm);
              var ShopPrice=JSON.stringify(data.ShopPrice);
              if(data.retcode == 1){
                  // if(data.isFond==1){
                  this.props.navigator.push({
                      component:OrderDetails,
                      params:{
                          ProdName:rowData.ProdName,
                          ShopPrice:rowData.StdPrice,
                          Pid:rowData.Pid,
                          countm:rowData.ShopNumber,
                          promemo:rowData.promemo,
                          prototal:rowData.prototal,
                          ProdCode:rowData.ProdCode,
                          DepCode:rowData.DepCode1,
                          ydcountm:countm,
                      }
                  })
                  // }else{
                  //     // alert('该商品暂时无法购买')
                  // }
              }else{
                  alert(JSON.stringify(data))
              }
          },(err)=>{
              alert("网络请求失败");
          })
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
                    placeholder="请输入搜索商品名称"
                    placeholderColor="#999999"
                    underlineColorAndroid='transparent'
                    onChangeText={(value)=>{
                        this.setState({
                            Search:value
                        })
                        this.inputOnBlur(value)
                    }}
                />
                <Image source={require("../images/2.png")} style={styles.SearchImage}></Image>
                <TouchableOpacity onPress={this.pressPop.bind(this)} style={styles.Right}>
                    <View style={styles.Text1}><Text style={styles.Text}>取消</Text></View>
                </TouchableOpacity>
            </View>
            <View style={styles.BlockList}>
                {
                    (this.state.dataRows=="")?
                        <View style={styles.Null}>
                            <Text style={styles.NullText}>
                                没有搜索到相关商品~~~
                            </Text>
                        </View>:
                        <ListView
                            dataSource={this.state.dataSource}
                            showsVerticalScrollIndicator={true}
                            renderRow={this._renderRow.bind(this)}
                            ref="myInput"
                        />
                }
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    Title:{
        backgroundColor:"#ff4e4e",
        paddingLeft:16,
        paddingRight:16,
        paddingTop:15,
        paddingBottom:15,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#cacccb"
    },
    SearchImage:{
        position:"absolute",
        top:22,
        left:24,
    },
    Search:{
        borderRadius:30,
        backgroundColor:"#ffffff",
        color: "#333333",
        paddingLeft:46,
        paddingBottom:15,
        paddingTop:6,
        paddingBottom:6,
        fontSize:14,
        flex:1,
    },
    Right:{
        width:60,
        flexDirection:"row",
        paddingTop:3,
        paddingLeft:6
    },
    HeaderImage1:{
        flex:1,
        marginLeft:20,
    },
    Text1:{
        flex:1
    },
    Text:{
        fontSize:18,
        color:"#ffffff",
        paddingTop:5,
        paddingLeft:10,
    },
    BlockList:{
        flex:1,
        flexDirection: "column",
        backgroundColor:"#ffffff"
    },
    Row:{
        flexDirection:"row",
    },
    Block:{
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:25,
        paddingRight:25,
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
        backgroundColor:"#ffffff"
    },
    BlockText:{
        fontSize:14,
        color:"#333333"
    },
    Null:{
        marginLeft:25,
        marginRight:25,
        marginTop:120,
    },
    NullText:{
        color:"#cccccc",
        fontSize:20,
        textAlign:"center"
    }
});
