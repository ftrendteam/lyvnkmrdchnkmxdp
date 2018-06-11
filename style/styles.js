/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
} from 'react-native';

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    header: {
        height: 60,
        backgroundColor: "#ff4e4e",
        paddingTop: 10,
    },
    cont: {
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 16,
    },
    HeaderImage1: {
        marginRight: 25,
        marginTop: 5
    },
    HeaderList: {
        flex: 6,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 22,
        marginTop: 3,
    },
    Rolling: {
        flex:15,
        backgroundColor:"#ffffff",
        paddingTop:10,
    },
    footer: {
        height: 80,
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#f2f2f2"
    },
    source: {
        flexDirection: "row",
        flex: 1,
    },
    Home: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
        backgroundColor: "#ffffff",
    },
    home1: {
        color: '#999999',
        fontSize: 16,
        marginTop: 5,
        flex: 1,
    },
    home2: {
        color: '#ff4e4e',
        fontSize: 16,
        marginTop: 5,
        flex: 1,
    },
    ShopCar: {
        width: 25,
        height: 25,
        backgroundColor: "#ffba00",
        color: "#ffffff",
        textAlign: "center",
        borderRadius: 50,
        position: "absolute",
        top: 10,
        right: -42,
    },
    Add: {
        position: "absolute",
        right: -50,
        top: 5,
        color: "#ff4e4e",
        fontWeight: "bold"
    },
    LoadCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#000000",
        opacity: 0.8,
        borderRadius: 5,
    },
    TextLoading: {
        fontSize: 17,
        color: "#ffffff"
    },
    activity: {
        marginBottom: 5,
    },
    SHDan:{
        flexDirection: "row",
    },
    SHLeft:{
        flex:2,
    },
    ShenHe: {
        flex:1,
        height:30,
        paddingTop:6,
        paddingBottom:6,
        borderRadius:5,
        backgroundColor:"#ffba00"
    },
    ShenHe_text:{
        textAlign:"center",
        color:"#ffffff",
        fontSize:16,
    },
    row:{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2"
    },
    OnclickList:{
        flex:1,
        paddingTop:10,
        paddingBottom:15,
        borderRightWidth: 1,
        borderRightColor: "#f2f2f2",
    },
    ModalHeadImage1: {
        textAlign: "center",
        marginTop: 10,
    },
    LisText: {
        textAlign: "center",
        fontSize: 18,
        color: "#666666",
        marginTop: 5,
    },
});
module.exports = styles;