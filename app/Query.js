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
import Distrition_list from "./Distrition_list";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';

export default class Query extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            sCode1:"",
            active:"",
        };
    }

    componentDidMount(){
        // Storage.delete("PickedDate");
        Storage.get('invoice').then((tags)=>{
            this.setState({
                invoice:tags
            })
        })
    }

    Return(){
        this.props.navigator.pop();
    }

    _reloadView(sCode) {
        sCode = String(sCode);
        this.setState({
            sCode1:sCode,
        });
    }

    pressPush(){
        var str=this.state.sCode1;
        if(this.state.sCode1==""){
            alert("请选择原始单号");
        }else{
            var nextRoute={
                name:"主页",
                component:Search
            };
            this.props.navigator.push(nextRoute);

            var date = new Date();
            var data=JSON.stringify(date.getTime());
            Storage.delete('YuanDan');
            Storage.delete('Screen');
            Storage.save('OrgFormno',str);
            Storage.save('Date',data);
            Storage.save('Name','商品盘点单');
            Storage.save('FormType','PCYW');
            Storage.save('valueOf','App_Client_ProPSSH');
            Storage.save('history','App_Client_ProPSSHQ');
            Storage.save('historyClass','App_Client_ProPSSHDetailQ');
            Storage.save('ProYH','ProPC');
        }
    }

    Home(){
        var str=this.state.sCode1;
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        if(this.state.sCode1==""){
            alert("请选择原始单号");
        }else{
            var nextRoute={
                name:"主页",
                component:Index
            };
            this.props.navigator.push(nextRoute);
            Storage.delete('YuanDan');
            Storage.save('OrgFormno',str);
            Storage.save('Date',data);
            Storage.save('Name','商品盘点单');
            Storage.save('valueOf','App_Client_ProPC');
            Storage.save('history','App_Client_ProCurrPCQ');
            Storage.save('historyClass','App_Client_ProPCDetailQ');
            Storage.save('ProYH','ProPC');
        }
    }

    Search(){
        Storage.save('shopPandian','App_Client_NoEndPCQ');
        var nextRoute={
            name:"Distrition_list",
            component:Distrition_list,
            params: {
                reloadView:(sCode)=>this._reloadView(sCode)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Head}>
                    <View style={styles.cont}>
                        <TouchableOpacity style={styles.Images} onPress={this.Return.bind(this)}>
                            <Image source={require("../images/left.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <View style={styles.HeadList}>
                            <Text style={styles.HeadText}>{this.state.invoice}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>单号:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.Search.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.sCode1}
                            numberoflines={1}
                            placeholder="请选择单号"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.Search.bind(this)}>
                        <Image source={require("../images/right.png")} style={styles.Image}></Image>
                    </TouchableOpacity>
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
    Head:{
        height:50,
        backgroundColor:"#f47882",
        paddingTop:10,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb",
    },
    cont:{
        flexDirection:"row",
        marginLeft:25,
    },
    Images:{
        width:60,
    },
    HeadList:{
        flex:6,
        marginTop:2,
        paddingRight:70,
    },
    HeadText:{
        color:"#ffffff",
        fontSize:18,
        textAlign:"center",
    },
    admin:{
        borderRadius:3,
        backgroundColor:"#f5f5f5",
        color: "#333333",
        paddingTop:8,
        paddingBottom:8,
        paddingLeft:12,
        paddingRight:60,
        fontSize:16,
        flex:5,
    },
    ContList:{
        height:50,
        marginTop:20,
        marginLeft:25,
        marginRight:15,
        paddingTop:10,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#eeeeee",
    },
    listleft:{
        width:60,
    },
    listLeftText:{
        color:"#323232",
        fontSize:17,
    },
    listcont:{
        flex:7,
        paddingLeft:5,
        paddingRight:5,
    },
    listContText:{
        color:"#323232",
        fontSize:17,
    },
    listimages:{
        flex:1,
    },
    TextInput:{
        flex:7,

    },
    TextInput1:{
        paddingLeft:5,
        paddingRight:5,
        fontSize:16,
        color:"#323232"
    },
    search:{
        flexDirection:"row",
        marginTop:40,
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
    Search:{
        width:60,
        paddingTop:8,
        paddingLeft:15,
        backgroundColor:"#f5f5f5",
    }
});


