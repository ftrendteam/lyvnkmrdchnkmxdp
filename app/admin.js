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
  TouchableHighlight,
  AsyncStorages,
  ToastAndroid
} from 'react-native';
import home from "./Home";
import NetUtils from "../utils/NetUtils";
import WebUtils from "../utils/WebUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from 'react-native-storage';
import Picker from 'react-native-picker';
//第二页面
let dbAdapter = new DBAdapter();
let db;
export default class admin extends Component {
  componentWillMount() {
    //开启数据库
    if (!db) {
      db = dbAdapter.open();
    }
    //建表
    dbAdapter.createTable();
  }
    constructor(props){
        super(props);

        this.state = {
            language:null,
            show:false,
            reqCode:"",
            reqDetailCode:"",
            ClientCode:"",
            sDateTime:"",
            Pwd:"",
            Sign:"",
            Usercode:"",
            UserPwd:"",
        };
        this.pickerData=[]
    }
 //第一次跑数据 componentDidMount
 //失去焦点时 跑数据、存储、获取数据
    autoFocuss(){
        let params = {
            reqCode:"App_PosReq",
            reqDetailCode:"App_Client_UseQry",
            ClientCode:"800000001",
            sDateTime:"2017-08-09 12:12:12",//获取当前时间转换成时间戳
            Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_UseQry" + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
        };
        //console.log(loginParams);
         WebUtils.Post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',params, (data)=>{
            if(data.retcode == 1){
                DetailInfo1 = JSON.stringify(data.DetailInfo1);// 在这里从接口取出要保存的数据，然后执行save方法
                   var  DetailInfo1 = JSON.stringify(data.DetailInfo1);
                   for(var value of data.DetailInfo1){
                        // console.log(value)
                        // alert(JSON.stringify(value))
                        var shopcode = value.shopcode;
                        var shopname = value.shopname;
                        this.pickerData .push(shopname+"_"+shopcode);
                        // alert(shopname+"_"+shopcode);
                   }

                   // alert("成功")
                   //alert(JSON.stringify(data.DetailInfo1))
            }else{
                alert("数据保存失败")
            }
         })
    }
// 失焦时触发事件
    inputOnBlur(){
        this.autoFocuss();
    }
//登录
    pressPush(){
        let params = {
            reqCode:"App_PosReq",
            reqDetailCode:"App_Client_UseQry",
            Usercode:this.state.super,
            sDateTime:"2017-08-09 12:12:12",//获取当前时间转换成时间戳
            UserPwd:NetUtils.MD5(this.state.UserPwd)+'',//获取到密码之后md5加密
            Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_UseQry" + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
        };
         WebUtils.Post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',params, (data)=>{
          alert(JSON.stringify(data))
            if(data.isEnter == 1){

                var nextRoute={
                    name:"主页",
                     component:home,
                };
                this.props.navigator.push(nextRoute)
            }else{
                  ToastAndroid.show('用户名或密码错误', ToastAndroid.SHORT)
            }
         })
    }
    pressPop(){
        this.props.navigator.pop();
    }
//机构信息下拉数据
    _showDatePicker() {
        Picker.init({
            pickerData: this.pickerData,
            selectedValue: [59],
            onPickerConfirm: pickedValue => {
            this.setState({//选择下拉内容
                pickedDate:pickedValue,
            });
                console.log(pickedValue);
            },
            onPickerCancel: pickedValue => {
                console.log(pickedValue);
            },
            onPickerSelect: pickedValue => {
                console.log(pickedValue);
            },
        });
        Picker.show();
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
                style={styles.admin}
                onBlur={this.inputOnBlur.bind(this)}
                onChangeText={(value)=>{
                    this.setState({
                        Usercode:value
                    })
                }}/>
            <Image source={require("../images/admin.png")} style={styles.TextImage}></Image>
        </View>
        <View style={styles.TextInput}>
            <TextInput
                autofocus="{true}"
                 numberoflines="{1}"
                keyboardType="numeric"
                placeholder="用户密码"
                maxLength={6}
                textalign="center"
                underlineColorAndroid='transparent'
                placeholderTextColor="#bcbdc1"
                style={styles.pass}
                onChangeText={(value)=>{
                    this.setState({
                        UserPwd:value
                    })
                }}
                />
            <Image source={require("../images/admin1.png")} style={styles.TextImage1}></Image>
        </View>
        <View style={styles.AgencyInformation}>
            <View style={styles.InformationLeft}><Text style={styles.InformationLeftText}>机构信息</Text></View>
            <TouchableOpacity style={styles.PullDown} onPress={this._showDatePicker.bind(this)}>
                <Text style={styles.PullClick}>{this.state.pickedDate}</Text>
            </TouchableOpacity>
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
        marginTop:30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:50,
    },
   AgencyInformation:{
      marginLeft:60,
      marginRight:60,
      marginTop:20,
      flexDirection:"row",
   },
   InformationLeft:{
    flex:2,
   },
   InformationLeftText:{
    color:"#bcbdc1",
    lineHeight:32,
   },
   PullDown:{
    flex:7,
    height:40,
    borderBottomWidth:1,
    borderBottomColor:"#474955",
   },
   PullClick:{
   color:"#bcbdc1",
   lineHeight:30,
   paddingLeft:10,
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