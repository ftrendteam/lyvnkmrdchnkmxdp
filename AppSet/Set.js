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
    TouchableOpacity,
} from 'react-native';
import Index from "../app/Index";
import Search from "../app/Search";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';
import ModalDropdown from 'native';
export default class Set extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:true,
            invoice:this.props.invoice ? this.props.invoice : "",
        };
    }

    componentDidMount(){}

    Return(){
        var nextRoute={
            name:"Index",
            component:Index
        };
        this.props.navigator.push(nextRoute)
    }

    onclick(){

    }

    _setModalVisible(){}

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
                    <TouchableOpacity style={styles.listcont} onPress={this.onclick.bind(this)}>
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
                    <TouchableOpacity onPress={this.onclick.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <TouchableOpacity style={styles.listcont} onPress={this.onclick.bind(this)}>
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
                    <TouchableOpacity onPress={this.onclick.bind(this)}>
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
                                <View style={styles.danju}><Text style={styles.DanText}>打印设置</Text></View>
                                <TouchableOpacity style={styles.ModalLeft} onPress={this._setModalVisible.bind(this)}>
                                    <Image source={require("../images/2_02.png")} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity>

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
        height:180,
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