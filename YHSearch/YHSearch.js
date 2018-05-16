/**
 * 库存查询
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
import Screen from "./Screen";//筛选条件
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let db;
export default class YHSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            linkurl:"",
            show:false,
            JiGou:this.props.JiGou ? this.props.JiGou : "",
            DepCode:this.props.DepCode ? this.props.DepCode : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            DeviceEventEmitter.removeAllListeners();
            this._fetch();
        });
    }

    _fetch(){
        Storage.get('code').then((tags)=>{
            Storage.get('LinkUrl').then((LinkUrl) => {
                let params = {
                    reqCode:"App_PosReq",
                    reqDetailCode:"App_Client_ProZYHQ",
                    ClientCode:this.state.ClientCode,
                    sDateTime:Date.parse(new Date()),
                    ShopCode:tags,
                    ChildShopCode:this.state.JiGou,
                    depcode:this.state.DepCode,
                    Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_ProZYHQ" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',
                };
                console.log(JSON.stringify(params))
                FetchUtils.post(LinkUrl,JSON.stringify(params)).then((data)=>{
                    if(data.retcode == 1){
                        var detailinfo = data.DetailInfo;
                        console.log("data.DetailInfo",JSON.stringify(data.DetailInfo))
                        this.dataRows = this.dataRows.concat(detailinfo);
                        this.setState({
                            dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                        })
                    }else{
                        alert(JSON.stringify(data))
                    }
                },(err)=>{
                    alert("网络请求失败");
                })
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

    Search(value){
        if(value==""){
            this.abc=[];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.abc),
            })
            Storage.get('code').then((tags)=>{
                Storage.get('LinkUrl').then((LinkUrl) => {
                    let params = {
                        reqCode:"App_PosReq",
                        reqDetailCode:"App_Client_ProZYHQ",
                        ClientCode:this.state.ClientCode,
                        sDateTime:Date.parse(new Date()),
                        ShopCode:tags,
                        Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_ProZYHQ" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',
                    };
                    FetchUtils.post(LinkUrl,JSON.stringify(params)).then((data)=>{
                        if(data.retcode == 1){
                            var detailinfo = data.DetailInfo;
                            this.dataRows.push(detailinfo);
                            this.setState({
                                dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                            })
                        }else{
                            alert(JSON.stringify(data))
                        }
                    },(err)=>{
                        alert("网络请求失败");
                    })
                })
            })
        }else if(value!==""){
            for (let i = 0; i < this.dataRows.length; i++) {
                let dataRow = this.dataRows[i];
                if (((dataRow.prodname + "").indexOf(value) >= 0)) {
                    var str = this.dataRows.splice(i,1);
                    this.dataRows.unshift(str[0]);
                    // break;
                }
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
            })
        }
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <View style={styles.DataList}>
                <View style={styles.coding}>
                    <Text style={styles.prod_name}>{rowData.prodname}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.prod_name}>{rowData.countm}</Text>
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

    /**
     * 筛选机构、要货单号
     * @constructor
     */
    YHSearch(){
        var nextRoute = {
            name: "要货查询",
            component: Screen,
            params: {
                invoice:"要货查询",
            }
        };
        this.props.navigator.push(nextRoute);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>要货查询</Text>
                        <TouchableOpacity onPress={this.YHSearch.bind(this)} style={styles.onclick}>
                            <Image source={require("../images/1_08.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.Title}>
                        <TextInput
                            autoFocus={true}
                            returnKeyType="search"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholder="搜索相关产品名称"
                            placeholderColor="#323232"
                            style={styles.Search}
                            onChangeText={(value)=>{
                                this.setState({
                                    search:value
                                })
                                this.Search(value)
                            }}
                        />
                        <Image source={require("../images/2.png")} style={styles.SearchImage} />
                    </View>
                </View>
                <View>
                    <View style={styles.head}>
                        <View style={styles.coding}>
                            <Text style={styles.TitleCodingText}>名称</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.TitleCodingText}>数量</Text>
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
        paddingRight:16,
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
    head:{
        flexDirection:"row",
        paddingTop:13,
        paddingBottom:13,
        paddingLeft:5,
        paddingRight:5,
        backgroundColor:"#f2f2f2"
    },
    coding:{
        flex:1,
    },
    prod_name:{
        color:"#333333",
        fontSize:16,
        height:28,
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