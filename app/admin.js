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
  ActivityIndicator,
} from 'react-native';
import Index from "./Index";
import PickedDate_list from "./PickedDate_list";
import DataUtils from "../utils/DataUtils";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import UpData from "../utils/UpData";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";
import Picker from 'react-native-picker';
import ModalDropdown from 'react-native-modal-dropdown';

var {NativeModules} = require('react-native');
let dbAdapter = new DBAdapter();
let updata = new UpData();
let db

export default class admin extends Component {
    constructor(props){
        super(props);
        this.state = {
            language:null,
            show:false,
            ErrorShow:false,
            animating:false,
            NewData:false,
            DataComplete:false,
            Edition:false,
            NewEdition:false,
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
            sCode1:"",
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
        //textinput自动获取焦点
        this.setState({
            focus:true
        })
        //获取数据库url地址
        Storage.get('LinkUrl').then((tags) => {
            this.setState({
                linkurl:tags
            })
        })
        Storage.get('Url').then((tags) => {
            //apk版本自动更新
            FetchUtil.post(tags+"/Default2.aspx?jsonStr={'TblName':'AndroidYWVersion'}").then((data) => {//获取最新apk版本号
                NativeModules.AndroidDeviceInfo.getVerCode((msg) => {//获取当前apk版本号
                    if (data > msg) {
                        this.Edition();
                    }

                });
            },(err)=>{
                alert("网络请求失败");
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
                     alert(JSON.stringify(data))
                 }
            },(err)=>{
                alert("网络请求失败");
            })
        });
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }

    _ErrorModalVisible(){
        let isshow = this.state.ErrorShow;
        this.setState({
            ErrorShow:!isshow,
        });
    }

    NewData(){
        let isshow = this.state.NewData;
        this.setState({
            NewData:!isshow,
        });
    }

    DataComplete(){
        let isshow = this.state.DataComplete;
        this.setState({
            DataComplete:!isshow,
        });
    }

    Datacomplete(){
        this.DataComplete();
    }

    //版本自动更新弹框
    Edition(){
        let isshow = this.state.Edition;
        this.setState({
            Edition:!isshow,
        });
    }

    Datermine(){
        Storage.get('Url').then((tags) => {
            this.Edition();
            this.NewEdition();
            NativeModules.UpApk.isUpdata(tags,(finish)=>{
                if (finish) {
                    this.NewEdition();
                    NativeModules.UpApk.installAPK();
                }
            });
        })
    }

    NoDatermine(){
        this.Edition();
    }

    NewEdition(){
        let isshow = this.state.NewEdition;
        this.setState({
            NewEdition:!isshow,
        });
    }
    //版本自动更新弹框over
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
        if(this.state.sCode1 == ""){
            ToastAndroid.show('请选择机构信息', ToastAndroid.SHORT)
            return;
        }else{
            <ActivityIndicator key="1"></ActivityIndicator>
        }
        NativeModules.AndroidDeviceInfo.getIMEI((IMEI)=>{
            Storage.get('IMEI').then((tags) => {
                if(IMEI==tags){
                    var code = ""+this.state.sCode1.replace(/(^\s+)|(\s+$)/g, "");//获取到之后前面加""+
                    var Usercode=this.state.Usercode;
                    var UserPwd=this.state.UserPwd;
                    str1 = code.split('_');
                    str2 = str1[1];
                    this._setModalVisible();
                    dbAdapter.isLogin(Usercode, this.state.UserPwd, str2).then((isLogin)=>{

                        if(isLogin){
                            var strin = this.state.sCode1;
                            strjj = ""+strin;
                            code = strjj.substring(strjj.indexOf('_') + 1,strjj.length).replace(/(^\s+)|(\s+$)/g, "");
                            Storage.save('code',code);
                            Storage.save('username',Usercode);
                            Storage.save('Usercode',Usercode);
                            Storage.save('userpwd',UserPwd);
                            Storage.save('str2',str2);
                            Storage.save('FirstTime1','2');
                            var nextRoute={
                                name:"主页",
                                component:Index,
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                            ToastAndroid.show('登录成功', ToastAndroid.SHORT);
                        }else{
                            this._setModalVisible();
                            this._ErrorModalVisible();
                        }
                    },(err)=>{
                        this._setModalVisible();
                        alert("cuowu");
                    });
                }else{
                    alert("当前商户名不同，该机器无法运行")
                }
            })
        })
    }

    PickedDate(){
        if(this.state.Usercode==""){
            alert("请输入用户编码")
        }else{
            var Usercode=this.state.Usercode;
            Storage.save('Usercode',Usercode);
            var nextRoute={
                name:"PickedDate_list",
                component:PickedDate_list,
                params: {
                    reloadView:(sCode)=>this._reloadView(sCode)
                }
            };
            this.props.navigator.push(nextRoute)
        }
    }

    inputOnBlur(){
        this.setState({ focus: false });
        if(this.state.Usercode){
            this.setState({
                sCode1:""
            });
        }
    }

    _reloadView(sCode) {
        sCode = String(sCode);
        this.setState({
            sCode1:sCode,
        });
    }

    LoginError(){
        this._ErrorModalVisible();
    }

    UpData(){
        var code = ""+this.state.sCode1;
        Storage.save('code',code);
        if(this.state.sCode1==""){
            alert("请选择机构信息")
        }else{
            this.NewData();
            Storage.get('code').then((tags) => {
                updata.downLoadAllData(this.state.linkurl,dbAdapter,tags);
                this.NewData();
                this.DataComplete();
            })
        }

    }

    _onSubmitEditing(){
        this._textInput.blur();
    }
    _onPressSearch(event){
        this.pressPush()
    }
    render() {
    return (
        <ScrollView  style={styles.Container}>
            <Image source={require("../images/bj.png")} style={styles.container}>
                <ScrollView style={styles.ScrollView}  scrollEnabled={false}>
                    <View style={styles.Image}>
                        <Image source={require("../images/logo.png")}></Image>
                    </View>
                    <View style={styles.TextInput}>
                        <TextInput
                            ref={component => this._textInput = component}
                            returnKeyType='search'
                            autoFocus={true}
                            numberoflines={1}
                            keyboardType="numeric"
                            placeholder="请输入用户编码"
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
                        <Image source={require("../images/1_07.png")} style={styles.TextImage1}></Image>
                    </View>
                    <View style={[styles.TextInput,{marginTop:15}]}>
                        <TextInput
                            returnKeyType='search'
                            autofocus={true}
                            secureTextEntry={true}
                            numberoflines={1}
                            keyboardType="numeric"
                            placeholder="请输入密码"
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
                        <Image source={require("../images/1_11.png")} style={styles.TextImage1}></Image>
                    </View>
                    <View style={[styles.TextInput,{marginTop:15}]}>
                        <TouchableOpacity onPress={this.PickedDate.bind(this)}>
                            <TextInput
                                autofocus={true}
                                editable={false}
                                defaultValue ={this.state.sCode1}
                                placeholder="请选择机构信息"
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
                            <Image source={require("../images/1_14.png")} style={styles.TextImage1}></Image>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.pressPush.bind(this)}>
                       <Text style={styles.login}>登录</Text>
                    </TouchableOpacity>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.show}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.LoadCenter}>
                            <View style={styles.loading}>
                                <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
                                <Text style={styles.TextLoading}>登录中</Text>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.NewData}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.LoadCenter}>
                            <View style={styles.loading}>
                                <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
                                <Text style={styles.TextLoading}>更新数据中...</Text>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.DataComplete}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.DataComplete}>
                            <View style={styles.ErrorCont}>
                                <View style={styles.LoginError}>
                                    <Text style={styles.ErrorText}>
                                        数据更新完毕
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.LoginOk1} onPress={this.Datacomplete.bind(this)}>
                                    <Text style={styles.ErrorText}>
                                        确定
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.ErrorShow}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.Error}>
                            <View style={styles.ErrorCont}>
                                <View style={styles.LoginError}>
                                    <Text style={styles.ErrorText}>
                                        登录失败：账号或密码错误
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.LoginOk1} onPress={this.LoginError.bind(this)}>
                                    <Text style={styles.ErrorText}>
                                        好的
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.Edition}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.Error}>
                            <View style={styles.ErrorCont}>
                                <View style={styles.LoginError}>
                                    <Text style={styles.ErrorText}>
                                        当前版本不是最新版本，是否更新？
                                    </Text>
                                </View>
                                <View style={styles.Edition}>
                                    <TouchableOpacity style={styles.LoginOk} onPress={this.Datermine.bind(this)}>
                                        <Text style={styles.ErrorText}>
                                            确定
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.LoginOk} onPress={this.NoDatermine.bind(this)}>
                                        <Text style={styles.ErrorText}>
                                            取消
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={this.state.NewEdition}
                        onShow={() => {}}
                        onRequestClose={() => {}} >
                        <View style={styles.LoadCenter}>
                            <View style={styles.loading}>
                                <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
                                <Text style={styles.TextLoading}>正在下载最新版本...</Text>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity onPress={this.UpData.bind(this)} style={styles.refresh}>
                        <Image source={require("../images/1_21.png")}></Image>
                        <Text style={styles.DataText}>数据更新</Text>
                    </TouchableOpacity>
                </ScrollView>
            </Image>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    Container:{
        flex:1,
        backgroundColor:"#ff5263"
    },
    container:{
        flex:1,
        paddingTop:20,
        paddingLeft:30,
        paddingRight:30,
        paddingBottom:10,
        width:null,
        height:null,
    },
    TextInput:{
        marginTop:15,
    },
    admin:{
        borderRadius:5,
        backgroundColor:"#ffffff",
        color: "#333333",
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:50,
        fontSize:16,
    },
    pass:{
        borderRadius:5,
        backgroundColor:"#ffffff",
        color: "#333333",
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:50,
        fontSize:16,
    },
    Image:{
        marginTop:15,
        marginLeft:25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:10,
    },
   login:{
      marginTop:40,
      paddingTop:12,
      paddingBottom:12,
      backgroundColor:"#ff8081",
      color:"#ffffff",
      borderRadius:3,
      textAlign:"center",
      fontSize:18,
   },
  refresh:{
      justifyContent: 'center',
      alignItems: 'center',
    height:30,
    marginTop:25,
    flexDirection:'row'
  },
  DataText:{
    marginLeft:10,
    color:"#ffffff",
    fontSize:16,
  },
  TextImage:{
      position:"absolute",
      left:12,
      top:8,
  },
  TextImage1:{
      position:"absolute",
      left:14,
      top:15,
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
      borderRadius:5,
  },
  TextLoading:{
      fontSize:17,
      color:"#ffffff"
  },
  activity:{
      marginBottom:5,
  },
    listcont:{
        flex:7,
        paddingLeft:5,
        paddingRight:5,
        borderBottomWidth:1,
        borderBottomColor:"#474955",
    },
    listContText:{
        color:"#bcbdc1",
        fontSize:14,
    },
    Error:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#000000",
        opacity:0.9
    },
    DataComplete:{
        flex:1,
        backgroundColor:"#000000",
        opacity:0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ErrorCont:{
        width:320,
        backgroundColor:"#ffffff",
        borderRadius:3,
        paddingTop:15,
        paddingBottom:15,
        paddingLeft:8,
        paddingRight:8,
    },
    LoginError:{
        marginTop:18,
        paddingBottom:15,
        borderBottomColor:"#cccccc",
        borderBottomWidth:1,
    },
    ErrorText:{
        color:"#323232",
        fontSize:16,
        textAlign:"center"
    },
    Edition:{
        flexDirection:"row"
    },
    LoginOk:{
        flex:1,
        paddingTop:22,
    },
    LoginOk1:{
        paddingTop:22,
    },
});