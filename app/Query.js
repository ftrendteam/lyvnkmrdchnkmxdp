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
    TouchableOpacity
} from 'react-native';
import Home from "./Home";
import Search from "./Search";
export default class Query extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
        };
    }
    pressPush(){
        var nextRoute={
            name:"主页",
            component:Search
        };
        this.props.navigator.push(nextRoute)
    }
    Home(){
        var nextRoute={
            name:"主页",
            component:Home
        };
        this.props.navigator.push(nextRoute)
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.TextInput}>
                    <TextInput
                        autofocus="{true}"
                        numberoflines="{1}"
                        keyboardType="numeric"
                        placeholder="请输入手机全号或后四位"
                        textalign="center"
                        underlineColorAndroid='transparent'
                        placeholderTextColor="#cccccc"
                        style={styles.admin}/>
                </View>
                <View style={styles.search}>
                    <TouchableOpacity style={styles.textsearch} onPress={this.pressPush.bind(this)}>
                        <Text style={styles.textsearch1}>查询/扫描</Text>
                    </TouchableOpacity>
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
    admin:{
        borderRadius:3,
        backgroundColor:"#f5f5f5",
        color: "#333333",
        paddingTop:8,
        paddingBottom:8,
        paddingLeft:12,
        fontSize:16,
        marginLeft:50,
        marginRight:50,
        marginTop:50,
    },
    search:{
        flexDirection:"row",
    },
    textsearch:{
        marginLeft:50,
        marginTop:20,
        backgroundColor:"#f47882",
        borderRadius:15,
        flex:5,
        height:45,
    },
    textsearch1:{
        textAlign:"center",
        fontSize:14,
        color:"#ffffff",
        lineHeight:28
    },
    determine:{
        flex:1,
        marginTop:20,
        marginLeft:50,
        marginRight:50,
        backgroundColor:"#f47882",
        borderRadius:3,
        height:44,
    },
    determine1:{
        textAlign:"center",
        fontSize:14,
        color:"#ffffff",
        lineHeight:27
    }
});


