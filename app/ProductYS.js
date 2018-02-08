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

        Storage.get('Disting').then((tags)=>{
            this.setState({
                Disting:tags
            })
        })
    }

    Return(){
        var nextRoute={
            name:"Index",
            component:Index
        };
        this.props.navigator.push(nextRoute)
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

    SearchShopname1(Suppcode1) {
        Suppcode1 = String(Suppcode1);
        this.setState({
            sCode1:Suppcode1,
        });
    }

    Button(){
        if(this.state.Disting=="0") {
            var date = new Date();
            var data=JSON.stringify(date.getTime());
            var str=this.state.sCode1;
            var str1=this.state.suppcode1;
            if(this.state.sCode1==""){
                alert("请选择供应商")
            }else{
                Storage.delete('YuanDan');
                var nextRoute={
                    name:"Index",
                    component:Index,
                };
                this.props.navigator.push(nextRoute);
                Storage.save('OrgFormno',str1);
                Storage.save('Name','商品验收单');
                Storage.save('FormType','YSYW');
                Storage.save('valueOf','App_Client_ProYS');
                Storage.save('history','App_Client_ProYSQ');
                Storage.save('historyClass','App_Client_ProYSDetailQ');
                Storage.save('ProYH','ProYS');
                Storage.save('YuanDan','1');
                Storage.save('Screen','1');
                Storage.save('Date',data);
                Storage.save("scode",str);
                Storage.save('Document', "商品验收");
            }
        }else if(this.state.Disting=="1"){
            var date = new Date();
            var data=JSON.stringify(date.getTime());
            var str=this.state.sCode1;
            var str1=this.state.suppcode1;
            if(this.state.sCode1==""){
                alert("请选择供应商")
            }else{
                var date = new Date();
                var data=JSON.stringify(date.getTime());
                var nextRoute={
                    name:"Search",
                    component:Search,
                };
                this.props.navigator.push(nextRoute);
                Storage.save('OrgFormno',str1);
                Storage.save('Name','商品验收单');
                Storage.save('FormType','YSYW');
                Storage.save('valueOf','App_Client_ProYS');
                Storage.save('history','App_Client_ProYSQ');
                Storage.save('historyClass','App_Client_ProYSDetailQ');
                Storage.save('ProYH','ProCG');
                Storage.save('YuanDan','1');
                Storage.save('Screen','1');
                Storage.save('Date',data);
                Storage.save("scode",str);
                Storage.save('Document', "商品验收");
            }
        }
    }

    Search(){
        Storage.save('shopPandian','App_Client_NOYSCGQ');
        var nextRoute={
            name:"Distrition_list",
            component:Distrition_list,
            params: {
                SearchShopname:(Suppcode)=>this.SearchShopname(Suppcode),
                SearchShopname1:(Suppcode1)=>this.SearchShopname1(Suppcode1)
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
                        <Image source={require("../images/2_03.png")} style={styles.Image}></Image>
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
                        <Image source={require("../images/2_03.png")} style={styles.Image}></Image>
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
        marginTop:4,
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
        width:200,
        paddingLeft:5,
        paddingRight:5,
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



