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
import Distrition_list from "./Distrition_list";
import ProductCG_list from "./ProductCG_list";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';
import ModalDropdown from 'native';
export default class ProductCG extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            sCode1:"",
            suppcode1:"",
            active:"",
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

    SearchShopname(Suppcode) {
        Suppcode = String(Suppcode);
        this.setState({
            suppcode1:Suppcode,
        });

    }

    Button(){
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        var str=this.state.sCode1;
        var str1=this.state.suppcode1;
        if(this.state.sCode1==""){
            alert("请选择供应商")
        }else if(this.state.suppcode1==""){
            alert("请选择采购单")
        }else{
            var nextRoute={
                name:"Index",
                component:Index,
            };
            this.props.navigator.push(nextRoute);
            Storage.save('OrgFormno',str1);
            Storage.save('Name','商品验收单');
            Storage.save('valueOf','App_Client_ProYS');
            Storage.save('histoasry','App_Client_ProYSQ');
            Storage.save('historyClass','App_Client_ProYSDetailQ');
            Storage.save('ProYH','ProYS');
            Storage.save('Date',data);
            Storage.save("scode",str)
        }
    }

    Search(){
        Storage.save('shopPandian','App_Client_NOYSCGQ');
        var nextRoute={
            name:"Distrition_list",
            component:Distrition_list,
            params: {
                SearchShopname:(Suppcode)=>this.SearchShopname(Suppcode)
            }
        };
        this.props.navigator.push(nextRoute)
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
                        <Text style={styles.listLeftText}>供应商:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.onclick.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.sCode1}
                            numberoflines={1}
                            placeholder="请选择供应商"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.onclick.bind(this)}>
                        <Image source={require("../images/right.png")} style={styles.Image}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.ContList}>
                    <View style={styles.listleft}>
                        <Text style={styles.listLeftText}>采购单:</Text>
                    </View>
                    <TouchableOpacity onPress={this.Search.bind(this)} style={styles.listcont}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.suppcode1}
                            numberoflines={1}
                            placeholder="请选择采购单"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.Search.bind(this)}>
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
        marginTop:15,
        marginLeft:25,
        marginRight:15,
        paddingTop:13,
        paddingBottom:5,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#eeeeee",
    },
    listleft:{
        width:70,
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
    TextInput:{
        flex:7,
    },
    TextInput1:{
        paddingLeft:5,
        paddingRight:5,
        paddingTop:5,
        paddingBottom:5,
        fontSize:16,
        color:"#323232"
    },
    button:{
        marginLeft:60,
        marginRight:60,
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



