import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Button,
    ToastAndroid
} from 'react-native';
import admin from "./admin";
import NetUtils from "../utils/NetUtils";
import WebUtils from "../utils/WebUtils";
import Navigator from "react-native-deprecated-custom-components";
import Storage from '../utils/Storage';//
class login extends Component{
//获取数据
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
        var object = {
            ClientCode:this.state.ClientCode,
            sDateTime:"2017-08-09 12:12:12",//获取当前时间转换成时间戳
            Pwd:NetUtils.MD5(this.state.Pwd)+'',//获取到密码之后md5加密
            Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_Qry" + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
        };
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
            reqCode:"",
            reqDetailCode:"",
            ClientCode:"",
            sDateTime:"",
            Pwd:"",
            Sign:"",
            LinkUrl:""
        };
    }
    pressPush(){
        let params = {
            reqCode:"App_PosReq",
            reqDetailCode:"App_Client_Qry",
            ClientCode:this.state.ClientCode,
            sDateTime:"2017-08-09 12:12:12",//获取当前时间转换成时间戳
            Pwd:NetUtils.MD5(this.state.Pwd)+'',//获取到密码之后md5加密
            Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_Qry" + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
        };
        WebUtils.Post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',params, (data)=>{
            if(data.retcode == 1){
                DetailInfo = JSON.stringify(data.DetailInfo);// 在这里从接口取出要保存的数据，然后执行save方法
                var  DetailInfo = JSON.stringify(data.DetailInfo);
                //alert(JSON.stringify(data))
                for(var value of data.DetailInfo){
                   //     console.log(value)
                   //     alert(JSON.stringify(value))
                   LinkUrl = value.LinkUrl;
                   //alert(LinkUrl);获取url地址
                }
                //标记位  登录成功保存记录，已经登录
                Storage.save({
                    key: 'isInit',  // 注意:请不要在key中使用_下划线符号!
                    id: '100',   // 注意:请不要在id中使用_下划线符号!
                });
                var nextRoute={
                    name:"主页",
                    component:admin,
                };
                this.props.navigator.push(nextRoute)
            }else{
                ToastAndroid.show('用户名或密码错误', ToastAndroid.SHORT)
            }
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.Image}>
                    <Image source={require("../images/logo.png")}></Image>
                </View>
                <View style={styles.TextInput}>
                    <TextInput
                        autofocus="{true}"
                        numberoflines="{1}"
                        placeholder="商户号"
                        textalign="center"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#bcbdc1"
                        style={styles.admin}
                        onChangeText={(value)=>{
                            this.setState({
                                ClientCode:value
                            })
                        }}/>
                    <Image source={require("../images/admin.png")} style={styles.TextImage}></Image>
                </View>
                <View style={styles.TextInput}>
                <TextInput
                    autofocus="{true}"
                    numberoflines="{1}"
                    placeholder="密码"
                    maxLength={6}
                    textalign="center"
                    underlineColorAndroid='transparent'
                    placeholderTextColor="#bcbdc1"
                    style={styles.pass}
                    onChangeText={(value)=>{
                        this.setState({
                            Pwd:value
                        })
                    }}/>
                <Image source={require("../images/look.png")} style={styles.TextImage1}></Image>
                 </View>
                <TouchableOpacity onPress={this.pressPush.bind(this)}>
                    <Text style={styles.login}>确定</Text>
                </TouchableOpacity>
            </View>
    );
    }
}
export default class MainView extends Component{
    render() {
        var rootRoute={
            name:"测试",
            component:login
        };
        return (
            <Navigator.Navigator
                initialRoute={rootRoute}
                configureScene={(route)=>{
                    return Navigator.Navigator.SceneConfigs.PushFromRight;
                }}
                renderScene={(route,navigator)=>{
                    var Component=route.component;
                    return(
                        <Component
                            navigator={navigator}
                            route={route}/>
                    );
                }}
            />
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
    TextImage:{
        position:"absolute",
        left:12,
        top:10,
    },
    TextImage1:{
        position:"absolute",
        left:14,
        top:10,
    }
});