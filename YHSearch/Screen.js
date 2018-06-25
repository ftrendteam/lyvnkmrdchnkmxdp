/**
 * 要货查询 YHSearch文件夹下
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import PinLeiData from "../YHDan/PinLeiData";
import JiGou from "../PSDan/JiGou";
import YHSearch from "./YHSearch";
export default class myproject extends Component {
    constructor(props){
        super(props);
        this.state = {
            JiGou:'',
            DepName1:"",
            DepCode1:"",
            invoice:this.props.invoice ? this.props.invoice : "",
            OrgFormno:this.props.OrgFormno ? this.props.OrgFormno : "",
        };
    }

    componentDidMount(){

    }

    Return(){
        this.props.navigator.pop();
    }

    /**
     * 机构
     * @constructor
     */
    JiGouOnclick(){
        var nextRoute={
            name:"JiGou",
            component:JiGou,
            params: {
                reloadShopname:(JiGou)=>this._reloadShopname(JiGou)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadShopname(JiGou) {
        JiGou = String(JiGou);
        this.setState({
            JiGou:JiGou,
        });
    }
    /**
     * 品类
     * @constructor
     */
    ShoppData(){
        var nextRoute = {
            name: "ProductCG_list",
            component: PinLeiData,
            params: {
                DepName: (DepName) => this._DepName(DepName),
                DepCode: (DepCode) => this._DepCode(DepCode),
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _DepName(DepName) {
        DepName = String(DepName);
        this.setState({
            DepName1:DepName,
        });
    }
    _DepCode(DepCode) {
        DepCode = String(DepCode);
        this.setState({
            DepCode1:DepCode,
        });
    }

    /**
     * 确定按钮（返回要货查询展示界面）
     * @constructor
     */
    Button(){
        var nextRoute = {
            name: "YHSearch",
            component: YHSearch,
            params: {
                JiGou:this.state.JiGou,
                DepCode:this.state.DepCode1,
            }
        };
        this.props.navigator.push(nextRoute)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>{this.state.invoice}</Text>

                    </View>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>机构:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.JiGouOnclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.JiGou}
                            numberoflines={1}
                            placeholder="请选择机构"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.JiGouOnclick.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>商品品类:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.ShoppData.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.DepName1}
                            numberoflines={1}
                            placeholder="请选择商品品类"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.ShoppData.bind(this)}>
                        <Image source={require("../images/2_03.png")}></Image>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={this.Button.bind(this)}>
                    <Text style={styles.buttonText}>确定</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
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
    ContList:{
        height:58,
        paddingLeft:25,
        paddingRight:15,
        paddingTop:12,
        backgroundColor:"#ffffff",
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
    listleft:{
        width:70,
        marginTop:6,
    },
    listLeftText:{
        color:"#333333",
        fontSize:16,
        textAlign:"right"
    },
    listcont:{
        flex:7,
        paddingLeft:5,
        paddingRight:5,
    },
    listContText:{
        color:"#333333",
        fontSize:16,
    },
    TextInput1:{
        paddingLeft:5,
        paddingRight:5,
        paddingTop:5,
        marginBottom:5,
        fontSize:16,
        color:"#333333"
    },
    button:{
        marginLeft:25,
        marginRight:25,
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ff4e4e",
        borderRadius:3,
        marginTop:30,
    },
    buttonText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"center"
    }
});