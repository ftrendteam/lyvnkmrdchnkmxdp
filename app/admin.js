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
  Modal,
  TouchableHighlight,
  AsyncStorages,
  ToastAndroid,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Index from "./Index";
import DataUtils from "../utils/DataUtils";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";
import Picker from 'react-native-picker';
import ModalDropdown from 'react-native-modal-dropdown';

let dbAdapter = new DBAdapter();
let db

export default class admin extends Component {
    constructor(props){
        super(props);
        this.state = {
            language:null,
            show:false,
            animating:false,
            reqCode:"",
            reqDetailCode:"",
            ClientCode:"",
            sDateTime:"",
            Pwd:"",
            Sign:"",
            Usercode:"",
            UserPwd:"",
            Product:"",
            detailInfo1:"",
            linkurl:"",
        };
        this.pickerData=[]
    }

    //初始化render之前执行
    componentWillMount() {
        //开启数据库
        if (!db) {
            db = dbAdapter.open();
        }
        //建表
        dbAdapter.createTable();
    }

    //初始化render之后只执行一次
    componentDidMount(){
        //获取数据库url地址
        Storage.get('LinkUrl').then((tags) => {
            this.setState({
                linkurl:tags
            })
        })

        Storage.get('ClientCode').then((tags) => {
            let params = {
                 reqCode:"App_PosReq",
                 reqDetailCode:"App_Client_UseQry",
                 ClientCode:tags,
                 sDateTime:Date.parse(new Date()),//获取当前时间转换成时间戳
                 Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_UseQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
            };
            FetchUtil.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                 if(data.retcode == 1){
                      //用户信息
                      var detailInfo1 = data.DetailInfo1;
                      //console.log("detailInfo1=",detailInfo1);打印debug
                      dbAdapter.insertTShopItemData(detailInfo1);
                      //机构信息
                      var detailInfo2 = data.DetailInfo2;
                      dbAdapter.insertTUserSetData(detailInfo2);
                      //权限表
                      var detailInfo3 = data.DetailInfo3;
                      // console.log("userright=",detailInfo3);
                      dbAdapter.insertTUserRrightData(detailInfo3);
                      //用户管理机构表
                      var detailInfo4 = data.DetailInfo4;
                      dbAdapter.insertTUsershopData(detailInfo4);
                      //var acquiring = DataUtils.get("LinkUrl",LinkUrl);
                 }else{
                     ToastAndroid.show('网络请求失败', ToastAndroid.SHORT);
                 }
            })
        });
    }

    //输入用户编码之后执行
    autoFocuss(){
        Storage.get('ClientCode').then((tags) => {
             let params = {
                    reqCode:"App_PosReq",
                    reqDetailCode:"App_Client_UseQry",
                    ClientCode:tags,
                    sDateTime:Date.parse(new Date()),//获取当前时间转换成时间戳
                    Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_UseQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
             };
             FetchUtil.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                if(data.retcode == 1){
                    DetailInfo1 = JSON.stringify(data.DetailInfo1);// 在这里从接口取出要保存的数据，然后执行save方法
                       var  DetailInfo1 = JSON.stringify(data.DetailInfo1);
                       for(var value of data.DetailInfo1){
                            var shopcode = value.shopcode;
                            var shopname = value.shopname;
                            this.pickerData .push(shopname+"_"+shopcode);
                       }
                       this.setState({
                            pickedDate:this.pickerData
                       })
                }else{
                }
             })
        })
    }

    // 失焦时触发事件
    inputOnBlur(){
        this.autoFocuss();
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }

    //登录
    pressPush(){
        //等待对话框 显示隐藏
        if(this.state.Usercode == ""){
            ToastAndroid.show('请输入用户编码', ToastAndroid.SHORT)
            return;
        }
        if(this.state.UserPwd == ""){
            ToastAndroid.show('请输入密码', ToastAndroid.SHORT)
            return;
        }
        if(this.state.Product == ""){
            ToastAndroid.show('请选择机构信息', ToastAndroid.SHORT)
            return;
        }else{
            <ActivityIndicator key="1"></ActivityIndicator>
        }
        var code = ""+this.state.Product;//获取到之后前面加""+
        var Usercode=this.state.Usercode;
        var UserPwd=this.state.UserPwd;
        //DataUtils.save("shopCode",this.state.pickedDate);//调用保存封装接口
        str1 = code.split('_');
        str2 = str1[1];
        this._setModalVisible();
        dbAdapter.isLogin(Usercode, this.state.UserPwd, str2).then((isLogin)=>{
            if(isLogin){
               var strin = this.state.Product;
               strjj = ""+strin;
               code = strjj.substring(strjj.indexOf('_') + 1,strjj.length);
               Storage.save('code',code);
               Storage.save('username',Usercode);
               Storage.save('userpwd',UserPwd);
               var nextRoute={
                   name:"主页",
                   component:Index,
               };
               this.props.navigator.push(nextRoute);
               this._setModalVisible();
            }else{
               this._setModalVisible();
               ToastAndroid.show('用户编码或密码错误', ToastAndroid.SHORT);
            }
        });
    }

    //机构信息下拉列表赋值
    _dropdown_4_onSelect(idx, value) {
        this.setState({
            Product:value
        })
    }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.ScrollView} scrollEnabled={false}>
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
                    secureTextEntry={true}
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
                <ModalDropdown style={styles.PullDown} options={this.state.pickedDate} textStyle={styles.dropdown_2_text} onSelect={(idx, value) => this._dropdown_4_onSelect(idx, value)}/>
            </View>
            <TouchableOpacity onPress={this.pressPush.bind(this)}>
               <Text style={styles.login}>登录</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.refresh}>
                <Image source={require("../images/refresh.png")} style={styles.refreshImage}></Image>
            </TouchableOpacity>
        </ScrollView>
        <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.show}
        onShow={() => {}}
        onRequestClose={() => {}} >
            <View style={styles.LoadCenter}>
                <View style={styles.loading}>
                    <ActivityIndicator key="1" color="#414240" size="large" style={styles.activity}></ActivityIndicator>
                    <Text style={styles.TextLoading}>登录中</Text>
                </View>
            </View>
        </Modal>
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
        marginLeft:30,
        marginRight:30,
        marginTop:25,
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
        marginBottom:10,
    },
   AgencyInformation:{
      marginLeft:30,
      marginRight:30,
      marginTop:15,
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
    borderBottomWidth:1,
    borderBottomColor:"#474955",
   },
   dropdown_2_text:{
    paddingLeft:8,
    color:"#bcbdc1",
    lineHeight:25,
   },
   login:{
      marginLeft:30,
      marginRight:30,
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
    marginTop:45,
    marginLeft:30,
    marginRight:30,
    alignItems: 'center',
  },
  refreshImage:{
  },
  TextImage:{
      position:"absolute",
      left:12,
      top:8,
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
  },
  centering:{
    marginTop:20,
  },
  LoadCenter:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading:{
      paddingLeft:15,
      paddingRight:15,
      paddingTop:15,
      paddingBottom:15,
      backgroundColor:"#000000",
      opacity:0.8,
      borderRadius:3,
  },
  TextLoading:{
      fontSize:17,
      color:"#ffffff"
  },
  activity:{
      marginBottom:5,
  },
});