/**
 * 配送收货第三分页选择供应商列表
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ListView,
    FlatList,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";

let dbAdapter = new DBAdapter();
let db;

export default class Distrition_list extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            LinkUrl:"",
            userName:"",
            Usercode:"",
            str2:"",
            DetailInfo:"",
            show:false,
            App_Client:this.props.App_Client?this.props.App_Client:"",
            invoice:this.props.invoice ? this.props.invoice : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
    }
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            Storage.get('userName').then((tags)=>{
                this.setState({
                    userName:tags
                })
            })

            Storage.get('Usercode').then((tags)=>{
                this.setState({
                    Usercode:tags
                })
            })

            Storage.get('str2').then((tags)=>{
                this.setState({
                    str2:tags
                })
            })

            Storage.get('LinkUrl').then((tags)=>{
                this.setState({
                    LinkUrl:tags
                })
            })

            this.fetch();
        });
    }

    fetch(){
        var date = new Date();
        var getFullYear = date.getFullYear();
        var getMonth = date.getMonth() + 1;
        var getDate = date.getDate();
        var getHours = date.getHours();
        var getMinutes = date.getMinutes();
        var getSeconds = date.getSeconds();
        if (getMonth >= 0 && getMonth <= 9) {
            var getMonth = "0" + getMonth;
        }
        if (getDate >= 0 && getDate <= 9) {
            var getDate = "0" + getDate;
        }
        if (getHours >= 0 && getHours <= 9) {
            var getHours = "0" + getHours;
        }
        if (getMinutes >= 0 && getMinutes <= 9) {
            var getMinutes = "0" + getMinutes;
        }
        if (getSeconds >= 0 && getSeconds <= 9) {
            var getSeconds = "0" + getSeconds;
        }
        var SfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + getHours+":"+getMinutes+":"+getSeconds;
        Storage.get('ClientCode').then((tags) => {
            let params = {
                reqCode:"App_PosReq",
                reqDetailCode:this.state.App_Client,
                ClientCode:tags,
                sDateTime:SfullTime,//获取当前时间转换成时间戳
                Sign:NetUtils.MD5("App_PosReq" + "##" +this.state.App_Client + "##" + SfullTime + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                username:this.state.userName,
                usercode:this.state.Usercode,
                shopcode:this.state.str2,
            };
            FetchUtil.post(this.state.LinkUrl,JSON.stringify(params)).then((data)=>{
                if(data.retcode == 1){
                    var DetailInfo = data.DetailInfo;
                    this.dataRows = this.dataRows.concat(DetailInfo);
                    this.setState({
                        DetailInfo:DetailInfo
                    })
                    if(DetailInfo==null){
                        return;
                    }else{
                        this.setState({
                            dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                        })
                    }
                }else{
                    alert(JSON.stringify(data))
                }
            },(err)=>{
                alert("网络请求失败");
            })
        })
    }

    Return(){
        this.refs.textInput.blur();
        this.props.navigator.pop();
    }

    Search(value){
        for (let i = 0; i < this.dataRows.length; i++) {
            // let temp = this.dataRows[0];
            let dataRow = this.dataRows[i];
            if (((dataRow.Formno + "").indexOf(value) >= 0)) {
                // this.dataRows[0] = dataRow;
                // this.dataRows[i] = temp;
                var str = this.dataRows.splice(i,1);
                this.dataRows.unshift(str[0])
                break;
            }
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
        })
    }

    pressPop(rowData){
        this.refs.textInput.blur();
        if(this.props.reloadView||this.props.DepName||this.props.DepCode||this.props.SourceNumber){
            if(this.state.App_Client=='App_Client_NOYSPSQ'){
                this.props.reloadView(rowData.Formno);
                this.props.DepName(rowData.depname);
                this.props.DepCode(rowData.depcode);
            }else if(this.state.App_Client=='App_Client_NoEndPCQ'){
                this.props.reloadView(rowData.Formno);
            }else if(this.state.App_Client=='App_Client_NOProWXHQ'){
                this.props.SourceNumber(rowData.Formno);
                this.props.SalesMan(rowData.ywusercode);
                this.props.Customers(rowData.suppcode);
            }
        }
        this.props.navigator.pop();
    }

    pressPop1(rowData){
        this.refs.textInput.blur();
        if(this.props.SearchShopname||this.props.SearchShopname1||this.props.DepName||this.props.DepCode){
            if(this.state.App_Client=='App_Client_NOYSCGQ'||this.state.App_Client=='App_Client_NOYSXPCGQ'){
                this.props.SearchShopname(rowData.Formno);
                this.props.SearchShopname1(rowData.suppcode);
                this.props.DepName(rowData.depname);
                this.props.DepCode(rowData.depcode);
            }
        }
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <View style={styles.header}>
                {
                    (this.state.App_Client=='App_Client_NoEndPCQ'||this.state.App_Client=='App_Client_NOYSPSQ'||this.state.App_Client=='App_Client_NOProWXHQ')?
                        <TouchableOpacity onPress={()=>this.pressPop(rowData)} style={styles.Coding}>
                            <View style={[styles.coding,{flex:3}]}>
                                <Text style={styles.codingText}>{rowData.Formno}</Text>
                            </View>
                            <View style={[styles.coding,{flex:2}]}>
                                <Text style={styles.codingText}>{rowData.depname}</Text>
                            </View>
                        </TouchableOpacity>:null
                }
                {
                    (this.state.App_Client=='App_Client_NOYSCGQ'||this.state.App_Client=='App_Client_NOYSXPCGQ')?
                        <TouchableOpacity onPress={()=>this.pressPop1(rowData)} style={styles.Coding}>
                            <View style={[styles.coding,{flex:3}]}>
                                <Text style={styles.codingText}>{rowData.Formno}</Text>
                            </View>
                            <View style={[styles.coding,{flex:1}]}>
                                <Text style={styles.codingText}>{rowData.suppcode}</Text>
                            </View>
                            <View style={[styles.coding,{flex:1}]}>
                                <Text style={styles.codingText}>{rowData.depname}</Text>
                            </View>
                        </TouchableOpacity>:null
                }
            </View>
        )

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Title}>
                    <TextInput
                        ref="textInput"
                        returnKeyType="search"
                        placeholder="搜索相关单号"
                        placeholderColor="#323232"
                        underlineColorAndroid='transparent'
                        style={styles.Search}
                        onChangeText={(value)=>{
                            this.setState({
                                search:value
                            })
                            this.Search(value)
                        }}
                    />
                    <Image source={require("../images/2.png")} style={styles.SearchImage} />
                    <View style={styles.Right}>
                        <TouchableOpacity style={styles.Text1} onPress={this.Return.bind(this)}><Text style={styles.Text}>取消</Text></TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={styles.head}>
                        <View style={[styles.coding,{flex:3}]}>
                            <Text style={styles.codingText}>单据号</Text>
                        </View>
                        {
                            (this.state.invoice=="配送收货"||this.state.invoice=="批发销售")?
                                <View style={[styles.coding,{flex:2}]}>
                                    <Text style={styles.codingText}>品类</Text>
                                </View>:null
                        }
                        {
                            (this.state.invoice=="商品验收"||this.state.invoice=="协配收货")?
                                <View style={[styles.coding,{flex:1}]}>
                                    <Text style={styles.codingText}>供应商</Text>
                                </View>:null
                        }
                        {
                            (this.state.invoice=="商品验收"||this.state.invoice=="协配收货")?
                                <View style={[styles.coding,{flex:1}]}>
                                    <Text style={styles.codingText}>品类</Text>
                                </View>:null
                        }
                    </View>

                    {
                        (this.state.DetailInfo==null)?
                            <View style={styles.Null}>
                                <Text style={styles.NullText}>
                                    暂无数据~~~
                                </Text>
                            </View>:
                            <ListView
                                keyboardShouldPersistTaps={"handled"}
                                style={styles.scrollview}
                                enableEmptySections = {true}
                                dataSource={this.state.dataSource}
                                showsVerticalScrollIndicator={true}
                                renderRow={this._renderRow.bind(this)}
                            />
                    }
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
    Title:{
        backgroundColor:"#ff4e4e",
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
    Right:{
        width:60,
        flexDirection:"row",
        paddingTop:3,
        paddingLeft:6
    },
    Text:{
        fontSize:18,
        color:"#ffffff",
        paddingTop:5,
        paddingLeft:10,
    },
    head:{
        flexDirection:"row",
        paddingTop:13,
        paddingBottom:13,
        paddingLeft:25,
        paddingRight:25,
    },
    Coding:{
        flexDirection:"row",
    },
    coding:{
        flex:2,
        paddingLeft:5
    },
    codingText:{
        color:"#333333",
        fontSize:16,
        height:22,
        overflow:"hidden"
    },
    name:{
        flex:1,
    },
    header:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
    scrollview:{
        marginBottom:140,
    },
    Null:{
        marginLeft:25,
        marginRight:25,
        marginTop:120,
    },
    NullText:{
        color:"#cccccc",
        fontSize:18,
        textAlign:"center"
    }

});
