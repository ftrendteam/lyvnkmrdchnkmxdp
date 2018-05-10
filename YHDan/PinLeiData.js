/**
 * 要货单商品品类
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

export default class PinLeiData extends Component {
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
            Storage.get('invoice').then((tags)=>{
                this.setState({
                    invoice:tags
                })
            })
            this.fetch();
        });
    }

    fetch(){
        dbAdapter.selectTDepSet('1').then((rows) => {
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
        if(value==""){
            this.abc=[];
            dbAdapter.selectAllData("tsuppset").then((rows)=>{
                for(let i =0;i<rows.length;i++){
                    var row = rows.item(i);
                    this.abc.push(row);
                }
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.abc),
                })
            })
        }else if(value!==""){
            for (let i = 0; i < this.dataRows.length; i++) {
                let dataRow = this.dataRows[i];
                if (((dataRow.DepName + "").indexOf(value) >= 0)) {
                    var str = this.dataRows.splice(i,1);
                    this.dataRows.unshift(str[0]);
                    // break;
                }
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
            })
        }
    }

    pressPop(rowData){
        if(this.props.DepName||this.props.DepCode){
            this.props.DepName(rowData.DepName);
            this.props.DepCode(rowData.DepCode);
        }
        this.props.navigator.pop();
    }

    /**
     *
     * 清空数据
     */
    DeleteData(){
        if(this.props.DepName||this.props.DepCode){
            this.props.DepName("");
            this.props.DepCode("");
        }
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return(
            <TouchableOpacity style={styles.header} onPress={()=>this.pressPop(rowData)}>
                <View style={styles.coding}>
                    <Text style={styles.codingText}>{rowData.DepName}</Text>
                </View>
                <View style={styles.name}>
                    <Text style={styles.codingText}>{rowData.DepCode}</Text>
                </View>
            </TouchableOpacity>
        )

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Title}>
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
                            <Text style={styles.codingText}>品类名称</Text>
                        </View>
                        <View style={styles.name}>
                            <Text style={styles.codingText}>编码</Text>
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
                    <ListView
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
    }
});
