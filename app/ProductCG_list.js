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
import DataUtils from '../utils/DataUtils';

let dbAdapter = new DBAdapter();
let db;

export default class ProductCG_list extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            rowlength:"",
            searchText:"",
            show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        };
        this.dataRows = [];
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.fetch();
        });
    }

    fetch(){
        dbAdapter.selectAllData("tsuppset").then((rows)=>{
            var length = rows.length;
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                var abc = JSON.stringify(rows.item.sCode);
                this.dataRows.push(row);
                alert(abc)
            }

            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                rowlength:length,
                searchText:abc
            })
        })
    }

    Return(){
        this.props.navigator.pop();
    }

    Search(value){

        // var rowsLength = this.state.rowlength;//表格总共有多少行
        // var key = this.state.search;//获取输入框的值
        // var text = this.state.searchText;
        // setTimeout(function(){
        //     var searchCol = 0;
        //     for(var i=1;i<rowsLength;i++){
        //         if(text.match(key)){//match函数进行筛选
        //             //显示行操作，
        //         }else{
        //             //隐藏行操作
        //         }
        //     }
        // },200);
    }

    pressPop(rowData){
        if(this.props.reloadView){
            this.props.reloadView(rowData.sCode)
        }
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <TouchableOpacity style={styles.header} onPress={()=>this.pressPop(rowData)}>
                <View style={styles.coding}>
                    <Text style={styles.codingText1}>{rowData.sCode}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.nameText1}>{rowData.sname}</Text>
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
                            <Text style={styles.HeadText}>商品采购</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.Search}>
                    <TextInput
                        autofocus="{true}"
                        returnKeyType="search"
                        placeholder="请输入供应商编码"
                        placeholderColor="#323232"
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
                            <Text style={styles.nameText}>名称</Text>
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
        backgroundColor: '#ffffff',
    },
    Head:{
        height:50,
        backgroundColor:"#f47882",
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
    },
    HeadText:{
        color:"#ffffff",
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
        backgroundColor:"#f5f5f5",
        color: "#323232",
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
        borderBottomColor:"#cacccb",
    },
    coding:{
        flex:1,
        paddingLeft:12
    },
    codingText:{
        color:"#323232",
        fontSize:17,
    },
    name:{
        flex:1,
    },
    nameText:{
        color:"#323232",
        fontSize:17,
    },
    header:{
        height:35,
        flexDirection:"row",
        marginLeft:25,
        marginRight:25,
        marginTop:15,
        borderBottomWidth:1,
        borderBottomColor:"#f5f5f5",
    },
    coding:{
        flex:1,
        paddingLeft:12
    },
    codingText1:{
        color:"#323232",
        fontSize:16,
    },
    name:{
        flex:1,
    },
    nameText1:{
        color:"#323232",
        fontSize:16,
    },
    scrollview:{
        marginBottom:200,
    }
});
