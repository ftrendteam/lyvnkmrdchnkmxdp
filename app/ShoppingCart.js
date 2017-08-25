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
} from 'react-native';
import Code from "./Code";
import Search from "./Search";
import Succeed from "./Succeed";
import OrderDetails from "./OrderDetails";
import List from "./List";
import XZHBottomView from './XZHBottomView';
import XZHWineCell from  './XZHWineCell';
import SideMenu from 'react-native-side-menu';
var data = require('./../LocalData/data.json');
//第二页面
export default class ShoppingCart extends Component {
constructor(props){
        super(props);
        this.state = {
            show:false,
        };
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
    Succeed(){
          var nextRoute={
              name:"主页",
              component:Succeed
          };
          this.props.navigator.push(nextRoute)
    }
    List(){
        var nextRoute={
            name:"主页",
            component:List
        };
        this.props.navigator.push(nextRoute)
    }
    OrderDetails(){
        var nextRoute={
            name:"主页",
            component:OrderDetails
        };
        this.props.navigator.push(nextRoute)
    }
    pressPop(){
          this._setModalVisible()
          this.props.navigator.pop();
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
                  <TouchableOpacity onPress={this.List.bind(this)}>
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
                <ScrollView>
                    <View style={styles.ShopList}>
                        <TouchableOpacity style={styles.ShopContList} onPress={this.OrderDetails.bind(this)}>
                            <View style={styles.ShopTop}>
                                <Text style={styles.ShopLeft}>苹果</Text>
                                <Text style={styles.ShopRight}>单位：件</Text>
                            </View>
                            <View style={styles.ShopTop}>
                                <Text style={[styles.Name,styles.Name1]}></Text>
                                <Text style={[styles.Number,styles.Name1]}>12.00</Text>
                                <Text style={[styles.Price,styles.Name1]}>12.00</Text>
                                <Text style={[styles.SmallScale,styles.Name2]}>144.00</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
           <XZHBottomView style={styles.bottomViewStyle}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
        container:{
            flex:1,
            backgroundColor:"#ffffff",
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
            fontSize:16,
        },
        ShopRight:{
            flex:1,
            textAlign:"right",
            color:"#666666",
            fontSize:16,
        },
        Name1:{
            color:"#333333",
            fontSize:16,
        },
        Name2:{
            color:"#f63e4d"
        },
        ContList1:{
            marginBottom:10,
            flex:1,
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
            fontSize:16,
            color:"#555555",
        },
        client:{
            fontSize:16,
            color:"#555555",
        },
        ClientType:{
            fontSize:16,
            color:"#555555",
        },
        goods:{
            fontSize:16,
            color:"#555555"
        },
        GoodsNumber:{
            fontSize:16,
            color:"#555555"
        },
        Price1:{
            fontSize:16,
            color:"#f47882",
            position:"absolute",
            right:0,
        },
        DocumentsNote:{
            fontSize:16,
            color:"#f47882"
        },
        Submit:{
            fontSize:16,
            color:"#ffffff",
            backgroundColor:"#f47882",
            paddingTop:15,
            paddingBottom:15,
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
       LayerThickness:{
            backgroundColor:"#000000",
            opacity:0.5,
            flex:1,
       },
       ModalView:{
            position:"absolute",
            width:400,
            height:260,
            backgroundColor:"#ffffff",
            borderRadius:5,
            top:250,
            marginLeft:100,
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
        fontSize:16,
       },
       TextInput:{
        width:350,
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
       }




});