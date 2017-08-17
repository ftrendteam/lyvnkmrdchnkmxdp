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
  Button
} from 'react-native';
import Code from "./Code";
import Search from "./Search";
export default class GoodsDetails extends Component {
    constructor(props){
          super(props);
      }
      pressPop(){
              this.props.navigator.pop();
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
                <Text style={styles.right}>苹果笔记本</Text>
            </View>
            <View style={styles.List}>
                <View style={styles.left1}>
                    <Text style={styles.NumberName}>数量</Text>
                    <TextInput style={styles.Number} underlineColorAndroid='transparent' />
                </View>
                <View style={styles.right1}>
                    <Text style={styles.NumberText}>件</Text>
                    <Text style={styles.Delete}>×</Text>
                    <Text style={styles.Reduce}>-</Text>
                    <Text style={styles.Increase}>+</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.left2}>
                    <Text style={styles.price}>单价</Text>
                    <Text style={styles.Price}>152800.00</Text>
                </View>
                <View style={styles.right2}>
                    <Text style={styles.price}>元/件</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.left2}>
                    <Text style={styles.price}>金额</Text>
                    <Text style={styles.Price}>564564658798899900.00</Text>
                </View>
                <View style={styles.right2}>
                    <Text style={styles.price}>元</Text>
                </View>
            </View>
            <View style={styles.List}>
                <Text style={styles.left}>备注</Text>
                <Text style={styles.Right}>暂无备注</Text>
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
    height:50,
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
    height:50,
    flexDirection:"row",
  },
  right1:{
    flex:1,
    height:50,
    flexDirection:"row",
  },
 left2:{
    position:"absolute",
    left:25,
    top:12,
    flexDirection:"row",
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
    position:"absolute",
    left:50,
    fontSize:16,
    color:"#f63e4d",
  },
 NumberName:{
    position:"absolute",
    fontSize:16,
    color:"#666666",
    top:12,
  },
  Number:{
    position:"absolute",
    left:40,
    fontSize:16,
    color:"#666666",
    top:8,
    height:40,
    width:300,
  },
  NumberText:{
    position:"absolute",
    right:150,
    fontSize:18,
    color:"#666666",
    top:10,
  },
  Delete:{
    position:"absolute",
    right:80,
    fontSize:18,
    color:"#f63e4d",
    top:10,
  },
  Reduce:{
    position:"absolute",
    right:40,
    fontSize:18,
    color:"#f63e4d",
    top:10,
  },
  Increase:{
    position:"absolute",
    right:0,
    fontSize:18,
    color:"#f63e4d",
    top:10,
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