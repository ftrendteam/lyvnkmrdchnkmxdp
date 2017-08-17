/**
 * Created by Administrator on 2017/8/7.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Button
} from 'react-native';
import admin from "./admin";
import Navigator from "react-native-deprecated-custom-components";
class login extends Component{
    constructor(props){
        super(props);
    }
    pressPush(){
        var nextRoute={
            name:"主页",
            component:admin
        };
        this.props.navigator.push(nextRoute)
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
        marginTop:50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:70,
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