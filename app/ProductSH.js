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
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import Index from "./Index";
import Home from "./Home";
import Search from "./Search";
import NetUtils from "../utils/NetUtils";
import DataUtils from '../utils/DataUtils';
import FetchUtils from "../utils/FetchUtils";
import Storage from '../utils/Storage';
import ModalDropdown from 'native';
export default class ProductSH extends Component {
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
        if(str.length != 6){
            alert("请输入16位数的单号");
        }else{
            var nextRoute={
                name:"主页",
                component:Index
            };
            this.props.navigator.push(nextRoute)
        }
        Storage.save('OrgFormno',this.state.Number);
        Storage.save('Name','协配收货');
        Storage.save('valueOf','App_Client_ProXP');
        Storage.save('history','App_Client_ProXPYSQ');
        Storage.save('historyClass','App_Client_ProXPDetailYSQ');

    }
    _dropdown_4_onSelect(idx, value) {
        this.setState({
            Product:value
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.images} onPress={this.Return.bind(this)}><Image source={require("../images/left1.png")} style={styles.HeaderImage}></Image></TouchableOpacity>
                <View style={styles.TextInput}>
                    <TextInput
                        autofocus="{true}"
                        numberoflines="{1}"
                        keyboardType="numeric"
                        placeholder="请输入供应商编码"
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
                <View style={styles.AgencyInformation}>
                    <View style={styles.InformationLeft}><Text style={styles.InformationLeftText}>供应商编码</Text></View>
                    <ModalDropdown style={styles.PullDown} options={[1,2,3,4,5]} textStyle={styles.dropdown_2_text} onSelect={(idx, value) => this._dropdown_4_onSelect(idx, value)}/>
                </View>
                <View style={styles.TextInput}>
                    <TextInput
                        autofocus="{true}"
                        numberoflines="{1}"
                        keyboardType="numeric"
                        placeholder="请输入机构编码"
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
                <View style={styles.AgencyInformation}>
                    <View style={styles.InformationLeft}><Text style={styles.InformationLeftText}>机构编码</Text></View>
                    <ModalDropdown style={styles.PullDown} options={[1,2,3,4,5]} textStyle={styles.dropdown_2_text} onSelect={(idx, value) => this._dropdown_4_onSelect(idx, value)}/>
                </View>
                <View style={styles.search}>
                    <TouchableOpacity style={styles.textsearch} onPress={this.pressPush.bind(this)}>
                        <Text style={styles.textsearch1}>确定</Text>
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
    images:{
        height:50,
        paddingLeft:30,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb",
        justifyContent: 'center',
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
        marginTop:30,
    },
    textsearch:{
        marginLeft:30,
        marginRight:30,
        backgroundColor:"#f47882",
        borderRadius:15,
        flex:1,
        paddingTop:10,
        paddingBottom:10,
    },
    textsearch1:{
        textAlign:"center",
        fontSize:16,
        color:"#ffffff",
    },
    AgencyInformation:{
        marginLeft:30,
        marginRight:30,
        marginTop:20,
        flexDirection:"row",
    },
    InformationLeft:{
        flex:2,
    },
    InformationLeftText:{
        lineHeight:32,
    },
    PullDown:{
        flex:7,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb",
    },
    dropdown_2_text:{
        paddingLeft:15,
        lineHeight:25,
    },
});


