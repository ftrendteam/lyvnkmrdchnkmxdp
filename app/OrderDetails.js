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
  DeviceEventEmitter
} from 'react-native';
import Code from "./Code";
import home from "./Home";
import Index from "./Index";
import Search from "./Search";
import Storage from "../utils/Storage";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
let dbAdapter = new DBAdapter();
export default class GoodsDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            ProdCode:this.props.ProdCode ? this.props.ProdCode : "",//接受传入的值
            ProdName:this.props.ProdName ? this.props.ProdName : "",//接受传入的值
            Pid:this.props.Pid ? this.props.Pid : "",
            StdPrice:this.props.StdPrice ? this.props.StdPrice : "",
            ShopNumber:this.props.ShopNumber ? this.props.ShopNumber : "1",
            ShopRemark:this.props.ShopRemark ? this.props.ShopRemark : "",
            ShopAmount:this.props.ShopAmount ? this.props.ShopAmount : "",
            totalPrice:"",
            Number:this.props.ShopNumber ? this.props.ShopNumber : "",
            Price:"",
            Remark:this.props.ShopRemark ? this.props.ShopRemark : "",
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
       var nextRoute={
            name:"主页",
            component:Code
       };
       this.props.navigator.push(nextRoute)
    }
    componentDidMount(){
        var procode = this.state.ProdCode;
        alert(procode)
        Storage.save('procode',procode);
    }

// 失焦时触发事件
    inputOnBlur(){
       var Number=this.state.Number;
       var StdPrice=this.state.StdPrice;
       this.state.totalPrice =Number*StdPrice;
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
            alert('商品数量不能小于0');
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
        shopInfo.ShopName = this.state.ProdName;
        shopInfo.ShopNumber = this.state.Number;
        shopInfo.ShopPrice = this.state.StdPrice;
        shopInfo.ShopAmount =(this.state.Number)*(this.state.StdPrice);
        shopInfo.ShopRemark = this.state.Remark;
        shopInfoData.push(shopInfo);
        //然后调用方法
        dbAdapter.insertShopInfo(shopInfoData);
        var nextRoute={
           name:"主页",
           component:Index,
        };
        this.props.navigator.push(nextRoute);
//        this.props.navigator.pop();
    }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
              <View style={styles.cont}>
                    <TouchableOpacity   onPress={this.GoodsDetails.bind(this)}>
                          <Image source={require("../images/left1.png")} style={styles.HeaderImage}></Image>
                    </TouchableOpacity>
                    <Text style={styles.HeaderList}>要货单</Text>
                    <TouchableOpacity onPress={this.Code.bind(this)}>
                          <Image source={require("../images/sm.png")} style={styles.HeaderImage1}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.pressPush.bind(this)}>
                            <Image source={require("../images/search.png")} style={styles.HeaderImage}></Image>
                    </TouchableOpacity>
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
                    <Text style={styles.Price1}>{this.state.StdPrice}</Text>
                </View>
                <View style={styles.right2}>
                    <Text style={styles.price}>元/件</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.left2}>
                    <Text style={styles.Price}>金额</Text>
                    <Text style={styles.Price1}>
                    {(this.state.Number)*(this.state.StdPrice)}
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
    fontSize:20,
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
    flex:6,
  },
  right1:{
    height:45,
    flexDirection:"row",
    position:"absolute",
    right:25,
    top:8
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
    marginTop:5,
  },
  Price1:{
    fontSize:16,
    color:"#666666",
    marginTop:5,
    marginLeft:10,
  },
  Price2:{
    fontSize:16,
    color:"#666666",
    marginTop:8,
  },
  NumberName:{
    fontSize:16,
    color:"#666666",
    marginTop:5,
  },
  Number:{
    fontSize:16,
    color:"#666666",
    height:40,
    width:220,
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
  },
  Delete:{
    fontSize:18,
    color:"#f63e4d",
    textAlign:"left"
  },
  Reduce:{
    fontSize:18,
    color:"#f63e4d",
    textAlign:"center"
  },
  Increase:{
    fontSize:18,
    color:"#f63e4d",
    textAlign:"right"
  },
  sublime:{
    width:50,
  },
  button:{
    marginTop:50,
    flex:1,
    marginLeft:60,
    marginRight:60,
  },
  ButtonText:{
    color:"#ffffff",
    backgroundColor:"#f47882",
    height:45,
    lineHeight:30,
    borderRadius:5,
    textAlign:"center",
    fontSize:18,
  }
});