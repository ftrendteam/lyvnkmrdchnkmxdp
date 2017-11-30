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
    TouchableOpacity
} from 'react-native';

import Storage from "../utils/Storage";

export default class Sell extends Component {

    constructor(props){
        super(props);
        this.state = {
            name:""
        }
    }

    componentDidMount(){

        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
            });
        });

    }

    Return(){
        this.props.navigator.pop();
    }



    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>{this.state.name}</Text>
                    </View>
                </View>
                <View style={styles.TitleCont}>
                    <View style={styles.FristList}>
                        <View style={styles.List}>
                            <View style={styles.ListView}>
                                <Text style={[styles.ListText,{textAlign:"center"}]}>店号：</Text>
                            </View>
                            <View style={styles.ListView}>
                                <Text style={styles.ListText}>0001</Text>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.ListView}>
                                <Text style={[styles.ListText,{textAlign:"center"}]}>收款员：</Text>
                            </View>
                            <View style={styles.ListView}>
                                <Text style={styles.ListText}>0001</Text>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.ListView}>
                                <Text style={[styles.ListText,{textAlign:"center"}]}>pos号：</Text>
                            </View>
                            <View style={styles.ListView}>
                                <Text style={styles.ListText}>0001</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.FristList}>
                        <View style={styles.List}>
                            <View style={styles.ListView}>
                                <Text style={[styles.ListText,{textAlign:"center"}]}>店号：</Text>
                            </View>
                            <View style={styles.ListView}>
                                <Text style={styles.ListText}>0001</Text>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.ListView}>
                                <Text style={[styles.ListText,{textAlign:"center"}]}>收款员：</Text>
                            </View>
                            <View style={styles.ListView}>
                                <Text style={styles.ListText}>0001</Text>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.ListView}>
                                <Text style={[styles.ListText,{textAlign:"center"}]}>pos号：</Text>
                            </View>
                            <View style={styles.ListView}>
                                <Text style={styles.ListText}>0001</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.ShopCont}>
                    <View style={[{backgroundColor:"#ff4e4e",width:10,height:60,position:"absolute",left:0,}]}></View>
                    <View style={[{backgroundColor:"#ff4e4e",width:10,height:60,position:"absolute",right:0,}]}></View>
                    <View style={styles.ShopList}>
                        <View>
                            <View>
                                <Text></Text>
                            </View>
                        </View>
                    </View>
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
        paddingRight:56,
        color:"#ffffff",
        fontSize:22,
        marginTop:3,
    },
    TitleCont:{
        height:90,
        backgroundColor:"#ff4e4e",
        paddingLeft:25,
        paddingRight:25,
    },
    FristList:{
        height:38,
        paddingTop:10,
        flexDirection:"row",
    },
    List:{
        flex:1,
        flexDirection:"row",
    },
    ListView:{
        flex:1,
    },
    ListText:{
        color:"#ffffff",
        fontSize:16,
    },
    ShopCont:{
        paddingLeft:10,
        paddingRight:10,
    },
    ShopList:{
        height:380,
        borderRadius:5,
        backgroundColor:"#ffffff",
        borderBottomColor:"#000000",
        borderBottomWidth:1,
        borderTopColor:"#000000",
        borderTopWidth:1,
        borderLeftColor:"#000000",
        borderLeftWidth:1,
        borderRightColor:"#000000",
        borderRightWidth:1,
    }
});
