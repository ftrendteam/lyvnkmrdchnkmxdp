/**
 * 商品品类
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
import Index from "../app/Index";
import Search from "../app/Search";
import PinLeiData from "./PinLeiData";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';

export default class PinLei extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Number:"",
            DepName1:"",
            active:"",
            DepCode1:"",
            invoice:this.props.invoice ? this.props.invoice : "",
            OrgFormno:this.props.OrgFormno ? this.props.OrgFormno : "",
        };
    }

    componentDidMount(){
        Storage.get('Disting').then((tags)=>{
            this.setState({
                Disting:tags
            })
        })
    }

    Return(){
        if(this.state.invoice=="商品损溢"){
            this.props.navigator.pop();
        }else{
            var nextRoute={
                name:"Index",
                component:Index
            };
            this.props.navigator.push(nextRoute)
        }
    }
    /**
     * 商品品类获取
     */
    onclick(){
        var nextRoute={
            name:"ProductCG_list",
            component:PinLeiData,
            params: {
                DepName:(DepName)=>this._DepName(DepName),
                DepCode:(DepCode)=>this._DepCode(DepCode),
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

    Button(){
        if(this.state.Disting=="0") {
            var date = new Date();
            var data=JSON.stringify(date.getTime());
            var nextRoute={
                name:"Index",
                component:Index
            };
            this.props.navigator.push(nextRoute);
            if(this.state.invoice=="门店要货"){
                this.delete();
                Storage.save('Name', '门店要货');
                Storage.save('FormType', 'YWYW');
                Storage.save('ProYH', 'ProYH');
                Storage.save('YdCountm', '1');
                Storage.save('Date', data);
                //将内容保存到本地数据库
                Storage.save('FormCheck', 'YHYW');//要货查询审核按钮
                Storage.save('valueOf', 'App_Client_ProYH');
                Storage.save('history', 'App_Client_ProYHQ');
                Storage.save('historyClass', 'App_Client_ProYHDetailQ');
            }else if(this.state.invoice=="实时盘点"){
                this.delete();
                Storage.save('Date', data);
                Storage.save('Name', '实时盘点');
                Storage.save('Document', "实时盘点");
                Storage.save('FormType', 'CUPCYW');
                Storage.save('ProYH', 'ProCurrPC');
                Storage.save('YdCountm', '1');
                Storage.save('Screen', '2');
                Storage.save("scode", "1");
                Storage.save('FormCheck', 'CUPCYW');
                Storage.save('valueOf', 'App_Client_ProCurrPC');
                Storage.save('history', 'App_Client_ProCurrPCQ');
                Storage.save('historyClass', 'App_Client_ProCurrPCDetailQ');
            }else if(this.state.invoice=="商品损溢"){
                this.delete();
                Storage.save('Name','商品损溢');
                Storage.save('FormType','SYYW');
                Storage.save('ProYH','ProSY');
                Storage.save('YdCountm','3');
                if(this.state.OrgFormno=="报损"){
                    Storage.save('OrgFormno',"1");
                }else if(this.state.OrgFormno=="溢出"){
                    Storage.save('OrgFormno',"0");
                }
                Storage.save('Date',this.state.active);
                Storage.save('FormCheck', 'SYYW');
                Storage.save('valueOf', 'App_Client_ProSY');
                Storage.save('history', 'App_Client_ProSYQ');
                Storage.save('historyClass', 'App_Client_ProSYDetailQ');
            }else if(this.state.invoice=="标签采集"){
                this.delete();
                Storage.save('Date', data);
                Storage.save('YdCountm', '5');
                Storage.save('BQNumber', '3');
                Storage.save('Document', "标签采集");
                Storage.save('Name', '标签采集');
                Storage.save('ProYH', 'BJQ');
                Storage.save('valueOf', 'App_Client_BJQ');
            }else if(this.state.invoice=="售价调整"){
                this.delete();
                Storage.save('Name', '售价调整');
                Storage.save('FormType', 'TJYW');
                Storage.save('ProYH', 'ProTJQ');
                Storage.save('Date', data);
                Storage.save('FormCheck', 'TJYW');
                Storage.save('valueOf', 'App_Client_ProTJ');//门店要货提交
                Storage.save('history', 'App_Client_ProTJQ');//门店要货查询
                Storage.save('historyClass', 'App_Client_ProTJDetailQ');//门店要货明细查询
            }
        }else if(this.state.Disting=="1"){
            var date = new Date();
            var data=JSON.stringify(date.getTime());
            var nextRoute={
                name:"Search",
                component:Search
            };
            this.props.navigator.push(nextRoute);
            if(this.state.invoice=="门店要货"){
                this.delete();
                Storage.save('Name', '门店要货');
                Storage.save('FormType', 'YWYW');
                Storage.save('ProYH', 'ProYH');
                Storage.save('YdCountm', '1');
                Storage.save('Date', data);
                //将内容保存到本地数据库
                Storage.save('FormCheck', 'YHYW');//要货查询审核按钮
                Storage.save('valueOf', 'App_Client_ProYH');
                Storage.save('history', 'App_Client_ProYHQ');
                Storage.save('historyClass', 'App_Client_ProYHDetailQ');
            }
            else if(this.state.invoice=="实时盘点"){
                this.delete();
                Storage.save('Date', data);
                Storage.save('Name', '实时盘点');
                Storage.save('Document', "实时盘点");
                Storage.save('FormType', 'CUPCYW');
                Storage.save('ProYH', 'ProCurrPC');
                Storage.save('YdCountm', '1');
                Storage.save('Screen', '2');
                Storage.save("scode", "1");
                Storage.save('FormCheck', 'CUPCYW');
                Storage.save('valueOf', 'App_Client_ProCurrPC');
                Storage.save('history', 'App_Client_ProCurrPCQ');
                Storage.save('historyClass', 'App_Client_ProCurrPCDetailQ');
            }
            else if(this.state.invoice=="商品损溢"){
                this.delete();
                Storage.save('Name','商品损溢');
                Storage.save('FormType','SYYW');
                Storage.save('ProYH','ProSY');
                Storage.save('YdCountm','3');
                if(this.state.OrgFormno=="报损"){
                    Storage.save('OrgFormno',"1");
                }else if(this.state.OrgFormno=="溢出"){
                    Storage.save('OrgFormno',"0");
                }
                Storage.save('Date',this.state.active);
                Storage.save('FormCheck', 'SYYW');
                Storage.save('valueOf', 'App_Client_ProSY');
                Storage.save('history', 'App_Client_ProSYQ');
                Storage.save('historyClass', 'App_Client_ProSYDetailQ');
            }
            else if(this.state.invoice=="标签采集"){
                this.delete();
                Storage.save('Date', data);
                Storage.save('YdCountm', '5');
                Storage.save('BQNumber', '3');
                Storage.save('Document', "标签采集");
                Storage.save('Name', '标签采集');
                Storage.save('ProYH', 'BJQ');
                Storage.save('valueOf', 'App_Client_BJQ');
            }
            else if(this.state.invoice=="售价调整"){
                this.delete();
                Storage.save('Name', '售价调整');
                Storage.save('FormType', 'TJYW');
                Storage.save('ProYH', 'ProTJQ');
                Storage.save('Date', data);
                Storage.save('FormCheck', 'TJYW');
                Storage.save('valueOf', 'App_Client_ProTJ');//门店要货提交
                Storage.save('history', 'App_Client_ProTJQ');//门店要货查询
                Storage.save('historyClass', 'App_Client_ProTJDetailQ');//门店要货明细查询
            }
        }

    }

    delete(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        Storage.delete('YuanDan');
        Storage.delete('Screen');
        Storage.delete('StateMent');
        Storage.delete('BQNumber');
        Storage.delete('YdCountm');
        Storage.delete('Modify');
        Storage.delete("PeiSong");
        Storage.delete('StateMent');
        if(this.state.DepName1==""&&this.state.DepCode1==""){
            Storage.delete('DepCode');
        }else{
            Storage.save('DepCode', this.state.DepCode1);
        }
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
                        <Text style={styles.listLeftText}>商品品类:</Text>
                    </View>
                    <TouchableOpacity style={styles.listcont} onPress={this.onclick.bind(this)}>
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
                    <TouchableOpacity onPress={this.onclick.bind(this)}>
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