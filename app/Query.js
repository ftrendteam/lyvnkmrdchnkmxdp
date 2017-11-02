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
    TouchableOpacity,
} from 'react-native';
import Index from "./Index";

import Home from "./Home";
import Search from "./Search";
import NetUtils from "../utils/NetUtils";
import DataUtils from '../utils/DataUtils';
import Storage from '../utils/Storage';

export default class Query extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
        };
    }

    Return(){
        this.props.navigator.pop();
    }

    pressPush(){
        var str=this.state.Number;
        if(str.length != 16){
            alert("请输入16位数的单号");
        }else{
            var nextRoute={
                name:"主页",
                component:Search
            };
            this.props.navigator.push(nextRoute);
            Storage.save('OrgFormno',this.state.Number);
            Storage.save('Name','配送收货单');
            Storage.save('valueOf','App_Client_ProPSSH');
            Storage.save('history','App_Client_ProPSSHQ');
            Storage.save('historyClass','App_Client_ProPSSHDetailQ');
        }
    }

    Home(){
        var str=this.state.Number;
        if(str.length != 16){
            alert("请输入16位数的单号");
        }else{
            var nextRoute={
                name:"主页",
                component:Index
            };
            this.props.navigator.push(nextRoute);
            Storage.save('OrgFormno',this.state.Number);
            Storage.save('Name','商品盘点单');
            Storage.save('valueOf','App_Client_ProPC');
            Storage.save('history','App_Client_ProCurrPCQ');
            Storage.save('historyClass','App_Client_ProPCDetailQ');
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.images} onPress={this.Return.bind(this)}><Image source={require("../images/left1.png")} style={styles.HeaderImage}></Image></TouchableOpacity>
                <View style={styles.TextInput}>
                    <TextInput
                        autofocus="{true}"
                        numberoflines="{1}"
                        placeholder="请输入原始单号"
                        textalign="center"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#cccccc"
                        style={styles.admin}
                        onChangeText={(value)=>{
                            this.setState({
                                Number:value
                            })
                        }}
                    />
                </View>
                <View style={styles.search}>
                    <TouchableOpacity style={styles.textsearch} onPress={this.pressPush.bind(this)}>
                        <Text style={styles.textsearch1}>查询/扫描</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.determine} onPress={this.Home.bind(this)}>
                        <Text style={styles.determine1}>确定</Text>
                    </TouchableOpacity>
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
    admin:{
        borderRadius:3,
        backgroundColor:"#f5f5f5",
        color: "#333333",
        paddingTop:8,
        paddingBottom:8,
        paddingLeft:12,
        fontSize:16,
        marginLeft:30,
        marginRight:30,
        marginTop:50,
    },
    search:{
        flexDirection:"row",
        marginTop:20,
    },
    textsearch:{
        marginLeft:30,
        marginRight:20,
        backgroundColor:"#f47882",
        borderRadius:15,
        flex:5,
        paddingTop:10,
        paddingBottom:10,
    },
    textsearch1:{
        textAlign:"center",
        fontSize:16,
        color:"#ffffff",
    },
    determine:{
        flex:2,
        backgroundColor:"#f47882",
        borderRadius:3,
        paddingTop:10,
        paddingBottom:10,
        marginRight:30,
    },
    determine1:{
        textAlign:"center",
        fontSize:16,
        color:"#ffffff",
    },
    images:{
        height:50,
        paddingLeft:30,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb",
        justifyContent: 'center',
    },
});


