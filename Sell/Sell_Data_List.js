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
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import FetchUtil from "../utils/FetchUtils";
let dbAdapter = new DBAdapter();
let db;

export default class Sell_Data_List extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            Sell:"",
            ShopCode:"",
            show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            Storage.get('invoice').then((tags)=>{
                this.setState({
                    invoice:tags
                })
            });

            Storage.get('Sell').then((tags)=>{
                this.setState({
                    Sell:tags
                })
            })

            Storage.get('ShopCode').then((tags)=>{
                this.setState({
                    ShopCode:tags
                })
            });
            this.fetch();
        })
    }

    fetch(){
        this._setModalVisible();
        let params = {
            TblName:"DownPosShop",
        };
        Storage.get('LinkUrl').then((tags) => {
            FetchUtil.post(tags,JSON.stringify(params)).then((data)=>{
                var TblRow = data.TblRow;
                var TblRow1 = data.TblRow1;
                if(this.state.Sell=="ShopCode"){
                    this.dataRows = this.dataRows.concat(TblRow);
                }else if(this.state.Sell=="PosCode"){
                    for(let i =0;i<TblRow1.length;i++){
                        var row = TblRow1[i];
                        var ShopCode = row.ShopCode;
                        if(this.state.ShopCode==ShopCode){
                            var PosCode = TblRow1[i];
                            this.dataRows = this.dataRows.concat(PosCode);
                        }
                    }
                }
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                });
                this._setModalVisible();
            },(err)=>{
                alert("网络请求失败");
            })
        })
    }

    Return(){
        this.props.navigator.pop();
    }

    Search(value){
        for (let i = 0; i < this.dataRows.length; i++) {
            // let temp = this.dataRows[0];
            let dataRow = this.dataRows[i];
            if (((dataRow.ShopCode + "").indexOf(value) >= 0)) {
                var str = this.dataRows.splice(i,1);
                this.dataRows.unshift(str[0]);
                break;
            }
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
        })
    }

    pressPop(rowData){
        if(this.props.reloadView){
            this.props.reloadView(rowData.ShopCode)
        }else if(this.props.PosCodeView){
            this.props.PosCodeView(rowData.PosCode)
        }
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <View>
                {
                    (this.state.Sell=="ShopCode")?
                    <TouchableOpacity style={styles.header} onPress={()=>this.pressPop(rowData)}>
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>{rowData.ShopCode}</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>{rowData.ShopName}</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.header} onPress={()=>this.pressPop(rowData)}>
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>{rowData.PosCode}</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>{rowData.MachName}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        )

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Title}>
                    <TextInput
                        autofocus="{true}"
                        returnKeyType="search"
                        placeholder="搜索相关编号"
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
                    <TouchableOpacity onPress={this.Return.bind(this)} style={styles.Right}>
                        <Text style={styles.Text}>取消</Text>
                    </TouchableOpacity>
                </View>
                <View>

                    <View style={styles.head}>
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>编码</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>名称</Text>
                        </View>
                    </View>

                    {
                        (this.dataRows=="")?
                            <View style={styles.NullData}>
                                <Text style={[{fontSize:18,color:"#999999"}]}>
                                    当前机构号暂无数据
                                </Text>
                            </View>
                            :
                            <ListView
                                style={styles.scrollview}
                                dataSource={this.state.dataSource}
                                showsVerticalScrollIndicator={true}
                                renderRow={this._renderRow.bind(this)}
                            />
                    }
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
    header:{
        flexDirection:"row",
        paddingLeft:25,
        paddingRight:25,
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
    coding:{
        flex:1,
        paddingLeft:12
    },
    codingText1:{
        color:"#333333",
        fontSize:16,
    },
    name:{
        flex:1,
    },
    nameText1:{
        color:"#333333",
        fontSize:16,
    },
    scrollview:{
        marginBottom:120,
    },
    NullData:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:80,
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
