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

let dbAdapter = new DBAdapter();
let db;

export default class ProductXP_list extends Component {
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
        dbAdapter.selectAllData("tshopitem").then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                this.dataRows.push(row);
            }

            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
            })
        })
    }

    Return(){
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
        var Data=rowData.shopname+rowData.shopcode;
        if(this.props.reloadShopname){
            this.props.reloadShopname(Data)
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
                        placeholder="搜索相关单号"
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
                            <Text style={styles.codingText}>机构号</Text>
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
        paddingRight:70,
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
