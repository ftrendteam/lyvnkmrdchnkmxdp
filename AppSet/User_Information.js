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
    Modal,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Set from "./Set";
import Storage from '../utils/Storage';
export default class User_Information extends Component {
    constructor(props){
        super(props);
        this.state = {
            usercode:"",
            poscode:"",
            ShopCode:"",
            invoice:this.props.invoice ? this.props.invoice : "",
        };
    }

    componentDidMount(){
        Storage.get('username').then((username) => {
            Storage.get('str2').then((ShopCode) => {
                Storage.get('PosCode').then((poscode) => {
                    this.setState({
                        usercode: username,
                        poscode:poscode,
                        ShopCode:ShopCode,
                    });
                })
            })
        })
    }

    Return(){
        this.props.navigator.pop();
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.Return.bind(this)}>
                        <Image source={require("../images/2_01.png")}></Image>
                    </TouchableOpacity>
                    <Text style={styles.HeaderList}>{this.state.invoice}</Text>
                </View>
                <View style={styles.Cont}>
                    <View style={styles.List}>
                        <Text style={styles.ListLeft}>当前登录用户：</Text>
                        <Text style={styles.ListRight}>{this.state.usercode}</Text>
                    </View>
                    <View style={styles.List}>
                        <Text style={styles.ListLeft}>当前登录机构：</Text>
                        <Text style={styles.ListRight}>{this.state.ShopCode}</Text>
                    </View>
                    <View style={styles.List}>
                        <Text style={styles.ListLeft}>当前POS号：</Text>
                        <Text style={styles.ListRight}>{this.state.poscode}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    header: {
        height: 60,
        backgroundColor: "#ff4e4e",
        paddingTop: 10,
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 16,
    },
    HeaderList: {
        flex: 6,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 22,
    },
    Cont: {
        height:200,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#ffffff",
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 5,
        marginTop:10,
        paddingTop:20,
    },
    List: {
        flexDirection: "row",
        paddingBottom:20,
    },
    ListLeft: {
        width:120,
        fontSize: 16,
        color: "#444444",
        textAlign:"left"
    },
    ListRight: {
        flex:1,
        fontSize: 16,
        color: "#444444",
        textAlign:"left"
    },
});