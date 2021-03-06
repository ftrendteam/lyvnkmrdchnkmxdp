/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Navigator,
    TouchableOpacity,
    ScrollableTabView,
    ScrollView,
    Modal,
    Dimensions,
    TouchableHighlight,
    ListView,
    AnimatedFlatList,
    DeviceEventEmitter,
    FlatList,
    ToastAndroid,
    ActivityIndicator,
    InteractionManager,
} from 'react-native';
import HistoricalDocument from "./HistoricalDocument";//历史单据
import ShoppingCart from "./ShoppingCart";//清单
import admin from "./admin";//登录页==用户编码
import OrderDetails from "./OrderDetails";//商品详情页，数量增加
import SunYi from "./SunYi";//损溢单
import Search from "./Search";//搜索
import Query from "./Query";//商品盘点
import Distrition from "./Distrition";//配送收货
import ProductCG from "./ProductCG";//商品采购单
import ProductYS from "./ProductYS";//商品验收单
import ProductXP from "./ProductXP";//协配采购单
import ProductSH from "./ProductSH";//协配收货单
import WholeSale from "../WholeSale/WholeSale";//批发销售
import PinLei from "../YHDan/PinLei";//要货单第二分页
import SellData from "../Sell/Sell_Data";//销售第二分页
import Sell from "../Sell/Sell";//销售付款页面
import SellDan from "../Sell/SellDan";//销售历史单据
import StockEnquiries from "../StockEnquiries/StockEnquiries";//库存查询
import Shopsearch from "../StockEnquiries/Shopsearch";//点击商品 商品查询
import SearchData from "../StockEnquiries/SearchData";//搜索页面 商品查询
import PSDan from "../PSDan/PSDan";//商品配送
import YHSearch from "../YHSearch/YHSearch";//要货查询
import Set from "../AppSet/Set";//设置
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";//网络请求封装
import UpData from "../utils/UpData";//数据更新
import DBAdapter from "../adapter/DBAdapter";//接口页面
import Storage from '../utils/Storage';//保存 获取
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";//商品扫码
import DeCodePrePrint from "../utils/DeCodePrePrint";
import SideMenu from 'react-native-side-menu';
import BigDecimalUtils from "../utils/BigDecimalUtils";

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;

let dbAdapter = new DBAdapter();
let updata = new UpData();
let deCode13 = new DeCodePrePrint();
let decodepreprint = new DeCodePrePrint18();

let db;
let page = 1;
let total = 0;
let totalPage = 0;
const lastDepCode = "";
let listener;
export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentindex: 0,
            isPress: true,
            pickedDate: "",
            pid: "",
            DepCode: "",
            head: "",
            shopcar: "",
            Counmnmber: "",
            data: "",
            ShopNumber: "",
            ShopNumber1: "",
            ShopCar1: "",
            usercode: "",
            License: "",
            username: "",
            ClientCode: "",
            Usercode: "",
            SuppCode: "",
            ShopCode: "",
            ChildShopCode: "",
            OrgFormno: "",
            FormType: "",
            LinkUrl: "",
            Disting: "",
            ShopNumber: "",
            Modify: "",
            Zero: "",
            OrderDetails: "",
            pressStatus: 0,
            PressStatus: 0,
            nomore: true,
            isloading: true,
            show: false,
            Show: false,
            Promp: false,
            Promp1: false,
            Permissions: false,
            Permissions1: false,
            Permissions2: false,
            statement: false,
            receiving: false,
            emptydata: false,
            NewData: false,
            DataComplete: false,
            MoreShop: false,
            depcode: this.props.DepCode ? this.props.DepCode : "",//要货单第二分页传入的depcode以及修改数量返回
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
            ShopData: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
            saveDepCode:'',
        };
        this.dataRows = [];
        this.productData = [];
        var timer1 = null;
        if (!db) {
            db = dbAdapter.open();
        }
    }

    History() {
        if (this.state.head == "标签采集") {
            ToastAndroid.show('暂不支持该业务', ToastAndroid.SHORT)
        } else if (this.state.head == "移动销售") {
            var nextRoute = {
                name: "主页",
                component: SellDan
            };
            this.props.navigator.push(nextRoute)
        } else {
            var nextRoute = {
                name: "主页",
                component: HistoricalDocument
            };
            this.props.navigator.push(nextRoute)
        }
    }

    ShopList() {
        Storage.get('Name').then((tags) => {
            if (this.state.head == "移动销售") {
                var nextRoute = {
                    name: "Sell",
                    component: Sell
                };
                DeviceEventEmitter.removeAllListeners();
                this.props.navigator.push(nextRoute);
            } else {
                DeviceEventEmitter.removeAllListeners();
                var nextRoute = {
                    name: "主页",
                    component: ShoppingCart
                };
                this.props.navigator.push(nextRoute)
            }
        })

    }

    //单据onclick事件
    _rightButtonClick() {
        this._setModalVisible();
    }

    //二维码扫描
    Code() {
        if (this.state.head == null) {
            this._Emptydata();
        } else {
            NativeModules.RNScannerAndroid.openScanner();
        }
    }

    //扫码方法
    Device() {
        DeviceEventEmitter.addListener("code", (reminder) => {
            decodepreprint.init(reminder, dbAdapter);
            Storage.get('DepCode').then((DepCode) => {
                Storage.get('FormType').then((FormType) => {
                    Storage.get('LinkUrl').then((LinkUrl) => {
                        Storage.get('userName').then((userName) => {
                            Storage.get('Name').then((head) => {
                                if (head == null) {
                                    this._Emptydata();
                                } else {
                                    var date = new Date();
                                    var getFullYear = date.getFullYear();
                                    var getMonth = date.getMonth() + 1;
                                    var getDate = date.getDate();
                                    var getHours = date.getHours();
                                    var getMinutes = date.getMinutes();
                                    var getSeconds = date.getSeconds();
                                    if (getMonth >= 0 && getMonth <= 9) {
                                        var getMonth = "0" + getMonth;
                                    }
                                    if (getDate >= 0 && getDate <= 9) {
                                        var getDate = "0" + getDate;
                                    }
                                    if (getHours >= 0 && getHours <= 9) {
                                        var getHours = "0" + getHours;
                                    }
                                    if (getMinutes >= 0 && getMinutes <= 9) {
                                        var getMinutes = "0" + getMinutes;
                                    }
                                    if (getSeconds >= 0 && getSeconds <= 9) {
                                        var getSeconds = "0" + getSeconds;
                                    }
                                    var SfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
                                    Storage.delete('ShoppData');//删除 从清单点击商品类表 从修改数量点击回去 回到清单列表
                                    if ((reminder.length == 18 && decodepreprint.deCodePreFlag())) {
                                        new Promise.all([decodepreprint.deCodeProdCode(), decodepreprint.deCodeTotal(), decodepreprint.deCodeWeight()]).then((results) => {
                                            if (results.length == 3) {
                                                let prodCode = results[0];
                                                let total = results[1];
                                                let weight = results[2];
                                                dbAdapter.selectAidCode(prodCode, 1).then((product) => {
                                                    if (product.length == 0) {
                                                        ToastAndroid.show("商品不存在", ToastAndroid.SHORT);
                                                        return;
                                                    }
                                                    for (let i = 0; i < product.length; i++) {
                                                        let countm;
                                                        var row = product.item(i);
                                                        dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                            if (datas.length == 0) {
                                                                countm = weight;
                                                            } else {
                                                                countm = row.ShopNumber;
                                                            }
                                                            if (DepCode !== null) {
                                                                if (row.DepCode1 !== DepCode) {
                                                                    ToastAndroid.show("请选择该品类下的商品", ToastAndroid.SHORT);
                                                                    return;
                                                                } else {
                                                                    if (this.state.head == "移动销售") {
                                                                        var shopnumber = 0;
                                                                        var shopAmount = 0;
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: row.StdPrice,
                                                                                Pid: row.Pid,
                                                                                countm: countm,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: total,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: "",
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount: row.IsIntCount,
                                                                                SaoMa: 1,
                                                                            }
                                                                        })
                                                                        DeviceEventEmitter.removeAllListeners();
                                                                    } else {
                                                                        let params = {
                                                                            reqCode: "App_PosReq",
                                                                            reqDetailCode: "App_Client_CurrProdQry",
                                                                            ClientCode: this.state.ClientCode,
                                                                            sDateTime: SfullTime,
                                                                            Sign: NetUtils.MD5("App_PosReq" + "##" +
                                                                                "App_Client_CurrProdQry" + "##" + SfullTime + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                                            username: userName,
                                                                            usercode: this.state.Usercode,
                                                                            SuppCode: row.SuppCode,
                                                                            ShopCode: this.state.ShopCode,
                                                                            ChildShopCode: this.state.ChildShopCode,
                                                                            ProdCode: row.ProdCode,
                                                                            OrgFormno: this.state.OrgFormno,
                                                                            FormType: FormType,
                                                                        };
                                                                        FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                                            var countm = JSON.stringify(data.countm);
                                                                            var ShopPrice = JSON.stringify(data.ShopPrice);
                                                                            if (data.retcode == 1) {
                                                                                if (this.state.head == "商品查询") {
                                                                                    this.props.navigator.push({
                                                                                        component: Shopsearch,
                                                                                        params: {
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                                        if (row.ShopNumber == 0) {
                                                                                            this.props.navigator.push({
                                                                                                component: OrderDetails,
                                                                                                params: {
                                                                                                    ProdName: row.ProdName,
                                                                                                    ShopPrice: ShopPrice,
                                                                                                    Pid: row.Pid,
                                                                                                    countm: countm,
                                                                                                    promemo: row.ShopRemark,
                                                                                                    prototal: row.ShopAmount,
                                                                                                    ProdCode: row.ProdCode,
                                                                                                    DepCode: row.DepCode1,
                                                                                                    SuppCode: row.SuppCode,
                                                                                                    ydcountm: countm,
                                                                                                    BarCode: row.BarCode,
                                                                                                    IsIntCount: row.IsIntCount
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            this.props.navigator.push({
                                                                                                component: OrderDetails,
                                                                                                params: {
                                                                                                    ProdName: row.ProdName,
                                                                                                    ShopPrice: row.ShopPrice,
                                                                                                    Pid: row.Pid,
                                                                                                    countm: countm,
                                                                                                    promemo: row.ShopRemark,
                                                                                                    prototal: row.ShopAmount,
                                                                                                    ProdCode: row.ProdCode,
                                                                                                    DepCode: row.DepCode1,
                                                                                                    SuppCode: row.SuppCode,
                                                                                                    ydcountm: countm,
                                                                                                    BarCode: row.BarCode,
                                                                                                    IsIntCount: row.IsIntCount
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    } else if (this.state.head == "售价调整") {
                                                                                        dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                                                            if (datas.length == 0) {
                                                                                                this.props.navigator.push({
                                                                                                    component: OrderDetails,
                                                                                                    params: {
                                                                                                        ProdName: row.ProdName,
                                                                                                        ShopPrice: ShopPrice,
                                                                                                        Pid: row.Pid,
                                                                                                        countm: countm,
                                                                                                        promemo: row.ShopRemark,
                                                                                                        prototal: row.ShopAmount,
                                                                                                        ProdCode: row.ProdCode,
                                                                                                        DepCode: row.DepCode1,
                                                                                                        SuppCode: row.SuppCode,
                                                                                                        ydcountm: "",
                                                                                                        BarCode: row.BarCode,
                                                                                                        IsIntCount: row.IsIntCount
                                                                                                    }
                                                                                                })
                                                                                            } else {
                                                                                                for (let i = 0; i < datas.length; i++) {
                                                                                                    var Data = datas.item(i);
                                                                                                    this.props.navigator.push({
                                                                                                        component: OrderDetails,
                                                                                                        params: {
                                                                                                            ProdName: row.ProdName,
                                                                                                            ShopPrice: ShopPrice,
                                                                                                            Pid: row.Pid,
                                                                                                            countm: countm,
                                                                                                            promemo: row.ShopRemark,
                                                                                                            prototal: row.ShopAmount,
                                                                                                            ProdCode: row.ProdCode,
                                                                                                            DepCode: row.DepCode1,
                                                                                                            SuppCode: row.SuppCode,
                                                                                                            ydcountm: Data.ydcountm,
                                                                                                            BarCode: row.BarCode,
                                                                                                            IsIntCount: row.IsIntCount
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        this.props.navigator.push({
                                                                                            component: OrderDetails,
                                                                                            params: {
                                                                                                ProdName: row.ProdName,
                                                                                                ShopPrice: ShopPrice,
                                                                                                Pid: row.Pid,
                                                                                                countm: countm,
                                                                                                promemo: row.ShopRemark,
                                                                                                prototal: row.ShopAmount,
                                                                                                ProdCode: row.ProdCode,
                                                                                                DepCode: row.DepCode1,
                                                                                                SuppCode: row.SuppCode,
                                                                                                ydcountm: countm,
                                                                                                BarCode: row.BarCode,
                                                                                                IsIntCount: row.IsIntCount
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }
                                                                                DeviceEventEmitter.removeAllListeners();
                                                                            } else {
                                                                                alert(JSON.stringify(data))
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            }
                                                            else {
                                                                if (this.state.head == "移动销售") {
                                                                    var shopnumber = 0;
                                                                    var shopAmount = 0;
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: row.ProdName,
                                                                            ShopPrice: row.StdPrice,
                                                                            Pid: row.Pid,
                                                                            countm: countm,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: total,
                                                                            ProdCode: row.ProdCode,
                                                                            DepCode: row.DepCode1,
                                                                            SuppCode: row.SuppCode,
                                                                            ydcountm: "",
                                                                            BarCode: row.BarCode,
                                                                            IsIntCount: row.IsIntCount,
                                                                            SaoMa: 1,
                                                                        }
                                                                    })
                                                                    DeviceEventEmitter.removeAllListeners();
                                                                } else {
                                                                    let params = {
                                                                        reqCode: "App_PosReq",
                                                                        reqDetailCode: "App_Client_CurrProdQry",
                                                                        ClientCode: this.state.ClientCode,
                                                                        sDateTime: SfullTime,
                                                                        Sign: NetUtils.MD5("App_PosReq" + "##" +
                                                                            "App_Client_CurrProdQry" + "##" + SfullTime + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                                        username: userName,
                                                                        usercode: this.state.Usercode,
                                                                        SuppCode: row.SuppCode,
                                                                        ShopCode: this.state.ShopCode,
                                                                        ChildShopCode: this.state.ChildShopCode,
                                                                        ProdCode: row.ProdCode,
                                                                        OrgFormno: this.state.OrgFormno,
                                                                        FormType: FormType,
                                                                    };
                                                                    FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                                        var ShopPrice = JSON.stringify(data.ShopPrice);
                                                                        if (data.retcode == 1) {
                                                                            if (this.state.head == "商品查询") {
                                                                                this.props.navigator.push({
                                                                                    component: Shopsearch,
                                                                                    params: {
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                    }
                                                                                })
                                                                            } else {
                                                                                if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                                    if (row.ShopNumber == 0) {
                                                                                        this.props.navigator.push({
                                                                                            component: OrderDetails,
                                                                                            params: {
                                                                                                ProdName: row.ProdName,
                                                                                                ShopPrice: ShopPrice,
                                                                                                Pid: row.Pid,
                                                                                                countm: countm,
                                                                                                promemo: row.ShopRemark,
                                                                                                prototal: row.ShopAmount,
                                                                                                ProdCode: row.ProdCode,
                                                                                                DepCode: row.DepCode1,
                                                                                                SuppCode: row.SuppCode,
                                                                                                ydcountm: data.countm,
                                                                                                BarCode: row.BarCode,
                                                                                                IsIntCount: row.IsIntCount
                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        this.props.navigator.push({
                                                                                            component: OrderDetails,
                                                                                            params: {
                                                                                                ProdName: row.ProdName,
                                                                                                ShopPrice: row.ShopPrice,
                                                                                                Pid: row.Pid,
                                                                                                countm: countm,
                                                                                                promemo: row.ShopRemark,
                                                                                                prototal: row.ShopAmount,
                                                                                                ProdCode: row.ProdCode,
                                                                                                DepCode: row.DepCode1,
                                                                                                SuppCode: row.SuppCode,
                                                                                                ydcountm: data.countm,
                                                                                                BarCode: row.BarCode,
                                                                                                IsIntCount: row.IsIntCount
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                } else if (this.state.head == "售价调整") {
                                                                                    dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                                                        if (datas.length == 0) {
                                                                                            this.props.navigator.push({
                                                                                                component: OrderDetails,
                                                                                                params: {
                                                                                                    ProdName: row.ProdName,
                                                                                                    ShopPrice: ShopPrice,
                                                                                                    Pid: row.Pid,
                                                                                                    countm: countm,
                                                                                                    promemo: row.ShopRemark,
                                                                                                    prototal: row.ShopAmount,
                                                                                                    ProdCode: row.ProdCode,
                                                                                                    DepCode: row.DepCode1,
                                                                                                    SuppCode: row.SuppCode,
                                                                                                    ydcountm: "",
                                                                                                    BarCode: row.BarCode,
                                                                                                    IsIntCount: row.IsIntCount
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            for (let i = 0; i < datas.length; i++) {
                                                                                                var Data = datas.item(i);
                                                                                                this.props.navigator.push({
                                                                                                    component: OrderDetails,
                                                                                                    params: {
                                                                                                        ProdName: row.ProdName,
                                                                                                        ShopPrice: ShopPrice,
                                                                                                        Pid: row.Pid,
                                                                                                        countm: countm,
                                                                                                        promemo: row.ShopRemark,
                                                                                                        prototal: row.ShopAmount,
                                                                                                        ProdCode: row.ProdCode,
                                                                                                        DepCode: row.DepCode1,
                                                                                                        SuppCode: row.SuppCode,
                                                                                                        ydcountm: Data.ydcountm,
                                                                                                        BarCode: row.BarCode,
                                                                                                        IsIntCount: row.IsIntCount
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: countm,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: data.countm,
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount: row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                            DeviceEventEmitter.removeAllListeners();
                                                                        } else {
                                                                            alert(JSON.stringify(data))
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else if ((reminder.length == 13 && deCode13.deCodePreFlag(reminder))) {//13位条码解析
                                        new Promise.all([deCode13.deCodeProdCode(reminder, dbAdapter), deCode13.deCodeTotile(reminder, dbAdapter)]).then((result) => {
                                            if (result.length == 2) {
                                                let prodCode = result[0];//解析出来的prodcode用来selectaidcode接口传入prodcode
                                                let total = result[1];
                                                dbAdapter.selectAidCode(prodCode, 1).then((rows) => {
                                                    if (rows.length == 0) {
                                                        ToastAndroid.show("商品不存在", ToastAndroid.SHORT);
                                                        return;
                                                    }
                                                    for (let i = 0; i < rows.length; i++) {
                                                        var row = rows.item(i);
                                                        dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                            if (datas.length == 0) {
                                                                var divide = total / row.ShopPrice;
                                                                var countm = divide.toFixed(3);
                                                            } else {
                                                                var countm = row.ShopNumber;
                                                            }
                                                            if (DepCode !== null) {
                                                                if (row.DepCode1 !== DepCode) {
                                                                    ToastAndroid.show("请选择该品类下的商品", ToastAndroid.SHORT);
                                                                    return;
                                                                } else {
                                                                    let params = {
                                                                        reqCode: "App_PosReq",
                                                                        reqDetailCode: "App_Client_CurrProdQry",
                                                                        ClientCode: this.state.ClientCode,
                                                                        sDateTime: SfullTime,
                                                                        Sign: NetUtils.MD5("App_PosReq" + "##" +
                                                                            "App_Client_CurrProdQry" + "##" + SfullTime + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                                        username: userName,
                                                                        usercode: this.state.Usercode,
                                                                        SuppCode: row.SuppCode,
                                                                        ShopCode: this.state.ShopCode,
                                                                        ChildShopCode: this.state.ChildShopCode,
                                                                        ProdCode: row.ProdCode,
                                                                        OrgFormno: this.state.OrgFormno,
                                                                        FormType: FormType,
                                                                    };
                                                                    FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                                        var ShopPrice = JSON.stringify(data.ShopPrice);
                                                                        if (this.state.head == "移动销售") {
                                                                            var shopnumber = 0;
                                                                            var shopAmount = 0;
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: row.ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: countm,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: "",
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount: row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                        else {
                                                                            if (data.retcode == 1) {
                                                                                if (this.state.head == "商品查询") {
                                                                                    this.props.navigator.push({
                                                                                        component: Shopsearch,
                                                                                        params: {
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    if (this.state.head == "售价调整") {
                                                                                        dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                                                            var divide = total / ShopPrice;
                                                                                            var countm = divide.toFixed(3);
                                                                                            if (datas.length == 0) {
                                                                                                this.props.navigator.push({
                                                                                                    component: OrderDetails,
                                                                                                    params: {
                                                                                                        ProdName: row.ProdName,
                                                                                                        ShopPrice: ShopPrice,
                                                                                                        Pid: row.Pid,
                                                                                                        countm: countm,
                                                                                                        promemo: row.ShopRemark,
                                                                                                        prototal: row.ShopAmount,
                                                                                                        ProdCode: row.ProdCode,
                                                                                                        DepCode: row.DepCode1,
                                                                                                        SuppCode: row.SuppCode,
                                                                                                        ydcountm: "",
                                                                                                        BarCode: row.BarCode,
                                                                                                        IsIntCount: row.IsIntCount
                                                                                                    }
                                                                                                })
                                                                                            } else {
                                                                                                for (let i = 0; i < datas.length; i++) {
                                                                                                    var Data = datas.item(i);
                                                                                                    this.props.navigator.push({
                                                                                                        component: OrderDetails,
                                                                                                        params: {
                                                                                                            ProdName: row.ProdName,
                                                                                                            ShopPrice: ShopPrice,
                                                                                                            Pid: row.Pid,
                                                                                                            countm: countm,
                                                                                                            promemo: row.ShopRemark,
                                                                                                            prototal: row.ShopAmount,
                                                                                                            ProdCode: row.ProdCode,
                                                                                                            DepCode: row.DepCode1,
                                                                                                            SuppCode: row.SuppCode,
                                                                                                            ydcountm: Data.ydcountm,
                                                                                                            BarCode: row.BarCode,
                                                                                                            IsIntCount: row.IsIntCount
                                                                                                        }
                                                                                                    })
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    } else {
                                                                                        this.props.navigator.push({
                                                                                            component: OrderDetails,
                                                                                            params: {
                                                                                                ProdName: row.ProdName,
                                                                                                ShopPrice: row.ShopPrice,
                                                                                                Pid: row.Pid,
                                                                                                countm: countm,
                                                                                                promemo: row.ShopRemark,
                                                                                                prototal: row.ShopAmount,
                                                                                                ProdCode: row.ProdCode,
                                                                                                DepCode: row.DepCode1,
                                                                                                SuppCode: row.SuppCode,
                                                                                                ydcountm: data.countm,
                                                                                                BarCode: row.BarCode,
                                                                                                IsIntCount: row.IsIntCount
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                alert(JSON.stringify(data))
                                                                            }
                                                                        }
                                                                        DeviceEventEmitter.removeAllListeners();
                                                                    })
                                                                }
                                                            }
                                                            else {
                                                                let params = {
                                                                    reqCode: "App_PosReq",
                                                                    reqDetailCode: "App_Client_CurrProdQry",
                                                                    ClientCode: this.state.ClientCode,
                                                                    sDateTime: SfullTime,
                                                                    Sign: NetUtils.MD5("App_PosReq" + "##" +
                                                                        "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                                    username: userName,
                                                                    usercode: this.state.Usercode,
                                                                    SuppCode: row.SuppCode,
                                                                    ShopCode: this.state.ShopCode,
                                                                    ChildShopCode: this.state.ChildShopCode,
                                                                    ProdCode: row.ProdCode,
                                                                    OrgFormno: this.state.OrgFormno,
                                                                    FormType: FormType,
                                                                };
                                                                FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                                    var countm = JSON.stringify(data.countm);
                                                                    var ShopPrice = JSON.stringify(data.ShopPrice);
                                                                    if (this.state.head == "移动销售") {
                                                                        var shopnumber = 0;
                                                                        var shopAmount = 0;
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: row.ShopPrice,
                                                                                Pid: row.Pid,
                                                                                countm: countm,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: "",
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    }
                                                                    else {
                                                                        if (data.retcode == 1) {
                                                                            if (this.state.head == "商品查询") {
                                                                                this.props.navigator.push({
                                                                                    component: Shopsearch,
                                                                                    params: {
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                    }
                                                                                })
                                                                            } else {
                                                                                if (this.state.head == "售价调整") {
                                                                                    dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                                                        var divide = total / ShopPrice;
                                                                                        var countm = divide.toFixed(3);
                                                                                        if (datas.length == 0) {
                                                                                            this.props.navigator.push({
                                                                                                component: OrderDetails,
                                                                                                params: {
                                                                                                    ProdName: row.ProdName,
                                                                                                    ShopPrice: ShopPrice,
                                                                                                    Pid: row.Pid,
                                                                                                    countm: countm,
                                                                                                    promemo: row.ShopRemark,
                                                                                                    prototal: row.ShopAmount,
                                                                                                    ProdCode: row.ProdCode,
                                                                                                    DepCode: row.DepCode1,
                                                                                                    SuppCode: row.SuppCode,
                                                                                                    ydcountm: "",
                                                                                                    BarCode: row.BarCode,
                                                                                                    IsIntCount: row.IsIntCount
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            for (let i = 0; i < datas.length; i++) {
                                                                                                var Data = datas.item(i);
                                                                                                this.props.navigator.push({
                                                                                                    component: OrderDetails,
                                                                                                    params: {
                                                                                                        ProdName: row.ProdName,
                                                                                                        ShopPrice: ShopPrice,
                                                                                                        Pid: row.Pid,
                                                                                                        countm: countm,
                                                                                                        promemo: row.ShopRemark,
                                                                                                        prototal: row.ShopAmount,
                                                                                                        ProdCode: row.ProdCode,
                                                                                                        DepCode: row.DepCode1,
                                                                                                        SuppCode: row.SuppCode,
                                                                                                        ydcountm: Data.ydcountm,
                                                                                                        BarCode: row.BarCode,
                                                                                                        IsIntCount: row.IsIntCount
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: row.ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: countm,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: data.countm,
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount: row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                        } else {
                                                                            alert(JSON.stringify(data))
                                                                        }
                                                                    }
                                                                    DeviceEventEmitter.removeAllListeners();
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else {
                                        //商品查询
                                        dbAdapter.selectAidCode(reminder, 1).then((rows) => {
                                            if (rows.length == 0) {
                                                ToastAndroid.show("商品不存在", ToastAndroid.SHORT);
                                                return;
                                            }
                                            if (rows.length > 1) {
                                                this.ShopData = [];
                                                for (let i = 0; i < rows.length; i++) {
                                                    var row = rows.item(i);
                                                    this.ShopData.push(row);
                                                }
                                                this.setState({
                                                    ShopData: this.state.ShopData.cloneWithRows(this.ShopData),
                                                })
                                                this._MoreShop();
                                                return;
                                            }
                                            if (rows.length == 1) {
                                                for (let i = 0; i < rows.length; i++) {
                                                    var row = rows.item(i);
                                                    if (DepCode !== null) {
                                                        if (row.DepCode1 !== DepCode) {
                                                            ToastAndroid.show("请选择该品类下的商品", ToastAndroid.SHORT);
                                                            return;
                                                        } else {
                                                            let params = {
                                                                reqCode: "App_PosReq",
                                                                reqDetailCode: "App_Client_CurrProdQry",
                                                                ClientCode: this.state.ClientCode,
                                                                sDateTime: Date.parse(new Date()),
                                                                Sign: NetUtils.MD5("App_PosReq" + "##" +
                                                                    "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                                username: userName,
                                                                usercode: this.state.Usercode,
                                                                SuppCode: row.SuppCode,
                                                                ShopCode: this.state.ShopCode,
                                                                ChildShopCode: this.state.ChildShopCode,
                                                                ProdCode: row.ProdCode,
                                                                OrgFormno: this.state.OrgFormno,
                                                                FormType: FormType,
                                                            };
                                                            FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                                DeviceEventEmitter.removeAllListeners();
                                                                var countm = JSON.stringify(data.countm);
                                                                var ShopPrice = JSON.stringify(data.ShopPrice);
                                                                if (data.retcode == 1) {
                                                                    if (this.state.head == "商品查询") {
                                                                        this.props.navigator.push({
                                                                            component: Shopsearch,
                                                                            params: {
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                            }
                                                                        })
                                                                    } else {
                                                                        if (this.state.head == "移动销售") {
                                                                            var shopnumber = 0;
                                                                            var shopAmount = 0;
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: row.ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: "",
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount: row.IsIntCount
                                                                                }
                                                                            })
                                                                        } else if (this.state.head == "售价调整") {
                                                                            dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                                                if (datas.length == 0) {
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: row.ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: row.ShopNumber,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: "",
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount: row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                } else {
                                                                                    for (let i = 0; i < datas.length; i++) {
                                                                                        var Data = datas.item(i);
                                                                                        this.props.navigator.push({
                                                                                            component: OrderDetails,
                                                                                            params: {
                                                                                                ProdName: row.ProdName,
                                                                                                ShopPrice: row.ShopPrice,
                                                                                                Pid: row.Pid,
                                                                                                countm: row.ShopNumber,
                                                                                                promemo: row.ShopRemark,
                                                                                                prototal: row.ShopAmount,
                                                                                                ProdCode: row.ProdCode,
                                                                                                DepCode: row.DepCode1,
                                                                                                SuppCode: row.SuppCode,
                                                                                                ydcountm: Data.ydcountm,
                                                                                                BarCode: row.BarCode,
                                                                                                IsIntCount: row.IsIntCount
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }
                                                                            })
                                                                        } else {
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: row.ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: JSON.stringify(data.countm),
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount: row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                } else {
                                                                    alert(JSON.stringify(data))
                                                                }
                                                            })
                                                        }
                                                    } else {
                                                        let params = {
                                                            reqCode: "App_PosReq",
                                                            reqDetailCode: "App_Client_CurrProdQry",
                                                            ClientCode: this.state.ClientCode,
                                                            sDateTime: Date.parse(new Date()),
                                                            Sign: NetUtils.MD5("App_PosReq" + "##" +
                                                                "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                            username: userName,
                                                            usercode: this.state.Usercode,
                                                            SuppCode: row.SuppCode,
                                                            ShopCode: this.state.ShopCode,
                                                            ChildShopCode: this.state.ChildShopCode,
                                                            ProdCode: row.ProdCode,
                                                            OrgFormno: this.state.OrgFormno,
                                                            FormType: FormType,
                                                        };
                                                        FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                            DeviceEventEmitter.removeAllListeners();
                                                            var countm = JSON.stringify(data.countm);
                                                            var ShopPrice = JSON.stringify(data.ShopPrice);
                                                            if (data.retcode == 1) {
                                                                if (this.state.head == "商品查询") {
                                                                    this.props.navigator.push({
                                                                        component: Shopsearch,
                                                                        params: {
                                                                            ProdCode: row.ProdCode,
                                                                            DepCode: row.DepCode1,
                                                                        }
                                                                    })
                                                                } else {
                                                                    if (this.state.head == "移动销售") {
                                                                        var shopnumber = 0;
                                                                        var shopAmount = 0;
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: row.ShopPrice,
                                                                                Pid: row.Pid,
                                                                                countm: row.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: "",
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    } else if (this.state.head == "售价调整") {
                                                                        dbAdapter.selectShopInfoData(row.Pid).then((datas) => {
                                                                            if (datas.length == 0) {
                                                                                this.props.navigator.push({
                                                                                    component: OrderDetails,
                                                                                    params: {
                                                                                        ProdName: row.ProdName,
                                                                                        ShopPrice: row.ShopPrice,
                                                                                        Pid: row.Pid,
                                                                                        countm: row.ShopNumber,
                                                                                        promemo: row.ShopRemark,
                                                                                        prototal: row.ShopAmount,
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                        SuppCode: row.SuppCode,
                                                                                        ydcountm: "",
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount: row.IsIntCount
                                                                                    }
                                                                                })
                                                                            } else {
                                                                                for (let i = 0; i < datas.length; i++) {
                                                                                    var Data = datas.item(i);
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: row.ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: row.ShopNumber,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: Data.ydcountm,
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount: row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    } else {
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: row.ShopPrice,
                                                                                Pid: row.Pid,
                                                                                countm: row.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: JSON.stringify(data.countm),
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            } else {
                                                                alert(JSON.stringify(data))
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    })
                })
            })
        })
    }

    //搜索
    pressPush() {
        if (this.state.head == null) {
            this._Emptydata();
        } else {
            if (this.state.head == "商品查询") {
                var nextRoute = {
                    name: "主页",
                    component: SearchData
                };
                this.props.navigator.push(nextRoute);
            } else {
                var nextRoute = {
                    name: "主页",
                    component: Search
                };
                this.props.navigator.push(nextRoute);
            }
            DeviceEventEmitter.removeAllListeners();
        }
    }

    //页面执行方法
    componentDidMount() {

        Storage.save("num", "1");
        Storage.delete("ShoppData");
        InteractionManager.runAfterInteractions(() => {
            decodepreprint.initFlag(dbAdapter);
            deCode13.init(dbAdapter);
            this.Storage();
            this._fetch();
            this.Device();
            if (lastDepCode == 1) {
                page = 1;
            }
            Storage.get('Disting').then((tags) => {
                this.setState({
                    Disting: tags,
                })

                if (this.state.Disting == "0") {
                    this.setState({
                        pressStatus: 'pressin',
                        PressStatus: '0',
                    });
                } else if (this.state.Disting == "1") {
                    this.setState({
                        PressStatus: 'Pressin',
                        pressStatus: 0
                    });
                }
            })
        });
    }

    Storage() {
        Storage.delete('DataName');
        Storage.get('Name').then((tags) => {
            this.setState({
                head: tags
            })
        });

        Storage.get('username').then((tags) => {
            this.setState({
                username: tags
            })
        });

        Storage.get('ClientCode').then((tags) => {
            this.setState({
                ClientCode: tags
            })
        })

        Storage.get('Usercode').then((tags) => {
            this.setState({
                Usercode: tags
            })
        })

        Storage.get('code').then((tags) => {
            this.setState({
                ShopCode: tags
            })
        })

        Storage.get('shildshop').then((tags) => {
            this.setState({
                ChildShopCode: tags
            })
        })

        Storage.get('OrgFormno').then((tags) => {
            this.setState({
                OrgFormno: tags
            })
        })

        Storage.get('username').then((tags) => {
            this.setState({
                usercode: tags
            })

        });
        Storage.get('DepCode').then((depCode)=>{
            if (depCode==null||depCode=='undefined'){
                depCode='';
            }
            this.setState({
                saveDepCode: depCode
            })

        });
    }

    //获取左侧商品品类信息、商品总数、触发第一个列表
    _fetch() {
        Storage.get('DepCode').then((Depcode) => {
            let ShopCar1 = 0;
            var priductdata = 0;
            let DepCode;
            let priductData = [];
            dbAdapter.selectTDepSet('1').then((rows) => {
                for (let i = 0; i < rows.length; i++) {
                    var row = rows.item(i);
                    this.dataRows.push(row);
                    var ShopCar = rows.item(0).DepCode;
                    ShopCar1 = BigDecimalUtils.add(row.ShopNumber, ShopCar1, 2);
                };
                //判断修改数量页面传过来depcode是否为空
                if (Depcode!==null){
                    if (this.state.depcode == "") {
                        DepCode = Depcode;
                        this.setState({
                            depcode: Depcode,
                            currentindex: Depcode,
                        });
                        lastDepCode = Depcode;
                    } else {
                        DepCode = this.state.depcode;
                        this.setState({
                            currentindex: this.state.depcode,
                        });
                    }
                }else{
                    if (this.state.depcode == "") {
                        DepCode = ShopCar;
                        this.setState({
                            depcode: ShopCar,
                            currentindex: ShopCar,
                        });
                        lastDepCode = ShopCar;
                    } else {
                        DepCode = this.state.depcode;
                        this.setState({
                            currentindex: this.state.depcode,
                        });
                    }
                }
                //获取商品总数（DepCode为类别的depcode）
                dbAdapter.selectProduct1(DepCode, 1).then((rows) => {
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                    }
                    ;
                    priductdata = JSON.stringify(row.countn);
                });
                //触发第一个左侧品类
                dbAdapter.selectProduct(DepCode, page, 1).then((rows) => {
                    if (lastDepCode !== "") {
                        page = 1;
                    }
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                        priductData.push(row);
                    }
                    ;
                    total = priductdata;
                    totalPage = total % 9 == 0 ? total / 9 : Math.floor(total / 9) + 1;
                    this.productData = priductData;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                        ShopCar1: ShopCar1,
                        Page: priductdata,
                        data: priductData,
                        isloading: false,
                    });
                });
            });
            this._fetch1();
        })
    }

    _fetch1() {
        dbAdapter.selectShopInfo("1").then((rows) => {
            if (rows.length == 0) {
                Storage.delete('BeiZhu');
            } else {
                for (let i = 0; i < rows.length; i++) {
                    var row = rows.item(i);
                };
            }
        });
        dbAdapter.selectShopInfoAllCountm().then((rows) => {
            let ShopCar = rows.item(0).countm;
            this.setState({
                shopcar: ShopCar.toFixed(2),
            });
        });
    }

    /**
     * 商品品类获取品类下商品
     */
    _pressRow(rowData) {
        var priductdata = 0;
        let priductData = [];
        if (lastDepCode == "") {
            lastDepCode = rowData.DepCode;
        } else if (lastDepCode !== '') {
            page = 1;
        }
        dbAdapter.selectProduct1(rowData.DepCode, 1).then((rows) => {
            for (let i = 0; i < rows.length; i++) {
                var row = rows.item(i);
            }
            priductdata = JSON.stringify(row.countn);
        });
        this.setState({
            depcode: rowData.DepCode,
            currentindex: rowData.DepCode,
        });
        dbAdapter.selectProduct(rowData.DepCode, page, 1).then((rows) => {
            for (let i = 0; i < rows.length; i++) {
                var row = rows.item(i);
                priductData.push(row);
            }
            ;
            total = priductdata;
            totalPage = total % 9 == 0 ? total / 9 : Math.floor(total / 9) + 1;
            this.productData = priductData;
            this.setState({
                data: priductData,
                isloading: false,
                dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
            });
            if (totalPage == 0) {
                this.setState({
                    nomore: false,
                });
            } else if (totalPage > 0) {
                this.setState({
                    nomore: true,
                });
            }
        });
        this._fetch1();
        //var startTime = (new Date()).valueOf();//获取当前时间
        //var endTime = (new Date()).valueOf();//获取结束时间
        //alert(endTime-startTime);
    }

    /**
     * 左侧列表listview
     */
    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={() => this._pressRow(rowData)} key={rowData.DepCode}
                              style={this.state.currentindex == rowData.DepCode ? styles.clickes : styles.click}>
                {
                    (rowData.ShopNumber == 0) ?
                        null :
                        <View style={styles.addnumber}>
                            <Text style={styles.Reduction1}>{Number(rowData.ShopNumber).toFixed(2)}</Text>
                        </View>
                }

                <Text style={styles.Active}>{rowData.DepName}</Text>

            </TouchableOpacity>
        );
    }

    /**
     * flatlist
     */
    _renderItem(item, index) {
        return (
            <View style={styles.Border}>
                {
                    (this.state.head == "实时盘点" || this.state.head == "商品盘点") ?
                        <View style={styles.AddNumber} ref="goodsCodeOrName">
                            {
                                (item.item.ShopNumber === "" || this.state.Zero == "0") ?
                                    null :
                                    <TouchableOpacity style={styles.Subtraction} onPress={() => this.Countm(item)}>
                                        <Text style={styles.Number}>{item.item.ShopNumber}</Text>
                                        {
                                            (item.item.ShopNumber == "0") ?
                                                null :
                                                <View style={styles.subtraction}><Text style={styles.Reduction}>-</Text></View>
                                        }
                                    </TouchableOpacity>
                            }
                        </View>
                        :
                        <View style={styles.AddNumber} ref="goodsCodeOrName">
                            {
                                (item.item.ShopNumber == "" || item.item.ShopNumber == "0") ?
                                    null :
                                    <TouchableOpacity style={styles.Subtraction} onPress={() => this.Countm(item)}>
                                        <Text style={styles.Number}>{item.item.ShopNumber}</Text>
                                        <View style={styles.subtraction}><Text style={styles.Reduction}>-</Text></View>
                                    </TouchableOpacity>
                            }
                        </View>
                }
                <TouchableOpacity onPress={() => this.OrderDetails(item)}>
                    <View style={styles.Image}>
                        <Image source={require("../images/image.png")}></Image>
                    </View>
                    <Text style={styles.Text}>{item.item.ProdName}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 一码多品listview列表
     */
    _ShopDataRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.ShopList1} onPress={() => this.onclickShop(rowData)}>
                <Text style={styles.ShopHead}>{rowData.ProdCode}</Text>
                <Text style={styles.ShopHead}>{rowData.ProdName}</Text>
                <Text style={styles.ShopHead}>{rowData.ShopPrice}</Text>
            </TouchableOpacity>
        )
    }

    //修改商品数量增减查询
    Countm(item) {
        //调取数量
        // if(this.state.ShopNumber=="0"){
        //     this.setState({
        //         Zero:0,
        //     })
        //     return;
        // }else {
        item.item.ShopNumber = BigDecimalUtils.subtract(item.item.ShopNumber, 1, 2);
        if (item.item.ShopNumber <= 0) {
            item.item.ShopNumber = 0;
        }
        let select = 0;
        for (let i = 0; i < this.dataRows.length; i++) {
            if (item.item.DepCode1 == this.dataRows[i].DepCode) {//判断当前品类是否相等
                select = i;
                let ShopNumber = this.dataRows[i].ShopNumber;
                this.dataRows[i].ShopNumber = BigDecimalUtils.subtract(ShopNumber, 1, 2);
                if (this.dataRows[i].ShopNumber <= 0) {
                    this.dataRows[i].ShopNumber = 0;
                }
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                })
            }
        }
        var prototal = Number(item.item.ShopNumber * item.item.ShopPrice);
        var disCount = BigDecimalUtils.multiply(item.item.ShopNumber, item.item.ShopPrice);
        dbAdapter.upDataShopInfoCountmSub(item.item.ProdCode, disCount).then((rows) => {
        });
        if (item.item.ShopNumber == "0") {
            if (this.state.head !== "实时盘点" || this.state.head !== "商品盘点") {
                dbAdapter.deteleShopInfo(item.item.ProdCode).then((rows) => {
                });
                this.setState({
                    ShopCar1: 0,
                    ShopNumber: 0,
                    Zero: 0,
                })
            }
        }
        // }
        // this._fetch();
        this._fetch1();
    }

    _separator = () => {
        return <View style={{height: 1, backgroundColor: '#f5f5f5'}}/>;
    }

    _createEmptyView() {
        return (
            <View style={styles.footerView}>
                {
                    this.state.nomore ? [<ActivityIndicator key="1"></ActivityIndicator>,
                            <Text key="2" style={styles.fontColorGray}>加载中</Text>] :
                        <Text style={styles.nomore}>没有更多了</Text>
                }
            </View>
        );
    }

    /**
     *一码多品条目事件
     * @constructor
     */
    onclickShop(rowData) {
        var date = new Date();
        var getFullYear = date.getFullYear();
        var getMonth = date.getMonth() + 1;
        var getDate = date.getDate();
        var getHours = date.getHours();
        var getMinutes = date.getMinutes();
        var getSeconds = date.getSeconds();
        if (getMonth >= 0 && getMonth <= 9) {
            var getMonth = "0" + getMonth;
        }
        if (getDate >= 0 && getDate <= 9) {
            var getDate = "0" + getDate;
        }
        if (getHours >= 0 && getHours <= 9) {
            var getHours = "0" + getHours;
        }
        if (getMinutes >= 0 && getMinutes <= 9) {
            var getMinutes = "0" + getMinutes;
        }
        if (getSeconds >= 0 && getSeconds <= 9) {
            var getSeconds = "0" + getSeconds;
        }
        var SfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
        Storage.get('DepCode').then((DepCode) => {
            dbAdapter.selectAidCode(rowData.ProdCode, 1).then((rows) => {
                for (let i = 0; i < rows.length; i++) {
                    var row = rows.item(i);
                    if (DepCode !== null) {
                        if (this.state.depcode !== rowData.DepCode1) {
                            ToastAndroid.show("请选择该品类下的商品", ToastAndroid.SHORT);
                            return;
                        }
                        else {
                            if (this.state.head == "移动销售") {
                                var shopnumber = 0;
                                var shopAmount = 0;
                                this.props.navigator.push({
                                    component: OrderDetails,
                                    params: {
                                        ProdName: rowData.ProdName,
                                        ShopPrice: row.ShopPrice,
                                        Pid: rowData.Pid,
                                        countm: rowData.ShopNumber,
                                        promemo: rowData.ShopRemark,
                                        prototal: rowData.ShopAmount,
                                        ProdCode: rowData.ProdCode,
                                        DepCode: rowData.DepCode1,
                                        SuppCode: rowData.SuppCode,
                                        ydcountm: "",
                                        BarCode: rowData.BarCode,
                                        IsIntCount: row.IsIntCount
                                    }
                                })
                            }
                            else {
                                Storage.get('FormType').then((FormType) => {
                                    Storage.get('LinkUrl').then((LinkUrl) => {
                                        Storage.get('Modify').then((Modify) => {
                                            Storage.get('userName').then((userName) => {
                                                let params = {
                                                    reqCode: "App_PosReq",
                                                    reqDetailCode: "App_Client_CurrProdQry",
                                                    ClientCode: this.state.ClientCode,
                                                    sDateTime: SfullTime,
                                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##"
                                                        + SfullTime + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode +"##" + sDateTime + "##" + "PosControlCs"
                                                    username: userName,
                                                    usercode: this.state.Usercode,
                                                    SuppCode: rowData.SuppCode,
                                                    ShopCode: this.state.ShopCode,
                                                    ChildShopCode: this.state.ChildShopCode,
                                                    ProdCode: rowData.ProdCode,
                                                    OrgFormno: this.state.OrgFormno,
                                                    FormType: FormType,
                                                };
                                                FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                    var countm = JSON.stringify(data.countm);
                                                    var ShopPrice = JSON.stringify(data.ShopPrice);
                                                    if (data.retcode == 1) {
                                                        if (this.state.head == "商品查询") {
                                                            this.props.navigator.push({
                                                                component: Shopsearch,
                                                                params: {
                                                                    ProdCode: rowData.ProdCode,
                                                                    DepCode: rowData.DepCode1,
                                                                }
                                                            })
                                                        } else {
                                                            if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                if (rowData.ShopNumber == 0) {
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: rowData.ProdName,
                                                                            ShopPrice: rowData.ShopPrice,
                                                                            Pid: rowData.Pid,
                                                                            countm: rowData.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: rowData.prototal,
                                                                            ProdCode: rowData.ProdCode,
                                                                            DepCode: rowData.DepCode1,
                                                                            SuppCode: rowData.SuppCode,
                                                                            ydcountm: countm,
                                                                            BarCode: rowData.BarCode,
                                                                            IsIntCount: row.IsIntCount
                                                                        }
                                                                    })
                                                                } else {
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: rowData.ProdName,
                                                                            ShopPrice: rowData.ShopPrice,
                                                                            Pid: rowData.Pid,
                                                                            countm: rowData.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: rowData.prototal,
                                                                            ProdCode: rowData.ProdCode,
                                                                            DepCode: rowData.DepCode1,
                                                                            SuppCode: rowData.SuppCode,
                                                                            ydcountm: countm,
                                                                            BarCode: rowData.BarCode,
                                                                            IsIntCount: row.IsIntCount
                                                                        }
                                                                    })
                                                                }
                                                            } else if (this.state.head == "售价调整") {
                                                                dbAdapter.selectShopInfoData(rowData.Pid).then((datas) => {
                                                                    if (datas.length == 0) {
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: rowData.ProdName,
                                                                                ShopPrice: rowData.ShopPrice,
                                                                                Pid: rowData.Pid,
                                                                                countm: rowData.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: rowData.prototal,
                                                                                ProdCode: rowData.ProdCode,
                                                                                DepCode: rowData.DepCode1,
                                                                                SuppCode: rowData.SuppCode,
                                                                                ydcountm: "",
                                                                                BarCode: rowData.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    } else {
                                                                        for (let i = 0; i < datas.length; i++) {
                                                                            var data = datas.item(i);
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: rowData.ProdName,
                                                                                    ShopPrice: rowData.ShopPrice,
                                                                                    Pid: rowData.Pid,
                                                                                    countm: rowData.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: rowData.prototal,
                                                                                    ProdCode: rowData.ProdCode,
                                                                                    DepCode: rowData.DepCode1,
                                                                                    SuppCode: rowData.SuppCode,
                                                                                    ydcountm: data.ydcountm,
                                                                                    BarCode: rowData.BarCode,
                                                                                    IsIntCount: row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                this.props.navigator.push({
                                                                    component: OrderDetails,
                                                                    params: {
                                                                        ProdName: rowData.ProdName,
                                                                        ShopPrice: rowData.ShopPrice,
                                                                        Pid: rowData.Pid,
                                                                        countm: rowData.ShopNumber,
                                                                        promemo: row.ShopRemark,
                                                                        prototal: rowData.prototal,
                                                                        ProdCode: rowData.ProdCode,
                                                                        DepCode: rowData.DepCode1,
                                                                        SuppCode: rowData.SuppCode,
                                                                        ydcountm: countm,
                                                                        BarCode: rowData.BarCode,
                                                                        IsIntCount: row.IsIntCount
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    } else {
                                                        alert(JSON.stringify(data))
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                                this._MoreShop();
                            }
                            DeviceEventEmitter.removeAllListeners();
                        }
                    }
                    else {
                        if (this.state.head == "移动销售") {
                            var shopnumber = 0;
                            var shopAmount = 0;
                            this.props.navigator.push({
                                component: OrderDetails,
                                params: {
                                    ProdName: rowData.ProdName,
                                    ShopPrice: row.ShopPrice,
                                    Pid: rowData.Pid,
                                    countm: rowData.ShopNumber,
                                    promemo: rowData.ShopRemark,
                                    prototal: rowData.ShopAmount,
                                    ProdCode: rowData.ProdCode,
                                    DepCode: rowData.DepCode1,
                                    SuppCode: rowData.SuppCode,
                                    ydcountm: "",
                                    BarCode: rowData.BarCode,
                                    IsIntCount: row.IsIntCount
                                }
                            })
                        }
                        else {
                            Storage.get('FormType').then((FormType) => {
                                Storage.get('LinkUrl').then((LinkUrl) => {
                                    Storage.get('Modify').then((Modify) => {
                                        Storage.get('userName').then((userName) => {
                                            let params = {
                                                reqCode: "App_PosReq",
                                                reqDetailCode: "App_Client_CurrProdQry",
                                                ClientCode: this.state.ClientCode,
                                                sDateTime: SfullTime,
                                                Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##"
                                                    + SfullTime + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode +"##" + sDateTime + "##" + "PosControlCs"
                                                username: userName,
                                                usercode: this.state.Usercode,
                                                SuppCode: rowData.SuppCode,
                                                ShopCode: this.state.ShopCode,
                                                ChildShopCode: this.state.ChildShopCode,
                                                ProdCode: rowData.ProdCode,
                                                OrgFormno: this.state.OrgFormno,
                                                FormType: FormType,
                                            };
                                            FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                var countm = JSON.stringify(data.countm);
                                                var ShopPrice = JSON.stringify(data.ShopPrice);
                                                if (data.retcode == 1) {
                                                    if (this.state.head == "商品查询") {
                                                        this.props.navigator.push({
                                                            component: Shopsearch,
                                                            params: {
                                                                ProdCode: rowData.ProdCode,
                                                                DepCode: rowData.DepCode1,
                                                            }
                                                        })
                                                    } else {
                                                        if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                            if (rowData.ShopNumber == 0) {
                                                                this.props.navigator.push({
                                                                    component: OrderDetails,
                                                                    params: {
                                                                        ProdName: rowData.ProdName,
                                                                        ShopPrice: rowData.ShopPrice,
                                                                        Pid: rowData.Pid,
                                                                        countm: rowData.ShopNumber,
                                                                        promemo: row.ShopRemark,
                                                                        prototal: rowData.prototal,
                                                                        ProdCode: rowData.ProdCode,
                                                                        DepCode: rowData.DepCode1,
                                                                        SuppCode: rowData.SuppCode,
                                                                        ydcountm: countm,
                                                                        BarCode: rowData.BarCode,
                                                                        IsIntCount: row.IsIntCount
                                                                    }
                                                                })
                                                            } else {
                                                                this.props.navigator.push({
                                                                    component: OrderDetails,
                                                                    params: {
                                                                        ProdName: rowData.ProdName,
                                                                        ShopPrice: rowData.ShopPrice,
                                                                        Pid: rowData.Pid,
                                                                        countm: rowData.ShopNumber,
                                                                        promemo: row.ShopRemark,
                                                                        prototal: rowData.prototal,
                                                                        ProdCode: rowData.ProdCode,
                                                                        DepCode: rowData.DepCode1,
                                                                        SuppCode: rowData.SuppCode,
                                                                        ydcountm: countm,
                                                                        BarCode: rowData.BarCode,
                                                                        IsIntCount: row.IsIntCount
                                                                    }
                                                                })
                                                            }
                                                        } else if (this.state.head == "售价调整") {
                                                            dbAdapter.selectShopInfoData(rowData.Pid).then((datas) => {
                                                                if (datas.length == 0) {
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: rowData.ProdName,
                                                                            ShopPrice: rowData.ShopPrice,
                                                                            Pid: rowData.Pid,
                                                                            countm: rowData.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: rowData.prototal,
                                                                            ProdCode: rowData.ProdCode,
                                                                            DepCode: rowData.DepCode1,
                                                                            SuppCode: rowData.SuppCode,
                                                                            ydcountm: "",
                                                                            BarCode: rowData.BarCode,
                                                                            IsIntCount: row.IsIntCount
                                                                        }
                                                                    })
                                                                } else {
                                                                    for (let i = 0; i < datas.length; i++) {
                                                                        var data = datas.item(i);
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: rowData.ProdName,
                                                                                ShopPrice: rowData.ShopPrice,
                                                                                Pid: rowData.Pid,
                                                                                countm: rowData.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: rowData.prototal,
                                                                                ProdCode: rowData.ProdCode,
                                                                                DepCode: rowData.DepCode1,
                                                                                SuppCode: rowData.SuppCode,
                                                                                ydcountm: data.ydcountm,
                                                                                BarCode: rowData.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            this.props.navigator.push({
                                                                component: OrderDetails,
                                                                params: {
                                                                    ProdName: rowData.ProdName,
                                                                    ShopPrice: rowData.ShopPrice,
                                                                    Pid: rowData.Pid,
                                                                    countm: rowData.ShopNumber,
                                                                    promemo: row.ShopRemark,
                                                                    prototal: rowData.prototal,
                                                                    ProdCode: rowData.ProdCode,
                                                                    DepCode: rowData.DepCode1,
                                                                    SuppCode: rowData.SuppCode,
                                                                    ydcountm: countm,
                                                                    BarCode: rowData.BarCode,
                                                                    IsIntCount: row.IsIntCount
                                                                }
                                                            })
                                                        }
                                                    }
                                                } else {
                                                    alert(JSON.stringify(data))
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        }
                        DeviceEventEmitter.removeAllListeners();
                        this._MoreShop();
                    }
                }
            })
        })
    }

    //商品查询
    OrderDetails(item) {
        var date = new Date();
        var getFullYear = date.getFullYear();
        var getMonth = date.getMonth() + 1;
        var getDate = date.getDate();
        var getHours = date.getHours();
        var getMinutes = date.getMinutes();
        var getSeconds = date.getSeconds();
        if (getMonth >= 0 && getMonth <= 9) {
            var getMonth = "0" + getMonth;
        }
        if (getDate >= 0 && getDate <= 9) {
            var getDate = "0" + getDate;
        }
        if (getHours >= 0 && getHours <= 9) {
            var getHours = "0" + getHours;
        }
        if (getMinutes >= 0 && getMinutes <= 9) {
            var getMinutes = "0" + getMinutes;
        }
        if (getSeconds >= 0 && getSeconds <= 9) {
            var getSeconds = "0" + getSeconds;
        }
        var SfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
        Storage.get('DepCode').then((DepCode) => {
            if (this.state.head == null) {
                this._Emptydata();
            } else {
                //商品查询
                dbAdapter.selectAidCode(item.item.ProdCode, 1).then((rows) => {
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                        Storage.delete('ShoppData');//删除 从清单点击商品类表 从修改数量点击回去 回到清单列表
                        if (DepCode !== null) {

                            if (this.state.saveDepCode!=''&&row.DepCode1 !== this.state.saveDepCode) {
                                ToastAndroid.show("请选择该品类下的商品", ToastAndroid.SHORT);
                                return;
                            } else {
                                if (this.state.head == "移动销售") {
                                    var shopnumber = 0;
                                    var shopAmount = 0;
                                    this.props.navigator.push({
                                        component: OrderDetails,
                                        params: {
                                            ProdName: item.item.ProdName,
                                            ShopPrice: row.ShopPrice,
                                            Pid: item.item.Pid,
                                            countm: item.item.ShopNumber,
                                            promemo: item.item.ShopRemark,
                                            prototal: item.item.ShopAmount,
                                            ProdCode: item.item.ProdCode,
                                            DepCode: item.item.DepCode1,
                                            SuppCode: item.item.SuppCode,
                                            ydcountm: "",
                                            BarCode: item.item.BarCode,
                                            IsIntCount: row.IsIntCount
                                        }
                                    })
                                } else {
                                    Storage.get('FormType').then((FormType) => {
                                        Storage.get('LinkUrl').then((LinkUrl) => {
                                            Storage.get('Modify').then((Modify) => {
                                                Storage.get('userName').then((userName) => {
                                                    let params = {
                                                        reqCode: "App_PosReq",
                                                        reqDetailCode: "App_Client_CurrProdQry",
                                                        ClientCode: this.state.ClientCode,
                                                        sDateTime: SfullTime,
                                                        Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##"
                                                            + SfullTime + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode +"##" + sDateTime + "##" + "PosControlCs"
                                                        username: userName,
                                                        usercode: this.state.Usercode,
                                                        SuppCode: item.item.SuppCode,
                                                        ShopCode: this.state.ShopCode,
                                                        ChildShopCode: this.state.ChildShopCode,
                                                        ProdCode: item.item.ProdCode,
                                                        OrgFormno: this.state.OrgFormno,
                                                        FormType: FormType,
                                                    };
                                                    FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                        var Countm = JSON.stringify(data.countm);
                                                        var ShopPrice = JSON.stringify(data.ShopPrice);
                                                        if (data.retcode == 1) {
                                                            if (this.state.head == "商品查询") {
                                                                this.props.navigator.push({
                                                                    component: Shopsearch,
                                                                    params: {
                                                                        ProdCode: item.item.ProdCode,
                                                                        DepCode: item.item.DepCode1,
                                                                    }
                                                                })
                                                            } else {
                                                                if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                    if (item.item.ShopNumber == 0) {
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: item.item.ProdName,
                                                                                ShopPrice: item.item.ShopPrice,
                                                                                Pid: item.item.Pid,
                                                                                countm: item.item.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: item.item.prototal,
                                                                                ProdCode: item.item.ProdCode,
                                                                                DepCode: item.item.DepCode1,
                                                                                SuppCode: item.item.SuppCode,
                                                                                ydcountm: Countm,
                                                                                BarCode: item.item.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    } else {
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: item.item.ProdName,
                                                                                ShopPrice: item.item.ShopPrice,
                                                                                Pid: item.item.Pid,
                                                                                countm: item.item.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: item.item.prototal,
                                                                                ProdCode: item.item.ProdCode,
                                                                                DepCode: item.item.DepCode1,
                                                                                SuppCode: item.item.SuppCode,
                                                                                ydcountm: Countm,
                                                                                BarCode: item.item.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    }

                                                                } else if (this.state.head == "售价调整") {
                                                                    dbAdapter.selectShopInfoData(item.item.Pid).then((datas) => {
                                                                        if (datas.length == 0) {
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: item.item.ProdName,
                                                                                    ShopPrice: item.item.ShopPrice,
                                                                                    Pid: item.item.Pid,
                                                                                    countm: item.item.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: item.item.prototal,
                                                                                    ProdCode: item.item.ProdCode,
                                                                                    DepCode: item.item.DepCode1,
                                                                                    SuppCode: item.item.SuppCode,
                                                                                    ydcountm: "",
                                                                                    BarCode: item.item.BarCode,
                                                                                    IsIntCount: row.IsIntCount
                                                                                }
                                                                            })
                                                                        } else {
                                                                            for (let i = 0; i < datas.length; i++) {
                                                                                var data = datas.item(i);
                                                                                this.props.navigator.push({
                                                                                    component: OrderDetails,
                                                                                    params: {
                                                                                        ProdName: item.item.ProdName,
                                                                                        ShopPrice: item.item.ShopPrice,
                                                                                        Pid: item.item.Pid,
                                                                                        countm: item.item.ShopNumber,
                                                                                        promemo: row.ShopRemark,
                                                                                        prototal: item.item.prototal,
                                                                                        ProdCode: item.item.ProdCode,
                                                                                        DepCode: item.item.DepCode1,
                                                                                        SuppCode: item.item.SuppCode,
                                                                                        ydcountm: Countm,
                                                                                        BarCode: item.item.BarCode,
                                                                                        IsIntCount: row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    })
                                                                } else {
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: item.item.ProdName,
                                                                            ShopPrice: item.item.ShopPrice,
                                                                            Pid: item.item.Pid,
                                                                            countm: item.item.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: item.item.prototal,
                                                                            ProdCode: item.item.ProdCode,
                                                                            DepCode: item.item.DepCode1,
                                                                            SuppCode: item.item.SuppCode,
                                                                            ydcountm: Countm,
                                                                            BarCode: item.item.BarCode,
                                                                            IsIntCount: row.IsIntCount
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        } else {
                                                            alert(JSON.stringify(data))
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                    })
                                }
                            }
                        }
                        else {
                            if (this.state.head == "移动销售") {
                                var shopnumber = 0;
                                var shopAmount = 0;
                                this.props.navigator.push({
                                    component: OrderDetails,
                                    params: {
                                        ProdName: item.item.ProdName,
                                        ShopPrice: row.ShopPrice,
                                        Pid: item.item.Pid,
                                        countm: item.item.ShopNumber,
                                        promemo: item.item.ShopRemark,
                                        prototal: item.item.ShopAmount,
                                        ProdCode: item.item.ProdCode,
                                        DepCode: item.item.DepCode1,
                                        SuppCode: item.item.SuppCode,
                                        ydcountm: "",
                                        BarCode: item.item.BarCode,
                                        IsIntCount: row.IsIntCount
                                    }
                                })
                            } else {
                                Storage.get('FormType').then((FormType) => {
                                    Storage.get('LinkUrl').then((LinkUrl) => {
                                        Storage.get('Modify').then((Modify) => {
                                            Storage.get('userName').then((userName) => {
                                                let params = {
                                                    reqCode: "App_PosReq",
                                                    reqDetailCode: "App_Client_CurrProdQry",
                                                    ClientCode: this.state.ClientCode,
                                                    sDateTime: SfullTime,
                                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##"
                                                        + SfullTime + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode +"##" + sDateTime + "##" + "PosControlCs"
                                                    username: userName,
                                                    usercode: this.state.Usercode,
                                                    SuppCode: item.item.SuppCode,
                                                    ShopCode: this.state.ShopCode,
                                                    ChildShopCode: this.state.ChildShopCode,
                                                    ProdCode: item.item.ProdCode,
                                                    OrgFormno: this.state.OrgFormno,
                                                    FormType: FormType,
                                                };
                                                FetchUtil.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                    var Countm = JSON.stringify(data.countm);
                                                    var ShopPrice = JSON.stringify(data.ShopPrice);
                                                    if (data.retcode == 1) {
                                                        if (this.state.head == "商品查询") {
                                                            this.props.navigator.push({
                                                                component: Shopsearch,
                                                                params: {
                                                                    ProdCode: item.item.ProdCode,
                                                                    DepCode: item.item.DepCode1,
                                                                }
                                                            })
                                                        } else {
                                                            if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                if (item.item.ShopNumber == 0) {
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: item.item.ProdName,
                                                                            ShopPrice: item.item.ShopPrice,
                                                                            Pid: item.item.Pid,
                                                                            countm: item.item.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: item.item.prototal,
                                                                            ProdCode: item.item.ProdCode,
                                                                            DepCode: item.item.DepCode1,
                                                                            SuppCode: item.item.SuppCode,
                                                                            ydcountm: Countm,
                                                                            BarCode: item.item.BarCode,
                                                                            IsIntCount: row.IsIntCount
                                                                        }
                                                                    })
                                                                } else {
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: item.item.ProdName,
                                                                            ShopPrice: item.item.ShopPrice,
                                                                            Pid: item.item.Pid,
                                                                            countm: item.item.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: item.item.prototal,
                                                                            ProdCode: item.item.ProdCode,
                                                                            DepCode: item.item.DepCode1,
                                                                            SuppCode: item.item.SuppCode,
                                                                            ydcountm: Countm,
                                                                            BarCode: item.item.BarCode,
                                                                            IsIntCount: row.IsIntCount
                                                                        }
                                                                    })
                                                                }
                                                            } else if (this.state.head == "售价调整") {
                                                                dbAdapter.selectShopInfoData(item.item.Pid).then((datas) => {
                                                                    if (datas.length == 0) {
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: item.item.ProdName,
                                                                                ShopPrice: item.item.ShopPrice,
                                                                                Pid: item.item.Pid,
                                                                                countm: item.item.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: item.item.prototal,
                                                                                ProdCode: item.item.ProdCode,
                                                                                DepCode: item.item.DepCode1,
                                                                                SuppCode: item.item.SuppCode,
                                                                                ydcountm: "",
                                                                                BarCode: item.item.BarCode,
                                                                                IsIntCount: row.IsIntCount
                                                                            }
                                                                        })
                                                                    } else {
                                                                        for (let i = 0; i < datas.length; i++) {
                                                                            var data = datas.item(i);
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: item.item.ProdName,
                                                                                    ShopPrice: item.item.ShopPrice,
                                                                                    Pid: item.item.Pid,
                                                                                    countm: item.item.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: item.item.prototal,
                                                                                    ProdCode: item.item.ProdCode,
                                                                                    DepCode: item.item.DepCode1,
                                                                                    SuppCode: item.item.SuppCode,
                                                                                    ydcountm: Countm,
                                                                                    BarCode: item.item.BarCode,
                                                                                    IsIntCount: row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                this.props.navigator.push({
                                                                    component: OrderDetails,
                                                                    params: {
                                                                        ProdName: item.item.ProdName,
                                                                        ShopPrice: item.item.ShopPrice,
                                                                        Pid: item.item.Pid,
                                                                        countm: item.item.ShopNumber,
                                                                        promemo: row.ShopRemark,
                                                                        prototal: item.item.prototal,
                                                                        ProdCode: item.item.ProdCode,
                                                                        DepCode: item.item.DepCode1,
                                                                        SuppCode: item.item.SuppCode,
                                                                        ydcountm: Countm,
                                                                        BarCode: item.item.BarCode,
                                                                        IsIntCount: row.IsIntCount
                                                                    }
                                                                })
                                                            }
                                                        }
                                                    } else {
                                                        alert(JSON.stringify(data))
                                                    }
                                                })
                                            })
                                        })
                                    })
                                })
                            }
                        }
                    }
                })
            }
        })
    }

    //单据功能分类
    ChuMo() {
        Storage.save("Disting", "0");
        Storage.get('Disting').then((tags) => {
            this.setState({
                Disting: tags,
            })
        })
        this.setState({
            pressStatus: 'pressin',
            PressStatus: '0',
        });
    }

    SaoMa() {
        Storage.save("Disting", "1");
        Storage.get('Disting').then((tags) => {
            this.setState({
                Disting: tags
            })
        })
        this.setState({
            PressStatus: 'Pressin',
            pressStatus: 0
        });
    }

    /**
     * 门店要货
     */
    YaoHuo() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            Storage.get('code').then((tags) => {
                dbAdapter.isYHPSXP(tags).then((rows) => {
                    if (rows.length >= 1) {
                        dbAdapter.selectUserRight(this.state.usercode, "K0801").then((rows) => {
                            if (rows == true) {
                                if (this.state.Disting == "0" || this.state.Disting == "1") {
                                    var nextRoute = {
                                        name: "门店要货",
                                        component: PinLei,//YHDan文件夹
                                        params: {
                                            invoice: "门店要货"
                                        }
                                    };
                                    this.props.navigator.push(nextRoute);
                                    this._setModalVisible();
                                    DeviceEventEmitter.removeAllListeners();
                                } else {
                                    this.Promp();
                                }
                            } else {
                                ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                                return;
                            }
                        })
                    } else {
                        this.Permissions()
                    }
                })
            });
        }
    }

    /**
     * 商品损溢
     */
    SunYi() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K0604").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "商品损溢",
                            component: SunYi,//app文件夹
                            params: {
                                invoice: "商品损溢"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        if (this.state.Disting == "1") {
                            DeviceEventEmitter.removeAllListeners();
                        }
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 实时盘点
     */
    SSPanDian() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K0611").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "实时盘点",
                            component: PinLei,//app文件夹
                            params: {
                                invoice: "实时盘点"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        DeviceEventEmitter.removeAllListeners();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 商品盘点
     */
    SPPanDian() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K0607").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "主页",
                            component: Query,//app文件夹
                            params: {
                                invoice: "商品盘点"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        DeviceEventEmitter.removeAllListeners();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }

    }

    /**
     * 配送收货
     */
    PSShouHuo() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            Storage.get('code').then((tags) => {
                dbAdapter.isYHPSXP(tags).then((rows) => {
                    if (rows.length >= 1) {
                        dbAdapter.selectUserRight(this.state.usercode, "K0802").then((rows) => {
                            if (rows == true) {
                                if (this.state.Disting == "0" || this.state.Disting == "1") {
                                    var nextRoute = {
                                        name: "主页",
                                        component: Distrition,//app文件夹
                                        params: {
                                            invoice: "配送收货"
                                        }
                                    };
                                    this.props.navigator.push(nextRoute);
                                    this._setModalVisible();
                                    DeviceEventEmitter.removeAllListeners();
                                } else {
                                    this.Promp();
                                }
                            } else {
                                ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                                return;
                            }
                        })
                    } else {
                        this.Permissions()
                    }
                })
            });
        }

    }

    /**
     * 商品采购
     */
    SPCaiGou() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            Storage.get('code').then((tags) => {
                dbAdapter.isCGYS(tags).then((rows) => {
                    if (rows.length >= 1) {
                        dbAdapter.selectUserRight(this.state.usercode, "K0504").then((rows) => {
                            if (rows == true) {
                                if (this.state.Disting == "0" || this.state.Disting == "1") {
                                    var nextRoute = {
                                        name: "主页",
                                        component: ProductCG,//app文件夹
                                        params: {
                                            invoice: "商品采购"
                                        }
                                    };
                                    this.props.navigator.push(nextRoute);
                                    this._setModalVisible();
                                    DeviceEventEmitter.removeAllListeners();
                                } else {
                                    this.Promp();
                                }
                            } else {
                                ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                                return;
                            }
                        })
                    } else {
                        this.Permissions2()
                    }
                })
            });
        }
    }

    /**
     * 商品验收
     */
    SPYanShou() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            Storage.get('code').then((tags) => {
                dbAdapter.isCGYS(tags).then((rows) => {
                    if (rows.length >= 1) {
                        dbAdapter.selectUserRight(this.state.usercode, "K0505").then((rows) => {
                            if (rows == true) {
                                if (this.state.Disting == "0" || this.state.Disting == "1") {
                                    var nextRoute = {
                                        name: "主页",
                                        component: ProductYS,//app文件夹
                                        params: {
                                            invoice: "商品验收"
                                        }
                                    };
                                    this.props.navigator.push(nextRoute);
                                    this._setModalVisible();
                                    DeviceEventEmitter.removeAllListeners();
                                } else {
                                    this.Promp();
                                }
                            } else {
                                ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                                return;
                            }
                        })
                    } else {
                        this.Permissions2()
                    }
                })
            });
        }
    }

    /**
     * 协配采购
     */
    XPCaiGou() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            Storage.get('code').then((tags) => {
                dbAdapter.isXPCG(tags).then((rows) => {
                    if (rows.length >= 1) {
                        dbAdapter.selectUserRight(this.state.usercode, "K0707").then((rows) => {
                            if (rows == true) {
                                if (this.state.Disting == "0" || this.state.Disting == "1") {
                                    var nextRoute = {
                                        name: "主页",
                                        component: ProductXP,//app文件夹
                                        params: {
                                            invoice: "协配采购"
                                        }
                                    };
                                    this.props.navigator.push(nextRoute);
                                    this._setModalVisible();
                                    if (this.state.Disting == "1") {
                                        DeviceEventEmitter.removeAllListeners();
                                    }
                                } else {
                                    this.Promp();
                                }
                            } else {
                                ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                                return;
                            }
                        })
                    } else {
                        this.Permissions1()
                    }
                })
            });
        }
    }

    /**
     * 协配收货
     */
    XPShouHuo() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            Storage.get('code').then((tags) => {
                dbAdapter.isYHPSXP(tags).then((rows) => {
                    if (rows.length >= 1) {
                        dbAdapter.selectUserRight(this.state.usercode, "K0803").then((rows) => {
                            if (rows == true) {
                                if (this.state.Disting == "0" || this.state.Disting == "1") {
                                    var nextRoute = {
                                        name: "主页",
                                        component: ProductSH,//app文件夹
                                        params: {
                                            invoice: "协配收货"
                                        }
                                    };
                                    this.props.navigator.push(nextRoute);
                                    this._setModalVisible();
                                    if (this.state.Disting == "1") {
                                        DeviceEventEmitter.removeAllListeners();
                                    }
                                } else {
                                    this.Promp();
                                }
                            } else {
                                ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                                return;
                            }
                        })
                    } else {
                        this.Permissions()
                    }
                })
            });

        }
    }

    /**
     * 商品配送
     */
    PSDan() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K0706").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "商品配送",
                            component: PSDan,//app文件夹
                            params: {
                                invoice: "商品配送"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        DeviceEventEmitter.removeAllListeners();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 标签采集
     */
    BQbutton() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K0216").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "标签采集",
                            component: PinLei,//YHDan文件夹
                            params: {
                                invoice: "标签采集"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        DeviceEventEmitter.removeAllListeners();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 移动销售 进行绑定功能
     */
    Sell() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            if(this.state.Disting == "0" || this.state.Disting == "1"){
                NativeModules.AndroidDeviceInfo.getIMEI((IMEI) => {
                    Storage.get('Bind').then((tags) => {
                        if (tags == "bindsucceed") {
                            Storage.get('ShopCode').then((ShopCode) => {
                                Storage.get('PosCode').then((PosCode) => {
                                    let params = {
                                        TblName: "ChkPosShopBind",
                                        ShopCode: ShopCode,
                                        PosCode: PosCode,
                                        BindMAC: "",
                                        SysGuid: IMEI,
                                    }
                                    Storage.get('LinkUrl').then((linkurl) => {
                                        FetchUtil.post(linkurl, JSON.stringify(params)).then((data) => {
                                            if (data.retcode == 1) {
                                                var nextRoute = {
                                                    name: "移动销售",
                                                    component: PinLei,//YHDan文件夹
                                                    params: {
                                                        invoice: "移动销售"
                                                    }
                                                };
                                                this.props.navigator.push(nextRoute);
                                                this._setModalVisible();
                                            } else {
                                                var nextRoute = {
                                                    name: "移动销售",
                                                    component: SellData,//Sell文件夹
                                                    params: {
                                                        invoice: "移动销售"
                                                    }
                                                };
                                                this.props.navigator.push(nextRoute);
                                                this._setModalVisible();
                                            }
                                        }, (err) => {
                                            alert("网络请求失败");
                                        })
                                    })
                                })
                            })
                        } else {
                            var nextRoute = {
                                name: "移动销售",
                                component: SellData,
                                params: {
                                    invoice: "移动销售"
                                }
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                        }
                    })
                })
            } else{
                this.Promp();
            }
        }
    }

    /**
     * 批发销售
     */
    WholeSale() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K1104").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "批发销售",
                            component: WholeSale,//WholeSale文件夹
                            params: {
                                invoice: "批发销售"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        DeviceEventEmitter.removeAllListeners();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 批发报价
     */
    Offer() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K1105").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "批发报价",
                            component: WholeSale,//WholeSale文件夹
                            params: {
                                invoice: "批发报价"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        DeviceEventEmitter.removeAllListeners();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 库存查询
     */
    StockEnquiries() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            var nextRoute = {
                name: "库存查询",
                component: StockEnquiries,//StockEnquiries文件夹
            };
            this.props.navigator.push(nextRoute);
            this._setModalVisible();
        }
    }

    /**
     * 商品查询
     */
    ShopSearch() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            Storage.delete('DepCode');
            Storage.delete('OrgFormno');
            Storage.delete('scode');
            Storage.delete('shildshop');
            Storage.delete('YuanDan');
            Storage.delete('Screen');
            Storage.delete('StateMent');
            Storage.delete('BQNumber');
            Storage.delete('YdCountm');
            Storage.delete('Modify');
            var invoice = "商品查询";
            this.setState({
                head: invoice,
            });
            this._setModalVisible();
            Storage.save('Name', '商品查询');

        }
    }

    /**
     * 要货查询
     */
    YHSearch() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K0706").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "要货查询",
                            component: YHSearch,//YHSearch文件夹
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 售价调整
     */
    PriceTZ() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            dbAdapter.selectUserRight(this.state.usercode, "K0601").then((rows) => {
                if (rows == true) {
                    if (this.state.Disting == "0" || this.state.Disting == "1") {
                        var nextRoute = {
                            name: "售价调整",
                            component: PinLei,//YHDan文件夹
                            params: {
                                invoice: "售价调整"
                            }
                        };
                        this.props.navigator.push(nextRoute);
                        this._setModalVisible();
                        DeviceEventEmitter.removeAllListeners();
                    } else {
                        this.Promp();
                    }
                } else {
                    ToastAndroid.show("没有权限", ToastAndroid.SHORT);
                    return;
                }
            })
        }
    }

    /**
     * 设置
     */
    AppSet() {
        var nextRoute = {
            name: "设置",
            component: Set,//AppSet文件夹
            params: {
                invoice: "设置"
            }
        };
        this.props.navigator.push(nextRoute);
        this._setModalVisible();
        DeviceEventEmitter.removeAllListeners();
    }

    /**
     * 退出
     */
    pullOut() {
        this._setModalVisible();
        if (this.state.shopcar > 0) {
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else {
            var nextRoute = {
                name: "主页",
                component: admin
            };
            this.props.navigator.push(nextRoute);
            Storage.delete('DepCode');
            Storage.delete('Name');
            Storage.delete('username');
            Storage.delete('history');
            Storage.delete('FirstTime1');
            Storage.delete("Disting");
            Storage.delete('BQNumber');
            Storage.delete('YdCountm');
            Storage.delete('Modify');
            Storage.delete('Radio');
            Storage.delete('SaoMa');
        }
    }

    pullOut1() {
        this._StateMent();
        if (this.state.shopcar > 0) {
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else {
            var nextRoute = {
                name: "主页",
                component: admin
            };
            this.props.navigator.push(nextRoute);
            Storage.delete('DepCode');
            Storage.delete('Name');
            Storage.delete('username');
            Storage.delete('history');
            Storage.delete('FirstTime1');
            Storage.delete("Disting");
            Storage.delete('BQNumber');
            Storage.delete('YdCountm');
            Storage.delete('Modify');
        }
    }

    UpData() {
        this.NewData();
        Storage.get('code').then((tags) => {
            Storage.get('LinkUrl').then((LinkUrl) => {
                updata.downLoadAllData(LinkUrl, dbAdapter, tags);
                this.NewData();
                this.DataComplete();
            })
        })
    }

    //报表(业务及收银)
    StateMent() {
        if (this.state.shopcar > 0) {
            this._setModalVisible();
            ToastAndroid.show("商品未提交", ToastAndroid.SHORT);
            return;
        } else if (this.state.username == null) {
            this._setModalVisible();
        } else {
            this._setModalVisible();
            this._StateMent();
            this.YeWu();
            Storage.save("StateMent", "0");
        }
    }

    YeWu() {
        Storage.save("Disting", "0");
        Storage.get('Disting').then((tags) => {
            this.setState({
                Disting: tags,
            })
        })
        this.setState({
            pressStatus: 'pressin',
            PressStatus: '0',
        });
    }

    ShouYin() {
        Storage.save("Disting", "1");
        Storage.get('Disting').then((tags) => {
            this.setState({
                Disting: tags
            })
        })
        this.setState({
            PressStatus: 'Pressin',
            pressStatus: 0
        });
        this._Receiving();
        this._StateMent();
    }

    YeWu1() {
        Storage.save("Disting", "0");
        Storage.get('Disting').then((tags) => {
            this.setState({
                Disting: tags,
            })
        })
        this.setState({
            pressStatus: 'pressin',
            PressStatus: '0',
        });
        this._StateMent();
        this._Receiving();
    }

    ShouYin1() {
        Storage.save("Disting", "1");
        Storage.get('Disting').then((tags) => {
            this.setState({
                Disting: tags
            })
        })
        this.setState({
            PressStatus: 'Pressin',
            pressStatus: 0
        });
    }

    YaoHuo1() {
        Storage.get('code').then((tags) => {
            dbAdapter.isYHPSXP(tags).then((rows) => {
                if (rows.length >= 1) {
                    this._StateMent();
                    var nextRoute = {
                        name: "HistoricalDocument",
                        component: HistoricalDocument
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete('Name');
                    Storage.save('name', '门店要货');
                    Storage.save('history', 'App_Client_ProYHQ');
                    Storage.save('historyClass', 'App_Client_ProYHDetailQ');
                } else {
                    this.Permissions()
                }
            })
        })
    }

    SunYi1() {
        this._StateMent();
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute);
        Storage.delete('Name');
        Storage.save('name', '商品损溢');
        Storage.save('history', 'App_Client_ProSYQ');
        Storage.save('historyClass', 'App_Client_ProSYDetailQ');
    }

    SSPanDian1() {
        this._StateMent();
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute);
        Storage.delete('Name');
        Storage.save('name', '实时盘点');
        Storage.save('history', 'App_Client_ProCurrPCQ');
        Storage.save('historyClass', 'App_Client_ProCurrPCDetailQ');
    }

    SPPanDian1() {
        this._StateMent();
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute);
        Storage.delete('Name');
        Storage.save('name', '商品盘点');
        Storage.save('history', 'App_Client_ProPCQ');
        Storage.save('historyClass', 'App_Client_ProPCDetailQ');
    }

    PSShouHuo1() {
        Storage.get('code').then((tags) => {
            dbAdapter.isYHPSXP(tags).then((rows) => {
                if (rows.length >= 1) {
                    this._StateMent();
                    var nextRoute = {
                        name: "HistoricalDocument",
                        component: HistoricalDocument
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete('Name');
                    Storage.save('name', '配送收货');
                    Storage.save('history', 'App_Client_ProPSSHQ');
                    Storage.save('historyClass', 'App_Client_ProPSSHDetailQ');
                } else {
                    this.Permissions()
                }
            })
        })
    }

    SPCaiGou1() {
        Storage.get('code').then((tags) => {
            dbAdapter.isCGYS(tags).then((rows) => {
                if (rows.length >= 1) {
                    this._StateMent();
                    var nextRoute = {
                        name: "HistoricalDocument",
                        component: HistoricalDocument
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete('Name');
                    Storage.save('name', '商品采购');
                    Storage.save('history', 'App_Client_ProCGQ');
                    Storage.save('historyClass', 'App_Client_ProCGDetailQ');
                } else {
                    this.Permissions2()
                }
            })
        });
    }

    SPYanShou1() {
        Storage.get('code').then((tags) => {
            dbAdapter.isCGYS(tags).then((rows) => {
                if (rows.length >= 1) {
                    this._StateMent();
                    var nextRoute = {
                        name: "HistoricalDocument",
                        component: HistoricalDocument
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete('Name');
                    Storage.save('name', '商品验收');
                    Storage.save('history', 'App_Client_ProYSQ');
                    Storage.save('historyClass', 'App_Client_ProYSDetailQ');
                } else {
                    this.Permissions2()
                }
            })
        });

    }

    XPCaiGou1() {
        Storage.get('code').then((tags) => {
            dbAdapter.isXPCG(tags).then((rows) => {
                if (rows.length >= 1) {
                    this._StateMent();
                    var nextRoute = {
                        name: "HistoricalDocument",
                        component: HistoricalDocument
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete('Name');
                    Storage.save('name', '协配采购');
                    Storage.save('history', 'App_Client_ProXPCGQ');
                    Storage.save('historyClass', 'App_Client_ProXPCGDetailQ');
                } else {
                    this.Permissions1()
                }
            })
        })
    }

    XPShouHuo1() {
        Storage.get('code').then((tags) => {
            dbAdapter.isYHPSXP(tags).then((rows) => {
                if (rows.length >= 1) {
                    this._StateMent();
                    var nextRoute = {
                        name: "HistoricalDocument",
                        component: HistoricalDocument
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete('Name');
                    Storage.save('name', '协配收货');
                    Storage.save('history', 'App_Client_ProXPYSQ');
                    Storage.save('historyClass', 'App_Client_ProXPYSDetailQ');
                } else {
                    this.Permissions()
                }
            })
        })
    }

    PSDan1() {
        this._StateMent();
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute);
        Storage.delete('Name');
        Storage.save('name', '商品配送');
        Storage.save('history', 'App_Client_ProPSQ');
        Storage.save('historyClass', 'App_Client_ProPSDetailQ');
    }

    Sell1() {
        NativeModules.AndroidDeviceInfo.getIMEI((IMEI) => {
            Storage.get('Bind').then((tags) => {
                if (tags == "bindsucceed") {
                    Storage.get('ShopCode').then((ShopCode) => {
                        Storage.get('PosCode').then((PosCode) => {
                            let params = {
                                TblName: "ChkPosShopBind",
                                ShopCode: ShopCode,
                                PosCode: PosCode,
                                BindMAC: "",
                                SysGuid: IMEI,
                            }
                            Storage.get('LinkUrl').then((linkurl) => {
                                FetchUtil.post(linkurl, JSON.stringify(params)).then((data) => {
                                    if (data.retcode == 1) {
                                        this._StateMent();
                                        var nextRoute = {
                                            name: "SellDan",
                                            component: SellDan
                                        };
                                        this.props.navigator.push(nextRoute);
                                        Storage.delete('Name');
                                        Storage.save('name', '移动销售');
                                    } else {
                                        var nextRoute = {
                                            name: "移动销售",
                                            component: SellData,
                                            params: {
                                                invoice: "移动销售",
                                                Sell1: "1",
                                            }
                                        };
                                        this.props.navigator.push(nextRoute);
                                        this._StateMent();
                                    }
                                }, (err) => {
                                    alert("网络请求失败");
                                })
                            })
                        })
                    })
                } else {
                    var nextRoute = {
                        name: "移动销售",
                        component: SellData,
                        params: {
                            invoice: "移动销售",
                            Sell1: "1",
                        }
                    };
                    this.props.navigator.push(nextRoute);
                    Storage.delete('Name');
                    Storage.save('name', '移动销售');
                    this._StateMent();
                }
            })
        })
    }

    WholeSale1() {
        this._StateMent();
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute);
        Storage.delete('Name');
        Storage.save('name', '批发销售');
        Storage.save('valueOf', 'App_Client_ProWXH');
        Storage.save('history', 'App_Client_ProWXHQ');
        Storage.save('historyClass', 'App_Client_ProWXHDetailQ');
    }

    Offer1() {
        this._StateMent();
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute);
        Storage.delete('Name');
        Storage.save('name', '批发报价');
        Storage.save('valueOf', 'App_Client_ProWBH');
        Storage.save('history', 'App_Client_ProWBHQ');
        Storage.save('historyClass', 'App_Client_ProWBHDetailQ');
    }

    PriceTZ1() {
        this._StateMent();
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute);
        Storage.delete('Name');
        Storage.save('name', '售价调整');
        Storage.save('valueOf', 'App_Client_ProTJ');//门店要货提交
        Storage.save('history', 'App_Client_ProTJQ');//门店要货查询
        Storage.save('historyClass', 'App_Client_ProTJDetailQ');//门店要货明细查询
    }

    //FlatList加入kay值
    keyExtractor(item: Object, index: number) {
        return item.ProdName//FlatList使用json中的ProdName动态绑定key
    }

    //FlatList翻页刷新列表
    _onload() {
        if (this.state.isloading) {
            return true
        }
        page = page + 1;
        this.setState({
            nomore: true,
            isloading: true
        });
        if (this.state.depcode != lastDepCode) {
            page = 1;
        }
        let priductData = [];
        if (totalPage > 1 && page < totalPage) {
            dbAdapter.selectProduct(this.state.depcode, page, 1).then((rows) => {
                for (let i = 0; i < rows.length; i++) {
                    var row = rows.item(i);
                    priductData.push(row);
                }
                ;
                if (this.state.depcode != lastDepCode) {
                    this.productData.splice(0, this.productData.length);
                    lastDepCode = this.state.depcode;
                }
                this.productData = this.productData.concat(priductData);
                this.setState({
                    data: this.productData,
                    isloading: false
                });
            });

        } else {
            this.setState({
                nomore: false,
            });
        }
    }

    //弹层
    //单据弹层
    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }

    _StateMent() {
        let isShow = this.state.statement;
        this.setState({
            statement: !isShow,
        });
    }

    _Receiving() {
        let isShow = this.state.receiving;
        this.setState({
            receiving: !isShow,
        });
    }

    //未选择单据时
    _Emptydata() {
        let isShow = this.state.emptydata;
        this.setState({
            emptydata: !isShow,
        });
    }

    Emptydata() {
        this._Emptydata();
    }

    //用户模式选择
    Promp() {
        let isShow = this.state.Promp;
        this.setState({
            Promp: !isShow,
        });
    }

    Mode() {
        this.Promp()
    }

    Promp1() {
        let isShow = this.state.Promp1;
        this.setState({
            Promp1: !isShow,
        });
    }

    Mode1() {
        this.Promp1()
    }

    //单据权限弹层
    Permissions() {
        let isShow = this.state.Permissions;
        this.setState({
            Permissions: !isShow,
        });
    }

    MoDe() {
        this.Permissions()
    }

    Permissions1() {
        let isShow = this.state.Permissions1;
        this.setState({
            Permissions1: !isShow,
        });
    }

    MoDe1() {
        this.Permissions1()
    }

    Permissions2() {
        let isShow = this.state.Permissions2;
        this.setState({
            Permissions2: !isShow,
        });
    }

    MoDe2() {
        this.Permissions2()
    }

    _MoreShop() {
        let isShow = this.state.MoreShop;
        this.setState({
            MoreShop: !isShow,
        });
    }

    CloseShopList() {
        this._MoreShop();
    }

    //数据更新
    NewData() {
        let isshow = this.state.NewData;
        this.setState({
            NewData: !isshow,
        });
    }

    DataComplete() {
        let isshow = this.state.DataComplete;
        this.setState({
            DataComplete: !isshow,
        });
    }

    Datacomplete() {
        this.DataComplete();
        this._setModalVisible();
    }

    //单据弹层结束

    /**
     * 返回上一级
     * @returns {XML}
     */
    Return() {
        this._StateMent();
    }

    render() {
        const {data} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this._rightButtonClick.bind(this)}>
                            <Image source={require("../images/1_12.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>{this.state.head}</Text>
                        <TouchableOpacity onPress={this.Code.bind(this)} style={styles.onclick}>
                            <Image source={require("../images/1_05.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.pressPush.bind(this)} style={styles.onclick}>
                            <Image source={require("../images/1_08.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.ContList}>
                    <ListView
                        style={styles.scrollview}
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={true}
                        renderRow={this._renderRow.bind(this)}
                    />
                    <View style={styles.RightList1}>
                        <FlatList
                            numColumns={3}
                            key={item => item.Pid}
                            style={styles.ScrollView1}
                            renderItem={this._renderItem.bind(this)}
                            ItemSeparatorComponent={this._separator.bind(this)}
                            ListFooterComponent={this._createEmptyView()}
                            data={data}
                            keyExtractor={this.keyExtractor}
                            onRefresh={this.refreshing}
                            refreshing={false}
                            onEndReachedThreshold={0.1}
                            onEndReached={() => {
                                this._onload()
                            }}
                            getItemLayout={(data, index) => (
                                // 120 是被渲染 item 的高度 ITEM_HEIGHT。
                                {length: 120, offset: 120 * index, index}
                            )}
                        />
                    </View>
                </View>

                {
                    (this.state.head == "商品查询") ?
                        null :
                        <View style={styles.footer}>
                            <TouchableOpacity style={styles.Home} onPress={this.History.bind(this)}>
                                <Image source={require("../images/1_300.png")}></Image>
                                <Text style={styles.home1}>历史单据查询</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Home}>
                                <Image source={require("../images/1_31.png")}></Image>
                                <Text style={styles.home2}>商品</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Home} onPress={this.ShopList.bind(this)}>
                                <View>
                                    <Image source={require("../images/1_322.png")}>
                                        {
                                            (this.state.shopcar == 0) ?
                                                null :
                                                <Text style={[{position: "absolute", right: -200,}]}>
                                                    {this.state.shopcar}</Text>
                                        }
                                        {
                                            (this.state.shopcar > 0) ?
                                                <Text style={[styles.ShopCar, {paddingTop: 3,}]}>
                                                    {this.state.shopcar}</Text> : null
                                        }
                                        {
                                            (this.state.shopcar < 999) ?
                                                null :
                                                <Text style={[styles.ShopCar,
                                                    {
                                                        width: 30,
                                                        height: 30,
                                                        top: 11,
                                                        lineHeight: 21,
                                                    }]}>{this.state.shopcar}</Text>
                                        }
                                        {
                                            (this.state.shopcar > 999) ?
                                                <View>
                                                    <Text style={[styles.ShopCar,
                                                        {
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
                }

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <ScrollView style={styles.modalStyle}>
                        <View style={styles.ModalTitle}>
                            <TouchableOpacity style={styles.ModalLeft} onPress={this.ChuMo.bind(this)}>
                                <View>
                                    <Image
                                        source={this.state.pressStatus == 'pressin' ? require("../images/1_42.png") : require("../images/1_43.png")}/>
                                </View>
                                <View>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_39.png")}/>
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        触摸
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.ModalLeft1}>
                                <Image source={require("../images/1_47.png")}/>
                            </View>
                            <TouchableOpacity style={styles.ModalLeft} onPress={this.SaoMa.bind(this)}>
                                <View style={[{marginLeft: 14}]}>
                                    <Image
                                        source={this.state.PressStatus == 'Pressin' ? require("../images/1_42.png") : require("../images/1_43.png")}/>
                                </View>
                                <View>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_41.png")}/>
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        扫码
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ModalCont}>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.YaoHuo.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_25.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        门店要货
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.PSShouHuo.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_28.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        配送收货
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress={this.SSPanDian.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_29.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        实时盘点
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine}/>
                            </View>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.SPPanDian.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_36.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品盘点
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.SunYi.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_38.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品损溢
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress={this.SPCaiGou.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_40.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品采购
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine}/>
                            </View>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.SPYanShou.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_44.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品验收
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.XPCaiGou.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_45.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        协配采购
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress={this.XPShouHuo.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_46.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        协配收货
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine}/>
                            </View>
                            <View style={[styles.ModalHead, {marginBottom: 10}]}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.PSDan.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_62.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品配送
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.PriceTZ.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_58.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        售价调整
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.ModalHeadImage}
                                    onPress={this.BQbutton.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_60.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        标签采集
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine}/>
                            </View>
                            <View style={[styles.ModalHead, {marginBottom: 10}]}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.Sell.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_57.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        移动销售
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.Offer.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_16.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        批发报价
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.ModalHeadImage}
                                    onPress={this.WholeSale.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_57.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        批发销售
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine}/>
                            </View>
                            <View style={[styles.ModalHead, {marginBottom: 10}]}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.ShopSearch.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_61.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品查询
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.StockEnquiries.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_61.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        库存查询
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.ModalHeadImage}
                                    onPress={this.YHSearch.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_61.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        要货查询
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine}/>
                            </View>
                            <View style={[styles.ModalHead, {marginBottom: 10}]}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.StateMent.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1-60.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        单据报表
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.AppSet.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_50.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        设置
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.ModalHeadImage}
                                    onPress={this.pullOut.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_56.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        退出账号
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine}/>
                            </View>
                            <View style={[styles.ModalHead, {marginBottom: 10}]}>
                                <TouchableOpacity
                                    onPress={this.UpData.bind(this)}
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_59.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        数据更新
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage}></TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage}></TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal
                    animationType='fade'//业务
                    transparent={true}
                    visible={this.state.statement}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <ScrollView style={styles.modalStyle}>
                        <View style={styles.ModalTitle}>
                            <TouchableOpacity style={styles.ModalLeft} onPress={this.YeWu.bind
                            (this)}>
                                <View>
                                    <Image source={this.state.pressStatus == 'pressin' ? require
                                    ("../images/1_42.png") : require("../images/1_43.png")}/>
                                </View>
                                <View>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_39.png")}/>
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        业务
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.ModalLeft1}>
                                <Image source={require("../images/1_47.png")}/>
                            </View>
                            <TouchableOpacity style={styles.ModalLeft} onPress={this.ShouYin.bind
                            (this)}>
                                <View style={[{marginLeft: 14}]}>
                                    <Image source={this.state.PressStatus == 'Pressin' ? require
                                    ("../images/1_42.png") : require("../images/1_43.png")}/>
                                </View>
                                <View>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_41.png")}/>
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        收银
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ModalCont}>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity style={[styles.ModalHeadImage,
                                    {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                                  onPress={this.YaoHuo1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_25.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        门店要货
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ModalHeadImage,
                                    {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                                  onPress={this.PSShouHuo1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_28.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        配送收货
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress=
                                    {this.SSPanDian1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_29.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        实时盘点
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style=
                                    {styles.ModalImageLine}/>
                            </View>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity style={[styles.ModalHeadImage,
                                    {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                                  onPress={this.SPPanDian1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_36.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品盘点
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ModalHeadImage,
                                    {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                                  onPress={this.SunYi1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_38.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品损溢
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress=
                                    {this.SPCaiGou1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_40.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品采购
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style=
                                    {styles.ModalImageLine}/>
                            </View>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity style={[styles.ModalHeadImage,
                                    {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                                  onPress={this.SPYanShou1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_44.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品验收
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ModalHeadImage,
                                    {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                                  onPress={this.XPCaiGou1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_45.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        协配采购
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress=
                                    {this.XPShouHuo1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_46.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        协配收货
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style=
                                    {styles.ModalImageLine}/>
                            </View>
                            <View style={[styles.ModalHead, {marginBottom: 10}]}>
                                <TouchableOpacity style={[styles.ModalHeadImage,
                                    {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                                  onPress={this.PSDan1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_45.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品配送
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.PriceTZ1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_58.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        售价调整
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.Sell1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_57.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        移动销售
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style=
                                    {styles.ModalImageLine}/>
                            </View>
                            <View style={[styles.ModalHead, {marginBottom: 10}]}>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.Offer1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_16.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        批发报价
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.ModalHeadImage, {borderRightWidth: 1, borderRightColor: "#f2f2f2"}]}
                                    onPress={this.WholeSale1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_16.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        批发销售
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage}
                                                  onPress={this.pullOut1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_56.png")}/>
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        退出账号
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={styles.return} onPress={this.Return.bind(this)}>
                                <Text style={styles.text}>返回</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal
                    animationType='fade'//收银
                    transparent={true}
                    visible={this.state.receiving}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <ScrollView style={styles.modalStyle}>
                        <View style={styles.ModalTitle}>
                            <TouchableOpacity style={styles.ModalLeft} onPress={this.YeWu1.bind(this)}>
                                <View>
                                    <Image
                                        source={this.state.pressStatus == 'pressin' ? require("../images/1_42.png") : require("../images/1_43.png")}/>
                                </View>
                                <View>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_39.png")}/>
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        业务
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.ModalLeft1}>
                                <Image source={require("../images/1_47.png")}/>
                            </View>
                            <TouchableOpacity style={styles.ModalLeft} onPress={this.ShouYin1.bind
                            (this)}>
                                <View style={[{marginLeft: 14}]}>
                                    <Image source={this.state.PressStatus == 'Pressin' ? require
                                    ("../images/1_42.png") : require("../images/1_43.png")}/>
                                </View>
                                <View>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_41.png")}/>
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        收银
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ModalCont}>
                            <View style={styles.ModalHead}>
                                <Text>
                                    敬请期待~~~
                                </Text>
                            </View>

                        </View>
                    </ScrollView>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.emptydata}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")}
                           style={[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    请选择单据
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.Emptydata.bind(this)} style={styles.Button}>
                                <Text style={[styles.ModalTitleText, {color: "#ffffff"}]}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.Promp}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")}
                           style={[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    请选择用户模式
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.Mode.bind(this)} style={styles.Button}>
                                <Text style={[styles.ModalTitleText, {color: "#ffffff"}]}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.Promp1}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")} style=
                        {[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    请将模式改为触摸
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.Mode1.bind(this)} style=
                                {styles.Button}>
                                <Text style={[styles.ModalTitleText, {color: "#ffffff"}]}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.Permissions}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")}
                           style={[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    没有配送机构,不能进行该业务
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.MoDe.bind(this)} style={styles.Button}>
                                <Text style={[styles.ModalTitleText, {color: "#ffffff"}]}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.Permissions1}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")} style=
                        {[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    该店不是配送中心,不能进行该业务
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.MoDe1.bind(this)} style=
                                {styles.Button}>
                                <Text style={[styles.ModalTitleText, {color: "#ffffff"}]}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.Permissions2}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")} style=
                        {[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    该机构没有采购权
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.MoDe2.bind(this)} style={styles.Button}>
                                <Text style={[styles.ModalTitleText, {color: "#ffffff"}]}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.NewData}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.LoadCenter}>
                        <View style={styles.loading}>
                            <ActivityIndicator key="1" color="#ffffff" size="large"
                                               style={styles.activity}></ActivityIndicator>
                            <Text style={styles.TextLoading}>更新数据中...</Text>
                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.DataComplete}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")}
                           style={[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    数据更新完毕
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.Datacomplete.bind(this)} style={styles.Button}>
                                <Text style={[styles.ModalTitleText, {color: "#ffffff"}]}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>

                <Modal
                    transparent={true}
                    visible={this.state.MoreShop}//一品多码弹层
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <Image source={require("../images/background.png")}
                           style={[styles.ModalStyle, {justifyContent: 'center', alignItems: 'center',}]}>
                        <View style={styles.Cont}>
                            <View style={styles.BouncesTitle}>
                                <Text style={[styles.TitleText, {fontSize: 18}]}>商品列表</Text>
                                <TouchableOpacity onPress={this.CloseShopList.bind(this)} style={styles.closeImage}>
                                    <Image source={require("../images/2_02.png")}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ShopName}>
                                <Text style={styles.ShopHead}>商品编码</Text>
                                <Text style={styles.ShopHead}>商品名称</Text>
                                <Text style={styles.ShopHead}>零售价</Text>
                            </View>
                            <ListView
                                style={styles.ShopData}
                                dataSource={this.state.ShopData}
                                showsVerticalScrollIndicator={true}
                                renderRow={this._ShopDataRow.bind(this)}
                            />
                        </View>
                    </Image>
                </Modal>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    Cont: {
        width: 280,
        borderRadius: 5,
        paddingBottom: 20,
        backgroundColor: "#ffffff",
    },
    BouncesTitle: {
        paddingTop: 13,
        paddingBottom: 13,
        backgroundColor: "#ff4e4e",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        flexDirection: 'row',
    },
    TitleText: {
        flex: 1,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 16,
    },
    ShopName: {
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        backgroundColor: "#e3e3e3"
    },
    ShopList1: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        flexDirection: "row",
    },
    ShopHead: {
        flex: 1,
        color: "#333333",
        textAlign: "center",
    },
    ShopData: {
        height: 220,
    },
    closeImage: {
        position: "absolute",
        right: 15,
        top: 6,
        paddingLeft: 5,
        paddingRight: 5,
    },

    return: {
        flex: 1,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 10,
        marginLeft: 30,
        marginRight: 30,
        backgroundColor: "#ff4e4e",
        borderRadius: 5,
    },
    text: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    login: {
        marginLeft: 60,
        marginRight: 60,
        marginTop: 40,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: "#f47882",
        color: "#ffffff",
        borderRadius: 3,
        textAlign: "center",
        fontSize: 20,
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
    onclick: {
        marginLeft: 18,
    },
    HeaderImage1: {
        marginRight: 25,
        marginTop: 5,
    },
    HeaderList: {
        flex: 6,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 22,
        marginTop: 3,
    },
    scrollview: {
        width: 130,
        backgroundColor: "#ffffff",
        flex: 2,
    },
    Active: {
        color: "#333333",
        textAlign: "center",
        fontSize: 16,
        height: 22,
        overflow: "hidden",
    },
    click: {
        borderTopWidth: 1,
        borderTopColor: "#f2f2f2",
        borderRightColor: "#f2f2f2",
        borderRightWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
    },
    clickes: {
        borderTopWidth: 1,
        borderTopColor: "#f2f2f2",
        borderRightColor: "#f2f2f2",
        borderRightWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#f2f2f2"
    },
    RightList: {
        paddingLeft: 15,
        paddingRight: 15,
        flex: 4,
        backgroundColor: "#ffffff",
    },
    RightList1: {
        flex: 4,
    },
    ScrollView1: {
        flex: 1,
        backgroundColor: "#ffffff",
        marginLeft: 5,
    },
    ContList: {
        flex: 22,
        flexDirection: "row",
    },
    Image: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    Text: {
        textAlign: "center",
        marginTop: 10,
        height: 20,
        fontSize: 14,
        color: "#333333"
    },
    AddNumber: {
        height: 30,
    },
    addnumber: {
        height: 20,
        position: 'absolute',
        right: 5,
        top: 3,
    },
    Reduction1: {
        color: "red",
        position: 'absolute',
        right: 4,
        top: 4,
        fontSize: 14,
    },
    subtraction: {
        marginRight: 10,
        marginTop: 2
    },
    Subtraction: {
        position: 'absolute',
        right: 5,
        top: 12,
        flexDirection: "row",
    },
    Reduction: {
        borderRadius: 50,
        backgroundColor: "red",
        color: "#ffffff",
        textAlign: "center",
        width: 15,
        height: 15,
        lineHeight: 12,
        fontSize: 18
    },
    Number: {
        color: "red",
        marginRight: 6,
    },
    Border: {
        borderRightWidth: 1,
        borderRightColor: "#f2f2f2",
        flex: 3,
        paddingBottom: 30,
    },
    fontColorGray: {
        textAlign: "center"
    },
    nomore: {
        textAlign: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    License: {
        flex: 1,
        backgroundColor: "#333333",
        opacity: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    LicenseConter: {
        width: 280,
        backgroundColor: "#ffffff",
        borderRadius: 5,
        paddingHorizontal: 50,
        paddingVertical: 20,
    },
    LicenseText: {
        fontSize: 16,
        color: "#323232",
        marginLeft: 40,
    },
    LicenseTextInput: {
        width: 178,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 16,
        marginBottom: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: "#cccccc",
        borderBottomColor: "#cccccc",
        borderLeftColor: "#cccccc",
        borderRightColor: "#cccccc",
    },
    Determine: {
        width: 80,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: "#f47882",
        borderRadius: 3,
        marginLeft: 48
    },
    DetermineText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center"
    },
    close: {
        width: 40,
        height: 40,
        position: "absolute",
        right: 0,
        top: 5
    },
    CloseText: {
        color: "#323232",
        fontSize: 22
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
    modalStyle: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    ModalTitle: {
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 14,
        paddingRight: 14,
        flexDirection: "row",
        backgroundColor: "#ff4e4f"
    },
    ModalLeft: {
        flex: 1,
    },
    ModalLeft1: {
        width: 2,
        marginTop: 14,
    },
    ModalImage: {
        textAlign: "center"
    },
    ModalText: {
        marginTop: 16,
        fontSize: 20,
        color: "#ffffff",
        textAlign: "center"
    },
    ModalCont: {
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 14,
        paddingRight: 14,
    },
    ModalHead: {
        flexDirection: "row"
    },
    ModalHeadImage: {
        flex: 1,
        paddingBottom: 10,
    },
    ModalHeadImage1: {
        textAlign: "center",
        marginTop: 10,
    },
    ModalHeadText: {
        textAlign: "center",
        fontSize: 18,
        color: "#666666",
        marginTop: 5,
    },
    ModalLine: {
        height: 2,
    },
    ModalImageLine: {
        width: null,
    },
    ModalStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    ModalStyleCont: {
        height: 165,
        paddingTop: 25,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    ModalStyleTitle: {
        paddingLeft: 88,
        paddingRight: 88,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
    },
    ModalTitleText: {
        fontSize: 16,
        color: "#ff4e4e",
        textAlign: "center",
    },
    Button: {
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "#ff4e4e",
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
});