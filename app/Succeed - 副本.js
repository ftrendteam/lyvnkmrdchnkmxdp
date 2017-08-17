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
  Image
} from 'react-native';
import home from "./Home";
export default class Succeed extends Component {
      constructor(props){
            super(props);
        }
        succeed(){
            var nextRoute={
                name:"主页",
                component:home
            };
            this.props.navigator.push(nextRoute)
        }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Title}>
            <TouchableOpacity  style={styles.HeaderImage} onPress={this.succeed.bind(this)}>
                 <Image source={require("../images/left.png")}></Image>
            </TouchableOpacity>
            <Text style={styles.Text}>订单提交成功</Text>
        </View>
        <View style={styles.Cont}>
            <Image source={require("../images/succeed.png")} style={styles.Image}></Image>
            <Text style={styles.succeed}>支付成功</Text>
            <Text style={styles.price}>￥288.00</Text>
            <View style={styles.button}>
                <Text style={styles.ButtonText} onPress={this.succeed.bind(this)}>完成</Text>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  Title:{
    height:60,
    backgroundColor:"#f47882",
    paddingLeft:25,
    paddingRight:25,
    paddingTop:13,
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor:"#cacccb"
  },
  HeaderImage:{
    width:15,
    height:22,
    marginTop:5,
  },
  Text:{
    flex:8,
    textAlign:"center",
    fontSize:20,
    color:"#ffffff"
    },
   Cont:{
    flex: 1,
    alignItems: 'center',
    marginTop:100,
   },
   succeed:{
    fontSize:20,
    marginTop:18,
    color:"#ff415b"
   },
   price:{
    fontSize:28,
    marginTop:30,
    color:"#000000"
   },
    button:{
        marginTop:50,
        width:300,
    },
    ButtonText:{
        color:"#ffffff",
        backgroundColor:"#f47882",
        height:45,
        lineHeight:32,
        borderRadius:5,
        textAlign:"center",
        fontSize:18,
    }
});
