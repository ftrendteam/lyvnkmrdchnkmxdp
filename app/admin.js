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
  ScrollView
} from 'react-native';
import Index from "./Index";
import DataUtils from "../utils/DataUtils";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";
import Picker from 'react-native-picker';
import ModalDropdown from 'react-native-modal-dropdown';
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
  read(){
          AsyncStorage.getItem('object',(error,result)=>{
              if (!error) {
                  console.log(result);
                  alert(result);
              }
          })
      }
  //存储数据
  save(){
      // JSON.stringify(object): JSON对象转换为字符串 用来存储
      AsyncStorage.setItem('object',JSON.stringify(object),(error)=>{
          if (error) {
              alert('存储失败');
          } else  {
              alert('存储成功');
              read();
          }
      });
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
            pickedDate:"",
            detailInfo1:"",
//            ClientCode:this.props.ClientCode ? this.props.ClientCode : "",
        };
        this.pickerData=[]
    }
 //直接跑数据 componentDidMount
    componentDidMount(){
        Storage.get('ClientCode').then((tags) => {
//        alert(tags)
            let params = {
                 reqCode:"App_PosReq",
                 reqDetailCode:"App_Client_UseQry",
                 ClientCode:tags,
                 sDateTime:"2017-08-09 12:12:12",//获取当前时间转换成时间戳
                 Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_UseQry" + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
            };
              FetchUtil.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
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
                      dbAdapter.insertTUserRrightData(detailInfo3);
                      //用户管理机构表
                      var detailInfo4 = data.DetailInfo4;
                      dbAdapter.insertTUsershopData(detailInfo4);
    //                  var acquiring = DataUtils.get("LinkUrl",LinkUrl);
//                      alert(JSON.stringify(data))
                 }else{
                     ToastAndroid.show('网络请求失败', ToastAndroid.SHORT);
//                     alert(JSON.stringify(data))
                 }
              })
         });
    }
 //失去焦点时 跑数据、存储、获取数据
    autoFocuss(){
    Storage.get('ClientCode').then((tags) => {
         let params = {
                reqCode:"App_PosReq",
                reqDetailCode:"App_Client_UseQry",
                ClientCode:tags,
                sDateTime:"2017-08-09 12:12:12",//获取当前时间转换成时间戳
                Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_UseQry" + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
         };
         FetchUtil.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
            if(data.retcode == 1){
                DetailInfo1 = JSON.stringify(data.DetailInfo1);// 在这里从接口取出要保存的数据，然后执行save方法
                   var  DetailInfo1 = JSON.stringify(data.DetailInfo1);
                   this.setState({
                        detailInfo1:DetailInfo1
                   })
                   alert(this.state.detailInfo1)
                   for(var value of data.DetailInfo1){
                        // alert(JSON.stringify(value))
                        var shopcode = value.shopcode;
                        var shopname = value.shopname;
                        this.pickerData .push(shopname+"_"+shopcode);
                   }
                   var moren1 = shopname+"_"+shopcode;
                   this.setState({
                        pickedDate:moren1
                   })
            }else{
//                alert("数据保存失败")
            }
         })
     })
    }
// 失焦时触发事件
    inputOnBlur(){
        this.autoFocuss();
    }
//登录
    pressPush(){
        Storage.save('history','');
        var PickedDate = this.state.pickedDate;
        if(PickedDate == ""){
            ToastAndroid.show('请选择机构信息', ToastAndroid.SHORT)
            return;
        }else{
            ToastAndroid.show('正在登录，请稍等~', ToastAndroid.SHORT)
        }
        var code = ""+this.state.pickedDate;//获取到之后前面加""+
        var Usercode=this.state.Usercode;
        var UserPwd=this.state.UserPwd;
        Storage.save("shopCode",this.state.pickedDate);//调用保存封装接口
        str1 = code.split('_');
        str2 = str1[1];
        dbAdapter.isLogin(Usercode, this.state.UserPwd, str2).then((isLogin)=>{
//            alert("123");
            if(isLogin){
               var strin = this.state.pickedDate;
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
            }else{
                ToastAndroid.show('用户编码或密码错误', ToastAndroid.SHORT)
            }
        });
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
                <ModalDropdown style={styles.PullDown} dropdownStyle={styles.dropdown_2_dropdown} options={this.state.detailInfo1}/>
            </View>
            <TouchableOpacity onPress={this.pressPush.bind(this)}>
               <Text style={styles.login}>登录</Text>
            </TouchableOpacity>
            <View style={styles.refresh}>
                <Image source={require("../images/refresh.png")} style={styles.refreshImage}></Image>
            </View>
        </ScrollView>
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
        fontSize:14,
    },
    pass:{
        borderRadius:5,
        backgroundColor:"#474955",
        color: "#ffffff",
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:50,
        fontSize:14,
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
    height:40,
    borderBottomWidth:1,
    borderBottomColor:"#474955",
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
      fontSize:16,
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