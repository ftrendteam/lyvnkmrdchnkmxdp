/**
 * 商品配送 下级列表 PSDan文件夹下
 */

import React, { Component } from 'react';
import {
   
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import Index from "../app/Index";
import Search from "../app/Search";
import JiGou from "./JiGou";
import YHDan from "./YHDan";
import CKu from "./CKu";
import PinLeiData from "../YHDan/PinLeiData";
import ShoppingCart from "../app/ShoppingCart";//清单
import Storage from '../utils/Storage';

export default class PSDan extends Component {
    constructor(props){
        super(props);
        this.state = {
            JiGou:'',
            YHDan:'',
            Disting:'',
            DepName1:"",
            DepCode1:"",
            CKu:"001",
            invoice:this.props.invoice ? this.props.invoice : "",
        }
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
//机构
    JiGouOnclick(){
        var nextRoute={
            name:"JiGou",
            component:JiGou,
            params: {
                reloadShopname:(JiGou)=>this._reloadShopname(JiGou)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadShopname(JiGou) {
        JiGou = String(JiGou);
        this.setState({
            JiGou:JiGou,
        });
    }
//要货单
    YHOnclick(){
        var nextRoute={
            name:"YHDan",
            component:YHDan,
            params: {
                YHDan:(YHDan)=>this._YHDan(YHDan),
                reloadShopname:(JiGou)=>this._reloadShopname(JiGou),
                DepName: (DepName) => this._DepName(DepName),
                DepCode: (DepCode) => this._DepCode(DepCode),
                JiGou: this.state.JiGou,
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _YHDan(YHDan) {
        YHDan = String(YHDan);
        this.setState({
            YHDan:YHDan,
        });
    }
//仓库
    CKOclick(){
        if(this.state.JiGou==''){
            ToastAndroid.show('请先选择机构号', ToastAndroid.SHORT);
            // alert("请先选择机构号")
        }else{
            var nextRoute={
                name:"CKu",
                component:CKu,
                params: {
                    CKu:(CKu)=>this._CKu(CKu),
                    JiGou: this.state.JiGou,
                }
            };
            this.props.navigator.push(nextRoute)
        }
    }

    _CKu(CKu) {
        CKu = String(CKu);
        this.setState({
            CKu:CKu,
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
        if(this.state.Disting=="0"){
            if(this.state.JiGou==''){
                ToastAndroid.show("机构号不能为空",ToastAndroid.SHORT);
                return;
            }else if(this.state.CKu==''){
                ToastAndroid.show("仓库不能为空",ToastAndroid.SHORT);
                return;
            }else{
                if(this.state.YHDan==""){
                    this.Data();
                    var nextRoute={
                        name:"Index",
                        component:Index,
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete("PeiSong");
                }else{
                    this.Data();
                    var nextRoute={
                        name:"ShoppingCart",
                        component:ShoppingCart,
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.save('PeiSong',"商品配送");
                }
            }
        }else if(this.state.Disting=="1"){
            if(this.state.JiGou==''){
                ToastAndroid.show("机构号不能为空",ToastAndroid.SHORT);
                return;
            }else if(this.state.CKu==''){
                ToastAndroid.show("仓库不能为空",ToastAndroid.SHORT);
                return;
            }else{
                if(this.state.YHDan==""){
                    this.Data();
                    var nextRoute={
                        name:"Search",
                        component:Search,
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete("PeiSong");
                }else{
                    this.Data();
                    var nextRoute={
                        name:"ShoppingCart",
                        component:ShoppingCart,
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.save('PeiSong',"商品配送");
                }
            }
        }
    }

    Data(){
        var str1=this.state.YHDan;
        var str2=this.state.JiGou;
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        Storage.delete('scode');
        Storage.delete('StateMent');
        Storage.delete('BQNumber');
        Storage.delete('YuanDan');
        Storage.delete('YdCountm');
        Storage.delete('Modify');
        if(this.state.DepCode1==""&&this.state.DepCode1==0){
            Storage.delete('DepCode');
        }else{
            Storage.save('DepCode', this.state.DepCode1);
        }
        if(this.state.YHDan==""){
            Storage.delete('DanHao');
            Storage.save('YdCountm',"6");
            Storage.save('Screen', '2');
        }else{
            Storage.save('DanHao',"App_Client_ProPSYHDetailQ");
            Storage.save('YdCountm',"2");
            Storage.save('Screen', '1');
        }
        Storage.save('Date',data);
        Storage.save('Name','商品配送');
        Storage.save('shildshop',str2);
        Storage.save('OrgFormno',str1);
        Storage.save('FormType', 'PSYW');
        Storage.save('CKu',this.state.CKu);
        Storage.save('FormCheck', 'PSYW');//要货查询审核按钮
        Storage.save('valueOf','App_Client_ProPS');
        Storage.save('history','App_Client_ProPSQ');
        Storage.save('historyClass','App_Client_ProPSDetailQ');
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
                        <Text style={styles.listLeftText}>机构:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.JiGouOnclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.JiGou}
                            numberoflines={1}
                            placeholder="请选择机构"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.JiGouOnclick.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>要货单:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.YHOnclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.YHDan}
                            numberoflines={1}
                            placeholder="请选择要货单"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.YHOnclick.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>仓库:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.CKOclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            value ={this.state.CKu}
                            numberoflines={1}
                            placeholder="请选择供应商"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.CKOclick.bind(this)}>
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
        paddingTop:5,
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