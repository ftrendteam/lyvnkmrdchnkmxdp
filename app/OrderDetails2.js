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
  TouchableOpacity,
  Image,
  ListView,
  TextInput,
  Button,
  DeviceEventEmitter,
  ToastAndroid
} from 'react-native';
import Code from "./Code";
import home from "./Home";
import Index from "./Index";
import OrderDetails from "./OrderDetails2";
import Search from "./Search";
import Storage from "../utils/Storage";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
let dbAdapter = new DBAdapter();
var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
export default class GoodsDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            ProdCode:this.props.ProdCode ? this.props.ProdCode : "",//接受传入的值
            ProdName:this.props.ProdName ? this.props.ProdName : "",
            Pid:this.props.Pid ? this.props.Pid : "",
            ShopPrice:this.props.ShopPrice ? this.props.ShopPrice : "",
            Remark:this.props.Remark ? this.props.Remark : "",
            prototal:this.props.prototal ? this.props.prototal : "",
            Number:this.props.countm ? this.props.countm : "1",
            DepCode:this.props.DepCode ? this.props.DepCode : "",
            Price:"",
            totalPrice:"",
            name:""
        }
    }
    GoodsDetails(){
        this.props.navigator.pop();
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
                if(rows.length==0){
                    alert("该商品不存在")
                }else{
                    var ShopCar = rows.item(0).ProdName;
                    var nextRoute={
                        name:"主页",
                        component:OrderDetails2,
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
                    };
                    this.props.navigator.push(nextRoute);
                }
            })
        })
        //二维码扫描商品
       //var nextRoute={
            //name:"主页",
            //component:Code
       //};
       //this.props.navigator.push(nextRoute)
    }
    componentDidMount(){
        Storage.get('Name').then((tags) => {
            this.setState({
                 name: tags
            });
        });
    }
// 失焦时触发事件
    inputOnBlur(){
       var Number=this.state.Number;
       var ShopPrice=this.state.ShopPrice;
       this.state.totalPrice =Number*ShopPrice;
       this.setState({
           totalPrice: this.state.totalPrice
       });
    }
    add(){
        var Number1=this.state.Number;
        this.setState({
           Number:parseInt(Number1)+1
       });
    }
    subtraction(){
        var Number1=this.state.Number;
        this.setState({
           Number:parseInt(Number1)-1
        });
        if(Number1 == 0){
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
            this.setState({
               Number:0
            });
        }
    }
    clear(){
        var Number1=this.state.Number;
        this.setState({
           Number:0
        });
    }
    pressPop(){
        var shopInfoData = [];
        var shopInfo = {};
        shopInfo.Pid = this.state.Pid;
        shopInfo.ProdCode=this.state.ProdCode;
        shopInfo.prodname = this.state.ProdName;
        shopInfo.countm = this.state.Number;
        shopInfo.ShopPrice = this.state.ShopPrice;
        shopInfo.prototal =(this.state.Number)*(this.state.ShopPrice);
        shopInfo.promemo = this.state.Remark;
        shopInfo.DepCode = this.state.DepCode;
        shopInfoData.push(shopInfo);
        //调用插入表方法
        dbAdapter.insertShopInfo(shopInfoData);
        var nextRoute={
           name:"主页",
           component:Search,
        };
        this.props.navigator.push(nextRoute);
    }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
              <View style={styles.cont}>
                    <TouchableOpacity onPress={this.GoodsDetails.bind(this)} style={styles.Headeronclick}>
                          <Image source={require("../images/left1.png")} style={styles.HeaderImage}></Image>
                    </TouchableOpacity>
                    <Text style={styles.HeaderList}>{this.state.name}</Text>

              </View>
        </View>
        <View style={styles.Cont}>
            <View style={styles.List}>
                <Text style={styles.left}>名称</Text>
                <Text style={styles.right}>{this.state.ProdName}</Text>
            </View>
            <View style={styles.List}>
                <View style={styles.left1}>
                    <Text style={styles.NumberName}>数量</Text>
                    <TextInput style={styles.Number}
                        underlineColorAndroid='transparent'
                        keyboardType="numeric"
                        value={this.state.Number.toString()}
                        onBlur={this.inputOnBlur.bind(this)}
                        onChangeText={(value)=>{this.setState({Number:value})}}/>
                    <Text style={styles.NumberText}>件</Text>
                </View>
                <View style={styles.right1}>
                    <TouchableOpacity style={styles.sublime} onPress={this.clear.bind(this)}><Text style={styles.Delete}>×</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.sublime} onPress={this.subtraction.bind(this)}><Text style={styles.Reduce}>-</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.sublime} onPress={this.add.bind(this)}><Text style={styles.Increase}>+</Text></TouchableOpacity>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.left2}>
                    <Text style={styles.Price}>单价</Text>
                    <Text style={styles.Price1}>{this.state.ShopPrice}</Text>
                </View>
                <View style={styles.right2}>
                    <Text style={styles.price}>元/件</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.left2}>
                    <Text style={styles.Price}>金额</Text>
                    <Text style={styles.Price1}>
                    {(this.state.Number)*(this.state.ShopPrice)}
                    </Text>
                </View>
                <View style={styles.right2}>
                    <Text style={styles.price}>元</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.left2}>
                    <Text style={styles.Price2}>备注</Text>
                    <TextInput
                     style={styles.Number1}
                     placeholder="暂无备注"
                     value={this.state.Remark.toString()}
                     underlineColorAndroid='transparent'
                     onChangeText={(value)=>{this.setState({Remark:value})}}/>
                </View>
            </View>
            <View style={styles.button}>
                <Text style={styles.ButtonText} onPress={this.pressPop.bind(this)}>确定</Text>
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
  header:{
    height:60,
    backgroundColor:"#ffffff",
    paddingTop:15,
    paddingBottom:20,
    borderBottomWidth:1,
    borderBottomColor:"#cacccb"
  },
  cont:{
    flexDirection:"row",
    marginLeft:25,
  },
  Headeronclick:{
    width:30,
  },
  onclick:{
    width:50,
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
    fontSize:18,
  },
  Cont:{
    paddingTop:10,
    paddingBottom:10,
  },
  List:{
    height:45,
    paddingTop:4,
    backgroundColor:"#ffffff",
    paddingLeft:25,
    paddingRight:25,
    flexDirection:"row",
    marginBottom:10,
  },
  left:{
    fontSize:16,
    color:"#666666",
    position:"absolute",
    left:25,
    top:10,
    flexDirection:"row",
  },
  right:{
    position:"absolute",
    right:25,
    top:10,
    fontSize:16,
    color:"#666666",
    flexDirection:"row",
  },
  Right:{
    position:"absolute",
    left:76,
    top:10,
    fontSize:16,
    color:"#666666",
    flexDirection:"row",
  },
  left1:{
    height:45,
    flexDirection:"row",
    flex:5,
  },
  right1:{
    marginTop:5,
    flexDirection:"row",
    flex:3,
  },
  left2:{
    height:45,
    flexDirection:"row",
    flex:6,
  },
  right2:{
    position:"absolute",
    right:25,
    top:12,
    flexDirection:"row",
  },
  price:{
    fontSize:16,
    color:"#666666",
  },
  Price:{
    fontSize:16,
    color:"#666666",
    marginTop:10,
  },
  Price1:{
    fontSize:16,
    color:"#666666",
    marginTop:10,
    marginLeft:10,
  },
  Price2:{
    fontSize:16,
    color:"#666666",
    marginTop:10,
  },
  NumberName:{
    fontSize:16,
    color:"#666666",
    marginTop:10,
    flex:1
  },
  Number:{
    fontSize:16,
    color:"#666666",
    height:40,
    flex:3
  },
  Number1:{
    fontSize:16,
    color:"#666666",
    flex:6,
  },
  NumberText:{
    fontSize:18,
    color:"#666666",
    marginTop:5,
    flex:1
  },
  Delete:{
    fontSize:18,
    color:"#f63e4d",
    flex:1,
    textAlign:"center"
  },
  Reduce:{
    fontSize:18,
    color:"#f63e4d",
    flex:1,
    textAlign:"center"
  },
  Increase:{
    fontSize:18,
    color:"#f63e4d",
    flex:1,
    textAlign:"center"
  },
  sublime:{
    flex:1
  },
  button:{
    marginTop:50,
    flex:1,
    marginLeft:40,
    marginRight:40,
  },
  ButtonText:{
    color:"#ffffff",
    backgroundColor:"#f47882",
    height:35,
    lineHeight:25,
    borderRadius:5,
    textAlign:"center",
    fontSize:16,
  },
});