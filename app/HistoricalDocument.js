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
  ScrollView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import GoodsDetails from "./GoodsDetails";
import Enquiries from "./Enquiries";
//第二页面
export default class HistoricalDocument extends Component {
  constructor(props){
        super(props);
    }
  pressPush(){
      var nextRoute={
          name:"主页",
          component:Enquiries
      };
      this.props.navigator.push(nextRoute)
    }
    GoodsDetails(){
          var nextRoute={
              name:"主页",
              component:GoodsDetails
          };
          this.props.navigator.push(nextRoute)
        }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.cont}>
                <Text style={styles.HeaderList}>要货单</Text>
                <TouchableOpacity onPress={this.pressPush.bind(this)}>
                    <Image source={require("../images/search1.png")} style={styles.HeaderImage}></Image>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.Rolling}>
            <ScrollView>
                 <View style={styles.Cont}>
                 <TouchableHighlight onPress={this.GoodsDetails.bind(this)}>
                    <View style={styles.ContList}>
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>要货单号：</Text>
                            <Text style={styles.ListRight}>YH34545878687890</Text>
                        </Text>
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>制单日期：</Text>
                            <Text style={styles.ListRight}>2017-10-12</Text>
                        </Text>
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>单据数量：</Text>
                            <Text style={styles.ListRight}>20</Text>
                        </Text>
                        <Text style={styles.List}>
                             <Text style={styles.ListLeft}>单据金额：</Text>
                             <Text style={styles.ListRight}>5000</Text>
                        </Text>
                        <Text style={styles.List} style={{marginBottom:15,}}>
                              <Text style={styles.ListLeft}>单据备注</Text>
                              <Text style={styles.ListRight}>大富科技刚看见的更快机构哦一破哦我狗我狗 快捷快递机构价公积金 的顾客就赶快来法国进口</Text>
                         </Text>
                    </View>
                    </TouchableHighlight>
                 </View>
            </ScrollView>
        </View>
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
             backgroundColor:"#f47882",
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
          color:"#ffffff",
          fontSize:20,
      },
      Cont:{
          marginLeft:25,
          marginRight:25,
          paddingLeft:35,
          paddingRight:35,
          borderBottomWidth:1,
          borderBottomColor:"#e5e5e5"
      },
      ContList:{
        paddingTop:15,
      },
      List:{
        flexDirection:"row",
        fontSize:14,
      },
      ListLeft:{
        color:"#636363",
      },
      ListRight:{
        color:"#323232",
        lineHeight:28,
      },
      Rolling:{
        flex:1,
      }
});