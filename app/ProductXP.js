/**
 * 协配采购第二分页
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    Image
} from 'react-native';
import Index from "./Index";
import Search from "./Search";
import ProductCG_list from "./ProductCG_list";
import ProductXP_list from "./ProductXP_list";
import PinLeiData from "../YHDan/PinLeiData";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';
export default class ProductXP extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            sCode1:"",
            shopname1:"",
            active:"",
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

    onclick(){
        var nextRoute={
            name:"ProductCG_list",
            component:ProductCG_list,
            params: {
                reloadView:(sCode)=>this._reloadView(sCode)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadView(sCode) {
        sCode = String(sCode);
        this.setState({
            sCode1:sCode,
        });
    }

    Monclick(){
        var nextRoute={
            name:"ProductXP_list",
            component:ProductXP_list,
            params: {
                reloadShopname:(shopname)=>this._reloadShopname(shopname)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadShopname(shopname) {
        shopname = String(shopname);
        this.setState({
            shopname1:shopname,
        });
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

    Button(){
        if(this.state.Disting=="0") {
            if(this.state.sCode1==""){
                ToastAndroid.show("请选择供应商",ToastAndroid.SHORT);
                return;
            }else if(this.state.shopname1==""){
                ToastAndroid.show("请选择机构信息",ToastAndroid.SHORT);
                return;
            }else{
                var nextRoute={
                    name:"Index",
                    component:Index,
                };
                this.props.navigator.push(nextRoute);
                this.Data();
            }
        }else if(this.state.Disting=="1"){
            if(this.state.sCode1==""){
                ToastAndroid.show("请选择供应商",ToastAndroid.SHORT);
                return;
            }else if(this.state.shopname1==""){
                ToastAndroid.show("请选择机构信息",ToastAndroid.SHORT);
                return;
            }else{
                var nextRoute={
                    name:"Search",
                    component:Search,
                };
                this.props.navigator.push(nextRoute);
                this.Data();
            }
        }

    }

    Data(){
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        var str=this.state.sCode1;
        var str1=this.state.shopname1;
        Storage.delete('YuanDan');
        Storage.delete('Screen');
        Storage.delete('OrgFormno');
        Storage.delete('StateMent');
        Storage.delete('BQNumber');
        Storage.delete('Modify');
        Storage.delete("PeiSong");
        Storage.delete('SourceNumber');
        if(this.state.DepName1==""&&this.state.DepCode1==""){
            Storage.delete('DepCode');
        }else{
            Storage.save('DepCode', this.state.DepCode1);
        }
        Storage.save('YdCountm', '3');
        Storage.save('Name','协配采购');
        Storage.save('FormType','XPCGYW');
        Storage.save('FormCheck', 'XPCGYW');//要货查询审核按钮
        Storage.save('valueOf','App_Client_ProXPCG');
        Storage.save('history','App_Client_ProXPCGQ');
        Storage.save('historyClass','App_Client_ProXPCGDetailQ');
        Storage.save('ProYH','ProXPCG');
        Storage.save('Date',data);
        Storage.save("scode",str);
        Storage.save('shildshop',str1);
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
                        <Text style={styles.listLeftText}>供应商:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.onclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.sCode1}
                            numberoflines={1}
                            placeholder="请选择供应商"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.onclick.bind(this)}>
                        <Image source={require("../images/2_03.png")} style={styles.Image}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>机构:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.Monclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.shopname1}
                            numberoflines={1}
                            placeholder="请选择机构信息"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.Monclick.bind(this)}>
                        <Image source={require("../images/2_03.png")} style={styles.Image}></Image>
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
                <TouchableOpacity style={styles.button} onPress={this.Button.bind(this)}>
                    <Text style={styles.buttonText}>确定</Text>
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
        marginBottom:5,
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



