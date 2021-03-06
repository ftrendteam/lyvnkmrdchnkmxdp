/**
 * 第一登陆页面（商户号）
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    Button,
    TextInput,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    ActivityIndicator,
    DeviceEventEmitter,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import admin from "./admin";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import Storage from "../utils/Storage";
var {NativeModules} = require('react-native');
var RNAndroidIMEI = NativeModules.RNAndroidIMEI;

export default class  login extends Component{
    constructor(props){
        super(props);
        this.state = {
            reqCode:"",
            reqDetailCode:"",
            ClientCode:"",
            sDateTime:"",
            Pwd:"",
            Sign:"",
            LinkUrl:"",
            textinput:"",
            show:false,
            ErrorShow:false
        };
    }

    componentDidMount() {
        this.setState({
            focus: true
        })
    }

    pressPush(){
        if(this.state.ClientCode == ""){
            ToastAndroid.show('请输入商户号', ToastAndroid.SHORT)
            return;
        }
        if(this.state.Pwd == ""){
            ToastAndroid.show('请输入密码', ToastAndroid.SHORT)
            return;
        }
        this._setModalVisible();
        NativeModules.AndroidDeviceInfo.getIMEI((IMEI)=>{
            let params = {
                reqCode:"App_PosReq",
                reqDetailCode:"App_Client_Qry",
                ClientCode:this.state.ClientCode,
                sDateTime:Date.parse(new Date()),//获取当前时间转换成时间戳
                Pwd:NetUtils.MD5(this.state.Pwd)+'',//获取到密码之后md5加密
                IMEI1:IMEI,
                IMEI2:"",
                SignIMEI1:NetUtils.MD5("1q2w3e4r%"+IMEI)+'',
                SignIMEI2:NetUtils.MD5("1q2w3e4r%"+"")+'',
                Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_Qry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
            }
            FetchUtil.post('http://register.smartpos.top:8091/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
                if(data.retcode == 1){
                    DetailInfo = JSON.stringify(data.DetailInfo);// 在这里从接口取出要保存的数据，然后执行save方法
                    var  DetailInfo = JSON.stringify(data.DetailInfo);
                    for(var value of data.DetailInfo){//获取DetailInfo数据
                        LinkUrl = value.LinkUrl;//获取url地址
                        var str=LinkUrl;
                        var Url=LinkUrl;
                        var items=str.replace('?WSDL',"");//截取字符
                        var Items=Url.replace('/WEBSERVICE/FTRENDWS.ASMX?WSDL',"");
                        var NullItems=Items.replace(/\s/g, "");
                        Storage.save('Url',NullItems);
                        var data='/FMJsonInterfaceByDownToPos';
                        var date=items+'/FMJsonInterfaceByDownToPos';//拼接字符
                        var replace = date.replace(/\s/g, "");
                        Storage.save('LinkUrl',replace);
                    }
                    RNAndroidIMEI.getAndroidIMEI();
                    Storage.save('ClientCode',this.state.ClientCode);
                    Storage.save('IMEI',IMEI);
                    Storage.save('FirstTime','1');
                    this.props.navigator.push({
                        component:admin,
                    });
                    ToastAndroid.show('登录成功', ToastAndroid.SHORT);
                    this._setModalVisible();
                }else{
                    this._setModalVisible();
                    var msg=data.msg;
                    alert(JSON.stringify(msg)+"标识码:"+IMEI)
                }
            },(err)=>{
                this._setModalVisible();
                alert("网络请求失败");
            })
        })
    }

    LoginError(){
        this._ErrorModalVisible();
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }

    _ErrorModalVisible(){
        let isShow = this.state.ErrorShow;
        this.setState({
            ErrorShow:!isShow,
        });
    }

    onSubmitEditing(){
        this.setState({
            textinput:1,
        })
    }

    onSubmitEditing1(){
        this.setState({
            textinput:""
        })
    }

    render(){
        return (
            <ScrollView  style={styles.Container} keyboardShouldPersistTaps={"handled"}>
                <Image source={require("../images/bj.png")} style={styles.container}>
                    <ScrollView style={styles.ScrollView} scrollEnabled={false} keyboardShouldPersistTaps={"handled"}>
                        <View style={styles.Image}>
                            <Image source={require("../images/logo.png")}></Image>
                        </View>
                        <View style={styles.TextInput}>
                            <ScrollView>
                                {
                                    (this.state.textinput == "1") ?
                                        <TextInput
                                            returnKeyType='search'
                                            numberoflines={1}
                                            keyboardType="numeric"
                                            placeholder="请输入商户号"
                                            textalign="center"
                                            underlineColorAndroid='transparent'
                                            placeholderTextColor="#bcbdc1"
                                            style={styles.admin}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    ClientCode: value
                                                })
                                            }}
                                        />
                                        :
                                        <TextInput
                                            autoFocus={true}
                                            returnKeyType='search'
                                            numberoflines={1}
                                            keyboardType="numeric"
                                            placeholder="请输入商户号"
                                            textalign="center"
                                            underlineColorAndroid='transparent'
                                            placeholderTextColor="#bcbdc1"
                                            style={styles.admin}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    ClientCode: value
                                                })
                                            }}
                                            onSubmitEditing={this.onSubmitEditing.bind(this)}
                                        />
                                }
                            </ScrollView>
                            <Image source={require("../images/1_11.png")} style={styles.TextImage1}></Image>
                        </View>
                        <View style={styles.TextInput}>
                            <ScrollView>
                                {
                                    (this.state.textinput == "1") ?
                                        <TextInput
                                            autoFocus={true}
                                            returnKeyType='search'
                                            secureTextEntry={true}
                                            numberoflines={1}
                                            keyboardType="numeric"
                                            placeholder="请输入商户密码"
                                            textalign="center"
                                            underlineColorAndroid='transparent'
                                            placeholderTextColor="#bcbdc1"
                                            style={styles.pass}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    Pwd: value
                                                })
                                            }}
                                            onSubmitEditing={this.onSubmitEditing1.bind(this)}
                                        />
                                        :
                                        <TouchableOpacity onPress={this.onSubmitEditing.bind(this)}>
                                            <TextInput
                                                editable={false}
                                                secureTextEntry={true}
                                                placeholder="请输入商户密码"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.pass}
                                                defaultValue={this.state.Pwd}
                                            />
                                        </TouchableOpacity>
                                }
                            </ScrollView>
                            <Image source={require("../images/1_04.png")} style={styles.TextImage1}></Image>
                        </View>
                        <TouchableOpacity onPress={this.pressPush.bind(this)}>
                            <Text style={styles.login}>确定</Text>
                        </TouchableOpacity>
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
                                            登录失败：商户号或密码错误
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.LoginOk} onPress={this.LoginError.bind(this)}>
                                        <Text style={styles.ErrorText}>
                                            好的
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                </Image>
            </ScrollView>
        )
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
    TextImage1:{
        position:"absolute",
        left:14,
        top:15,
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
    Error:{
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
    LoginOk:{
        marginTop:22,
    },
});