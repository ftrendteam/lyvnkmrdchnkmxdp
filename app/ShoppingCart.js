/**
 * 提交清单
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    ListView,
    TextInput,
    Navigator,
    Dimensions,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    ActivityIndicator,
    TouchableHighlight,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';

import Index from "./Index";
import HistoricalDocument from "./HistoricalDocument";
import Search from "./Search";
import OrderDetails from "./OrderDetails";
import SunYi from "./SunYi";
import Query from "./Query";
import Distrition from "./Distrition";
import ProductCG from "./ProductCG";
import ProductYS from "./ProductYS";
import ProductXP from "./ProductXP";
import ProductSH from "./ProductSH";
import PSDan from "../PSDan/PSDan";//商品配送
import PinLei from "../YHDan/PinLei";//要货单第二分页
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";
import NumberUtils from "../utils/NumberUtils";
import BigDecimalUtils from "../utils/BigDecimalUtils";
import SideMenu from 'react-native-side-menu';
import { SwipeListView } from 'react-native-swipe-list-view';

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let decodepreprint = new DeCodePrePrint18();
let db;

export default class ShoppingCart extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            Show:false,
            ScreenBod:false,
            Succeed:false,
            Wait:false,
            DeleteData:false,
            ShopNumber:"",
            ShopAmount:"",
            reqDetailCode:"",
            Remark:"",
            suppcode:"",
            shildshop:"",
            IMEI:"",
            ProYH:"",
            Date:"",
            active:"",
            ClientCode:"",
            Usercode:"",
            SuppCode:"",
            ShopCode:"",
            ChildShopCode:"",
            OrgFormno:"",
            FormType:"",
            LinkUrl:"",
            SUbmit:"",
            BeiZhu:"",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
            ds:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
        this.ds = [];
        this.rows=[];
        this.DataShop=[];
    }

    //自动跑接口
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this._dpSearch();
            this._fetch();
            this.Storage();
            this.Device();
        });

        Storage.get('Name').then((tags)=>{
            this.setState({
                Name:tags
            })
        })
    }

    _dpSearch(){
        //取出保存本地的数据  'valueOf'是保存的时候自己定义的参数   tags就是保存的那个值
        //在一进来页面就取出来，就不会出现第一次点击为 空值
        Storage.delete("ShoppData");
        Storage.get('valueOf').then((tags) => {
            this.setState({
                reqDetailCode: tags
            })
        });

        //username获取
        Storage.get('username').then((tags) => {
            this.setState({
                Username: tags
            });
        });

        //usercode获取
        Storage.get('userpwd').then((tags) => {
            this.setState({
                Userpwd: tags
            });
        });

        Storage.get('IMEI').then((tags) => {
            this.setState({
                IMEI:tags
            })
        })

        Storage.get('ProYH').then((tags) => {
            this.setState({
                ProYH:tags
            })
        })

        Storage.get('Date').then((tags) => {
            this.setState({
                Date:tags
            })
        })

        this.modal();
        //查询shopInfo表中某品类的数量
        Storage.get('PeiSong').then((PeiSong) => {
            if(PeiSong=="商品配送"){
                dbAdapter.selectShopInfo().then((rows)=> {
                    if (rows.length == 0) {
                        Storage.get('LinkUrl').then((LinkUrl) => {
                            Storage.get('ClientCode').then((ClientCode)=>{
                                Storage.get('shildshop').then((ChildShopCode)=>{
                                    Storage.get('code').then((ShopCode)=>{
                                        Storage.get('OrgFormno').then((OrgFormno)=>{
                                            if(OrgFormno==null){
                                                this.modal();
                                            }else{
                                                let params = {
                                                    reqCode: "App_PosReq",
                                                    reqDetailCode: "App_Client_ProPSYHDetailQ",
                                                    ClientCode: ClientCode,
                                                    sDateTime: Date.parse(new Date()),
                                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_ProPSYHDetailQ" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                    ShopCode: ShopCode,
                                                    ChildShopCode: ChildShopCode,
                                                    OrgFormno: OrgFormno,
                                                };
                                                FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                                    var DetailInfos =data.DetailInfo;
                                                    if(data.retcode == 1){
                                                        var ShopNumber = 0;
                                                        var shopAmount = 0;
                                                        for(let i =0;i<DetailInfos.length;i++) {
                                                            let detailInfo = DetailInfos[i];
                                                            var shopInfoData = [];
                                                            var shopInfo = {};
                                                            var serial=i+1;
                                                            var prodcode=detailInfo.prodcode;
                                                            var countm=detailInfo.countm;
                                                            var pid=detailInfo.pid;
                                                            var promemo = "";
                                                            var ydcountm = detailInfo.countm;
                                                            var prodname=detailInfo.prodname;
                                                            var shopnumber=detailInfo.countm;
                                                            var ProPrice=detailInfo.ShopPrice;
                                                            var ShopAmount=detailInfo.prototal;
                                                            shopAmount += Number(ShopAmount);
                                                            ShopNumber += Number(shopnumber);
                                                            this.ds.push(detailInfo);
                                                            var DataShop = {
                                                                'serial':serial,
                                                                'prodname':prodname,
                                                                'barCode':"",
                                                                'prodcode': prodcode,
                                                                'shopnumber':shopnumber,
                                                                'countm': countm,
                                                                'ProPrice': ProPrice,
                                                                'promemo': "",
                                                                'ydcountm': ydcountm,
                                                                'ShopAmount':ShopAmount,
                                                                'SuppCode':"",
                                                                'Pid':pid,
                                                                'DepCode':"",
                                                            }
                                                            this.DataShop.push(DataShop);
                                                            shopInfo.Pid = pid;
                                                            shopInfo.ProdCode=prodcode;
                                                            shopInfo.prodname = prodname;
                                                            shopInfo.countm = countm;
                                                            shopInfo.ShopPrice = ProPrice;
                                                            shopInfo.prototal = ShopAmount;
                                                            shopInfo.promemo = promemo;
                                                            shopInfo.DepCode = "";
                                                            shopInfo.ydcountm = ydcountm;
                                                            shopInfo.SuppCode = "";
                                                            shopInfo.BarCode = "";
                                                            shopInfoData.push(shopInfo);
                                                            //调用插入表方法
                                                            dbAdapter.insertShopInfo(shopInfoData);
                                                        }
                                                        this.setState({
                                                            ShopNumber:ShopNumber,//数量
                                                            ShopAmount:NumberUtils.numberFormat2(shopAmount),//总金额
                                                            ds:this.state.ds.cloneWithRows(this.DataShop),
                                                        })
                                                    }else{
                                                        var msg=data.msg;
                                                        alert(msg)
                                                    }
                                                }, (err) => {
                                                    alert("网络请求失败");
                                                    this._setModalVisible();
                                                })
                                                this.modal();//弹层隐藏
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    }else{
                        this.modal();
                    }
                })
            } else{
                this.shopinfo();
            }
        })
    }

    /**
     * 查询shopinfo表数据
     */
    shopinfo(){
        dbAdapter.selectShopInfo().then((rows)=>{
            var shopnumber = 0;
            var shopAmount = 0;
            for(let i =0;i<rows.length;i++){
                var serial=i+1;
                var row = rows.item(i);
                var prodname = row.prodname;
                var number = row.ShopNumber;
                var prodcode = row.ProdCode;
                var countm = row.countm;
                var ProPrice = row.ShopPrice;
                var promemo = row.promemo;
                var ydcountm = row.ydcountm;
                var barCode = row.BarCode;
                var SHopAMount=NumberUtils.numberFormat2(row.ShopAmount);
                shopAmount += Number(SHopAMount);
                shopnumber += Number(row.ShopNumber);
                this.ds.push(row);
                var DataShop = {
                    'serial':serial,
                    'prodname':prodname,
                    'barCode':barCode,
                    'prodcode': prodcode,
                    'shopnumber':number,
                    'countm': number,
                    'ProPrice': ProPrice,
                    'promemo': promemo,
                    'ydcountm': ydcountm,
                    'ShopAmount':row.ShopAmount,
                    'SuppCode':row.SuppCode,
                    'Pid':row.pid,
                    'DepCode':row.DepCode,
                }
                this.DataShop.push(DataShop);
            }
            this.setState({
                number1:number,
                ShopNumber:shopnumber,//数量
                ShopAmount:NumberUtils.numberFormat2(shopAmount),//总金额
                ds:this.state.ds.cloneWithRows(this.DataShop)
            })
            this.modal();
        })
    }

    Storage(){
        Storage.get('Name').then((tags) => {
            this.setState({
                head:tags
            })
        });

        Storage.get('username').then((tags) => {
            this.setState({
                username:tags
            })
        });

        Storage.get('ClientCode').then((tags)=>{
            this.setState({
                ClientCode:tags
            })
        })

        Storage.get('Usercode').then((tags)=>{
            this.setState({
                Usercode:tags
            })
        })

        Storage.get('code').then((tags)=>{
            this.setState({
                ShopCode:tags
            })
        })

        Storage.get('shildshop').then((tags)=>{
            this.setState({
                ChildShopCode:tags
            })
        })

        Storage.get('OrgFormno').then((tags)=>{
            this.setState({
                OrgFormno:tags
            })
        })

    }

    _fetch(){
        //查询shopInfo表中所有商品的数量总和
        dbAdapter.selectShopInfoAllCountm().then((rows)=>{
            var ShopCar = rows.item(0).countm;
            this.setState({
                shopcar:ShopCar
            });
        });
    }

    //扫描商品
    Code(){
        RNScannerAndroid.openScanner();
    }

    Device() {
        DeviceEventEmitter.addListener("code", (reminder) => {
            decodepreprint.init(reminder, dbAdapter);
            if (this.state.head == null) {
                this._Emptydata();
            } else {
                Storage.get('DepCode').then((DepCode) => {
                    Storage.get('FormType').then((FormType) => {
                        Storage.get('LinkUrl').then((LinkUrl) => {
                            Storage.get('userName').then((userName) => {
                                if ((reminder.length == 18 && decodepreprint.deCodePreFlag())) {
                                    new Promise.all([decodepreprint.deCodeProdCode(),decodepreprint.deCodeTotal(),decodepreprint.deCodeWeight()]).then((results) => {
                                        if(results.length==3){
                                            let prodCode = results[0];
                                            let total = results[1];
                                            let weight = results[2];
                                            dbAdapter.selectAidCode(prodCode, 1).then((product) => {
                                                if(product.length==0){
                                                    ToastAndroid.show("商品不存在",ToastAndroid.SHORT);
                                                    return;
                                                }
                                                for (let i = 0; i < product.length; i++) {
                                                    var row = product.item(i);
                                                    if(DepCode!==null) {
                                                        if (row.DepCode1 !== DepCode) {
                                                            ToastAndroid.show("请选择该品类下的商品",ToastAndroid.SHORT);
                                                            return;
                                                        } else {
                                                            let params = {
                                                                reqCode: "App_PosReq",
                                                                reqDetailCode: "App_Client_CurrProdQry",
                                                                ClientCode: this.state.ClientCode,
                                                                sDateTime: Date.parse(new Date()),
                                                                Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                                username: userName,
                                                                usercode: this.state.Usercode,
                                                                SuppCode: row.SuppCode,
                                                                ShopCode: this.state.ShopCode,
                                                                ChildShopCode: this.state.ChildShopCode,
                                                                ProdCode: row.ProdCode,
                                                                OrgFormno: this.state.OrgFormno,
                                                                FormType: FormType,
                                                            };
                                                            FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
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
                                                                        DeviceEventEmitter.removeAllListeners();
                                                                        this.setState({
                                                                            OrderDetails: '',
                                                                        })
                                                                    } else {
                                                                        if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                            Storage.save("ShoppData", "清单");
                                                                            if(row.ShopNumber == 0){
                                                                                this.props.navigator.push({
                                                                                    component: OrderDetails,
                                                                                    params: {
                                                                                        ProdName: row.ProdName,
                                                                                        ShopPrice: ShopPrice,
                                                                                        Pid: row.Pid,
                                                                                        countm: row.ShopNumber,
                                                                                        promemo: row.ShopRemark,
                                                                                        prototal: row.ShopAmount,
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                        SuppCode: row.SuppCode,
                                                                                        ydcountm: countm,
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount:row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }else{
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
                                                                                        ydcountm: countm,
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount:row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }
                                                                        } else if(this.state.head=="售价调整"){
                                                                            dbAdapter.selectShopInfoData(row.Pid).then((datas)=> {
                                                                                Storage.save("ShoppData", "清单");
                                                                                if(datas.length==0){
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: row.ShopNumber,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: "",
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount:row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                }else{
                                                                                    for (let i = 0; i < datas.length; i++) {
                                                                                        var data = datas.item(i);
                                                                                        this.props.navigator.push({
                                                                                            component: OrderDetails,
                                                                                            params: {
                                                                                                ProdName: row.ProdName,
                                                                                                ShopPrice: ShopPrice,
                                                                                                Pid: row.Pid,
                                                                                                countm: row.ShopNumber,
                                                                                                promemo: row.ShopRemark,
                                                                                                prototal: row.ShopAmount,
                                                                                                ProdCode: row.ProdCode,
                                                                                                DepCode: row.DepCode1,
                                                                                                SuppCode: row.SuppCode,
                                                                                                ydcountm: data.ydcountm,
                                                                                                BarCode: row.BarCode,
                                                                                                IsIntCount:row.IsIntCount
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }
                                                                            })
                                                                        }else {
                                                                            Storage.save("ShoppData", "清单");
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: countm,
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                        DeviceEventEmitter.removeAllListeners();
                                                                        this.setState({
                                                                            OrderDetails: '',
                                                                        })
                                                                    }
                                                                } else {
                                                                    alert(JSON.stringify(data))
                                                                }
                                                            })
                                                        }
                                                    }
                                                    else{
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
                                                        FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
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
                                                                    DeviceEventEmitter.removeAllListeners();
                                                                    this.setState({
                                                                        OrderDetails: '',
                                                                    })
                                                                } else {
                                                                    if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                        Storage.save("ShoppData", "清单");
                                                                        if(row.ShopNumber == 0){
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: countm,
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount
                                                                                }
                                                                            })
                                                                        }else{
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
                                                                                    ydcountm: countm,
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                    }else if(this.state.head=="售价调整"){
                                                                        dbAdapter.selectShopInfoData(row.Pid).then((datas)=> {
                                                                            Storage.save("ShoppData", "清单");
                                                                            if(datas.length==0){
                                                                                this.props.navigator.push({
                                                                                    component: OrderDetails,
                                                                                    params: {
                                                                                        ProdName: row.ProdName,
                                                                                        ShopPrice: ShopPrice,
                                                                                        Pid: row.Pid,
                                                                                        countm: row.ShopNumber,
                                                                                        promemo: row.ShopRemark,
                                                                                        prototal: row.ShopAmount,
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                        SuppCode: row.SuppCode,
                                                                                        ydcountm: "",
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount:row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }else{
                                                                                for (let i = 0; i < datas.length; i++) {
                                                                                    var data = datas.item(i);
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: row.ShopNumber,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: data.ydcountm,
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount:row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    }else {
                                                                        Storage.save("ShoppData", "清单");
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: ShopPrice,
                                                                                Pid: row.Pid,
                                                                                countm: row.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: countm,
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount:row.IsIntCount
                                                                            }
                                                                        })
                                                                    }
                                                                    DeviceEventEmitter.removeAllListeners();
                                                                    this.setState({
                                                                        OrderDetails: '',
                                                                    })
                                                                }
                                                            } else {
                                                                alert(JSON.stringify(data))
                                                            }
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    });
                                }
                                else if((reminder.length==13&&deCode13.deCodePreFlag(reminder))){//13位条码解析
                                    new Promise.all([deCode13.deCodeProdCode(reminder,dbAdapter),deCode13.deCodeTotile(reminder,dbAdapter)]).then((result)=>{
                                        if(result.length==2){
                                            let prodCode = result[0];
                                            let price = result[1];
                                            dbAdapter.selectAidCode(prodCode, 1).then((rows) => {
                                                if(rows.length==0){
                                                    ToastAndroid.show("商品不存在",ToastAndroid.SHORT);
                                                    return;
                                                }
                                                for (let i = 0; i < rows.length; i++) {
                                                    var row = rows.item(i);
                                                    if(DepCode!==null) {
                                                        if (row.DepCode1 !== DepCode) {
                                                            ToastAndroid.show("请选择该品类下的商品",ToastAndroid.SHORT);
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
                                                            FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
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
                                                                        DeviceEventEmitter.removeAllListeners();
                                                                        this.setState({
                                                                            OrderDetails: '',
                                                                        })
                                                                    } else {
                                                                        if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                            Storage.save("ShoppData", "清单");
                                                                            if(row.ShopNumber == 0){
                                                                                this.props.navigator.push({
                                                                                    component: OrderDetails,
                                                                                    params: {
                                                                                        ProdName: row.ProdName,
                                                                                        ShopPrice: ShopPrice,
                                                                                        Pid: row.Pid,
                                                                                        countm: row.ShopNumber,
                                                                                        promemo: row.ShopRemark,
                                                                                        prototal: row.ShopAmount,
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                        SuppCode: row.SuppCode,
                                                                                        ydcountm: countm,
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount:row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }else{
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
                                                                                        ydcountm: countm,
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount:row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }
                                                                        }else if(this.state.head=="售价调整"){
                                                                            dbAdapter.selectShopInfoData(row.Pid).then((datas)=> {
                                                                                Storage.save("ShoppData", "清单");
                                                                                if(datas.length==0){
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: row.ShopNumber,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: "",
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount:row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                }else{
                                                                                    for (let i = 0; i < datas.length; i++) {
                                                                                        var data = datas.item(i);
                                                                                        this.props.navigator.push({
                                                                                            component: OrderDetails,
                                                                                            params: {
                                                                                                ProdName: row.ProdName,
                                                                                                ShopPrice: ShopPrice,
                                                                                                Pid: row.Pid,
                                                                                                countm: row.ShopNumber,
                                                                                                promemo: row.ShopRemark,
                                                                                                prototal: row.ShopAmount,
                                                                                                ProdCode: row.ProdCode,
                                                                                                DepCode: row.DepCode1,
                                                                                                SuppCode: row.SuppCode,
                                                                                                ydcountm: data.ydcountm,
                                                                                                BarCode: row.BarCode,
                                                                                                IsIntCount:row.IsIntCount
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                }
                                                                            })
                                                                        } else {
                                                                            Storage.save("ShoppData", "清单");
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: countm,
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                        DeviceEventEmitter.removeAllListeners();
                                                                        this.setState({
                                                                            OrderDetails: '',
                                                                        })
                                                                    }
                                                                } else {
                                                                    alert(JSON.stringify(data))
                                                                }
                                                            })
                                                        }
                                                    }
                                                    else{
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
                                                        FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
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
                                                                    DeviceEventEmitter.removeAllListeners();
                                                                    this.setState({
                                                                        OrderDetails: '',
                                                                    })
                                                                } else {
                                                                    if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                        Storage.save("ShoppData", "清单");
                                                                        if(row.ShopNumber == 0){
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: countm,
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount
                                                                                }
                                                                            })
                                                                        }else{
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
                                                                                    ydcountm: countm,
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount,
                                                                                }
                                                                            })
                                                                        }
                                                                    }else if(this.state.head=="售价调整"){
                                                                        dbAdapter.selectShopInfoData(row.Pid).then((datas)=> {
                                                                            Storage.save("ShoppData", "清单");
                                                                            if(datas.length==0){
                                                                                this.props.navigator.push({
                                                                                    component: OrderDetails,
                                                                                    params: {
                                                                                        ProdName: row.ProdName,
                                                                                        ShopPrice: ShopPrice,
                                                                                        Pid: row.Pid,
                                                                                        countm: row.ShopNumber,
                                                                                        promemo: row.ShopRemark,
                                                                                        prototal: row.ShopAmount,
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                        SuppCode: row.SuppCode,
                                                                                        ydcountm: "",
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount:row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }else{
                                                                                for (let i = 0; i < datas.length; i++) {
                                                                                    var data = datas.item(i);
                                                                                    this.props.navigator.push({
                                                                                        component: OrderDetails,
                                                                                        params: {
                                                                                            ProdName: row.ProdName,
                                                                                            ShopPrice: ShopPrice,
                                                                                            Pid: row.Pid,
                                                                                            countm: row.ShopNumber,
                                                                                            promemo: row.ShopRemark,
                                                                                            prototal: row.ShopAmount,
                                                                                            ProdCode: row.ProdCode,
                                                                                            DepCode: row.DepCode1,
                                                                                            SuppCode: row.SuppCode,
                                                                                            ydcountm: data.ydcountm,
                                                                                            BarCode: row.BarCode,
                                                                                            IsIntCount:row.IsIntCount
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    } else {
                                                                        Storage.save("ShoppData", "清单");
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: ShopPrice,
                                                                                Pid: row.Pid,
                                                                                countm: row.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: countm,
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount:row.IsIntCount,
                                                                            }
                                                                        })
                                                                    }
                                                                    DeviceEventEmitter.removeAllListeners();
                                                                    this.setState({
                                                                        OrderDetails: '',
                                                                    })
                                                                }
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
                                else {
                                    //商品查询
                                    dbAdapter.selectAidCode(reminder, 1).then((rows) => {
                                        if(rows.length==0){
                                            ToastAndroid.show("商品不存在",ToastAndroid.SHORT);
                                            return;
                                        }
                                        for (let i = 0; i < rows.length; i++) {
                                            var row = rows.item(i);
                                            if(DepCode!==null) {
                                                if (row.DepCode1 !== DepCode) {
                                                    ToastAndroid.show("请选择该品类下的商品",ToastAndroid.SHORT);
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
                                                    FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
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
                                                                DeviceEventEmitter.removeAllListeners();
                                                                this.setState({
                                                                    OrderDetails: '',
                                                                })
                                                            } else {
                                                                if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                    Storage.save("ShoppData", "清单");
                                                                    if(row.ShopNumber == 0){
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: ShopPrice,
                                                                                Pid: row.Pid,
                                                                                countm: row.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: countm,
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount:row.IsIntCount,
                                                                            }
                                                                        })
                                                                    }else{
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
                                                                                ydcountm: countm,
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount:row.IsIntCount,
                                                                            }
                                                                        })
                                                                    }
                                                                }else if(this.state.head=="售价调整"){
                                                                    dbAdapter.selectShopInfoData(row.Pid).then((datas)=> {
                                                                        Storage.save("ShoppData", "清单");
                                                                        if(datas.length==0){
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: "",
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount
                                                                                }
                                                                            })
                                                                        }else{
                                                                            for (let i = 0; i < datas.length; i++) {
                                                                                var data = datas.item(i);
                                                                                this.props.navigator.push({
                                                                                    component: OrderDetails,
                                                                                    params: {
                                                                                        ProdName: row.ProdName,
                                                                                        ShopPrice: ShopPrice,
                                                                                        Pid: row.Pid,
                                                                                        countm: row.ShopNumber,
                                                                                        promemo: row.ShopRemark,
                                                                                        prototal: row.ShopAmount,
                                                                                        ProdCode: row.ProdCode,
                                                                                        DepCode: row.DepCode1,
                                                                                        SuppCode: row.SuppCode,
                                                                                        ydcountm: data.ydcountm,
                                                                                        BarCode: row.BarCode,
                                                                                        IsIntCount:row.IsIntCount
                                                                                    }
                                                                                })
                                                                            }
                                                                        }
                                                                    })
                                                                } else {
                                                                    Storage.save("ShoppData", "清单");
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: row.ProdName,
                                                                            ShopPrice: ShopPrice,
                                                                            Pid: row.Pid,
                                                                            countm: row.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: row.ShopAmount,
                                                                            ProdCode: row.ProdCode,
                                                                            DepCode: row.DepCode1,
                                                                            SuppCode: row.SuppCode,
                                                                            ydcountm: countm,
                                                                            BarCode: row.BarCode,
                                                                            IsIntCount:row.IsIntCount,
                                                                        }
                                                                    })
                                                                }
                                                                DeviceEventEmitter.removeAllListeners();
                                                                this.setState({
                                                                    OrderDetails: '',
                                                                })
                                                            }
                                                        } else {
                                                            alert(JSON.stringify(data))
                                                        }
                                                    })
                                                }
                                            }else{
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
                                                FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
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
                                                            DeviceEventEmitter.removeAllListeners();
                                                            this.setState({
                                                                OrderDetails: '',
                                                            })
                                                        } else {
                                                            if (this.state.head == "商品采购" || this.state.head == "协配采购" || this.state.Modify == 1) {
                                                                Storage.save("ShoppData", "清单");
                                                                if(row.ShopNumber == 0){
                                                                    this.props.navigator.push({
                                                                        component: OrderDetails,
                                                                        params: {
                                                                            ProdName: row.ProdName,
                                                                            ShopPrice: ShopPrice,
                                                                            Pid: row.Pid,
                                                                            countm: row.ShopNumber,
                                                                            promemo: row.ShopRemark,
                                                                            prototal: row.ShopAmount,
                                                                            ProdCode: row.ProdCode,
                                                                            DepCode: row.DepCode1,
                                                                            SuppCode: row.SuppCode,
                                                                            ydcountm: countm,
                                                                            BarCode: row.BarCode,
                                                                            IsIntCount:row.IsIntCount,
                                                                        }
                                                                    })
                                                                }else{
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
                                                                            ydcountm: countm,
                                                                            BarCode: row.BarCode,
                                                                            IsIntCount:row.IsIntCount,
                                                                        }
                                                                    })
                                                                }
                                                            }else if(this.state.head=="售价调整"){
                                                                dbAdapter.selectShopInfoData(row.Pid).then((datas)=> {
                                                                    Storage.save("ShoppData", "清单");
                                                                    if(datas.length==0){
                                                                        this.props.navigator.push({
                                                                            component: OrderDetails,
                                                                            params: {
                                                                                ProdName: row.ProdName,
                                                                                ShopPrice: ShopPrice,
                                                                                Pid: row.Pid,
                                                                                countm: row.ShopNumber,
                                                                                promemo: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                ydcountm: "",
                                                                                BarCode: row.BarCode,
                                                                                IsIntCount:row.IsIntCount
                                                                            }
                                                                        })
                                                                    }else{
                                                                        for (let i = 0; i < datas.length; i++) {
                                                                            var data = datas.item(i);
                                                                            this.props.navigator.push({
                                                                                component: OrderDetails,
                                                                                params: {
                                                                                    ProdName: row.ProdName,
                                                                                    ShopPrice: ShopPrice,
                                                                                    Pid: row.Pid,
                                                                                    countm: row.ShopNumber,
                                                                                    promemo: row.ShopRemark,
                                                                                    prototal: row.ShopAmount,
                                                                                    ProdCode: row.ProdCode,
                                                                                    DepCode: row.DepCode1,
                                                                                    SuppCode: row.SuppCode,
                                                                                    ydcountm: data.ydcountm,
                                                                                    BarCode: row.BarCode,
                                                                                    IsIntCount:row.IsIntCount
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            } else {
                                                                Storage.save("ShoppData", "清单");
                                                                this.props.navigator.push({
                                                                    component: OrderDetails,
                                                                    params: {
                                                                        ProdName: row.ProdName,
                                                                        ShopPrice: ShopPrice,
                                                                        Pid: row.Pid,
                                                                        countm: row.ShopNumber,
                                                                        promemo: row.ShopRemark,
                                                                        prototal: row.ShopAmount,
                                                                        ProdCode: row.ProdCode,
                                                                        DepCode: row.DepCode1,
                                                                        SuppCode: row.SuppCode,
                                                                        ydcountm: countm,
                                                                        BarCode: row.BarCode,
                                                                        IsIntCount:row.IsIntCount,
                                                                    }
                                                                })
                                                            }
                                                            DeviceEventEmitter.removeAllListeners();
                                                            this.setState({
                                                                OrderDetails: '',
                                                            })
                                                        }
                                                    } else {
                                                        alert(JSON.stringify(data))
                                                    }
                                                })
                                            }
                                        }
                                    })

                                }
                            })
                        })
                    })
                })
            }
        })
    }

    renderRow(rowData, sectionID, rowID){
        return (
            <TouchableOpacity style={styles.ShopList} onPress={()=>this.OrderDetails(rowData)}>
                <View style={[styles.RowList,{paddingLeft:30,}]}>
                    <View style={styles.serial}>
                        <Text style={styles.SerialText}>{rowData.serial}.</Text>
                    </View>
                    {
                        (rowData.barCode == "") ?
                            <Text style={[styles.Name,styles.Name1]}>{rowData.prodcode}</Text>
                            :
                            <Text style={[styles.Name,styles.Name1]}>{rowData.barCode}</Text>
                    }
                    <Text style={[styles.Name,styles.Name1]}>{rowData.prodname}</Text>
                </View>
                {
                    (this.state.Name=="售价调整")?
                        <View style={styles.RowList1}>
                            <Text style={styles.Number}>{rowData.ydcountm}</Text>
                        </View>
                        :
                        <View style={styles.RowList1}>
                            <Text style={[styles.Number,styles.Name1]}>{rowData.shopnumber}</Text>
                        </View>
                }
                <View style={styles.RowList1}>
                    <Text style={[styles.Price,styles.Name1]}>{rowData.ProPrice}</Text>
                </View>
                {
                    (this.state.Name=="标签采集"||this.state.Name=="售价调整")?
                        null:
                        <View style={styles.RowList1}>
                            <Text style={[styles.SmallScale,styles.Name1]}>{rowData.ShopAmount}</Text>
                        </View>
                }
            </TouchableOpacity>
        );
    }

    renderHiddenRow(rowData, sectionID, rowID){
        return (
            <TouchableOpacity onPress={()=>this.deteleShopInfo(rowData)} style={styles.rowBack}>
                <Text style={styles.rowBackText}>删除</Text>
            </TouchableOpacity>
        );
    }

    /**
     *
     * 删除每一列数据
     */
    deteleShopInfo(rowData, sectionID, rowID){
        dbAdapter.deteleShopInfo(rowData.prodcode).then((rows)=>{});
        dbAdapter.selectShopInfo().then((rows)=>{
            this.DataShop=[];
            this.ds=[];
            var shopnumber = 0;
            var shopAmount = 0;
            for(let i =0;i<rows.length;i++){
                var serial=i+1;
                var row = rows.item(i);
                var prodname = row.prodname;
                var number = row.ShopNumber;
                var prodcode = row.ProdCode;
                var countm = row.countm;
                var ProPrice = row.ShopPrice;
                var promemo = row.promemo;
                var ydcountm = row.ydcountm;
                var barCode = row.BarCode;
                var SHopAMount=NumberUtils.numberFormat2(row.ShopAmount);
                shopAmount += Number(SHopAMount);
                shopnumber += Number(row.ShopNumber);
                this.ds.push(row);
                var DataShop = {
                    'serial':serial,
                    'prodname':prodname,
                    'barCode':barCode,
                    'prodcode': prodcode,
                    'shopnumber':number,
                    'countm': number,
                    'ProPrice': ProPrice,
                    'promemo': promemo,
                    'ydcountm': ydcountm,
                    'ShopAmount':row.ShopAmount,
                    'SuppCode':row.SuppCode,
                    'Pid':row.pid,
                    'DepCode':row.DepCode,
                }
                this.DataShop.push(DataShop);
            }
            this.setState({
                number1:number,
                ShopNumber:shopnumber,//数量
                ShopAmount:NumberUtils.numberFormat2(shopAmount),//总金额
                ds:this.state.ds.cloneWithRows(this.DataShop)
            })
        })
        dbAdapter.selectShopInfoAllCountm().then((rows)=>{
            var ShopCar = rows.item(0).countm;
            this.setState({
                shopcar:ShopCar
            });
        });
    }

    History(){
        Storage.get('Name').then((tags)=> {
            if(tags=="移动销售"||tags=="标签采集"){
                ToastAndroid.show('暂不支持该业务', ToastAndroid.SHORT)
            }else{
                var nextRoute = {
                    name: "主页",
                    component: HistoricalDocument
                };
                this.props.navigator.push(nextRoute)
            }
        })
    }

    Shop(){
        var nextRoute={
            name:"主页",
            component:Index
        };
        this.props.navigator.push(nextRoute)
    }

    pressPush(){
        Storage.save("ShoppData", "清单");
        this.props.navigator.push({
            component:Search,
        });
        DeviceEventEmitter.removeAllListeners();
    }

    //点击商品列表跳转到修改商品数量页面
    OrderDetails(rowData, sectionID, rowID){
        Storage.get('FormType').then((FormType)=>{
            Storage.get('LinkUrl').then((LinkUrl) => {
                Storage.get('userName').then((userName)=>{
                    Storage.get('PeiSong').then((PeiSong) => {
                        dbAdapter.selectAidCode(rowData.prodcode, 1).then((rowdata) => {
                            for (let i = 0; i < rowdata.length; i++) {
                                var rowdatas = rowdata.item(i);
                            }
                            dbAdapter.selectShopInfoData(rowData.Pid).then((rows) => {
                                for (let i = 0; i < rows.length; i++) {
                                    var row = rows.item(i);
                                    // alert(JSON.stringify(row.ydcountm))
                                    if (PeiSong == "商品配送") {
                                        var SuppCode = "";
                                    } else {
                                        var SuppCode = rowData.SuppCode;
                                    }
                                    let params = {
                                        reqCode: "App_PosReq",
                                        reqDetailCode: "App_Client_CurrProdQry",
                                        ClientCode: this.state.ClientCode,
                                        sDateTime: "2017-08-09 12:12:12",
                                        Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                        username: userName,
                                        usercode: this.state.Usercode,
                                        SuppCode: SuppCode,
                                        ShopCode: this.state.ShopCode,
                                        ChildShopCode: this.state.ChildShopCode,
                                        ProdCode: rowData.prodcode,
                                        OrgFormno: this.state.OrgFormno,
                                        FormType: FormType,
                                    };
                                    FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                        var ydcountm = JSON.stringify(data.countm);
                                        var ShopPrice = JSON.stringify(data.ShopPrice);
                                        if (data.retcode == 1) {
                                            Storage.save("ShoppData", "清单");
                                            this.props.navigator.push({
                                                component: OrderDetails,
                                                params: {
                                                    ProdName: rowData.prodname,
                                                    ShopPrice: rowData.ProPrice,
                                                    countm: rowData.countm,
                                                    Pid: row.pid,
                                                    ProdCode: rowData.prodcode,
                                                    DepCode: rowData.DepCode,
                                                    ydcountm: JSON.stringify(row.ydcountm),
                                                    SuppCode: row.SuppCode,
                                                    BarCode: row.BarCode,
                                                    promemo: row.promemo,
                                                    IsIntCount: rowdatas.IsIntCount
                                                }
                                            })
                                        } else {
                                            alert(JSON.stringify(data))
                                        }
                                    }, (err) => {
                                        alert("网络请求失败");
                                    })
                                }
                            })
                        })
                    })
                })
            })
        })

    }

    pressPop(){
        this._setModalVisible();
        this.props.navigator.pop();
    }

    ScreenBod(){
        let isScreen = this.state.ScreenBod;
        this.setState({
            ScreenBod:!isScreen,
        });
    }

    SCreenBod(){
        this.setState({
            SUbmit:'',
        });
        this.ScreenBod();
    }

    //提交
    submit(){
        this.setState({
            SUbmit:1
        })
        if(this.state.SUbmit==1){
            return;
        }else{
            if(this.ds==0){
                alert("请添加商品");
            }else{
                this.screen = [];
                Storage.get('shildshop').then((tags)=>{
                    this.setState({
                        shildshop:tags
                    })
                })

                Storage.get('LinkUrl').then((tags) => {
                    this.setState({
                        linkurl:tags
                    })
                })

                Storage.get('Screen').then((tags)=>{
                    this.setState({
                        Screen:tags
                    })
                })
                this.Wait();
                Storage.get('code').then((tags) => {
                    Storage.get("usercode","").then((usercode)=>{
                        Storage.get("username","").then((username)=>{
                            let params = {
                                ClientCode: this.state.ClientCode,
                                username: this.state.Username,
                                usercode: this.state.Userpwd,
                                Remark: this.state.ShopRemark,
                            };
                        });
                    });
                    Storage.get('scode').then((scode)=>{
                        Storage.get('CKu').then((CKu)=> {
                            Storage.get('DepCode').then((DepCode)=> {
                                if(DepCode==null){
                                    var depcode=0;
                                }else{
                                    var depcode=DepCode;
                                }
                                let params = {
                                    reqCode: "App_PosReq",
                                    reqDetailCode: this.state.reqDetailCode,
                                    ClientCode: this.state.ClientCode,
                                    sDateTime: "2017-08-09 12:12:12",//获取当前时间转换成时间戳
                                    Sign: NetUtils.MD5("App_PosReq" + "##" +this.state.reqDetailCode + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',
                                    username: this.state.Username,
                                    usercode: this.state.Userpwd,
                                    DetailInfo1: {
                                        "ShopCode": tags,
                                        "OrgFormno": this.state.OrgFormno,
                                        "ProMemo": this.state.Remark,
                                        "SuppCode":scode,
                                        "childshop":this.state.shildshop,
                                        "pdaGuid":this.state.IMEI,
                                        "pdgFormno":this.state.ProYH+this.state.Date,
                                        "storecode":CKu,
                                        "depcode":depcode,
                                    },
                                    DetailInfo2: this.DataShop,
                                };
                                if(this.state.Screen=="1"||this.state.Screen=="2"){
                                    var DetailInfo2=params.DetailInfo2;
                                    for(let i =0;i<DetailInfo2.length;i++){
                                        let detail = DetailInfo2[i];
                                        let ydcountm = detail.ydcountm;
                                        let countm = detail.countm;
                                        if(ydcountm!==countm){
                                            this.screen.push(detail);
                                        }
                                    }
                                    if(this.screen==""){
                                        FetchUtils.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                                            if(data.retcode == 1){
                                                if(this.state.Screen!=="1"||this.state.Screen!=="2"||this.screen==""||scode==null){
                                                    this.Wait();
                                                    this.Succeed();
                                                    Storage.get('Radio').then((Radio) => {
                                                      if(Radio==0){
                                                          this.Set();
                                                      }
                                                    })
                                                }
                                            }else{
                                                this.Wait();
                                                alert(data.msg)
                                            }
                                        },(err)=>{
                                            alert("网络请求失败");
                                        })
                                    }else{
                                        this.setState({
                                            dataSource:this.state.dataSource.cloneWithRows(this.screen),
                                        })
                                        this.Wait();
                                        this.ScreenBod();
                                    }
                                    this.setState({
                                        SUbmit:'',
                                    })
                                }else{
                                    FetchUtils.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                                        if(data.retcode == 1){
                                            if(this.state.Screen!=="1"||this.state.Screen!=="2"||this.screen==""||scode==null){
                                                this.Wait();
                                                this.Succeed();
                                                Storage.get('Radio').then((Radio) => {
                                                    if(Radio==0){
                                                        this.Set();
                                                    }
                                                })
                                            }
                                            this.setState({
                                                SUbmit:'',
                                            })
                                        }else{
                                            this.Wait();
                                            alert(data.msg)
                                        }
                                    },(err)=>{
                                        alert("网络请求失败");
                                    })
                                }
                            })
                        })
                    })
                })
            }
        }
    }

    submit1() {
        Storage.get('shildshop').then((tags) => {
            this.setState({
                shildshop: tags
            })
        })

        Storage.get('LinkUrl').then((tags) => {
            this.setState({
                linkurl: tags
            })
        })

        if (this.ds == 0) {
            alert("请添加商品")
        } else {
            Storage.get('code').then((tags) => {
                Storage.get("usercode", "").then((usercode) => {
                    Storage.get("username", "").then((username) => {
                        let params = {
                            ClientCode: this.state.ClientCode,
                            username: this.state.Username,
                            usercode: this.state.Userpwd,
                            Remark: this.state.ShopRemark,
                        };
                    });
                });
                Storage.get('scode').then((scod) => {
                    Storage.get('CKu').then((CKu)=> {
                        Storage.get('DepCode').then((DepCode)=> {
                            if (DepCode == null) {
                                var depcode = 0;
                            } else {
                                var depcode = DepCode;
                            }
                            let params = {
                                reqCode: "App_PosReq",
                                reqDetailCode: this.state.reqDetailCode,
                                ClientCode: this.state.ClientCode,
                                sDateTime: "2017-08-09 12:12:12",
                                Sign: NetUtils.MD5("App_PosReq" + "##" + this.state.reqDetailCode + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs") + '',
                                username: this.state.Username,
                                usercode: this.state.Userpwd,
                                DetailInfo1: {
                                    "ShopCode": tags,
                                    "OrgFormno": this.state.OrgFormno,
                                    "ProMemo": this.state.Remark,
                                    "SuppCode": scod,
                                    "childshop": this.state.shildshop,
                                    "pdaGuid": this.state.IMEI,
                                    "pdgFormno": this.state.ProYH + this.state.Date,
                                    "storecode":CKu,
                                    "depcode":depcode,
                                },
                                DetailInfo2: this.DataShop,
                            };
                            FetchUtils.post(this.state.linkurl, JSON.stringify(params)).then((data) => {
                                if (data.retcode == 1) {
                                    this.ScreenBod();
                                    this.Succeed();
                                    Storage.get('Radio').then((Radio) => {
                                        if(Radio==0){
                                            this.Set();
                                        }
                                    })
                                    this.setState({
                                        SUbmit:'',
                                    })
                                } else {
                                    alert(data.msg)
                                }
                            },(err)=>{
                                alert("网络请求失败");
                            })
                        })
                    })
                })
            })
        }
    }

    /**
     *打印设置
     */
    Set(){
        if(this.state.Name=="售价调整"||this.state.Name=="标签采集"){
            console.log("hello")
        }else{
            Storage.get('Pid').then((Pid) => {
                Storage.get('code').then((ShopName) => {
                    Storage.get('MenDianName').then((MenDianName) => {
                        Storage.get('usercode').then((usercode) => {
                            Storage.get('userName').then((userName) => {
                                var now = new Date();
                                var year = now.getFullYear();
                                var month = now.getMonth() + 1;
                                var day = now.getDate();
                                var hh = now.getHours();
                                var mm = now.getMinutes();
                                var ss = now.getSeconds();
                                if (month >= 1 && month <= 9) {
                                    month = "0" + month;
                                }
                                if (day >= 1 && day <= 9) {
                                    day = "0" + day;
                                }
                                if (hh >= 1 && hh <= 9) {
                                    hh = "0" + hh;
                                }
                                if (mm >= 1 && mm <= 9) {
                                    mm = "0" + mm;
                                }
                                if (ss >= 1 && ss <= 9) {
                                    ss = "0" + ss;
                                }
                                NativeModules.AndroidPrintInterface.initPrint();
                                NativeModules.AndroidPrintInterface.setFontSize(30, 26, 0x26,);
                                NativeModules.AndroidPrintInterface.print(" " + " " + " " + " " + " " + " " + " " + " " + MenDianName+"\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.setFontSize(20, 20, 0x22);
                                NativeModules.AndroidPrintInterface.print("服务员：" + userName + "\n");
                                NativeModules.AndroidPrintInterface.print("当前单据：" + this.state.head + "\n");
                                if (hh < 12) {
                                    var hours = "上午"
                                } else if (hh >= 12) {
                                    var hours = "下午"
                                }
                                NativeModules.AndroidPrintInterface.print(year + "年" + month + "月" + day + "日" + " " + hours + hh + ":" + mm + ":" + ss + "\n");
                                NativeModules.AndroidPrintInterface.print("------------------------------------------------------------" + "\n");
                                NativeModules.AndroidPrintInterface.print("名称" + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + "数量" + " " + " " + " " + " " + "单价" + " " + " " + " " + " " + "小计" + "\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                for (let i = 0; i < this.DataShop.length; i++) {
                                    var DataRows = this.DataShop[i];
                                    if (DataRows.barCode == "") {
                                        var barCode = DataRows.prodcode;
                                    } else {
                                        var barCode = DataRows.barCode;
                                    }
                                    NativeModules.AndroidPrintInterface.print(DataRows.prodname + " " + " " + " " + " " + barCode + "\n");
                                    NativeModules.AndroidPrintInterface.print(" " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + DataRows.shopnumber + " " +" " +" " +" " + " " + " " + " " + DataRows.ProPrice + " " + " " + " " + " " + DataRows.ShopAmount + "\n");
                                    NativeModules.AndroidPrintInterface.print("\n");
                                }
                                NativeModules.AndroidPrintInterface.print("总价：" + this.state.ShopAmount + "\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.startPrint();
                            })
                        })
                    })
                })
            })
        }

    }

    _Screen(rowData, sectionID, rowID){
        return (
            <View style={styles.ScreenList}>
                <View style={styles.coulumnScreen}>
                    <Text style={styles.coulumnText}>
                        {rowData.prodname}
                    </Text>
                </View>
                <View style={styles.coulumnScreen}>
                    <Text style={styles.coulumnText}>
                        {rowData.ydcountm}
                    </Text>
                </View>
                <View style={styles.coulumnScreen}>
                    <Text style={styles.coulumnText}>
                        {rowData.countm}
                    </Text>
                </View>
            </View>
        );
    }

    //单据备注对话框
    _rightButtonClick() {
        if(this.ds==0){
            alert("请添加商品")
        }else{
            this._setModalVisible();
        }
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
            BeiZhu:this.state.Remark,
        });
    }

    modal() {
        let isShow = this.state.Show;
        this.setState({
            Show:!isShow,
        });
    }

    //成功弹层
    Succeed(){
        let isShow = this.state.Succeed;
        this.setState({
            Succeed:!isShow,
        });
    }

    //成功返回
    Return(){
        Storage.delete('OrgFormno');
        Storage.delete('shildshop');
        this.Succeed();
        this.DataSource();
    }

    //提交时各单据判断
    DeterMine(){
        Storage.get('Name').then((tags)=>{
            if(tags=="商品盘点"){
                this.Succeed();
                var nextRoute={
                    name:"Query",
                    component:Query,
                    params: {
                        invoice:"商品盘点"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="配送收货"){
                this.Succeed();
                var nextRoute={
                    name:"Distrition",
                    component:Distrition,
                    params: {
                        invoice:"配送收货"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="商品采购"){
                this.Succeed();
                var nextRoute={
                    name:"ProductCG",
                    component:ProductCG,
                    params: {
                        invoice:"商品采购"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="商品验收"){
                this.Succeed();
                var nextRoute={
                    name:"ProductYS",
                    component:ProductYS,
                    params: {
                        invoice:"商品验收"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="协配采购"){
                this.Succeed();
                var nextRoute={
                    name:"ProductXP",
                    component:ProductXP,
                    params: {
                        invoice:"协配采购"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="协配收货"){
                this.Succeed();
                var nextRoute={
                    name:"ProductSH",
                    component:ProductSH,
                    params: {
                        invoice:"协配收货"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="商品损溢"){
                this.Succeed();
                var nextRoute={
                    name:"SunYi",
                    component:SunYi,
                    params: {
                        invoice:"商品损溢"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="商品配送"){
                this.Succeed();
                var nextRoute={
                    name:"PSDan",
                    component:PSDan,
                    params: {
                        invoice:"商品配送"
                    }
                };
                this.props.navigator.push(nextRoute);
                Storage.delete('OrgFormno');
                Storage.delete('shildshop');
                this.DataSource();
            }
            if(tags=="门店要货"){
                this.Succeed();
                var nextRoute={
                    name:"PinLei",
                    component:PinLei,
                    params: {
                        invoice:"门店要货"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="实时盘点"){
                this.Succeed();
                var nextRoute={
                    name:"PinLei",
                    component:PinLei,
                    params: {
                        invoice:"实时盘点"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="标签采集"){
                this.Succeed();
                var nextRoute={
                    name:"PinLei",
                    component:PinLei,
                    params: {
                        invoice:"标签采集"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="售价调整"){
                this.Succeed();
                var nextRoute={
                    name:"PinLei",
                    component:PinLei,
                    params: {
                        invoice:"售价调整"
                    }
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }

        })
    }

    //提交时清空数据及更新setState
    DataSource(){
        dbAdapter.deleteData("shopInfo");
        this.ds=[];
        var price="";
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        this.setState({
            ds:this.state.ds.cloneWithRows(this.ds),
            ShopNumber:price,
            ShopAmount:price,
            shopcar:"",
            active:data,
            BeiZhu:"",
        })
        Storage.save('Date',this.state.active);
    }

    DataButton(){
        dbAdapter.deleteData("shopInfo");
        this.ds=[];
        var price="";
        this.setState({
            ds:this.state.ds.cloneWithRows(this.ds),
            ShopNumber:price,
            ShopAmount:price,
            shopcar:"",
            BeiZhu:"",
        })
        this.DeleteData();
    }

    CloseButton(){
        this.DeleteData();
    }
    //提交商品等待框
    Wait(){
        let isShow = this.state.Wait;
        this.setState({
            Wait:!isShow,
        });
    }

    DeleteData(){
        let isShow = this.state.DeleteData;
        this.setState({
            DeleteData:!isShow,
        });
    }

    DeleteShop(){
        this.DeleteData();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <Text style={styles.HeaderList}>商品清单</Text>
                        <TouchableOpacity onPress={this.Code.bind(this)}>
                            <Image source={require("../images/1_05.png")} style={styles.HeaderImage1}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.pressPush.bind(this)}>
                            <Image source={require("../images/1_08.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.ContList1}>
                    <View style={styles.NameList}>
                        <Text style={styles.Name}>名字</Text>
                        {
                            (this.state.Name=="售价调整")?
                                <Text style={styles.Number}>新价格</Text>
                                :
                                <Text style={styles.Number}>数量</Text>
                        }
                        {
                            (this.state.Name=="售价调整")?
                                <Text style={styles.Number}>原价格</Text>
                                :
                                <Text style={styles.Price}>单价</Text>
                        }
                        {
                            (this.state.Name=="标签采集"||this.state.Name=="售价调整")?
                                null
                                :
                                <Text style={styles.SmallScale}>小计</Text>
                        }
                    </View>
                    <View>
                        <SwipeListView
                            dataSource={this.state.ds}
                            renderRow={this.renderRow.bind(this)}
                            renderHiddenRow={this.renderHiddenRow.bind(this)}
                            rightOpenValue={-100}
                        />
                    </View>
                </View>
                <View style={styles.viewStyle}>
                    <View style={styles.Combined}>
                        <View style={styles.Combinedleft}>
                            <Text style={styles.CombinedText}>合计：</Text>
                        </View>
                        <TouchableOpacity style={styles.Combinedright} onPress={this.DeleteShop.bind(this)}>
                            <Text style={styles.Deletetext}>清空全部商品</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Client}>
                        {
                            (this.state.Name == "售价调整") ?
                                null
                                :
                                <Text style={styles.ClientText}>
                                    <Text style={[styles.ClientText,styles.ClientType]}>货品：</Text>
                                    <Text style={styles.ClientType}>{this.state.ShopNumber}</Text>
                                </Text>
                        }
                        {
                            (this.state.Name=="标签采集"||this.state.Name == "售价调整")?
                                null
                                :
                                <Text style={styles.ClientText}>
                                    <Text style={[styles.ClientText,styles.ClientType]}>总价：</Text>
                                    <Text style={styles.Price1}>{this.state.ShopAmount}</Text>
                                </Text>
                        }
                    </View>
                    <View style={styles.Note}>
                        <TouchableOpacity onPress={this._rightButtonClick.bind(this)} style={styles.DanJU}>
                            <View style={styles.DocumentsNote}>
                                <Text style={styles.Documentsnote}>单据备注：</Text>
                            </View>
                            <TextInput
                                style={styles.DocumentsNote1}
                                autofocus={true}
                                editable={false}
                                defaultValue ={this.state.BeiZhu}
                                textalign="center"
                                underlineColorAndroid='transparent'
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.Submit} onPress={this.submit.bind(this)}>
                            <Text style={{fontSize:18,color:"#ffffff",textAlign:"center"}}>提交</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.Home} onPress={this.History.bind(this)}><Image source={require("../images/1_300.png")}></Image><Text style={styles.home1}>历史单据查询</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.Shop.bind(this)}><Image source={require("../images/1_311.png")}></Image><Text style={styles.home1}>商品</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home}>
                        <View>
                            <Image source={require("../images/1_32.png")}>
                                {
                                    (this.state.shopcar==0)?
                                        null:
                                        <Text style={[{position:"absolute", right:-200,}]}>{this.state.shopcar}</Text>
                                }
                                {
                                    (this.state.shopcar>0)?
                                        <Text style={[styles.ShopCar,{paddingTop:3,}]}>{this.state.shopcar}</Text>:null
                                }
                                {
                                    (this.state.shopcar<999)?
                                        null:
                                        <Text style={[styles.ShopCar,{width:30,height:30,top:11,lineHeight:21,}]}>{this.state.shopcar}</Text>
                                }
                                {
                                    (this.state.shopcar>999)?
                                        <View>
                                            <Text style={[styles.ShopCar,{width:30,height:30,top:11,lineHeight:23}]}>{this.state.shopcar}</Text>
                                            <Text style={styles.Add}>
                                                +
                                            </Text>
                                        </View>:null
                                }
                            </Image>
                        </View>
                        <Text style={styles.home2}>清单</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.Show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.LoadCenter}>
                        <View style={styles.loading}>
                            <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
                            <Text style={styles.TextLoading}>加载中</Text>
                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={[styles.modalStyle,{justifyContent: 'center',alignItems: 'center',}]}>
                        <View style={[styles.ModalView,{borderRadius:5,paddingBottom:20,width:300,
                            height:330,backgroundColor:"#ffffff"}]}>
                            <View style={styles.DanJu}>
                                <View style={styles.danju}><Text style={styles.DanText}>单据备注</Text></View>
                                <TouchableOpacity style={styles.ModalLeft} onPress={this._setModalVisible.bind(this)}>
                                    <Image source={require("../images/2_02.png")} />
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                multiline={true}
                                maxLength={25}
                                placeholder="请填写单据备注信息"
                                underlineColorAndroid='transparent'
                                placeholderTextColor="#888888"
                                value={this.state.Remark}
                                style={styles.TextInput}
                                onChangeText={(value)=>{
                                    this.setState({
                                        Remark:value
                                    })
                                }}/>
                            <TouchableOpacity style={styles.Button} onPress={this._setModalVisible.bind(this)}>
                                <Text style={styles.ButtonText}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.ScreenBod}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.ModalStyle}>
                        <View style={styles.DanJu}>
                            <View style={styles.danju}><Text style={styles.DanText}>
                                以下商品数量不相等，是否继续？</Text></View>
                        </View>
                        {
                            (this.state.Screen == "1") ?
                                <View style={styles.ScreenTitle}>
                                    <View style={styles.coulumnScreen}>
                                        <Text style={styles.coulumnText}>
                                            商品名称
                                        </Text>
                                    </View>
                                    <View style={styles.coulumnScreen}>
                                        <Text style={styles.coulumnText}>
                                            原始数量
                                        </Text>
                                    </View>
                                    <View style={styles.coulumnScreen}>
                                        <Text style={styles.coulumnText}>
                                            数量
                                        </Text>
                                    </View>
                                </View>:null
                        }

                        {
                            (this.state.Screen=="2")?
                                <View style={styles.ScreenTitle}>
                                    <View style={styles.coulumnScreen}>
                                        <Text style={styles.coulumnText}>
                                            商品名称
                                        </Text>
                                    </View>
                                    <View style={styles.coulumnScreen}>
                                        <Text style={styles.coulumnText}>
                                            现在库存
                                        </Text>
                                    </View>
                                    <View style={styles.coulumnScreen}>
                                        <Text style={styles.coulumnText}>
                                            数量
                                        </Text>
                                    </View>
                                </View>:null
                        }

                        <View style={[{maxHeight:300,}]}>
                            <ListView
                                dataSource={this.state.dataSource}
                                showsVerticalScrollIndicator={true}
                                renderRow={this._Screen.bind(this)}
                                enableEmptySections={true}
                            />
                        </View>
                        <View style={styles.Determine}>
                            <TouchableOpacity style={styles.Cancel} onPress={this.SCreenBod.bind(this)}>
                                <Text style={styles.CancelText}>
                                    取消
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.Cancel,{marginRight:25,}]} onPress={this.submit1.bind(this)}>
                                <Text style={styles.CancelText}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.Succeed}
                    onShow={() => {}}
                    onRequestClose={() => {}}>
                    <View style={styles.Succeed}>
                        <View style={styles.header}>
                            <View style={styles.cont}>
                                <TouchableOpacity onPress={this.Return.bind(this)}>
                                    <Image source={require("../images/2_01.png")}></Image>
                                </TouchableOpacity>
                                <Text style={[styles.HeaderList,{textAlign:"left",marginLeft:10,}]}>{this.state.head}</Text>
                            </View>
                        </View>
                        <View style={styles.SucceedCont}>
                            <Image source={require("../images/succeed.png")}/>
                            <Text style={styles.SucceedText}>
                                提交成功
                            </Text>
                            <TouchableOpacity onPress={this.DeterMine.bind(this)} style={styles.DeterMine}>
                                <Text style={styles.DeterMineText}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.DeleteData}
                    onShow={() => {}}
                    onRequestClose={() => {}}>
                    <View style={[styles.modalStyle,{justifyContent: 'center',alignItems: 'center',}]}>
                        <View style={[styles.ModalView,{borderRadius:5,paddingBottom:50,width:300,backgroundColor:"#ffffff"}]}>
                            <View style={styles.DanJu}>
                                <View style={styles.danju}><Text style={styles.DanText}>是否清空全部商品？</Text></View>
                            </View>
                            <View style={styles.Row}>
                                <TouchableOpacity onPress={this.DataButton.bind(this)} style={styles.DataButton}>
                                    <Text style={styles.ModalTitleText}>
                                        确定
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.CloseButton.bind(this)} style={styles.CloseButton}>
                                    <Text style={styles.ModalTitleText}>
                                        取消
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.Wait}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.LoadCenter}>
                        <View style={styles.loading}>
                            <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
                            <Text style={styles.TextLoading}>正在提交</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ModalTitleText:{
        fontSize:16,
        color:"#ffffff",
        textAlign:"center",
    },
    Row:{
        flexDirection:"row",
        marginTop:50,
        paddingLeft:20,
        paddingRight:20,
    },
    DataButton:{
        flex:1,
        marginRight:35,
        paddingTop:8,
        paddingBottom:8,
        borderRadius:3,
        backgroundColor:"#ff4e4e",
    },
    CloseButton:{
        flex:1,
        paddingTop:8,
        paddingBottom:8,
        borderRadius:3,
        backgroundColor:"#ff4e4e",
    },
    container:{
        flex:1,
        backgroundColor:"#f2f2f2",
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
    HeaderImage:{
        marginLeft:18
    },
    HeaderList:{
        flex:6,
        textAlign:"center",
        color:"#ffffff",
        fontSize:22,
        marginTop:3,
    },
    NameList:{
        paddingLeft:25,
        paddingRight:25,
        flexDirection:"row",
        paddingTop:20,
        paddingBottom:20,
        alignItems:"center",
    },
    RowList:{
        flex:2,
    },
    serial:{
        position:"absolute",
        top:5,
        left:4,
    },
    SerialText:{
        borderRadius: 50,
        color: "#000000",
        fontSize:14,
    },
    RowList1:{
        flex:1,
    },
    Name:{
        flex:2,
        fontSize:18,
        color:"#333333",
    },
    Number:{
        flex:1,
        textAlign:"center",
        fontSize:18,
        color:"#333333",
    },
    Price:{
        flex:1,
        textAlign:"center",
        fontSize:18,
        color:"#333333",
    },
    SmallScale:{
        flex:1,
        textAlign:"right",
        fontSize:18,
        color:"#333333",
    },
    ShopList:{
        paddingRight:25,
        paddingTop:18,
        paddingBottom:18,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
        flexDirection:"row",
    },
    Name1:{
        color:"#333333",
        fontSize:16,
        height:22,
        overflow:"hidden",
    },
    ContList1:{
        flex:16,
        marginBottom:60,
    },
    CommoditySettlement:{
        backgroundColor:"#ffffff",
        borderTopWidth:1,
        borderTopColor:"#f5f5f5",
        paddingLeft:25,
        paddingRight:25,
        paddingTop:15,
        height:160,

    },
    Client:{
        flexDirection:"row",
        paddingBottom:5,
        overflow:"hidden",
    },
    Goods:{
        flexDirection:"row",
    },
    Note:{
        flexDirection:"row",
    },
    Combined:{
        flexDirection:"row",
    },
    Combinedleft:{
        flex:1,
        paddingTop:5,
    },
    Combinedright:{
        flex:1,
        paddingTop:5,
        paddingBottom:5,
    },
    Deletetext:{
        color:"#ff4e4e",
        textAlign:"center",
        fontWeight:"bold",
    },
    CombinedText:{
        fontSize:16,
        color:"#333333",
        fontWeight:"bold"
    },
    ClientType:{
        fontSize:16,
        color:"#666666",
    },
    DocumentsNote:{
        width:95,
        marginTop:14,
    },
    DanJU:{
        flex:5,
        flexDirection:"row",
    },
    Documentsnote:{
        fontSize:16,
        color:"#666666"
    },
    DocumentsNote1:{
        marginTop:3,
        flex:4,
        color:"#777777"
    },
    Submit:{
        backgroundColor:"#ff4e4e",
        paddingTop:10,
        paddingBottom:10,
        flex:2,
    },
    ModalStyle: {
        flex:1,
        backgroundColor:"#F2F2F2",
    },
    DanJu:{
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ff4e4e",
        flexDirection:'row',
    },
    DanText:{
        color:"#ffffff",
        textAlign:"center",
        fontSize:16,
    },
    TextInput:{
        marginLeft:25,
        marginRight:25,
        height:150,
        marginTop:25,
        backgroundColor:"#e2e2e2",
        textAlignVertical: 'top'
    },
    Button:{
        marginLeft:50,
        marginRight:50,
        backgroundColor:"#ff4e4e",
        paddingTop:13,
        paddingBottom:13,
        borderRadius:5,
        marginTop:25,
    },
    ButtonText:{
        color:"#ffffff",
        fontSize:18,
        textAlign:"center",
    },
    ModalLeft:{
        position:"absolute",
        right:15,
        top:6,
        paddingLeft:5,
        paddingRight:5,
    },
    danju:{
        flex:1,
    },
    viewStyle:{
        backgroundColor:"#fffce6",
        paddingLeft:25,
        height:120,
    },
    leftView:{
        flexDirection:'row',
        marginLeft: 8
    },
    rightView:{
        flexDirection:'row',
        marginRight: 8
    },
    Client:{
        marginTop:10,
        marginBottom:10,
        flexDirection:'row',
    },
    client:{
        fontSize:16,
        color:"#555555",
    },
    ClientType:{
        fontSize:16,
        color:"#555555",
    },
    goods:{
        fontSize:16,
        color:"#555555"
    },
    ClientText:{
        flex:2
    },
    GoodsNumber:{
        fontSize:16,
        color:"#555555"
    },
    Price1:{
        fontSize:16,
        fontWeight:"bold",
        color:"#ff4e4e",
        flex:2,
        textAlign:"right"
    },
    modalStyle: {
        backgroundColor:"#3e3d3d",
        opacity:0.9,
        flex:1,
    },
    LoadCenter:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:"#000000",
        opacity:0.8,
        borderRadius:5,
    },
    TextLoading:{
        fontSize:17,
        color:"#ffffff"
    },
    activity:{
        marginBottom:5,
    },
    ScreenList:{
        paddingTop:8,
        paddingBottom:8,
        flexDirection:"row",
        backgroundColor:"#ffffff",
        marginBottom:2,
    },
    ScreenTitle:{
        paddingTop:8,
        paddingBottom:8,
        height:55,
        flexDirection:"row",
    },
    coulumnScreen:{
        flex:1,
        paddingLeft:5,
    },
    coulumnText:{
        fontSize:16,
        textAlign:'center',
        lineHeight:30,
    },
    Determine:{
        marginTop:20,
        flexDirection:"row"
    },
    Cancel:{
        flex:1,
        marginLeft:25,
        backgroundColor:"#ff4e4e",
        paddingTop:13,
        paddingBottom:13,
        borderRadius:5,
    },
    CancelText:{
        fontSize:16,
        color:"#ffffff",
        textAlign:"center",
    },
    footer:{
        height:80,
        flexDirection:"row",
        borderTopWidth:1,
        borderTopColor:"#f2f2f2"
    },
    source:{
        flexDirection:"row",
        flex:1,
    },
    Home:{
        flex:1,
        alignItems: 'center',
        paddingTop:10,
        backgroundColor:"#ffffff",
    },
    home1:{
        color:'#999999',
        fontSize:16,
        marginTop:5,
        flex:1,
    },
    home2:{
        color:'#ff4e4e',
        fontSize:16,
        marginTop:5,
        flex:1,
    },
    ShopCar:{
        width:25,
        height:25,
        backgroundColor:"#ffba00",
        color:"#ffffff",
        textAlign:"center",
        borderRadius:50,
        position:"absolute",
        top:10,
        right:-42,
    },
    Add:{
        position:"absolute",
        right:-50,
        top:5,
        color:"#ff4e4e",
        fontWeight:"bold"
    },
    Succeed:{
        flex:1,
        backgroundColor:"#ffffff",
    },
    SucceedCont:{
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
    },
    SucceedText:{
        marginTop:20,
        fontSize:18,
        color:"#333333"
    },
    DeterMine:{
        position:"absolute",
        bottom:20,
        paddingTop:15,
        paddingBottom:15,
        borderRadius:25,
        width:300,
        backgroundColor:"#ff4e4e",
    },
    DeterMineText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"center"
    },
    rowBack:{
        backgroundColor:"#ff4e4e",
        paddingTop:18,
        paddingBottom:18,
        paddingRight:35
    },
    rowBackText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"right"
    }
});