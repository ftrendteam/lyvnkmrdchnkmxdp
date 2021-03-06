/**
 * 设置
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import Index from "../app/Index";
import Search from "../app/Search";
import User_Information from "./User_Information";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';
var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
export default class Set extends Component {
    constructor(props){
        super(props);
        this.state = {
            Radio:"",
            pressStatus: 0,
            PressStatus: 0,
            pressStatus1: 0,
            PressStatus1: 0,
            show:false,
            SaoMahow:false,
            invoice:this.props.invoice ? this.props.invoice : "",
        };
    }

    componentDidMount(){
        Storage.get('Radio').then((Radio) => {
            if (Radio == "0") {
                this.setState({
                    pressStatus: 'pressin',
                    PressStatus: '0',
                });
            } else if (Radio == "1") {
                this.setState({
                    PressStatus: 'Pressin',
                    pressStatus: 0
                });
            }
        })
    }

    Return(){
        this.props.navigator.pop();
        // var nextRoute={
        //     name:"Index",
        //     component:Index
        // };
        // this.props.navigator.push(nextRoute)
    }

    UserInformation(){
        var nextRoute = {
            name: "用户信息",
            component: User_Information,//YHDan文件夹
            params: {
                invoice:"用户信息"
            }
        };
        this.props.navigator.push(nextRoute);
    }

    /**
     * 打印设置
     * @private
     */
    SetButton(){
        Storage.get('Radio').then((tags) => {
            if (tags == "0") {
                this.setState({
                    pressStatus: 'pressin',
                    PressStatus: 0,
                });
            } else if (tags== "1") {
                this.setState({
                    PressStatus: 'Pressin',
                    pressStatus: 0
                });
            }
        })
        this._Show();
    }

    _setModalVisible(){
        this._Show();
    }

    YButton() {
        Storage.save("Radio", "0");
        this.setState({
            pressStatus: 'pressin',
            PressStatus: '0',
        });
    }

    NButton() {
        Storage.save("Radio", "1");
        this.setState({
            PressStatus: 'Pressin',
            pressStatus: 0
        });
    }

    _Show() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }

    /**
     * 扫码设置
     * @constructor
     */
    _setModalVisible1(){
        this._SaoMahow();
    }
    SMButton(){
        NativeModules.AndroidDeviceInfo.getDeviceModel((deviceModel)=>{
            if(deviceModel=="sq39Q"||deviceModel=="SHT"){
                ToastAndroid.show("当前机器不支持连续扫码功能", ToastAndroid.SHORT);
            }else {
                Storage.get('SaoMa').then((tags) => {
                    if (tags == "0") {
                        this.setState({
                            PressStatus1: 'Pressin1',
                            pressStatus1: 0
                        });
                    } else if (tags== "1") {
                        this.setState({
                            pressStatus1: 'pressin1',
                            PressStatus1: '0',
                        });
                    }
                })
                this._SaoMahow();
            }
        });
    }

    SYButton() {
        Storage.save("SaoMa", "1");//支持扫码
        this.setState({
            pressStatus1: 'pressin1',
            PressStatus1: '0',
        });
    }

    SNButton() {
        Storage.save("SaoMa", "0");//不支持扫码
        this.setState({
            PressStatus1: 'Pressin1',
            pressStatus1: 0
        });
    }

    _SaoMahow(){
        let isShow = this.state.SaoMahow;
        this.setState({
            SaoMahow: !isShow,
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
                    <TouchableOpacity style={styles.listcont} onPress={this.SetButton.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            editable={false}
                            numberoflines={1}
                            placeholder="打印设置"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#333333"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.SetButton.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <TouchableOpacity style={styles.listcont} onPress={this.SMButton.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            editable={false}
                            numberoflines={1}
                            placeholder="扫码设置"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#333333"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.SMButton.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <TouchableOpacity style={styles.listcont} onPress={this.UserInformation.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            editable={false}
                            numberoflines={1}
                            placeholder="用户信息"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#333333"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.UserInformation.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.ModalStyle}>
                        <View style={styles.ModalView}>
                            <View style={styles.DanJu}>
                                <View style={styles.danju}><Text style={styles.DanText}>是否打开打印功能</Text></View>
                                <TouchableOpacity style={styles.ModalLeft} onPress={this._setModalVisible.bind(this)}>
                                    <Image source={require("../images/2_02.png")} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={this.YButton.bind(this)} style={styles.radio}>
                                <Text style={styles.radiotext}>
                                    是
                                </Text>
                                <Image source={this.state.pressStatus == 'pressin' ? require("../images/1_431.png") : require("../images/1_43.png")} style={styles.radioimage}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.NButton.bind(this)} style={styles.radio}>
                                <Text style={styles.radiotext}>
                                    否
                                </Text>
                                <Image source={this.state.PressStatus == 'Pressin' ? require("../images/1_431.png") : require("../images/1_43.png")} style={styles.radioimage}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.SaoMahow}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.ModalStyle}>
                        <View style={styles.ModalView}>
                            <View style={styles.DanJu}>
                                <View style={styles.danju}><Text style={styles.DanText}>是否打开搜索界面连续扫码功能</Text></View>
                                <TouchableOpacity style={styles.ModalLeft} onPress={this._setModalVisible1.bind(this)}>
                                    <Image source={require("../images/2_02.png")} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={this.SYButton.bind(this)} style={styles.radio}>
                                <Text style={styles.radiotext}>
                                    是
                                </Text>
                                <Image source={this.state.pressStatus1 == 'pressin1' ? require("../images/1_431.png") : require("../images/1_43.png")} style={styles.radioimage}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.SNButton.bind(this)} style={styles.radio}>
                                <Text style={styles.radiotext}>
                                    否
                                </Text>
                                <Image source={this.state.PressStatus1 == 'Pressin1' ? require("../images/1_431.png") : require("../images/1_43.png")} style={styles.radioimage}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ModalStyle:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"#333333",
        opacity:0.8
    },
    ModalView:{
        borderRadius:5,
        paddingBottom:20,
        width:300,
        height:150,
        backgroundColor:"#ffffff"
    },
    ModalLeft:{
        position:"absolute",
        right:15,
        top:6,
        paddingLeft:5,
        paddingRight:5,
    },
    danju:{
        flex:1,
        paddingLeft:15,
    },
    DanJu:{
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ff4e4e",
        flexDirection:'row',
    },
    DanText:{
        color:"#ffffff",
        textAlign:"left",
        fontSize:16,
    },
    radio:{
        marginTop:15,
        paddingLeft:60,
        height:30,
    },
    radiotext:{
        fontSize:16,
        color:"#000000",

    },
    radioimage:{
        position:"absolute",
        left:20,
    },
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
        paddingLeft:16,
        paddingRight:16,
        paddingTop:12,
        marginTop:10,
        backgroundColor:"#ffffff",
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },

    listcont:{
        flex:1,
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
});