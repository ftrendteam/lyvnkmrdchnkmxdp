/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Image, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View,} from 'react-native';

export default class Modifies_Number extends Component {
    constructor(props){
        super(props);
        this.state = {
            name:this.props.name ? this.props.name : "",//接受传入的值
        }
    }

    Remark(){

    }

    ShopPrice(){

    }

    Return(){

    }

    PriceButton(){

    }
    pressPop(){

    }

    onNumber(){

    }

    onEndEditing(){

    }

    onSubmitEditing(){

    }
    render() {
        return (
            <ScrollView style={styles.container}>
                <ScrollView style={styles.ScrollView} scrollEnabled={false}>
                    <View style={styles.header}>
                        <View style={styles.cont}>
                            <TouchableOpacity onPress={this.Return.bind(this)}>
                                <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                            </TouchableOpacity>
                            <Text style={styles.HeaderList}>{this.state.name}</Text>
                        </View>
                    </View>
                    <View style={styles.Cont}>
                        <View style={styles.List}>
                            <Text style={styles.left}>名称</Text>
                            <Text style={styles.right}>{this.state.ProdName}</Text>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.left1}>
                                <Text style={styles.left}>数量</Text>
                                <View style={styles.onPrice}>
                                    <TextInput
                                        style={styles.Number}
                                        returnKeyType='search'
                                        autoFocus={true}
                                        underlineColorAndroid='transparent'
                                        keyboardType="numeric"
                                        placeholderTextColor="#333333"
                                        onChangeText={(value)=>{this.setState({Number:value})}}
                                        onSubmitEditing={this.onNumber.bind(this)}
                                        onEndEditing = {this.onSubmitEditing.bind(this)}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.left2}>
                                <Text style={styles.left}>单价</Text>
                                <View style={styles.onPrice}>
                                    {
                                        (this.state.OnPrice==1)?
                                            <TextInput
                                                autoFocus={true}
                                                returnKeyType='search'
                                                style={styles.Number}
                                                underlineColorAndroid='transparent'
                                                keyboardType="numeric"
                                                value={this.state.ShopPrice.toString()}
                                                placeholderTextColor="#333333"
                                                onChangeText={(value)=>{
                                                    this.setState({
                                                        ShopPrice:value
                                                    })
                                                }}
                                                onSubmitEditing={this.onEndEditing.bind(this)}
                                                onEndEditing = {this.onSubmitEditing.bind(this)}
                                            />
                                            :
                                            <TouchableOpacity onPress={this.PriceButton.bind(this)}>
                                                <Text style={styles.PriceText}>{this.state.ShopPrice}</Text>
                                            </TouchableOpacity>

                                    }
                                </View>
                            </View>
                            <View style={styles.right2}>
                                <Text style={styles.price}>元/件</Text>
                            </View>
                        </View>
                        <View style={[styles.List,{paddingTop:10,}]}>
                            <View style={styles.left2}>
                                <Text style={[styles.left,{marginTop:9,}]}>备注</Text>
                                <TextInput
                                    style={[styles.Number1,{fontSize:14}]}
                                    placeholder="暂无备注"
                                    placeholderTextColor="#999999"
                                    maxLength={50}
                                    value={this.state.Remark.toString()}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(value)=>{this.setState({Remark:value})}}/>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={this.pressPop.bind(this)}>
                            <Text style={styles.ButtonText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ScrollView>
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
    HeaderImage1:{
        marginRight:25,
        marginTop:5
    },
    HeaderList:{
        flex:6,
        textAlign:"center",
        paddingRight:56,
        color:"#ffffff",
        fontSize:22,
        marginTop:3,
    },
    List:{
        height:54,
        paddingTop:15,
        backgroundColor:"#ffffff",
        paddingLeft:25,
        paddingRight:25,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2"
    },
    left:{
        fontSize:16,
        color:"#666666",
        width:75,
        textAlign:"right"
    },
    right:{
        fontSize:16,
        color:"#333333",
        flexDirection:"row",
        marginLeft:15,
        fontWeight:"200"
    },
    Right:{
        fontSize:16,
        color:"#666666",
        flexDirection:"row",
    },
    left1:{
        flexDirection:"row",
        flex:1,
    },
    right1:{
        flexDirection:"row",
        flex:1,
        position:"absolute",
        right:5,
        top:5
    },
    left2:{
        flexDirection:"row",
        flex:6,
    },
    right2:{
        position:"absolute",
        right:25,
        top:12,
        flexDirection:"row",
    },
    Price1:{
        fontSize:16,
        color:"#333333",
        marginLeft:15,
        fontWeight:"200",
    },
    Number:{
        fontSize:16,
        color:"#333333",
        fontWeight:"200",
        paddingLeft:5,
        paddingTop:0,
        marginLeft:5,
        marginBottom:4,
        flex:1,
    },
    PriceText:{
        color:"#333333",
        fontSize:16,
        fontWeight:"200",
        marginLeft:10,
        marginBottom:4,
    },
    onPrice:{
        flex:1
    },
    Number1:{
        fontSize:16,
        color:"#333333",
        flex:6,
        marginBottom:1,
        fontWeight:"200"
    },
    Delete:{
        fontSize:20,
        color:"#f63e4d",
        flex:1,
        textAlign:"center"
    },
    Reduce:{
        fontSize:20,
        color:"#f63e4d",
        flex:1,
        textAlign:"center"
    },
    Increase:{
        fontSize:20,
        color:"#f63e4d",
        flex:1,
        textAlign:"center"
    },
    sublime:{
        marginLeft:8,
    },
    button:{
        marginTop:30,
        flex:1,
        marginLeft:25,
        marginRight:25,
        backgroundColor:"#ff4e4e",
        borderRadius:5,
        paddingTop:13,
        paddingBottom:13,
    },
    ButtonText:{
        color:"#ffffff",
        textAlign:"center",
        fontSize:18,
    },
});