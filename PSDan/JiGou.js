/**
 * 商品配送 下级列表 PSDan文件夹下
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

let dbAdapter = new DBAdapter();
let db;

export default class JiGou extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true}),
        };
        this.dataRows = [];
    }
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            Storage.get('invoice').then((tags)=>{
                this.setState({
                    invoice:tags
                })
            })
            this.fetch();
        });
    }

    fetch(){
        Storage.get('code').then((tags)=>{
            dbAdapter.selectXPShopCode(tags).then((rows)=>{
                for(let i =0;i<rows.length;i++){
                    var row = rows.item(i);
                    this.dataRows.push(row);
                }
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                    dataRows: this.dataRows,
                })
            })
        })
    }

    Return(){
        this.refs.textInput.blur();
        this.props.navigator.pop();
    }

    Search(value){
        for (let i = 0; i < this.dataRows.length; i++) {
            let temp = this.dataRows[0];
            let dataRow = this.dataRows[i];
            if (((dataRow.shopcode + "").indexOf(value) >= 0)) {
                this.dataRows[0] = dataRow;
                this.dataRows[i] = temp;
                break;
            }
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
        })

    }

    pressPop(rowData){
        this.refs.textInput.blur();
        var Data=rowData.shopcode;
        if(this.props.reloadShopname){
            this.props.reloadShopname(Data)
        }
        this.props.navigator.pop();
    }

    DeleteData(){
        this.refs.textInput.blur();
        if(this.props.reloadShopname){
            this.props.reloadShopname("");
        }
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <TouchableOpacity style={styles.header} onPress={()=>this.pressPop(rowData)}>
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
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>机构号</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>名称</Text>
                        </View>

                    </View>
                    <TouchableOpacity onPress={this.DeleteData.bind(this)} style={styles.header}>
                        <View style={styles.coding}>
                            <Text style={[styles.codingText,{color:"#ff4e4e"}]}>清空</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}></Text>
                        </View>
                    </TouchableOpacity>
                    {
                        (this.state.dataRows == "") ?
                            <View style={styles.Null}>
                                <Text style={styles.NullText}>
                                    没有搜索到相关商品~~~
                                </Text>
                            </View> :
                            <ListView
                                keyboardShouldPersistTaps={"handled"}
                                style={styles.scrollview}
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
    name:{
        flex:1,
    },
    scrollview:{
        marginBottom:180,
    },
    Null: {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 140,
    },
    NullText: {
        color: "#cccccc",
        fontSize: 20,
        textAlign: "center"
    },
});
