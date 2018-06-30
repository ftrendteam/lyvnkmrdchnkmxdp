/**
 * 商品盘点第二分页
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import Index from "./Index";
import Search from "./Search";
import Distrition_list from "./Distrition_list";
import PinLeiData from "../YHDan/PinLeiData";
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
            Disting:"",
            DepName1:"",
            DepCode1:"",
            invoice:this.props.invoice ? this.props.invoice : "",
        };
    }

    componentDidMount(){
        Storage.get('Disting').then((tags)=>{
            this.setState({
                Disting:tags
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

    _reloadView(sCode) {
        sCode = String(sCode);
        this.setState({
            sCode1:sCode,
        });
    }

    Home(){
        if(this.state.Disting=="0") {
            if(this.state.sCode1==""){
                ToastAndroid.show("请选择原始单号",ToastAndroid.SHORT);
                return;
            }else{
                var nextRoute={
                    name:"主页",
                    component:Index
                };
                this.props.navigator.push(nextRoute);
                this.Data();
            }
        }else if(this.state.Disting=="1") {
            if (this.state.sCode1 == "") {
                ToastAndroid.show("请选择原始单号",ToastAndroid.SHORT);
                return;
            } else {
                var nextRoute = {
                    name: "Search",
                    component: Search
                };
                this.props.navigator.push(nextRoute);
                this.Data();
            }
        }
    }

    Data(){
        var str=this.state.sCode1;
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        Storage.delete('OrgFormno');
        Storage.delete('Screen');
        Storage.delete('scode');
        Storage.delete('shildshop');
        Storage.delete('StateMent');
        Storage.delete('BQNumber');
        Storage.delete('YuanDan');
        Storage.delete('YdCountm');
        Storage.delete('Modify');
        Storage.delete("PeiSong");
        Storage.delete('SourceNumber');
        if(this.state.DepName1==""&&this.state.DepCode1==""){
            Storage.delete('DepCode');
        }else{
            Storage.save('DepCode', this.state.DepCode1);
        }
        Storage.save('YdCountm', '盘点');
        Storage.save('OrgFormno',str);
        Storage.save('Date',data);
        Storage.save('Name','商品盘点');
        Storage.save('FormCheck', 'PCYW');//要货查询审核按钮
        Storage.save('valueOf','App_Client_ProPC');
        Storage.save('history','App_Client_ProPCQ');
        Storage.save('historyClass','App_Client_ProPCDetailQ');
        Storage.save('ProYH','ProPC');
        Storage.save('Document', "商品盘点");
    }

    Search(){
        var nextRoute={
            name:"Distrition_list",
            component:Distrition_list,
            params: {
                reloadView:(sCode)=>this._reloadView(sCode),
                App_Client:'App_Client_NoEndPCQ'
            }
        };
        this.props.navigator.push(nextRoute)
    }

    ShoppData() {
        var nextRoute = {
            name: "ProductCG_list",
            component: PinLeiData,
            params: {
                DepName: (DepName) => this._DepName(DepName),
                DepCode: (DepCode) => this._DepCode(DepCode),
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _DepName(DepName) {
        DepName = String(DepName);
        this.setState({
            DepName1:DepName,
        });
    }
    _DepCode(DepCode) {
        DepCode = String(DepCode);
        this.setState({
            DepCode1:DepCode,
        });
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
                    <TouchableOpacity onPress={this.Search.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>商品品类:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.ShoppData.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.DepName1}
                            numberoflines={1}
                            placeholder="请选择商品品类"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.ShoppData.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.search}>
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
        height:58,
        paddingLeft:25,
        paddingRight:15,
        paddingTop:12,
        backgroundColor:"#ffffff",
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
    listleft:{
        width:80,
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
        marginBottom:5,
        fontSize:16,
        color:"#333333"
    },
    search:{
        flexDirection:"row",
        marginTop:30,
        paddingLeft:25,
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
        flex:1,
        backgroundColor:"#ff4e4e",
        borderRadius:3,
        paddingTop:13,
        paddingBottom:13,
        marginRight:25,
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


