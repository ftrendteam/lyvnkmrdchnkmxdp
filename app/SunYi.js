/**
 * 损溢第二分页
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
import PinLei from "../YHDan/PinLei";
import NetUtils from "../utils/NetUtils";
import Storage from '../utils/Storage';

export default class SunYi extends Component {
    constructor(props){
        super(props);
        this.state = {
            invoice:this.props.invoice ? this.props.invoice : "",
            active:"",
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
        var nextRoute={
            name:"Index",
            component:Index
        };
        this.props.navigator.push(nextRoute);
    }

    BaoSun(){
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        this.setState({
            active:data,
        });
        var nextRoute={
            name:"主页",
            component:PinLei,
            params: {
                OrgFormno:"报损",
                invoice:"商品损溢"
            }
        };
        this.props.navigator.push(nextRoute);
    }

    YiChu(){
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        this.setState({
            active:data,
        });
        var nextRoute={
            name:"主页",
            component:PinLei,
            params: {
                OrgFormno:"溢出",
                invoice:"商品损溢",
            }

        };
        this.props.navigator.push(nextRoute);
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
                <View style={styles.SYlist}>
                    <TouchableOpacity style={styles.BSlist} onPress={this.BaoSun.bind(this)}>
                        <Image source={require("../images/1_077.png")} style={styles.BSimage} />
                        <Text style={styles.BStext}>
                            报损
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.BSlist} onPress={this.YiChu.bind(this)}>
                        <Image source={require("../images/1_071.png")} style={styles.BSimage} />
                        <Text style={styles.BStext}>
                            溢出
                        </Text>
                    </TouchableOpacity>
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
    SYlist:{
    },
    BSlist:{
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:90,
        backgroundColor:"#ffffff",
        marginBottom:1,
    },
    BSimage:{
        position:"absolute",
        top:22,
        left:25,
    },
    BStext:{
        color:"#333333",
        fontSize:16,
    }

});