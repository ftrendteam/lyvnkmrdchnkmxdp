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
    Modal,
    TextInput,
    ListView,
    TouchableOpacity,
    ActivityIndicator,
    InteractionManager,
    DeviceEventEmitter,
} from 'react-native';
import Index from "../app/Index";
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import FetchUtil from "../utils/FetchUtils";
var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let db;
export default class StockEnquiries extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            linkurl:"",
            show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            Storage.get('LinkUrl').then((tags) => {
                this.setState({
                    linkurl:tags
                })
            });
            DeviceEventEmitter.removeAllListeners();
            this.Device();
        });
    }

    Code(){
        RNScannerAndroid.openScanner();
    }

    Device() {
        DeviceEventEmitter.addListener("code", (reminder) => {
            this.setState({
                search:reminder
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

    SearchButton(){
        this.ModalShow();
        this.dataRows=[];
        Storage.get('str2').then((tags) => {
            let params = {
                TblName:"android_ProdQryCurrKC",
                shopcode:tags,
                NeedPage:"0",
                PageSize:"20",
                CurrPage:"1",
                context:this.state.search,
            }
            FetchUtil.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                var TblRow = data.TblRow;
                this.dataRows = this.dataRows.concat(TblRow);
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                })
                this.ModalShow();
            })
        })
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <View style={styles.DataList}>
                <View style={[styles.coding,{paddingLeft:10,}]}>
                    <Text style={styles.prod_name}>{rowData.prod_name}</Text>
                    <Text style={[styles.prod_name,{color:"#666666"}]}>{rowData.prod_code}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.codingText}>{rowData.total}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.codingText}>{rowData.kc_count}</Text>
                </View>
            </View>
        )

    }

    ModalShow(){
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }

    _onEndEditing(){
        this._textInput.blur();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>库存查询</Text>
                        <TouchableOpacity onPress={this.Code.bind(this)} style={styles.onclick}>
                            <Image source={require("../images/1_05.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.Title}>
                        <TextInput
                            ref={component => this._textInput = component}
                            onEndEditing={()=>{this._onEndEditing()}}
                            autofocus="{true}"
                            returnKeyType="search"
                            placeholder="搜索相关产品名称"
                            placeholderColor="#323232"
                            underlineColorAndroid='transparent'
                            style={styles.Search}
                            value={this.state.search}
                            onChangeText={(value)=>{
                                this.setState({
                                    search:value
                                })
                            }}
                        />
                        <Image source={require("../images/2.png")} style={styles.SearchImage} />
                        <TouchableOpacity onPress={this.SearchButton.bind(this)} style={styles.Right}>
                            <Text style={styles.Text}>搜索</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={styles.head}>
                        <View style={styles.coding}>
                            <Text style={styles.TitleCodingText}>名称&条码</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.TitleCodingText}>金额</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.TitleCodingText}>库存</Text>
                        </View>
                    </View>
                    <ListView
                        style = {styles.scrollview}
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={true}
                        renderRow={this._renderRow.bind(this)}
                    />
                </View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.LoadCenter}>
                        <View style={styles.loading}>
                            <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
                            <Text style={styles.TextLoading}>加载中</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
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
    Title:{
        backgroundColor:"#e7e7e7",
        paddingLeft:16,
        paddingRight:5,
        paddingTop:15,
        paddingBottom:15,
        flexDirection:"row",
    },
    SearchImage:{
        position:"absolute",
        top:22,
        left:24,
    },
    Search:{
        borderRadius:30,
        backgroundColor:"#ffffff",
        color: "#333333",
        paddingLeft:46,
        paddingBottom:15,
        paddingTop:6,
        paddingBottom:6,
        fontSize:14,
        flex:1,
    },
    Right:{
        width:70,
        flexDirection:"row",
        paddingTop:3,
        paddingLeft:8
    },
    Text:{
        fontSize:18,
        color:"#ff4e4e",
        paddingTop:5,
        paddingLeft:10,
    },
    head:{
        flexDirection:"row",
        paddingTop:13,
        paddingBottom:13,
        paddingLeft:25,
        paddingRight:25,
        backgroundColor:"#f2f2f2"
    },
    coding:{
        flex:2,
    },
    prod_name:{
        color:"#333333",
        fontSize:16,
        height:22,
        overflow:"hidden",
    },
    codingText:{
        color:"#333333",
        fontSize:16,
        height:44,
        paddingTop:10,
        overflow:"hidden",
        textAlign:"center"
    },
    TitleCodingText:{
        color:"#333333",
        fontSize:16,
        height:22,
        overflow:"hidden",
        textAlign:"center"
    },
    name:{
        flex:1,
    },
    DataList:{
        flexDirection:"row",
        paddingLeft:5,
        paddingRight:5,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
    scrollview:{
        marginBottom:180,
    },
    LoadCenter:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:"#000000",
        opacity:0.8,
        borderRadius:5,
    },
    TextLoading:{
        fontSize:17,
        color:"#ffffff"
    },
});