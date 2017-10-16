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
  Modal,
  Dimensions,
  TouchableHighlight,
  ListView,
  DeviceEventEmitter
} from 'react-native';
import Index from "./Index";
import HistoricalDocument from "./HistoricalDocument";
import Code from "./Code";
import Search from "./Search";
import Succeed from "./Succeed";
import OrderDetails from "./OrderDetails";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DataUtils from '../utils/DataUtils';
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";
import SideMenu from 'react-native-side-menu';

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let db;
export default class ShoppingCart extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            ShopNumber:"",
            ShopAmount:"",
            reqDetailCode:"",
            Remark:"",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        };
        this.dataRows = [];
    }
    HISTORY(){
        var nextRoute={
            name:"主页",
            component:HistoricalDocument
        };
        this.props.navigator.push(nextRoute)
    }
    HOME(){
        var nextRoute={
            name:"主页",
            component:Index
        };
        this.props.navigator.push(nextRoute)
    }
    SHOP(){
        var nextRoute={
            name:"主页",

            component:ShoppingCart
        };
        this.props.navigator.push(nextRoute)
    }
    pressPush(){
          var nextRoute={
              name:"主页",
              component:Search
          };
          this.props.navigator.push(nextRoute)
        }
    Code(){
        RNScannerAndroid.openScanner();
        DeviceEventEmitter.addListener("code", (reminder) => {
            dbAdapter.selectAidCode(reminder,1).then((rows)=>{
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
                    }
                })
            })
        })
    }
    OrderDetails(rowData){
        this.props.navigator.push({
            component:OrderDetails,
            params:{
                ProdName:rowData.prodname,
                ShopPrice:rowData.ShopPrice,
                countm:rowData.countm,
                Pid:rowData.pid,
                ProdCode:rowData.ProdCode,
                DepCode:rowData.DepCode,
            }
        })
    }
//自动跑接口
    componentDidMount(){
       //取出保存本地的数据  'valueOf'是保存的时候自己定义的参数   tags就是保存的那个值
       //在一进来页面就取出来，就不会出现第一次点击为 空值
       Storage.get('valueOf').then((tags) => {
            this.setState({
                reqDetailCode: tags
            })
        });
       Storage.get('OrgFormno').then((tags) => {
            this.setState({
                orgFormno: tags
            });
       });
       Storage.get('procode').then((tags) => {
            this.setState({
                procode: tags
            });
       });
       //username获取
       Storage.get('username').then((tags) => {
            this.setState({
                Username: tags
            });
       });
       //usercode获取
       Storage.get('userpwd').then((tags) => {
            this.setState({
                Userpwd: tags
            });
       });
       dbAdapter.selectShopInfo('1').then((rows)=>{
           var shopnumber = 0;
           var shopAmount = 0;
           this.dataRows=[];
           for(let i =0;i<rows.length;i++){
               var row = rows.item(i);
               var number = row.countm;
               shopAmount += parseInt(row.prototal);
               shopnumber += parseInt(row.countm);
               this.dataRows.push(row);
           }
           if(this.dataRows==0){
                return;
           }else{
           this.setState({
               number1:number,
               ShopNumber:shopnumber,//数量
               ShopAmount:shopAmount,//总金额
               dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
           })
           }
       });
    }
     _renderRow(rowData, sectionID, rowID){
         return (
            <View style={styles.ShopList}>
                <TouchableOpacity style={styles.ShopContList} onPress={()=>this.OrderDetails(rowData)}>
                    <View style={styles.ShopTop}>
                        <Text style={styles.ShopLeft}>{rowData.prodname}</Text>
                        <Text style={styles.ShopRight}>单位：件</Text>
                    </View>
                    <View style={styles.ShopTop}>
                        <Text style={[styles.Name,styles.Name1]}></Text>
                        <Text style={[styles.Number,styles.Name1]}>{rowData.countm}</Text>
                        <Text style={[styles.Price,styles.Name1]}>{rowData.ShopPrice}</Text>
                        <Text style={[styles.SmallScale,styles.Name2]}>{rowData.prototal}</Text>
                    </View>
                </TouchableOpacity>
            </View>
         );
     }
    pressPop(){
          this._setModalVisible();
          this.props.navigator.pop();
    }
//提交
    submit(){
        Storage.get('code').then((tags) => {
            DataUtils.get("usercode","").then((usercode)=>{
                DataUtils.get("username","").then((username)=>{
                    let params = {
                        ClientCode: this.state.ClientCode,
                        username: this.state.Username,
                        usercode: this.state.Userpwd,
                        Remark: this.state.ShopRemark,
                    };
                });
            });
            let params = {
                reqCode: "App_PosReq",
                reqDetailCode: this.state.reqDetailCode,
                ClientCode: this.state.ClientCode,
                sDateTime: "2017-08-09 12:12:12",
                Sign: NetUtils.MD5("App_PosReq" + "##" +this.state.reqDetailCode + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',
                username: this.state.Username,
                usercode: this.state.Userpwd,
                DetailInfo1: {"ShopCode": tags, "OrgFormno": this.state.orgFormno, "ProMemo": this.state.Remark},
                DetailInfo2: this.dataRows
            };
            FetchUtils.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
                if(data.retcode == 1){
                   alert("提交成功")
                    }else{
//                   alert("提交失败");
                     alert(JSON.stringify(data))
                }
            })
        })
        dbAdapter.deleteData("shopInfo");
        this.componentDidMount();
    }
    _rightButtonClick() {
        Storage.get('textinput').then((tags) => {
            alert(tags);
            this.setState({
                Remark:tags
            })
//            alert(this.state.Remark)
        });
        console.log('右侧按钮点击了');
        this._setModalVisible();
    }
    _setModalVisible() {
        Storage.save('textinput',this.state.Remark);
        let isShow = this.state.show;
        this.setState({
          show:!isShow,
        });
    }

    renderLoadingView(){
       return (<View style={styles.container} >
               <Text>Loading movies......</Text>
           </View>
       );
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.cont}>
                <Text style={styles.HeaderList}>商品清单</Text>
                <TouchableOpacity onPress={this.Code.bind(this)}>
                    <Image source={require("../images/sm.png")} style={styles.HeaderImage1}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pressPush.bind(this)}>
                    <Image source={require("../images/search.png")} style={styles.HeaderImage}></Image>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.ContList1}>
            <View style={styles.Line}></View>
            <View style={styles.NameList}>
                <Text style={styles.Name}>名字</Text>
                <Text style={styles.Number}>数量</Text>
                <Text style={styles.Price}>单价</Text>
                <Text style={styles.SmallScale}>小计</Text>
            </View>
            <View style={styles.ContList}>
                    <ListView
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={true}
                        renderRow={this._renderRow.bind(this)}
                    />
            </View>
        </View>
        <View style={styles.viewStyle}>
            <View style={styles.Combined}>
                <Text style={styles.CombinedText}>合计：</Text>
            </View>
            <View style={styles.Client}>
                <Text style={styles.ClientText}>
                    <Text style={styles.client}>客户：</Text>
                    <Text style={styles.ClientType}>散户</Text>
                </Text>
                <Text style={styles.goodSNumber}>
                    <Text style={styles.goods}>货品：</Text>
                    <Text style={styles.GoodsNumber}>{this.state.ShopNumber}</Text>
                </Text>
                <Text style={styles.Price1}>￥{this.state.ShopAmount}</Text>
            </View>
            <View style={styles.Note}>
                <TouchableOpacity onPress={this._rightButtonClick.bind(this)}>
                    <Text style={styles.DocumentsNote}>单据备注</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.Submit} onPress={this.submit.bind(this)}>
                    <Text style={{fontSize:14,color:"#ffffff",}}>提交</Text>
                </TouchableOpacity>
            </View>
            <Modal
            transparent={true}
            visible={this.state.show}
            onShow={() => {}}
            onRequestClose={() => {}} >
                 <View style={styles.modalStyle}>
                      <View style={styles.LayerThickness}></View>
                      <View style={styles.ModalView}>
                          <View style={styles.DanJu}><Text style={styles.DanText}>单据备注</Text></View>
                                <TextInput
                                multiline={true}
                                placeholder="请填写单据备注信息"
                                underlineColorAndroid='transparent'
                                placeholderTextColor="#bcbdc1"
                                style={styles.TextInput}
                                onChangeText={(value)=>{
                                    this.setState({
                                        Remark:value
                                    })
                                }}/>
                                <View style={styles.ModalLeft} >
                                     <Text style={styles.buttonText1} onPress={this._setModalVisible.bind(this)}>×</Text>
                          </View>
                      </View>

                 </View>
            </Modal>
        </View>
        <View style={styles.footer}>
            <TouchableOpacity style={styles.Home} onPress={this.HISTORY.bind(this)}><Image source={require("../images/documents.png")}></Image><Text style={styles.home1}>历史单据</Text></TouchableOpacity>
            <TouchableOpacity style={styles.Home} onPress={this.HOME.bind(this)}><Image source={require("../images/home.png")}></Image><Text style={styles.home1}>首页</Text></TouchableOpacity>
            <TouchableOpacity style={styles.Home} onPress={this.SHOP.bind(this)}>
              <View><Image source={require("../images/shop1.png")}><Text style={styles.ShopCar}>{this.state.shopcar}</Text></Image></View>
              <Text style={styles.home2}>清单</Text>
            </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    footer:{
        flex:3,
        flexDirection:"row",
        borderTopWidth:1,
        borderTopColor:"#cacccb"
    },
     source:{
        flexDirection:"row",
        flex:1,
     },
     Home:{
        flex:1,
        alignItems: 'center',
        paddingTop:15,
        backgroundColor:"#ffffff",
     },
     home1:{
       color:'black',
       fontSize:14,
       marginTop:5,
       flex:1,
     },
     home2:{
       color:'#f47882',
       fontSize:14,
       marginTop:5,
       flex:1,
     },
     ShopCar:{
       color:"red",
       position:"absolute",
       right:-35,
     },
    container:{
      flex:1,
      backgroundColor:"#ffffff",
    },
   header:{
      height:50,
      backgroundColor:"#ffffff",
      paddingTop:10,
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
      marginTop:5
   },
   HeaderImage:{
      marginTop:5
   },
   HeaderList:{
      flex:6,
      textAlign:"center",
      color:"#323232",
      fontSize:16,
   },
   Line:{
      height:10,
      backgroundColor:"#f1f5f6"
   },
   NameList:{
      paddingLeft:25,
      paddingRight:25,
      flexDirection:"row",
      height:60,
      alignItems:"center",
      backgroundColor:"#fafafa",
      borderTopWidth:1,
      borderTopColor:"#f1f1f1"
   },
   Name:{
      flex:2,
      fontSize:16,
      color:"#333333",
   },
   Number:{
      flex:1,
      textAlign:"right",
      fontSize:16,
      color:"#333333",
   },
   Price:{
      flex:1,
      textAlign:"right",
      fontSize:16,
      color:"#333333",
   },
   SmallScale:{
      flex:1,
      textAlign:"right",
      fontSize:16,
      color:"#333333",
   },
   ShopList:{
      marginLeft:25,
      marginRight:25,
   },
   ShopContList:{
      borderBottomWidth:1,
      borderBottomColor:"#f5f5f5",
      paddingTop:20,
   },
   ShopTop:{
      marginBottom:20,
      flexDirection:"row",
   },
   ShopLeft:{
      flex:6,
      color:"#666666",
      fontSize:14,
   },
   ShopRight:{
      flex:2,
      textAlign:"right",
      color:"#666666",
      fontSize:14,
   },
   Name1:{
      color:"#333333",
      fontSize:14,
   },
   Name2:{
      color:"#f63e4d",
      fontSize:14,
   },
   ContList1:{
      flex:12,
      marginBottom:60,
   },
   CommoditySettlement:{
      backgroundColor:"#ffffff",
      borderTopWidth:1,
      borderTopColor:"#f5f5f5",
      paddingLeft:25,
      paddingRight:25,
      paddingTop:15,
      height:160,

   },
   Client:{
      flexDirection:"row",
      marginTop:15,
      marginBottom:15,
   },
   Goods:{
      flexDirection:"row",
   },
   Note:{
      flexDirection:"row",
   },
   CombinedText:{
      fontSize:14,
      color:"#555555",
   },
   client:{
      fontSize:14,
      color:"#555555",
   },
   ClientType:{
      fontSize:14,
      color:"#555555",
   },
   goods:{
      fontSize:14,
      color:"#555555",
      marginRight:3,
      width:45,
   },
   GoodsNumber:{
      fontSize:14,
      color:"#555555",
      flex:2
   },
   Price1:{
      fontSize:14,
      color:"#f47882",
      flex:2,
   },
   DocumentsNote:{
      fontSize:14,
      color:"#f47882"
   },
   Submit:{
      fontSize:14,
      color:"#ffffff",
      backgroundColor:"#f47882",
      paddingTop:7,
      paddingBottom:7,
      paddingLeft:50,
      paddingRight:50,
      position:"absolute",
      right:0,
   },
   goodSNumber:{
      position:"absolute",
      right:120,
   },
   modalStyle: {
     flex:1,
   },
   ModalView:{
      backgroundColor:"#ffffff",
      borderRadius:5,
      position:"absolute",
      top:130,
      left:50,
      width:300,
      paddingBottom:20
   },
   DanJu:{
      height:45,
      backgroundColor:"#fbced2",
      borderRadius:5,
   },
   DanText:{
      color:"#f47882",
      lineHeight:30,
      textAlign:"center",
      fontSize:14,
   },
   TextInput:{
      width:300,
      marginLeft:25,
      marginRight:25,
      height:180,
      marginTop:15,
      borderWidth:1,
      borderColor:"#fbced2",
   },
   ModalLeft:{
     position:"absolute",
     right:15,
     top:3,
   },
   buttonText1:{
     color:"#f47882",
     fontSize:24,
     width:30,
   },
    viewStyle:{
        backgroundColor:"#ffffff",
        borderTopWidth:1,
        borderTopColor:"#f5f5f5",
        paddingLeft:25,
        paddingRight:25,
        paddingTop:6,
        flex:5,
    },

    leftView:{
        flexDirection:'row',
        marginLeft: 8
    },

    rightView:{
        flexDirection:'row',
        marginRight: 8
    },
    CombinedText:{
        fontSize:16,
        color:"#555555",
    },
    Client:{
        marginTop:10,
        marginBottom:10,
        flexDirection:'row',
    },
    client:{
        fontSize:14,
        color:"#555555",
    },
    ClientType:{
        fontSize:14,
        color:"#555555",
    },
    goods:{
        fontSize:14,
        color:"#555555"
    },
    ClientText:{
        flex:2
    },
    goodSNumber:{
        flex:2
    },
    GoodsNumber:{
        fontSize:14,
        color:"#555555"
    },
    Price1:{
        fontSize:14,
        color:"#f47882",
        flex:2,
        textAlign:"right"
    },
    DocumentsNote:{
        fontSize:14,
        color:"#f47882",
        marginTop:15,
    },
    Submit:{
        backgroundColor:"#f47882",
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:50,
        paddingRight:50,
        position:"absolute",
        right:0,
    },
    modalStyle: {
        flex:1,
    },
    LayerThickness:{
        backgroundColor:"#000000",
        opacity:0.5,
        flex:1,
    },
    DanJu:{
        height:45,
        backgroundColor:"#fbced2",
        borderRadius:5,
    },
    DanText:{
        color:"#f47882",
        lineHeight:30,
        textAlign:"center",
        fontSize:14,
    },
    TextInput:{
        marginLeft:25,
        marginRight:25,
        height:180,
        marginTop:15,
        borderWidth:1,
        borderColor:"#fbced2",
        textAlignVertical: 'top'
    },
    ModalLeft:{
        position:"absolute",
        right:15,
        top:3,
    },
    buttonText1:{
        color:"#f47882",
        fontSize:20,
    }
});