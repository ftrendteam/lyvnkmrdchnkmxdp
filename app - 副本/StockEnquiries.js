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
    InteractionManager
} from 'react-native';
import Index from "./Index";
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';

let dbAdapter = new DBAdapter();
let db;
export default class StockEnquiries extends Component {
    constructor(props){
        super(props);
        this.state = {
            search:"",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            dbAdapter.selectAllData("tsuppset").then((rows)=>{
                for(let i =0;i<rows.length;i++){
                    var row = rows.item(i);
                    this.dataRows.push(row);
                }

                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                })
            })
        });
    }

    Return(){
        var nextRoute={
            name:"Index",
            component:Index
        };
        this.props.navigator.push(nextRoute)
    }

    SearchButton(){
        for (let i = 0; i < this.dataRows.length; i++) {
            // let temp = this.dataRows[0];
            let dataRow = this.dataRows[i];
            if (((dataRow.sCode + "").indexOf(this.state.search) >= 0)) {
                // this.dataRows[0] = dataRow;
                // this.dataRows[i] = temp;
                var str = this.dataRows.splice(i,1);
                this.dataRows.unshift(str[0]);
                break;
            }
        }
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
        })
    }


    _renderRow(rowData, sectionID, rowID){
        return(
            <TouchableOpacity style={styles.DataList}>
                <View style={styles.coding}>
                    <Text style={styles.codingText}>{rowData.sCode}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.codingText}>{rowData.sname}</Text>
                </View>
            </TouchableOpacity>
        )

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>库存查询</Text>
                    </View>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.Title}>
                        <TextInput
                            autofocus="{true}"
                            returnKeyType="search"
                            placeholder="搜索相关单号"
                            placeholderColor="#323232"
                            underlineColorAndroid='transparent'
                            style={styles.Search}
                            onChangeText={(value)=>{
                                this.setState({
                                    search:value
                                })
                            }}
                        />
                        <Image source={require("../images/2.png")} style={styles.SearchImage} />
                        <View style={styles.Right}>
                            <TouchableOpacity style={styles.Text1}><Text style={styles.Text} onPress={this.SearchButton.bind(this)}>搜索</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.head}>
                        <View style={styles.coding}>
                            <Text style={styles.codingText}>编码</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>名称</Text>
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
        paddingRight:5,
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
        width:70,
        flexDirection:"row",
        paddingTop:3,
        paddingLeft:8
    },
    Text:{
        fontSize:18,
        color:"#ff4e4e",
        paddingTop:5,
        paddingLeft:10,
    },
    head:{
        flexDirection:"row",
        paddingTop:13,
        paddingBottom:13,
        paddingLeft:25,
        paddingRight:25,
        backgroundColor:"#f2f2f2"
    },
    coding:{
        flex:1,
        paddingLeft:12,
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
    coding:{
        flex:1,
        paddingLeft:12
    },
    codingText1:{
        color:"#333333",
        fontSize:16,
    },
    DataList:{
        flexDirection:"row",
        paddingLeft:25,
        paddingRight:25,
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
    name:{
        flex:1,
    },
    nameText1:{
        color:"#333333",
        fontSize:16,
    },
    scrollview:{
        marginBottom:180,
    }
});