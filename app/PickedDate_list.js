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
                let dataRow = this.dataRows[i];
                if (((dataRow.shopcode + "").indexOf(value) >= 0)) {
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
            <TouchableOpacity style={styles.DataList} onPress={()=>this.pressPop(rowData)}>
                <View style={styles.coding}>
                    <Text style={styles.codingText}>{rowData.shopcode}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.codingText}>{rowData.shopname}</Text>
                </View>
            </TouchableOpacity>
        )

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Title}>
                    <TextInput
                        style={styles.Search}
                        autofocus="{true}"
                        returnKeyType="search"
                        placeholder="搜索机构编码"
                        placeholderTextColor="#bcbdc1"
                        underlineColorAndroid='transparent'
                        onChangeText={(value)=>{
                            this.setState({
                                search:value
                            })
                            this.Search(value)
                        }}
                    />
                    <Image source={require("../images/2.png")} style={styles.SearchImage} />
                    <View style={styles.Right}>
                        <TouchableOpacity style={styles.Text1}><Text style={styles.Text} onPress={this.Return.bind(this)}>取消</Text></TouchableOpacity>
                    </View>
                </View>
                <View>
                    <View style={styles.head}>
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>编码</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>机构名称</Text>
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
        backgroundColor: '#f2f2f2',
    },
    Title:{
        backgroundColor:"#ff4e4e",
        paddingLeft:16,
        paddingRight:16,
        paddingTop:15,
        paddingBottom:15,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#cacccb"
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
    HeaderImage1:{
        flex:1,
        marginLeft:20,
    },
    Text1:{
        flex:1
    },
    Text:{
        fontSize:16,
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
    coding:{
        flex:1,
        paddingLeft:12
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
    DataList:{
        flexDirection:"row",
        paddingTop:13,
        paddingBottom:13,
        paddingLeft:25,
        paddingRight:25,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
        overflow:"hidden"
    },
    coding:{
        flex:1,
        paddingLeft:12
    },
    name:{
        flex:1,
    },
    scrollview:{
        marginBottom:180
    }
});
