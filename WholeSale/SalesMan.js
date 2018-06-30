/**
 * 要货单商品品类 YHDan文件夹下
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
import styles from "../style/styles";//style样式引用
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";//网络请求封装

let dbAdapter = new DBAdapter();
let db;

export default class SalesMan extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
    }
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.fetch();
        });
    }

    fetch(){
        Storage.get('code').then((tags) => {
            dbAdapter.selectCounterman(tags).then((rows)=>{
                for(let i =0;i<rows.length;i++){
                    var row = rows.item(i);
                    this.dataRows.push(row);
                }
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                })
            })
        })
    }

    Return(){
        this.props.navigator.pop();
    }

    Search(value){

        for (let i = 0; i < this.dataRows.length; i++) {
            let dataRow = this.dataRows[i];
            if (((dataRow.Usercode + "").indexOf(value) >= 0)) {
                var str = this.dataRows.splice(i,1);
                this.dataRows.unshift(str[0]);
                // break;
            }
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
        })

    }

    pressPop(rowData){
        if(this.props.SalesMan){
            this.props.SalesMan(rowData.Usercode);
        }
        this.props.navigator.pop();
    }

    /**
     *
     * 清空数据
     */
    DeleteData(){
        if(this.props.SalesMan){
            this.props.SalesMan("");
        }
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <TouchableOpacity style={styles.headerList} onPress={()=>this.pressPop(rowData)}>
                <View style={styles.coding}>
                    <Text style={styles.codingText}>{rowData.Usercode}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.codingText}>{rowData.UserName}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.TitleSearch}>
                    <TextInput
                        autofocus="{true}"
                        returnKeyType="search"
                        placeholder="搜索相关名称"
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
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>机构号</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>名称</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={this.DeleteData.bind(this)} style={styles.headerList}>
                        <View style={styles.coding}>
                            <Text style={[styles.codingText,{color:"#ff4e4e"}]}>清空</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}></Text>
                        </View>
                    </TouchableOpacity>
                    <ListView
                        keyboardShouldPersistTaps={"handled"}
                        style={styles.scrollview}
                        enableEmptySections = {true}
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={true}
                        renderRow={this._renderRow.bind(this)}
                    />
                </View>
            </View>
        );
    }
}