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
    TextInput,
    TouchableOpacity,
    Image
} from 'react-native';
import Index from "./Index";
import Home from "./Home";
import Search from "./Search";
import ProductCG_list from "./ProductCG_list";
import ProductXP_list from "./ProductXP_list";
import NetUtils from "../utils/NetUtils";
import DataUtils from '../utils/DataUtils';
import Storage from '../utils/Storage';
import ModalDropdown from 'native';
export default class ProductCG extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            sCode1:"",
            shopname1:""
        };
    }

    componentDidMount(){
        Storage.get('invoice').then((tags)=>{
            this.setState({
                invoice:tags
            })
        })
    }

    Return(){
        this.props.navigator.pop();
    }

    onclick(){
        var nextRoute={
            name:"ProductCG_list",
            component:ProductCG_list,
            params: {
                reloadView:(sCode)=>this._reloadView(sCode)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadView(sCode) {
        sCode = String(sCode);
        this.setState({
            sCode1:sCode,
        });
    }

    Monclick(){
        var nextRoute={
            name:"ProductXP_list",
            component:ProductXP_list,
            params: {
                reloadShopname:(shopname)=>this._reloadShopname(shopname)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadShopname(shopname) {
        shopname = String(shopname);
        this.setState({
            shopname1:shopname,
        });
    }

    Button(){
        if(this.state.sCode1==""){
            alert("请选择供应商编码")
        }else if(this.state.shopname1==""){
            alert("请选择机构编码")
        }else{
            var nextRoute={
                name:"Index",
                component:Index,
            };
            this.props.navigator.push(nextRoute);
            Storage.save('OrgFormno',this.state.Number);
            Storage.save('Name','协配采购');
            Storage.save('valueOf','App_Client_ProXPCG');
            Storage.save('history','App_Client_ProXPCGQ');
            Storage.save('historyClass','App_Client_ProXPDetailCGQ');
            Storage.save("scode",this.state.sCode1)
            Storage.save('shildshop',this.state.shopname1)
        }
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
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>供应商编码:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.onclick.bind(this)}>
                        <Text style={styles.listContText}>{this.state.sCode1}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.onclick.bind(this)}>
                        <Image source={require("../images/right.png")} style={styles.Image}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>机构编码:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.Monclick.bind(this)}>
                        <Text style={styles.listContText}>{this.state.shopname1}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.Monclick.bind(this)}>
                        <Image source={require("../images/right.png")} style={styles.Image}></Image>
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
        backgroundColor: '#ffffff',
    },
    Head:{
        height:50,
        backgroundColor:"#f47882",
        paddingTop:10,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb",
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
    ContList:{
        height:50,
        marginTop:20,
        marginLeft:25,
        marginRight:15,
        paddingTop:10,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#eeeeee",
    },
    listleft:{
        width:100,
    },
    listLeftText:{
        color:"#323232",
        fontSize:17,
    },
    listcont:{
        flex:7,
        paddingLeft:5,
        paddingRight:5,
    },
    listContText:{
        color:"#323232",
        fontSize:17,
    },
    listimages:{
        flex:1,
    },
    Image:{
    },
    button:{
        marginLeft:80,
        marginRight:80,
        paddingTop:8,
        paddingBottom:8,
        backgroundColor:"#f47882",
        borderRadius:3,
        marginTop:100,
    },
    buttonText:{
        color:"#ffffff",
        fontSize:18,
        textAlign:"center"
    }
});



