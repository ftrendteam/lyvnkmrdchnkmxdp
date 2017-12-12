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
  ScrollView,
  Button,
  DeviceEventEmitter,
  ToastAndroid
} from 'react-native';
import Code from "./Code";
import home from "./Home";
import Index from "./Index";
import ShoppingCart from "./ShoppingCart";
import OrderDetails from "./OrderDetails";
import Search from "./Search";
import NumberUtils from "../utils/NumberUtils";
import Storage from "../utils/Storage";
import DBAdapter from "../adapter/DBAdapter";
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
            isFrist:this.props.countm ? true : false,
            DepCode:this.props.DepCode ? this.props.DepCode : "",
            ydcountm:this.props.ydcountm ? this.props.ydcountm : "",
            SuppCode:this.props.SuppCode ? this.props.SuppCode : "",
            Price:"",
            totalPrice:"",
            name:"",
            YdCountm:"",
            numberFormat2:""
        }
    }
    GoodsDetails(){
        var nextRoute={
            name:"ShoppingCart",
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
                if(rows.length==0){
                    alert("该商品不存在")
                }else{
                    var ShopCar = rows.item(0).ProdName;
                    var nextRoute={
                        name:"主页",
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

        Storage.get('YdCountm').then((tags)=>{
            this.setState({
                YdCountm:tags
            })
        });

        Storage.get('YuanDan').then((tags)=>{
            if(tags==1){
                if(this.state.Number == "1"&&!this.state.isFrist){
                    this.setState({
                        Number:this.state.ydcountm
                    })
                }
            }
            let numberFormat1 = NumberUtils.numberFormat2(this.state.ShopPrice);
            let numberFormat2 = NumberUtils.numberFormat2((this.state.Number)*(this.state.ShopPrice));
            this.setState({
                ShopPrice:numberFormat1,
                numberFormat2:numberFormat2,
            })
        })

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
            Number:parseInt(Number1)+1,
        });
        let numberFormat2 = NumberUtils.numberFormat2((parseInt(Number1)+1)*(this.state.ShopPrice));
        this.setState({
            numberFormat2:numberFormat2,
        });
    }
    subtraction(){
        if(this.state.Number >0){
            var Number1=this.state.Number;
            this.setState({
                Number:parseInt(Number1)-1,
            });
            let numberFormat2 = NumberUtils.numberFormat2((parseInt(Number1)-1)*(this.state.ShopPrice));
            this.setState({
                numberFormat2:numberFormat2,
            });
        }
        if(this.state.Number == 0){
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
            this.setState({
                Number:0
            });
        }
    }

    clear(){
        let numberFormat2 = NumberUtils.numberFormat2((0)*(this.state.ShopPrice));
        this.setState({
            Number:0,
            numberFormat2:numberFormat2,
        })
    }
    pressPop(){
        if(this.state.name==null) {
            alert("请选择单据")
        }else if(this.state.Number==0){
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
        }else{
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
            shopInfo.ydcountm = this.state.ydcountm;
            shopInfo.SuppCode = this.state.SuppCode;
            shopInfoData.push(shopInfo);
            //调用插入表方法
            dbAdapter.insertShopInfo(shopInfoData);
            var nextRoute = {
                name: "主页",
                component: ShoppingCart,
                params: {
                    DepCode: this.state.DepCode,
                }
            };
            this.props.navigator.push(nextRoute);
        }
    }

  render(){
    return (
      <View style={styles.container}>
          <ScrollView style={styles.ScrollView} scrollEnabled={false}>
              <View style={styles.header}>
                  <View style={styles.cont}>
                      <TouchableOpacity onPress={this.GoodsDetails.bind(this)}>
                          <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                      </TouchableOpacity>
                      <Text style={styles.HeaderList}>{this.state.name}</Text>

                  </View>
              </View>
              <View style={styles.Cont}>
                  <View style={styles.List}>
                      <Text style={styles.left}>名称</Text>
                      <Text style={styles.right}>{this.state.ProdName}</Text>
                  </View>
                  <View style={[styles.List,{paddingTop:12}]}>
                      <View style={styles.left1}>
                          <Text style={[styles.left,{marginTop:4}]}>数量</Text>
                          <TextInput style={styles.Number}
                                     underlineColorAndroid='transparent'
                                     keyboardType="numeric"
                                     value={this.state.Number.toString()}
                                     placeholderTextColor="#333333"
                                     onBlur={this.inputOnBlur.bind(this)}
                                     onChangeText={(value)=>{this.setState({Number:value})}}/>
                      </View>
                      <View style={styles.right1}>
                          <TouchableOpacity style={styles.sublime} onPress={this.clear.bind(this)}><Image source={require("../images/1_09.png")}/></TouchableOpacity>
                          <TouchableOpacity style={styles.sublime} onPress={this.add.bind(this)}><Image source={require("../images/1_15.png")}/></TouchableOpacity>
                          <TouchableOpacity style={styles.sublime} onPress={this.subtraction.bind(this)}><Image source={require("../images/1_13.png")}/></TouchableOpacity>
                      </View>
                  </View>
                  {
                      (this.state.YdCountm==1)?
                          <View style={styles.List}>
                              <View style={styles.left2}>
                                  <Text style={styles.left}>现在库存</Text>
                                  <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                              </View>
                          </View>:null
                  }
                  {
                      (this.state.YdCountm==2)?
                          <View style={styles.List}>
                              <View style={styles.left2}>
                                  <Text style={styles.left}>原单数量</Text>
                                  <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                              </View>
                          </View>:null
                  }
                  <View style={styles.List}>
                      <View style={styles.left2}>
                          <Text style={styles.left}>单价</Text>
                          <Text style={styles.Price1}>{this.state.ShopPrice}</Text>
                      </View>
                      <View style={styles.right2}>
                          <Text style={styles.price}>元/件</Text>
                      </View>
                  </View>
                  <View style={styles.List}>
                      <View style={styles.left2}>
                          <Text style={styles.left}>金额</Text>
                          <Text style={styles.Price1}>
                              {this.state.numberFormat2}
                          </Text>
                      </View>
                      <View style={styles.right2}>
                          <Text style={styles.price}>元</Text>
                      </View>
                  </View>
                  <View style={[styles.List,{paddingTop:10,}]}>
                      <View style={styles.left2}>
                          <Text style={[styles.left,{marginTop:9,}]}>备注</Text>
                          <TextInput
                              style={styles.Number1}
                              placeholder="暂无备注"
                              placeholderTextColor="#333333"
                              maxLength={24}
                              value={this.state.Remark.toString()}
                              underlineColorAndroid='transparent'
                              onChangeText={(value)=>{this.setState({Remark:value})}}/>
                      </View>
                  </View>
                  <TouchableOpacity onPress={this.pressPop.bind(this)} style={styles.button}>
                      <Text style={styles.ButtonText}>确定</Text>
                  </TouchableOpacity>
              </View>
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header:{
        height:60,
        backgroundColor:"#ff4e4e",
        paddingTop:10,
    },
    cont:{
        flexDirection:"row",
        paddingLeft:16,
        paddingRight:16,
    },
    HeaderImage1:{
        marginRight:25,
        marginTop:5
    },
    HeaderList:{
        flex:6,
        textAlign:"center",
        color:"#ffffff",
        fontSize:22,
        marginTop:3,
    },
    List:{
        height:54,
        paddingTop:15,
        backgroundColor:"#ffffff",
        paddingLeft:25,
        paddingRight:25,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2"
    },
    left:{
        fontSize:16,
        color:"#666666",
        width:75,
        textAlign:"right"
    },
    right:{
        fontSize:16,
        color:"#333333",
        flexDirection:"row",
        marginLeft:15,
        fontWeight:"200"
    },
    Right:{
        fontSize:16,
        color:"#666666",
        flexDirection:"row",
    },
    left1:{
        flexDirection:"row",
        flex:1,
        marginRight:160,
    },
    right1:{
        flexDirection:"row",
        position:"absolute",
        right:15,
        top:5,
    },
    left2:{
        flexDirection:"row",
        flex:6,
    },
    right2:{
        position:"absolute",
        right:25,
        top:12,
        flexDirection:"row",
    },
    Price1:{
        fontSize:16,
        color:"#333333",
        marginLeft:15,
        fontWeight:"200",
    },
    Number:{
        fontSize:16,
        color:"#333333",
        fontWeight:"200",
        flex:3,
        marginLeft:5,
        marginBottom:4,
    },
    Number1:{
        fontSize:16,
        color:"#333333",
        flex:6,
        marginBottom:1,
        fontWeight:"200"
    },
    Delete:{
        fontSize:20,
        color:"#f63e4d",
        flex:1,
        textAlign:"center"
    },
    Reduce:{
        fontSize:20,
        color:"#f63e4d",
        flex:1,
        textAlign:"center"
    },
    Increase:{
        fontSize:20,
        color:"#f63e4d",
        flex:1,
        textAlign:"center"
    },
    sublime:{
        marginLeft:8,
    },
    button:{
        marginTop:30,
        flex:1,
        marginLeft:25,
        marginRight:25,
        backgroundColor:"#ff4e4e",
        borderRadius:5,
        paddingTop:13,
        paddingBottom:13,
    },
    ButtonText:{
        color:"#ffffff",
        textAlign:"center",
        fontSize:18,
    },
});