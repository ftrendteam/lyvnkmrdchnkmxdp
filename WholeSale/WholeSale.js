/**
 * 商品品类 YHDan文件夹下
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
import Index from "../app/Index";
import Distrition_list from "../app/Distrition_list";
import Search from "../app/Search";
import PinLeiData from "../YHDan/PinLeiData";
import SalesMan from "./SalesMan";
import Customers from "./Customers";
import Plan from "./Plan";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';

export default class WholeSale extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            active:"",
            DepName1:"",
            DepCode1:"",
            SalesMan1:"",
            Customers1:"",
            SourceNumber1:"",
            Plan1:"",
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
    /**
     * 商品品类获取
     */
    ShopClass(){
        var nextRoute={
            name:"PinLeiData",
            component:PinLeiData,
            params: {
                DepName:(DepName)=>this._DepName(DepName),
                DepCode:(DepCode)=>this._DepCode(DepCode),
            }
        };
        this.props.navigator.push(nextRoute)
    }
    /**
     * 业务员
     */
    SalesMan(){
        var nextRoute={
            name:"SalesMan",
            component:SalesMan,
            params: {
                SalesMan:(SalesMan)=>this._SalesMan(SalesMan),
            }
        };
        this.props.navigator.push(nextRoute)
    }
    /**
     * 批发客户
     */
    Customers(){
        var nextRoute={
            name:"Customers",
            component:Customers,
            params: {
                Customers:(Customers)=>this._Customers(Customers),
            }
        };
        this.props.navigator.push(nextRoute)
    }
    /**
     * 来源单号（来源单号与配送收货、商品验收、等选择的单号是同一个接口）
     */
    SourceNumber(){
        var nextRoute={
            name:"Distrition_list",
            component:Distrition_list,//app文件夹
            params: {
                SourceNumber:(SourceNumber)=>this._SourceNumber(SourceNumber),
                App_Client:'App_Client_NOProWXHQ'
            }
        };
        this.props.navigator.push(nextRoute)
    }
    /**
     * 批发方案
     */
    Plan(){
        var nextRoute={
            name:"Plan",
            component:Plan,
            params: {
                Plan:(Customers)=>this._Plan(Customers),
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

    _SalesMan(SalesMan){
        SalesMan = String(SalesMan);
        this.setState({
            SalesMan1:SalesMan,
        });
    }

    _Customers(Customers){
        Customers = String(Customers);
        this.setState({
            Customers1:Customers,
        });
    }

    _SourceNumber(SourceNumber){
        SourceNumber = String(SourceNumber);
        this.setState({
            SourceNumber1:SourceNumber,
        });
    }

    _Plan(Plan){
        Plan = String(Plan);
        this.setState({
            Plan1:Plan,
        });
    }

    Button(){
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        if(this.state.SalesMan1==""){
            ToastAndroid.show('请选择业务员', ToastAndroid.SHORT)
        }else if(this.state.Customers1=="") {
            ToastAndroid.show('请选择批发客户', ToastAndroid.SHORT)
        }else{
            if(this.state.invoice=="批发销售"){
                Storage.delete('OrgFormno');
                Storage.delete('scode');
                Storage.delete('shildshop');
                Storage.delete('YuanDan');
                Storage.delete('Screen');
                Storage.delete('StateMent');
                Storage.delete('BQNumber');
                Storage.delete('YdCountm');
                Storage.delete('Modify');
                Storage.delete("PeiSong");
                Storage.delete('StateMent');
                if(this.state.DepName1==""&&this.state.DepCode1==""){
                    Storage.delete('DepCode');
                }else{
                    Storage.save('DepCode', this.state.DepCode1);
                }
                Storage.save('Name', '批发销售');
                Storage.save('FormType', 'PFXHYW');
                Storage.save('ProYH', 'ProWXH');
                Storage.save('FormCheck', 'PFXHYW');
                Storage.save('SourceNumber', this.state.SourceNumber1);
                Storage.save('YdCountm', '2');
                Storage.save('Screen','1');
                //将内容保存到本地数据库
                Storage.save('valueOf', 'App_Client_ProWXH');
                Storage.save('history', 'App_Client_ProWXHQ');
                Storage.save('historyClass', 'App_Client_ProWXHDetailQ');
            }else if(this.state.invoice=="批发报价"){
                Storage.delete('OrgFormno');
                Storage.delete('scode');
                Storage.delete('shildshop');
                Storage.delete('YuanDan');
                Storage.delete('Screen');
                Storage.delete('StateMent');
                Storage.delete('BQNumber');
                Storage.delete('YdCountm');
                Storage.delete('Modify');
                Storage.delete("PeiSong");
                Storage.delete('StateMent');
                Storage.delete('SourceNumber');
                Storage.delete('Screen');
                if(this.state.DepName1==""&&this.state.DepCode1==""){
                    Storage.delete('DepCode');
                }else{
                    Storage.save('DepCode', this.state.DepCode1);
                }
                Storage.save('Name', '批发报价');
                Storage.save('FormType', 'PFBJYW');
                Storage.save('ProYH', 'ProWBH');
                Storage.save('FormCheck', 'PFBJYW');
                //将内容保存到本地数据库
                Storage.save('valueOf', 'App_Client_ProWBH');
                Storage.save('history', 'App_Client_ProWBHQ');
                Storage.save('historyClass', 'App_Client_ProWBHDetailQ');
            }
            Storage.save('Date', data);
            Storage.save('OrgFormno', this.state.SalesMan1);
            Storage.save('scode', this.state.Customers1);
            Storage.save('shildshop', this.state.Plan1);
            if(this.state.Disting=="0") {
                var nextRoute={
                    name:"Index",
                    component:Index
                };
                this.props.navigator.push(nextRoute);
            }else if(this.state.Disting=="1"){
                var nextRoute={
                    name:"Search",
                    component:Search
                };
                this.props.navigator.push(nextRoute);
            }
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
                        <Text style={styles.listLeftText}>商品品类:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.ShopClass.bind(this)}>
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
                    <TouchableOpacity onPress={this.ShopClass.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>业务员:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.SalesMan.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.SalesMan1}
                            numberoflines={1}
                            placeholder="请选择业务员"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.SalesMan.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>批发客户:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.Customers.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.Customers1}
                            numberoflines={1}
                            placeholder="请选择批发客户"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.Customers.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                {
                    (this.state.invoice=="批发销售")?
                        <View style={styles.ContList}>
                            <View style={styles.listleft}>
                                <Text style={styles.listLeftText}>来源单号:</Text>
                            </View>
                            <TouchableOpacity style={styles.listcont} onPress={this.SourceNumber.bind(this)}>
                                <TextInput
                                    style={styles.TextInput1}
                                    autofocus={true}
                                    editable={false}
                                    defaultValue ={this.state.SourceNumber1}
                                    numberoflines={1}
                                    placeholder="请选择来源单号"
                                    textalign="center"
                                    underlineColorAndroid='transparent'
                                    placeholderTextColor="#cccccc"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.SourceNumber.bind(this)}>
                                <Image source={require("../images/2_03.png")}></Image>
                            </TouchableOpacity>
                        </View>
                        :
                        null
                }
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>批发方案:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.Plan.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.Plan1}
                            numberoflines={1}
                            placeholder="请选择批发方案"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.Plan.bind(this)}>
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