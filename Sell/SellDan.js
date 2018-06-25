/**
 * 移动销售历史查询 Sell文件夹下
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
import BaoBiao from "./Sell_BaoBiao";
import ShoppingCart from "../app/ShoppingCart";
import styles from "../style/styles";//style样式引用
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
            name: "Sell",
            component: Sell
        };
        this.props.navigator.push(nextRoute);
    }

    JYbaobiao(){
        this.props.navigator.push({
            component: BaoBiao,
            params: {
                BBName: "总交易报表",
            }
        })
    }

    SKbaobiao(){
        this.props.navigator.push({
            component: BaoBiao,
            params: {
                BBName: "收款员报表",
            }
        })
    }

    PLbaobiao(){
        this.props.navigator.push({
            component: BaoBiao,
            params: {
                BBName: "品类报表",
            }
        })
    }

    DPbaobiao(){
        this.props.navigator.push({
            component: BaoBiao,
            params: {
                BBName: "单品报表",
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <Text style={styles.HeaderList}>{this.state.name}</Text>

                    </View>
                </View>
                <ScrollView style={styles.Rolling}>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.OnclickList} onPress={this.JYbaobiao.bind(this)}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_63.png")}/>
                            </Text>
                            <Text style={styles.LisText}>总交易报表</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.OnclickList}onPress={this.SKbaobiao.bind(this)}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_64.png")}/>
                            </Text>
                            <Text style={styles.LisText}>收款员报表</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity style={styles.OnclickList}onPress={this.PLbaobiao.bind(this)}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_65.png")}/>
                            </Text>
                            <Text style={styles.LisText}>品类报表</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.OnclickList}onPress={this.DPbaobiao.bind(this)}>
                            <Text style={styles.ModalHeadImage1}>
                                <Image source={require("../images/1_66.png")}/>
                            </Text>
                            <Text style={styles.LisText}>单品报表</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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