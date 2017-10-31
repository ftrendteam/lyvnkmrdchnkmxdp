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
    Button,
    ToastAndroid
} from 'react-native';
import DataUtils from "../utils/DataUtils";
import admin from "./admin";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import Storage from "../utils/Storage";

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
            LinkUrl:""
        };
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
        let params = {
            reqCode:"App_PosReq",
            reqDetailCode:"App_Client_Qry",
            ClientCode:this.state.ClientCode,
            sDateTime:Date.parse(new Date()),//获取当前时间转换成时间戳
            Pwd:NetUtils.MD5(this.state.Pwd)+'',//获取到密码之后md5加密
            Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_Qry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
        };
        FetchUtil.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
            if(data.retcode == 1){
                DetailInfo = JSON.stringify(data.DetailInfo);// 在这里从接口取出要保存的数据，然后执行save方法
                var  DetailInfo = JSON.stringify(data.DetailInfo);
                for(var value of data.DetailInfo){//获取DetailInfo数据
                   LinkUrl = value.LinkUrl;//获取url地址
                   var str=LinkUrl;
                   var items=str.replace('?wsdl',"")
                   var data='/FMJsonInterfaceByDownToPos';
                   var date=items+'/FMJsonInterfaceByDownToPos';
                   DataUtils.save('LinkUrl',date);
                }
                DataUtils.save('FirstTime','1');
                DataUtils.save('ClientCode',this.state.ClientCode);
                this.props.navigator.push({
                    component:admin,
                });
            }else{
                ToastAndroid.show('商户号或密码错误', ToastAndroid.SHORT)
            }
        })
    }

    render(){
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
                        secureTextEntry={true}
                        numberoflines="{1}"
                        keyboardType="numeric"
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
                        }}
                    />
                    <Image source={require("../images/look.png")} style={styles.TextImage1}></Image>
                </View>
                <TouchableOpacity onPress={this.pressPush.bind(this)}>
                    <Text style={styles.login}>确定</Text>
                </TouchableOpacity>
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
    TextImage:{
        position:"absolute",
        left:12,
        top:8,
    },
    TextImage1:{
        position:"absolute",
        left:14,
        top:10,
    }
});