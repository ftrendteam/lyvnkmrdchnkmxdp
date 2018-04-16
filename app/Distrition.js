/**
 * 配送收货第二分页
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
import Index from "./Index";
import Search from "./Search";
import Distrition_list from "./Distrition_list";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';

export default class Distrition extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            invoice:"",
            sCode1:"",
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

    //返回前一页面
    Return(){
        var nextRoute={
            name:"Index",
            component:Index
        };
        this.props.navigator.push(nextRoute)
    }

    _reloadView(sCode) {
        sCode = String(sCode);
        this.setState({
            sCode1:sCode,
        });
    }

    //判断当前输入是否为正确的单号 并保存
    // pressPush(){
    //     var date = new Date();
    //     var data=JSON.stringify(date.getTime());
    //     var str=this.state.sCode1;
    //     var nextRoute={
    //         name:"主页",
    //         component:Search
    //     };
    //     this.props.navigator.push(nextRoute);
    //     Storage.delete('YuanDan');
    //     Storage.save('OrgFormno',str);
    //     Storage.save('Date',data);
    //     Storage.save('Name','配送收货单');
    //     Storage.save('FormType','PSSHYW');
    //     Storage.save('valueOf','App_Client_ProPSSH');
    //     Storage.save('history','App_Client_ProPSSHQ');
    //     Storage.save('historyClass','App_Client_ProPSSHDetailQ');
    //     Storage.save('ProYH','ProPSSH');
    // }

    Home(){
        if(this.state.Disting=="0") {
            var date = new Date();
            var data=JSON.stringify(date.getTime());
            this.setState({
                active:data,
            });
            var str=this.state.sCode1;
            var nextRoute={
                name:"主页",
                component:Index
            };
            this.props.navigator.push(nextRoute);
            Storage.delete('OrgFormno');
            Storage.delete('scode');
            Storage.delete('shildshop');
            Storage.delete('StateMent');
            Storage.delete('BQNumber');
            Storage.delete('YdCountm');
            Storage.delete('Modify');
            Storage.save('YdCountm', '2');
            Storage.save('YuanDan','1');
            Storage.save('OrgFormno',str);
            Storage.save("scode",str);
            Storage.save('Date',this.state.active);
            Storage.save('Name','配送收货');
            Storage.save('FormType','PSSHYW');
            Storage.save('valueOf','App_Client_ProPSSH');
            Storage.save('history','App_Client_ProPSSHQ');
            Storage.save('historyClass','App_Client_ProPSSHDetailQ');
            Storage.save('ProYH','ProPSSH');
            Storage.save('Screen','1');
            Storage.save('Document', "配送收货");
        }else if(this.state.Disting=="1"){
            var date = new Date();
            var data=JSON.stringify(date.getTime());
            this.setState({
                active:data,
            });
            var str=this.state.sCode1;
            var nextRoute={
                name:"Search",
                component:Search
            };
            this.props.navigator.push(nextRoute);
            Storage.delete('OrgFormno');
            Storage.delete('scode');
            Storage.delete('shildshop');
            Storage.delete('StateMent');
            Storage.delete('BQNumber');
            Storage.delete('YdCountm');
            Storage.delete('Modify');
            Storage.save('YdCountm', '2');
            Storage.save('YuanDan','1');
            Storage.save('OrgFormno',str);
            Storage.save("scode",str);
            Storage.save('Date',this.state.active);
            Storage.save('Name','配送收货');
            Storage.save('FormType','PSSHYW');
            Storage.save('valueOf','App_Client_ProPSSH');
            Storage.save('history','App_Client_ProPSSHQ');
            Storage.save('historyClass','App_Client_ProPSSHDetailQ');
            Storage.save('ProYH','ProPSSH');
            Storage.save('Screen','1');
            Storage.save('Document', "配送收货");
        }
    }



    Search(){
        Storage.save('shopPandian','App_Client_NOYSPSQ');
        var nextRoute={
            name:"Distrition_list",
            component:Distrition_list,
            params: {
                reloadView:(sCode)=>this._reloadView(sCode)
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
                        <Text style={styles.listLeftText}>单号:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.Search.bind(this)}>
                        <TextInput
                            style={styles.TextInput1}
                            autofocus={true}
                            editable={false}
                            defaultValue ={this.state.sCode1}
                            numberoflines={1}
                            placeholder="请选择单号"
                            textalign="center"
                            underlineColorAndroid='transparent'
                            placeholderTextColor="#cccccc"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listimages} onPress={this.Search.bind(this)}>
                        <Image source={require("../images/2_03.png")} style={styles.Image}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.search}>
                    <TouchableOpacity style={styles.determine} onPress={this.Home.bind(this)}>
                        <Text style={styles.determine1}>确定</Text>
                    </TouchableOpacity>
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
        width:60,
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
        marginBottom:5,
        fontSize:16,
        color:"#333333"
    },
    search:{
        flexDirection:"row",
        marginTop:30,
        paddingLeft:25,
    },
    textsearch:{
        marginLeft:30,
        marginRight:20,
        backgroundColor:"#f47882",
        borderRadius:15,
        flex:5,
        paddingTop:10,
        paddingBottom:10,
    },
    textsearch1:{
        textAlign:"center",
        fontSize:16,
        color:"#ffffff",
    },
    determine:{
        flex:1,
        backgroundColor:"#ff4e4e",
        borderRadius:3,
        paddingTop:13,
        paddingBottom:13,
        marginRight:25,
    },
    determine1:{
        textAlign:"center",
        fontSize:16,
        color:"#ffffff",
    },
    images:{
        height:50,
        paddingLeft:30,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb",
        justifyContent: 'center',
    },
    Search:{
        width:60,
        paddingTop:8,
        paddingLeft:15,
        backgroundColor:"#f5f5f5",
    }
});


