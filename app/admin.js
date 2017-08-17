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
  ModalDropdown,
  Modal,
  TouchableHighlight
} from 'react-native';
import home from "./Home";
//第二页面
export default class admin extends Component {
    constructor(props){
            super(props);
            this.state = {
                show:false,
                //wrp 测试提交 法规的发生
            };
        }
        pressPush(){
            var nextRoute={
                name:"主页",
                component:home
            };
            this.props.navigator.push(nextRoute)
        }
      pressPop(){
          this.props.navigator.pop();
      }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Image}>
            <Image source={require("../images/logo.png")}></Image>
        </View>
                <View style={styles.TextInput}>
                    <TextInput
                        autofocus="{true}"
                        numberoflines="{1}"
                        keyboardType="numeric"
                        placeholder="用户编码"
                        textalign="center"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#bcbdc1"
                        style={styles.admin}/>
                        <Image source={require("../images/admin.png")} style={styles.TextImage}></Image>
                </View>
                <View style={styles.TextInput}>
                    <TextInput
                        autofocus="{true}"
                         numberoflines="{1}"
                        keyboardType="numeric"
                        placeholder="密码"
                        maxLength={6}
                        textalign="center"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#bcbdc1"
                        style={styles.pass}/>
                        <Image source={require("../images/admin1.png")} style={styles.TextImage1}></Image>
                </View>
            <View style={styles.AgencyInformation}>
                <Text style={styles.InformationLeft}>机构信息</Text>
                <TextInput underlineColorAndroid='transparent'maxLength={6} style={styles.PlaceHolder}/>
            </View>
            <TouchableOpacity onPress={this.pressPush.bind(this)}>
               <Text style={styles.login}>登录</Text>
            </TouchableOpacity>
            <View style={styles.refresh}>
                <Image source={require("../images/refresh.png")} style={styles.refreshImage}></Image>
            </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
   container:{
          flex:1,
          backgroundColor:"#323642",
      },
      TextInput:{
             marginLeft:60,
             marginRight:60,
             marginTop:30,
         },
         admin:{
             borderRadius:5,
             backgroundColor:"#474955",
             color: "#ffffff",
             paddingTop:5,
             paddingBottom:5,
             paddingLeft:50,
             fontSize:16,
         },
         pass:{
             borderRadius:5,
             backgroundColor:"#474955",
             color: "#ffffff",
             paddingTop:5,
             paddingBottom:5,
             paddingLeft:50,
             fontSize:16,
         },
         Image:{
             marginTop:50,
             justifyContent: 'center',
             alignItems: 'center',
             marginBottom:70,
         },
       AgencyInformation:{
          marginLeft:60,
          marginRight:60,
          marginTop:30,
          flexDirection:"row",
          height:50,
       },
       InformationLeft:{
        color:"#bcbdc1",
        height:35,
       },
       PlaceHolder:{
        position:"absolute",
        left:88,
        top:-10,
        width:390,
        borderBottomWidth:1,
        borderBottomColor:"#474955",
        height:35,
        color:"#ffffff",
        fontSize:16,
       },
      login:{
          marginLeft:60,
          marginRight:60,
          marginTop:40,
          paddingTop:12,
          paddingBottom:12,
          backgroundColor:"#f47882",
          color:"#ffffff",
          borderRadius:3,
          textAlign:"center",
          fontSize:18,
      },
      refresh:{
        marginTop:60,
        marginRight:30,
      },
      refreshImage:{
        position :'absolute',
        right:30,
      },
      TextImage:{
              position:"absolute",
              left:12,
              top:10,
          },
          TextImage1:{
              position:"absolute",
              left:14,
              top:10,
          },
      modalStyle:{
        backgroundColor:"#ffffff",
        width:200,
        height:100,
      }
});