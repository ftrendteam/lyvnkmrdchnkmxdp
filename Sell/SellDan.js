/**
 * 移动销售历史查询
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Modal,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    InteractionManager,
    ActivityIndicator
} from 'react-native';
import Index from "../app/Index";
import Sell from "./Sell";
import ShoppingCart from "../app/ShoppingCart";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";
import MainView from "../index.android";

let dbAdapter = new DBAdapter();
let db;
export default class SellDan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            Storage.get('Name').then((tags) => {
                this.setState({
                    name: tags
                })
            });
        });
    }

    Shop() {
        var nextRoute = {
            name: "主页",
            component: Index
        };
        this.props.navigator.push(nextRoute)
    }

    ShopList() {
        var nextRoute = {
            name: "主页",
            component: ShoppingCart
        };
        this.props.navigator.push(nextRoute);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <Text style={styles.HeaderList}>{this.state.name}</Text>

                    </View>
                </View>
                <View style={styles.Rolling}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.OnclickList}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_25.png")}/>
                            </Text>
                            <Text style={styles.LisText}>总交易报表</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.OnclickList}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_25.png")}/>
                            </Text>
                            <Text style={styles.LisText}>收款员报表</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.OnclickList}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_25.png")}/>
                            </Text>
                            <Text style={styles.LisText}>品类报表</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.OnclickList}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_25.png")}/>
                            </Text>
                            <Text style={styles.LisText}>单品报表</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.Home}><Image source={require("../images/1_30.png")}></Image><Text
                        style={styles.home2}>历史单据查询</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.Shop.bind(this)}><Image
                        source={require("../images/1_311.png")}></Image><Text
                        style={styles.home1}>商品</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.ShopList.bind(this)}>
                        <View>
                            <Image source={require("../images/1_322.png")}>
                                {
                                    (this.state.shopcar == 0) ?
                                        null :
                                        <Text style={[{position: "absolute", right: -200,}]}>{this.state.shopcar}</Text>
                                }
                                {
                                    (this.state.shopcar > 0) ?
                                        <Text
                                            style={[styles.ShopCar, {paddingTop: 3,}]}>{this.state.shopcar}</Text> : null
                                }
                                {
                                    (this.state.shopcar < 999) ?
                                        null :
                                        <Text style={[styles.ShopCar, {
                                            width: 30,
                                            height: 30,
                                            top: 11,
                                            lineHeight: 21,
                                        }]}>{this.state.shopcar}</Text>
                                }
                                {
                                    (this.state.shopcar > 999) ?
                                        <View>
                                            <Text style={[styles.ShopCar, {
                                                width: 30,
                                                height: 30,
                                                top: 11,
                                                lineHeight: 23
                                            }]}>{this.state.shopcar}</Text>
                                            <Text style={styles.Add}>
                                                +
                                            </Text>
                                        </View> : null
                                }
                            </Image>
                        </View>
                        <Text style={styles.home1}>清单</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
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
});