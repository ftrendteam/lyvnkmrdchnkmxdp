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

export default class PickedDate_list extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            linkurl:"",
            invoice:"",
            show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
        this.pickerData=[];
    }
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            Storage.get('LinkUrl').then((tags) => {
                this.setState({
                    linkurl:tags
                })
            })
            Storage.get('PickedDate').then((tags)=>{
                this.setState({
                    invoice:tags
                })
            })
            this.fetch();
        });
    }

    fetch(){
        Storage.get('ClientCode').then((tags) => {
            let params = {
                reqCode:"App_PosReq",
                reqDetailCode:"App_Client_UseQry",
                ClientCode:tags,
                sDateTime:Date.parse(new Date()),//获取当前时间转换成时间戳
                Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_UseQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
            };
            FetchUtil.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                if(data.retcode == 1){
                    var DetailInfo1 = data.DetailInfo1;
                    this.dataRows = this.dataRows.concat(DetailInfo1);
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                    })
                }else{
                }
            })
        })
    }

    Return(){
        this.props.navigator.pop();
    }

    Search(value){
        //if(value>=3){
            for (let i = 0; i < this.dataRows.length; i++) {
                // let temp = this.dataRows[0];
                let dataRow = this.dataRows[i];
                if (((dataRow.sCode + "").indexOf(value) >= 0)) {
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
        //}
    }

    pressPop(rowData){
        if(this.props.reloadView){
            this.props.reloadView(rowData.shopname+'_'+rowData.shopcode)
        }
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <TouchableOpacity style={styles.header} onPress={()=>this.pressPop(rowData)}>
                <View style={styles.coding}>
                    <Text style={styles.codingText1}>{rowData.shopcode}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.nameText1}>{rowData.shopname}</Text>
                </View>
            </TouchableOpacity>
        )

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Head}>
                    <View style={styles.cont}>
                        <TouchableOpacity style={styles.images} onPress={this.Return.bind(this)}>
                            <Image source={require("../images/left.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <View style={styles.HeadList}>
                            <Text style={styles.HeadText}>{this.state.invoice}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.Search}>
                    <TextInput
                        autofocus="{true}"
                        returnKeyType="search"
                        placeholder="搜索机构信息"
                        placeholderTextColor="#bcbdc1"
                        underlineColorAndroid='transparent'
                        style={styles.searchContect}
                        onChangeText={(value)=>{
                            this.setState({
                                search:value
                            })
                            this.Search(value)
                        }}
                    />
                </View>
                <View>
                    <View style={styles.head}>
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>编码</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.nameText}>机构名称</Text>
                        </View>
                    </View>
                    <ListView
                        style={styles.scrollview}
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={true}
                        renderRow={this._renderRow.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#323642',
    },
    Head:{
        height:50,
        backgroundColor:"#474955",
        paddingTop:10,
    },
    cont:{
        flexDirection:"row",
        marginLeft:25,
    },
    images:{
        width:60,
    },
    HeadList:{
        flex:6,
        marginTop:2,
        paddingRight:70,
    },
    HeadText:{
        color:"#bcbdc1",
        fontSize:18,
        textAlign:"center",
    },
    Search:{
        marginLeft:25,
        marginRight:25,
        marginTop:15,
    },
    searchContect:{
        borderRadius:5,
        backgroundColor:"#474955",
        color:"#bcbdc1",
        paddingTop:8,
        paddingBottom:8,
        paddingLeft:25,
        fontSize:16,
        borderTopWidth:1,
        borderTopColor:"#cacccb",
        borderBottomWidth:1,
        borderBottomColor:"#cacccb",
        borderLeftWidth:1,
        borderLeftColor:"#cacccb",
        borderRightWidth:1,
        borderRightColor:"#cacccb",
    },
    head:{
        height:45,
        flexDirection:"row",
        marginLeft:25,
        marginRight:25,
        marginTop:15,
        borderBottomWidth:1,
        borderBottomColor:"#474955",
    },
    coding:{
        flex:1,
        paddingLeft:12
    },
    codingText:{
        color:"#bcbdc1",
        fontSize:17,
    },
    name:{
        flex:1,
    },
    nameText:{
        color:"#bcbdc1",
        fontSize:17,
    },
    header:{
        height:35,
        flexDirection:"row",
        marginLeft:25,
        marginRight:25,
        marginTop:15,
        borderBottomWidth:1,
        borderBottomColor:"#474955",
    },
    coding:{
        flex:1,
        paddingLeft:12
    },
    codingText1:{
        color:"#bcbdc1",
        fontSize:16,
    },
    name:{
        flex:1,
    },
    nameText1:{
        color:"#bcbdc1",
        fontSize:16,
    },
    scrollview:{
        marginBottom:200,
    }
});
