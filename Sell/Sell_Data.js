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
    ListView,
    TextInput,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import Index from "../app/Index";
import Search from "../app/Search";
import Sell_Data_List from "../Sell/Sell_Data_List";
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import FetchUtil from "../utils/FetchUtils";
import DownLoadBasicData from '../utils/DownLoadBasicData';
let dbAdapter = new DBAdapter();
var {NativeModules} = require('react-native');
var RNAndroidIMEI = NativeModules.RNAndroidIMEI;

export default class SellData extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            ShopCode:"",
            PosCode:"",
            invoice:"",
            active:"",
            linkurl:"",
        };
    }

    componentDidMount(){
        Storage.get('invoice').then((tags)=>{
            this.setState({
                invoice:tags
            })
        })

        Storage.get('Disting').then((tags)=>{
            this.setState({
                Disting:tags
            })
        })

        Storage.get('LinkUrl').then((tags) => {
            this.setState({
                linkurl:tags
            })
        })
    }

    Return(){
        var nextRoute={
            name:"Index",
            component:Index
        };
        this.props.navigator.push(nextRoute)
    }

    ShopCodeOnclick(){
        Storage.save("Sell","ShopCode");
        var nextRoute={
            name:"Sell_Data_List",
            component:Sell_Data_List,
            params: {
                reloadView:(ShopCode)=>this._reloadView(ShopCode)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadView(ShopCode) {
        ShopCode = String(ShopCode);
        this.setState({
            ShopCode:ShopCode,
        });
    }

    PosCodeOnclick(){
        Storage.save("Sell","PosCode");
        Storage.save("ShopCode",this.state.ShopCode);
        if(this.state.ShopCode==""){
            alert("请选择机构号");
        }else{
            var nextRoute={
                name:"Sell_Data_List",
                component:Sell_Data_List,
                params: {
                    PosCodeView:(PosCode)=>this._PosCodeView(PosCode)
                }
            };
            this.props.navigator.push(nextRoute)
        }
    }

    _PosCodeView(PosCode){
        PosCode = String(PosCode);
        this.setState({
            PosCode:PosCode,
        });
    }

    Button(){
        if(this.state.Disting=="0") {
            NativeModules.AndroidDeviceInfo.getIMEI((IMEI)=>{
                if(this.state.ShopCode==""){
                    alert("请选择机构号")
                }else if(this.state.PosCode==""){
                    alert("请选择pos号")
                }else {
                    let params = {
                        TblName: "PosShopBind",
                        poscode: this.state.PosCode,
                        shopcode: this.state.ShopCode,
                        BindMAC: "",
                        SysGuid: IMEI,
                    };
                    FetchUtil.post(this.state.linkurl, JSON.stringify(params)).then((data) => {
                        if (data.retcode == 1) {
                            DownLoadBasicData.downLoadPosOpt(this.state.linkurl, this.state.ShopCode, dbAdapter, this.state.PosCode).then((response) => {
                                if (response = true) {
                                    var nextRoute = {
                                        name: "Index",
                                        component: Index
                                    };
                                    this.props.navigator.push(nextRoute);
                                    Storage.save("Bind", "bindsucceed");
                                    Storage.save("ShopCode", this.state.ShopCode);
                                    Storage.save("PosCode", this.state.PosCode);
                                    Storage.save('Name', '移动销售');
                                    Storage.save("Num", "1");
                                    Storage.save("inoNum", "1");
                                } else {
                                    alert(JSON.stringify(response));
                                }
                            })
                        } else {
                            alert(JSON.stringify(data))
                        }

                    }, (err) => {
                        alert("网络请求失败");
                    })
                }
            })

        }else if(this.state.Disting=="1") {
            NativeModules.AndroidDeviceInfo.getIMEI((IMEI)=>{
                if(this.state.ShopCode==""){
                    alert("请选择机构号")
                }else if(this.state.PosCode==""){
                    alert("请选择pos号")
                }else {
                    let params = {
                        TblName: "PosShopBind",
                        poscode: this.state.PosCode,
                        shopcode: this.state.ShopCode,
                        BindMAC: "",
                        SysGuid: IMEI,
                    };
                    FetchUtil.post(this.state.linkurl, JSON.stringify(params)).then((data) => {
                        if (data.retcode == 1) {
                            DownLoadBasicData.downLoadPosOpt(this.state.linkurl, this.state.ShopCode, dbAdapter, this.state.PosCode).then((response) => {
                                if (response = true) {
                                    var nextRoute={
                                        name:"Search",
                                        component:Search,
                                    };
                                    this.props.navigator.push(nextRoute);
                                    Storage.save("Bind", "bindsucceed");
                                    Storage.save("ShopCode", this.state.ShopCode);
                                    Storage.save("PosCode", this.state.PosCode);
                                    Storage.save('Name', '移动销售');
                                    Storage.save("Num", "1");
                                } else {
                                    alert(JSON.stringify(response));
                                }
                            })

                        } else {
                            alert(JSON.stringify(data))
                        }

                    }, (err) => {
                        alert("网络请求失败");
                    })
                }
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>{this.state.invoice}</Text>
                    </View>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>机构号:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.ShopCodeOnclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.ShopCode}
                            numberoflines={1}
                            placeholder="请选择机构号"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.ShopCodeOnclick.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>Pos号:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.PosCodeOnclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.PosCode}
                            numberoflines={1}
                            placeholder="请选择Pos号"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.PosCodeOnclick.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.Button.bind(this)}>
                    <Text style={styles.buttonText}>绑定</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header:{
        height:60,
        backgroundColor:"#ff4e4e",
        paddingTop:10,
    },
    cont:{
        flexDirection:"row",
        paddingLeft:16,
        paddingRight:16,
    },
    HeaderList:{
        flex:6,
        textAlign:"center",
        paddingRight:50,
        color:"#ffffff",
        fontSize:22,
        marginTop:3,
    },
    ContList:{
        height:55,
        paddingLeft:25,
        paddingRight:15,
        paddingTop:15,
        backgroundColor:"#ffffff",
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
    listleft:{
        width:70,
        marginTop:6,
    },
    listLeftText:{
        color:"#333333",
        fontSize:16,
        textAlign:"right"
    },
    listcont:{
        flex:7,
        paddingLeft:5,
        paddingRight:5,
    },
    listContText:{
        color:"#333333",
        fontSize:16,
    },
    TextInput1:{
        paddingLeft:5,
        paddingRight:5,
        marginBottom:2,
        fontSize:16,
        color:"#333333"
    },
    button:{
        marginLeft:25,
        marginRight:25,
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ff4e4e",
        borderRadius:3,
        marginTop:30,
    },
    buttonText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"center"
    }
});



