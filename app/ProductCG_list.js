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
    TouchableOpacity,
    InteractionManager,
} from 'react-native';
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';

let dbAdapter = new DBAdapter();
let db;

export default class ProductCG_list extends Component {
    constructor(props){
        super(props);
        this.state = {
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

    Return(){
        this.props.navigator.pop();
    }

    fetch(){
        dbAdapter.selectAllData("tsuppset").then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                this.dataRows.push(row);
            }
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
            })
        })
    }

    _renderRow(rowData, sectionID, rowID){

        <View style={styles.header}>
            <View style={styles.coding}>
                <Text style={styles.codingText1}>{rowData.sCode}</Text>
            </View>
            <View style={styles.name}>
                <Text style={styles.nameText1}>{rowData.sname}</Text>
            </View>
        </View>

    }
    render() {
        console.log("ytt=",this.state.dataSource.length);

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
                        secureTextEntry={true}
                        numberoflines="{1}"
                        placeholder="请输入供应商编码"
                        textalign="center"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#bcbdc1"
                        style={styles.searchContect}
                        onChangeText={(value)=>{
                            this.setState({
                                search:value
                            })
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
        color: "#ffffff",
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
        textAlign:"center"
    },
    header:{
        height:35,
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
        textAlign:"center"
    },
});
