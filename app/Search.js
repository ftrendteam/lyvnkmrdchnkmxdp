/**
 * 搜索商品页面
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    ScrollView,
    ListView,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager,
    BackAndroid
} from 'react-native';

import Index from "./Index";
import Sell from "../Sell/Sell";//销售付款页面
import ShoppingCart from "./ShoppingCart";
import NetUtils from "../utils/NetUtils";
import NumberUtils from "../utils/NumberUtils";
import FetchUtil from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let db;
let decodepreprint = new DeCodePrePrint18();

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Search: "",
            Price: "",
            totalPrice: "",
            name: "",
            YdCountm: "",
            shuliang: "",
            numberFormat2: "",
            ProdName: "",
            ShopPrice: "",
            Pid: "",
            countm: "",
            prototal: "",
            ProdCode: "",
            DepCode: "",
            SuppCode: "",
            ydcountm: "",
            Number1: "",
            Remark: "",
            BarCode:"",
            modal:"",
            Modify:"",
            OnPrice:"",
            Total:"",
            Price:"",
            OptValue:"",
            IsIntCount:"",
            NewNumber:"",
            SJTZ:"",
            BqYs:"",
            PriceText:1,
            OrderDetails:1,
            Show: false,
            emptydata:false,
            dataRows: "1",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
            ShoppData:"",
        };
        this.dataRows = [];
    }
    componentWillMount() {
       /* if (Platform.OS === 'android') {*/
            // BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
            // this.handleBackButton = this.onBackAndroid.bind(this);

        // }
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            dbAdapter.selectKgOpt('YDPosCanChangePrice').then((data) => {
                for (let i = 0; i < data.length; i++) {
                    var datas = data.item(i);
                    var OptValue=datas.OptValue;
                    this.setState({
                        OptValue:OptValue,
                    });
                }
            })
            this.Storage();
            this.Device();
        });
    }

    Device() {
        DeviceEventEmitter.addListener("code", (reminder) => {
            decodepreprint.init(reminder, dbAdapter);
            if (reminder.length == 18 && decodepreprint.deCodePreFlag()) {
                decodepreprint.deCodeProdCode().then((datas) => {
                    dbAdapter.selectProdCode(datas, 1).then((rows) => {
                        Storage.get('FormType').then((tags) => {
                            this.setState({
                                FormType: tags
                            })
                        })

                        Storage.get('LinkUrl').then((tags) => {
                            this.setState({
                                LinkUrl: tags
                            })
                        })
                        //商品查询
                        Storage.get('userName').then((tags) => {
                            let params = {
                                reqCode: "App_PosReq",
                                reqDetailCode: "App_Client_CurrProdQry",
                                ClientCode: this.state.ClientCode,
                                sDateTime: Date.parse(new Date()),
                                Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                username: tags,
                                usercode: this.state.Usercode,
                                SuppCode: rows.item(0).SuppCode,
                                ShopCode: this.state.ShopCode,
                                ChildShopCode: this.state.ChildShopCode,
                                ProdCode: datas,
                                OrgFormno: this.state.OrgFormno,
                                FormType: this.state.FormType,
                            };
                            FetchUtil.post(this.state.LinkUrl, JSON.stringify(params)).then((data) => {
                                var countm = JSON.stringify(data.countm);
                                var ShopPrice = JSON.stringify(data.ShopPrice);
                                if (data.retcode == 1) {
                                    var countm = JSON.stringify(data.countm);
                                    var ShopPrice = JSON.stringify(data.ShopPrice);
                                    for (let i = 0; i < rows.length; i++) {
                                        var row = rows.item(i);
                                        var ShopCar = rows.item(0).ProdName;
                                        if(DepCode!==null){
                                            if(row.DepCode1!==DepCode){
                                                ToastAndroid.show("请选择该品类下的商品",ToastAndroid.SHORT);
                                                return;
                                            }else{
                                                let numberFormat2 = NumberUtils.numberFormat2((rows.item(0).ShopNumber)*(rows.item(0).ShopPrice));
                                                if (this.state.name == "商品采购" || this.state.name == "协配采购" || this.state.Modify == 1) {
                                                    if(rows.item(0).ShopNumber == 0){
                                                        this.setState({
                                                            numberFormat2:0.00,
                                                            Number1: '',
                                                        })
                                                    }else{
                                                        this.setState({
                                                            numberFormat2:numberFormat2,
                                                            Number1: rows.item(0).ShopNumber,
                                                        })
                                                    }
                                                    this.setState({
                                                        ProdName: row.ProdName,
                                                        ShopPrice: ShopPrice,
                                                        Pid: row.Pid,
                                                        Remark: row.ShopRemark,
                                                        prototal: row.ShopAmount,
                                                        ProdCode: row.ProdCode,
                                                        DepCode: row.DepCode1,
                                                        SuppCode: row.SuppCode,
                                                        BarCode: row.BarCode,
                                                        ydcountm: countm,
                                                        focus: true,
                                                        Search: "",
                                                        modal: 1,
                                                        IsIntCount:row.IsIntCount
                                                    })
                                                }else if(this.state.name=="售价调整"){
                                                    dbAdapter.selectShopInfoData(rowData.Pid).then((datas)=> {
                                                        if(datas.length==0){
                                                            this.setState({
                                                                ProdName: row.ProdName,
                                                                ShopPrice: row.ShopPrice,
                                                                Pid: row.Pid,
                                                                Number1: "",
                                                                Remark: row.ShopRemark,
                                                                prototal: row.ShopAmount,
                                                                ProdCode: row.ProdCode,
                                                                DepCode: row.DepCode1,
                                                                SuppCode: row.SuppCode,
                                                                BarCode: row.BarCode,
                                                                NewNumber: data.ydcountm,
                                                                focus: true,
                                                                Search:"",
                                                                PriceText:"",
                                                                modal:1,
                                                                IsIntCount:row.IsIntCount
                                                            })
                                                        }else{
                                                            for (let i = 0; i < datas.length; i++) {
                                                                var data = datas.item(i);
                                                                this.setState({
                                                                    ProdName: row.ProdName,
                                                                    ShopPrice: row.ShopPrice,
                                                                    Pid: row.Pid,
                                                                    Number1: 1,
                                                                    Remark: row.ShopRemark,
                                                                    prototal: row.ShopAmount,
                                                                    ProdCode: row.ProdCode,
                                                                    DepCode: row.DepCode1,
                                                                    SuppCode: row.SuppCode,
                                                                    BarCode: row.BarCode,
                                                                    NewNumber: data.ydcountm,
                                                                    focus: true,
                                                                    Search:"",
                                                                    PriceText:"",
                                                                    modal:1,
                                                                    IsIntCount:row.IsIntCount
                                                                })
                                                            }
                                                        }
                                                    })
                                                }else {
                                                    if(this.state.name=="标签采集"&&row.ShopNumber == 0){
                                                        this.setState({
                                                            Number1: 1,
                                                        })
                                                    }else{
                                                        this.setState({
                                                            numberFormat2:numberFormat2,
                                                            Number1: row.ShopNumber,
                                                        })
                                                    }

                                                    if(this.state.name!=="标签采集"&&row.ShopNumber == 0){
                                                        this.setState({
                                                            numberFormat2:0.00,
                                                            Number1: '',
                                                        })
                                                    }else{
                                                        this.setState({
                                                            numberFormat2:numberFormat2,
                                                            Number1: rowData.ShopNumber,
                                                        })
                                                    }
                                                    this.setState({
                                                        ProdName: row.ProdName,
                                                        ShopPrice: row.ShopPrice,
                                                        Pid: row.Pid,
                                                        Remark: row.ShopRemark,
                                                        prototal: row.ShopAmount,
                                                        ProdCode: row.ProdCode,
                                                        DepCode: row.DepCode1,
                                                        SuppCode: row.SuppCode,
                                                        BarCode: row.BarCode,
                                                        ydcountm: countm,
                                                        focus: true,
                                                        Search: "",
                                                        modal: 1,
                                                        IsIntCount:row.IsIntCount
                                                    })
                                                }
                                            }
                                        }else{
                                            let numberFormat2 = NumberUtils.numberFormat2((row.ShopNumber)*(rows.ShopPrice));
                                            if (this.state.name == "商品采购" || this.state.name == "协配采购" || this.state.Modify == 1) {
                                                if(row.ShopNumber == 0){
                                                    this.setState({
                                                        numberFormat2:0.00,
                                                        Number1: '',
                                                    })
                                                }else{
                                                    this.setState({
                                                        numberFormat2:numberFormat2,
                                                        Number1: row.ShopNumber,
                                                    })
                                                }
                                                this.setState({
                                                    ProdName: row.ProdName,
                                                    ShopPrice: ShopPrice,
                                                    Pid: row.Pid,
                                                    Remark: row.ShopRemark,
                                                    prototal: row.ShopAmount,
                                                    ProdCode: row.ProdCode,
                                                    DepCode: row.DepCode1,
                                                    SuppCode: row.SuppCode,
                                                    BarCode: row.BarCode,
                                                    ydcountm: countm,
                                                    focus: true,
                                                    Search: "",
                                                    modal: 1,
                                                    IsIntCount:row.IsIntCount
                                                })
                                            }else if(this.state.name=="售价调整"){
                                                dbAdapter.selectShopInfoData(rowData.Pid).then((datas)=> {
                                                    if(datas.length==0){
                                                        this.setState({
                                                            ProdName: row.ProdName,
                                                            ShopPrice: row.ShopPrice,
                                                            Pid: row.Pid,
                                                            Number1: "",
                                                            Remark: row.ShopRemark,
                                                            prototal: row.ShopAmount,
                                                            ProdCode: row.ProdCode,
                                                            DepCode: row.DepCode1,
                                                            SuppCode: row.SuppCode,
                                                            BarCode: row.BarCode,
                                                            NewNumber: data.ydcountm,
                                                            focus: true,
                                                            Search:"",
                                                            PriceText:"",
                                                            modal:1,
                                                            IsIntCount:row.IsIntCount
                                                        })
                                                    }else{
                                                        for (let i = 0; i < datas.length; i++) {
                                                            var data = datas.item(i);
                                                            this.setState({
                                                                ProdName: row.ProdName,
                                                                ShopPrice: row.ShopPrice,
                                                                Pid: row.Pid,
                                                                Number1: 1,
                                                                Remark: row.ShopRemark,
                                                                prototal: row.ShopAmount,
                                                                ProdCode: row.ProdCode,
                                                                DepCode: row.DepCode1,
                                                                SuppCode: row.SuppCode,
                                                                BarCode: row.BarCode,
                                                                NewNumber: data.ydcountm,
                                                                focus: true,
                                                                Search:"",
                                                                PriceText:"",
                                                                modal:1,
                                                                IsIntCount:row.IsIntCount
                                                            })
                                                        }
                                                    }
                                                })
                                            }else {
                                                if(this.state.name=="标签采集"&&rows.item(0).ShopNumber == 0){
                                                    this.setState({
                                                        Number1: 1,
                                                    })
                                                }else{
                                                    this.setState({
                                                        numberFormat2:numberFormat2,
                                                        Number1: row.ShopNumber,
                                                    })
                                                }

                                                if(this.state.name!=="标签采集"&&row.ShopNumber == 0){
                                                    this.setState({
                                                        numberFormat2:0.00,
                                                        Number1: '',
                                                    })
                                                }else{
                                                    this.setState({
                                                        numberFormat2:numberFormat2,
                                                        Number1: rowData.ShopNumber,
                                                    })
                                                }
                                                this.setState({
                                                    ProdName: row.ProdName,
                                                    ShopPrice: row.ShopPrice,
                                                    Pid: row.Pid,
                                                    Remark: row.ShopRemark,
                                                    prototal: row.ShopAmount,
                                                    ProdCode: row.ProdCode,
                                                    DepCode: row.DepCode1,
                                                    SuppCode: row.SuppCode,
                                                    BarCode: row.BarCode,
                                                    ydcountm: countm,
                                                    focus: true,
                                                    Search: "",
                                                    modal: 1,
                                                    IsIntCount:row.IsIntCount
                                                })
                                            }
                                        }
                                        Storage.get('YdCountm').then((ydcountm) => {
                                            if (ydcountm == 2) {//原单数量
                                                this.setState({
                                                    Number1: countm,
                                                })
                                            }
                                            this.setState({
                                                YdCountm: ydcountm
                                            })
                                        });

                                        Storage.get('YuanDan').then((tags) => {
                                            if (tags == "1") {
                                                if (this.state.Number1 == "" && !this.state.isFrist) {
                                                    this.setState({
                                                        Number1: this.state.ydcountm
                                                    })
                                                }
                                            }
                                            let numberFormat1 = NumberUtils.numberFormat2(this.state.ShopPrice);
                                            let numberFormat2 = NumberUtils.numberFormat2((this.state.Number1) * (this.state.ShopPrice));
                                            this.setState({
                                                ShopPrice: numberFormat1,
                                                numberFormat2: numberFormat2,
                                            })
                                        })
                                    }
                                }else {
                                    alert(JSON.stringify(data))
                                }
                            }, (err) => {
                                alert("网络请求失败");
                            })
                        })
                    })
                });
            } else {
                Storage.get('DepCode').then((DepCode) => {
                    Storage.get('FormType').then((FormType) => {
                        Storage.get('LinkUrl').then((LinkUrl) => {
                            Storage.get('scode').then((scode) => {
                                dbAdapter.selectAidCode(reminder, 1).then((rows) => {
                                    for (let i = 0; i < rows.length; i++) {
                                        var row = rows.item(i);
                                        if(this.state.name=="商品采购"||this.state.name=="商品验收"||this.state.name=="协配采购"||this.state.name=="协配收货"){
                                            var SuppCode=scode;
                                        }else{
                                            var SuppCode=row.SuppCode;
                                        }
                                        Storage.get('userName').then((userName) => {
                                            let params = {
                                                reqCode: "App_PosReq",
                                                reqDetailCode: "App_Client_CurrProdQry",
                                                ClientCode: this.state.ClientCode,
                                                sDateTime: Date.parse(new Date()),
                                                Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                                username: userName,
                                                usercode: this.state.Usercode,
                                                SuppCode: SuppCode,
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
                                                    if(DepCode!==null){
                                                        if(row.DepCode1!==DepCode){
                                                            ToastAndroid.show("请选择该品类下的商品",ToastAndroid.SHORT);
                                                            return;
                                                        }else{
                                                            let numberFormat2 = NumberUtils.numberFormat2((row.ShopNumber)*(row.ShopPrice));
                                                            if (this.state.name == "商品采购" || this.state.name == "协配采购" || this.state.Modify == 1) {
                                                                if(row.ShopNumber == 0){
                                                                    this.setState({
                                                                        numberFormat2:0.00,
                                                                        Number1: '',
                                                                    })
                                                                }else{
                                                                    this.setState({
                                                                        numberFormat2:numberFormat2,
                                                                        Number1: row.ShopNumber,
                                                                    })
                                                                }
                                                                this.setState({
                                                                    ShopPrice: ShopPrice,
                                                                    ProdName: row.ProdName,
                                                                    Pid: row.Pid,
                                                                    Remark: ro.ShopRemark,
                                                                    prototal: row.prototal,
                                                                    ProdCode: row.ProdCode,
                                                                    DepCode: row.DepCode1,
                                                                    SuppCode: row.SuppCode,
                                                                    BarCode: row.BarCode,
                                                                    ydcountm: countm,
                                                                    Search:"",
                                                                    modal:1,
                                                                    IsIntCount:row.IsIntCount
                                                                })
                                                            }else if(this.state.name=="售价调整"){
                                                                dbAdapter.selectShopInfoData(rowData.Pid).then((datas)=> {
                                                                    if(datas.length==0){
                                                                        this.setState({
                                                                            ProdName: row.ProdName,
                                                                            ShopPrice: row.ShopPrice,
                                                                            Pid: row.Pid,
                                                                            Number1: "",
                                                                            Remark: row.ShopRemark,
                                                                            prototal: row.ShopAmount,
                                                                            ProdCode: row.ProdCode,
                                                                            DepCode: row.DepCode1,
                                                                            SuppCode: row.SuppCode,
                                                                            BarCode: row.BarCode,
                                                                            NewNumber: data.ydcountm,
                                                                            focus: true,
                                                                            Search:"",
                                                                            PriceText:"",
                                                                            modal:1,
                                                                            IsIntCount:row.IsIntCount
                                                                        })
                                                                    }else{
                                                                        for (let i = 0; i < datas.length; i++) {
                                                                            var data = datas.item(i);
                                                                            this.setState({
                                                                                ProdName: rows.item(0).ProdName,
                                                                                ShopPrice: rows.item(0).ShopPrice,
                                                                                Pid: rows.item(0).Pid,
                                                                                Number1: 1,
                                                                                Remark: row.ShopRemark,
                                                                                prototal: row.ShopAmount,
                                                                                ProdCode: row.ProdCode,
                                                                                DepCode: row.DepCode1,
                                                                                SuppCode: row.SuppCode,
                                                                                BarCode: row.BarCode,
                                                                                NewNumber: data.ydcountm,
                                                                                focus: true,
                                                                                Search:"",
                                                                                PriceText:"",
                                                                                modal:1,
                                                                                IsIntCount:row.IsIntCount
                                                                            })
                                                                        }
                                                                    }
                                                                })
                                                            }else {
                                                                if(this.state.name=="标签采集"&&row.ShopNumber == 0){
                                                                    this.setState({
                                                                        Number1: 1,
                                                                    })
                                                                }else{
                                                                    this.setState({
                                                                        numberFormat2:numberFormat2,
                                                                        Number1: row.ShopNumber,
                                                                    })
                                                                }

                                                                if(this.state.name!=="标签采集"&&row.ShopNumber == 0){
                                                                    this.setState({
                                                                        numberFormat2:0.00,
                                                                        Number1: '',
                                                                    })
                                                                }else{
                                                                    this.setState({
                                                                        numberFormat2:numberFormat2,
                                                                        Number1: row.ShopNumber,
                                                                    })
                                                                }
                                                                this.setState({
                                                                    ShopPrice: ShopPrice,
                                                                    ProdName: row.ProdName,
                                                                    Pid: row.Pid,
                                                                    Remark: row.ShopRemark,
                                                                    prototal: row.prototal,
                                                                    ProdCode: row.ProdCode,
                                                                    DepCode: row.DepCode1,
                                                                    SuppCode: row.SuppCode,
                                                                    BarCode: row.BarCode,
                                                                    ydcountm: countm,
                                                                    Search:"",
                                                                    modal:1,
                                                                    IsIntCount:row.IsIntCount
                                                                })
                                                            }
                                                        }
                                                    }else{
                                                        let numberFormat2 = NumberUtils.numberFormat2((row.ShopNumber)*(ShopPrice));
                                                        if (this.state.name == "商品采购" || this.state.name == "协配采购" || this.state.Modify == 1) {
                                                            if(row.ShopNumber == 0){
                                                                this.setState({
                                                                    numberFormat2:0.00,
                                                                    Number1: '',
                                                                })
                                                            }else{
                                                                this.setState({
                                                                    numberFormat2:numberFormat2,
                                                                    Number1: row.ShopNumber,
                                                                })
                                                            }
                                                            this.setState({
                                                                ShopPrice: ShopPrice,
                                                                ProdName: row.ProdName,
                                                                Pid: row.Pid,
                                                                Remark: row.ShopRemark,
                                                                prototal: row.prototal,
                                                                ProdCode: row.ProdCode,
                                                                DepCode: row.DepCode1,
                                                                SuppCode: row.SuppCode,
                                                                BarCode: row.BarCode,
                                                                ydcountm: countm,
                                                                Search:"",
                                                                modal:1,
                                                                IsIntCount:row.IsIntCount
                                                            })
                                                        }else if(this.state.name=="售价调整"){
                                                            dbAdapter.selectShopInfoData(rowData.Pid).then((datas)=> {
                                                                if(datas.length==0){
                                                                    this.setState({
                                                                        ProdName: row.ProdName,
                                                                        ShopPrice: row.ShopPrice,
                                                                        Pid: row.Pid,
                                                                        Number1: "",
                                                                        Remark: row.ShopRemark,
                                                                        prototal: row.ShopAmount,
                                                                        ProdCode: row.ProdCode,
                                                                        DepCode: row.DepCode1,
                                                                        SuppCode: row.SuppCode,
                                                                        BarCode: row.BarCode,
                                                                        NewNumber: data.ydcountm,
                                                                        focus: true,
                                                                        Search:"",
                                                                        PriceText:"",
                                                                        modal:1,
                                                                        IsIntCount:row.IsIntCount
                                                                    })
                                                                }else{
                                                                    for (let i = 0; i < datas.length; i++) {
                                                                        var data = datas.item(i);
                                                                        this.setState({
                                                                            ProdName: row.ProdName,
                                                                            ShopPrice: row.ShopPrice,
                                                                            Pid: row.Pid,
                                                                            Number1: 1,
                                                                            Remark: row.ShopRemark,
                                                                            prototal: row.ShopAmount,
                                                                            ProdCode: row.ProdCode,
                                                                            DepCode: row.DepCode1,
                                                                            SuppCode: row.SuppCode,
                                                                            BarCode: row.BarCode,
                                                                            NewNumber: data.ydcountm,
                                                                            focus: true,
                                                                            Search:"",
                                                                            PriceText:"",
                                                                            modal:1,
                                                                            IsIntCount:row.IsIntCount
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        }else {
                                                            if(this.state.name=="标签采集"&&row.ShopNumber == 0){
                                                                this.setState({
                                                                    Number1: 1,
                                                                })
                                                            }else if(this.state.name!=="标签采集"&&row.ShopNumber == 0){
                                                                this.setState({
                                                                    numberFormat2:0.00,
                                                                    Number1: '',
                                                                })
                                                            }else{
                                                                this.setState({
                                                                    numberFormat2:numberFormat2,
                                                                    Number1: row.ShopNumber,
                                                                })
                                                            }
                                                            this.setState({
                                                                ShopPrice: ShopPrice,
                                                                ProdName: row.ProdName,
                                                                Pid: row.Pid,
                                                                Remark: row.ShopRemark,
                                                                prototal: row.prototal,
                                                                ProdCode: row.ProdCode,
                                                                DepCode: row.DepCode1,
                                                                SuppCode: row.SuppCode,
                                                                BarCode: row.BarCode,
                                                                ydcountm: countm,
                                                                Search:"",
                                                                modal:1,
                                                                IsIntCount:row.IsIntCount
                                                            })
                                                        }
                                                    }
                                                    this.Modal();
                                                } else {
                                                    alert(JSON.stringify(data))
                                                }
                                            }, (err) => {
                                                alert("网络请求失败");
                                            })
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            }
        })

    }

    Storage() {
        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
            })
            if(tags=="标签采集"||tags=="移动销售"){
                this.setState({
                    BqYs: "1",
                })
            }
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

        Storage.get('YdCountm').then((tags)=>{
            this.setState({
                YdCountm:tags
            })
        })

        Storage.get('Modify').then((tags) => {
            this.setState({
                Modify: tags
            })
        })

        Storage.get('ShoppData').then((tags) => {
            this.setState({
                ShoppData: tags
            })
        })

    }

    Close() {
        DeviceEventEmitter.removeAllListeners();
        if(this.state.name=="移动销售"){
            var nextRoute = {
                name: "Sell",
                component: Sell
            };
            this.props.navigator.push(nextRoute);
        }else{
            var nextRoute = {
                name: "清单",
                component: ShoppingCart,
            };
            this.props.navigator.push(nextRoute);
        }
    }

    inputOnBlur(value) {
        this.Modal();
        dbAdapter.selectAidCode(value, 1).then((rows) => {
            this.dataRows = [];
            for (let i = 0; i < rows.length; i++) {
                var row = rows.item(i);
                this.dataRows.push(row);
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                dataRows: this.dataRows
            })
        });
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={() => this.OrderDetails(rowData)} underlayColor={'red'} style={styles.Block}>
                <Text style={styles.BlockText}>{rowData.ProdName}</Text>
            </TouchableOpacity>
        );
    }
    /**
     * 商品查询
     */
    OrderDetails(rowData) {
        Storage.get('DepCode').then((DepCode) => {
            Storage.get('FormType').then((FormType) => {
                Storage.get('LinkUrl').then((LinkUrl) => {
                    Storage.get('scode').then((scode) => {
                        dbAdapter.selectAidCode(rowData.ProdCode, 1).then((rows) => {
                            if(this.state.name=="商品采购"||this.state.name=="商品验收"||this.state.name=="协配采购"||this.state.name=="协配收货"){
                                var SuppCode=scode
                            }else{
                                var SuppCode=rowData.SuppCode
                            }
                            Storage.get('userName').then((userName) => {
                                let params = {
                                    reqCode: "App_PosReq",
                                    reqDetailCode: "App_Client_CurrProdQry",
                                    ClientCode: this.state.ClientCode,
                                    sDateTime: Date.parse(new Date()),
                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                    username: userName,
                                    usercode: this.state.Usercode,
                                    SuppCode: SuppCode,
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
                                        for (let i = 0; i < rows.length; i++) {
                                            var row = rows.item(i);
                                            if(DepCode!==null){
                                                if(row.DepCode1!==DepCode){
                                                    ToastAndroid.show("请选择该品类下的商品",ToastAndroid.SHORT);
                                                    return;
                                                }else{
                                                    let numberFormat2 = NumberUtils.numberFormat2((rowData.ShopNumber)*(row.ShopPrice));
                                                    if (this.state.name == "商品采购" || this.state.name == "协配采购" || this.state.Modify == 1) {
                                                        if(rowData.ShopNumber == 0){
                                                            this.setState({
                                                                numberFormat2:0.00,
                                                                Number1: '',
                                                            })
                                                        }else{
                                                            this.setState({
                                                                numberFormat2:numberFormat2,
                                                                Number1: rowData.ShopNumber,
                                                            })
                                                        }
                                                        this.setState({
                                                            ShopPrice: ShopPrice,
                                                            ProdName: rowData.ProdName,
                                                            Pid: rowData.Pid,
                                                            Remark: rowData.ShopRemark,
                                                            prototal: rowData.prototal,
                                                            ProdCode: rowData.ProdCode,
                                                            DepCode: rowData.DepCode1,
                                                            SuppCode: rowData.SuppCode,
                                                            BarCode: rowData.BarCode,
                                                            ydcountm: countm,
                                                            PriceText:"",
                                                            Search:"",
                                                            modal:1,
                                                            IsIntCount:row.IsIntCount
                                                        })
                                                    }else if(this.state.name=="售价调整"){
                                                        dbAdapter.selectShopInfoData(rowData.Pid).then((datas)=> {
                                                            if(datas.length==0){
                                                                this.setState({
                                                                    ShopPrice: ShopPrice,
                                                                    ProdName: rowData.ProdName,
                                                                    Pid: rowData.Pid,
                                                                    Number1: 1,
                                                                    Remark: rowData.ShopRemark,
                                                                    prototal: rowData.prototal,
                                                                    ProdCode: rowData.ProdCode,
                                                                    DepCode: rowData.DepCode1,
                                                                    SuppCode: rowData.SuppCode,
                                                                    BarCode: rowData.BarCode,
                                                                    NewNumber: "",
                                                                    Search:"",
                                                                    PriceText:"",
                                                                    modal:1,
                                                                    IsIntCount:row.IsIntCount
                                                                })
                                                            }else{
                                                                for (let i = 0; i < datas.length; i++) {
                                                                    var data = datas.item(i);
                                                                    this.setState({
                                                                        ShopPrice: ShopPrice,
                                                                        ProdName: rowData.ProdName,
                                                                        Pid: rowData.Pid,
                                                                        Number1: 1,
                                                                        Remark: rowData.ShopRemark,
                                                                        prototal: rowData.prototal,
                                                                        ProdCode: rowData.ProdCode,
                                                                        DepCode: rowData.DepCode1,
                                                                        SuppCode: rowData.SuppCode,
                                                                        BarCode: rowData.BarCode,
                                                                        NewNumber: data.ydcountm,
                                                                        Search:"",
                                                                        PriceText:"",
                                                                        modal:1,
                                                                        IsIntCount:row.IsIntCount
                                                                    })
                                                                }
                                                            }
                                                        })
                                                    }else {
                                                        if(this.state.BqYs=="1"&&rowData.ShopNumber == 0){
                                                            this.setState({
                                                                Number1: 1,
                                                            })
                                                        }else{
                                                            this.setState({
                                                                numberFormat2:numberFormat2,
                                                                Number1: rowData.ShopNumber,
                                                            })
                                                        }

                                                        if(this.state.BqYs==""&&rowData.ShopNumber == 0){
                                                            this.setState({
                                                                numberFormat2:0.00,
                                                                Number1: '',
                                                            })
                                                        }else{
                                                            this.setState({
                                                                numberFormat2:numberFormat2,
                                                                Number1: rowData.ShopNumber,
                                                            })
                                                        }
                                                        this.setState({
                                                            ShopPrice: ShopPrice,
                                                            ProdName: rowData.ProdName,
                                                            Pid: rowData.Pid,
                                                            Remark: rowData.ShopRemark,
                                                            prototal: rowData.prototal,
                                                            ProdCode: rowData.ProdCode,
                                                            DepCode: rowData.DepCode1,
                                                            SuppCode: rowData.SuppCode,
                                                            BarCode: rowData.BarCode,
                                                            ydcountm: countm,
                                                            PriceText:"",
                                                            Search:"",
                                                            modal:1,
                                                            IsIntCount:row.IsIntCount
                                                        })
                                                    }
                                                }
                                            }else{
                                                let numberFormat2 = NumberUtils.numberFormat2((rowData.ShopNumber)*(ShopPrice));
                                                if (this.state.name == "商品采购" || this.state.name == "协配采购" || this.state.Modify == 1) {
                                                    if(rowData.ShopNumber == 0){
                                                        this.setState({
                                                            numberFormat2:0.00,
                                                            Number1: '',
                                                        })
                                                    }else{
                                                        this.setState({
                                                            numberFormat2:numberFormat2,
                                                            Number1: rowData.ShopNumber,
                                                        })
                                                    }
                                                    this.setState({
                                                        ShopPrice: ShopPrice,
                                                        ProdName: rowData.ProdName,
                                                        Pid: rowData.Pid,
                                                        Remark: rowData.ShopRemark,
                                                        prototal: rowData.prototal,
                                                        ProdCode: rowData.ProdCode,
                                                        DepCode: rowData.DepCode1,
                                                        SuppCode: rowData.SuppCode,
                                                        BarCode: rowData.BarCode,
                                                        ydcountm: countm,
                                                        PriceText:"",
                                                        Search:"",
                                                        modal:1,
                                                        IsIntCount:row.IsIntCount
                                                    })
                                                }else if(this.state.name=="售价调整"){
                                                    dbAdapter.selectShopInfoData(rowData.Pid).then((datas)=> {
                                                        if(datas.length==0){
                                                            this.setState({
                                                                ShopPrice: ShopPrice,
                                                                ProdName: rowData.ProdName,
                                                                Pid: rowData.Pid,
                                                                Number1: 1,
                                                                Remark: rowData.ShopRemark,
                                                                prototal: rowData.prototal,
                                                                ProdCode: rowData.ProdCode,
                                                                DepCode: rowData.DepCode1,
                                                                SuppCode: rowData.SuppCode,
                                                                BarCode: rowData.BarCode,
                                                                NewNumber: "",
                                                                Search:"",
                                                                PriceText:"",
                                                                modal:1,
                                                                IsIntCount:row.IsIntCount
                                                            })
                                                        }else{
                                                            for (let i = 0; i < datas.length; i++) {
                                                                var data = datas.item(i);
                                                                this.setState({
                                                                    ShopPrice: ShopPrice,
                                                                    ProdName: rowData.ProdName,
                                                                    Pid: rowData.Pid,
                                                                    Number1: 1,
                                                                    Remark: rowData.ShopRemark,
                                                                    prototal: rowData.prototal,
                                                                    ProdCode: rowData.ProdCode,
                                                                    DepCode: rowData.DepCode1,
                                                                    SuppCode: rowData.SuppCode,
                                                                    BarCode: rowData.BarCode,
                                                                    NewNumber: data.ydcountm,
                                                                    Search:"",
                                                                    PriceText:"",
                                                                    modal:1,
                                                                    IsIntCount:row.IsIntCount
                                                                })
                                                            }
                                                        }
                                                    })
                                                }else {
                                                    if(this.state.BqYs=="1"&&rowData.ShopNumber == 0){
                                                        this.setState({
                                                            Number1: 1,
                                                        })
                                                    }else if(this.state.BqYs==""&&rowData.ShopNumber == 0){
                                                        this.setState({
                                                            numberFormat2:0.00,
                                                            Number1: '',
                                                        })
                                                    }else{
                                                        this.setState({
                                                            numberFormat2:numberFormat2,
                                                            Number1: rowData.ShopNumber,
                                                        })
                                                    }
                                                    this.setState({
                                                        ShopPrice: ShopPrice,
                                                        ProdName: rowData.ProdName,
                                                        Pid: rowData.Pid,
                                                        Remark: rowData.ShopRemark,
                                                        prototal: rowData.prototal,
                                                        ProdCode: rowData.ProdCode,
                                                        DepCode: rowData.DepCode1,
                                                        SuppCode: rowData.SuppCode,
                                                        BarCode: rowData.BarCode,
                                                        ydcountm: countm,
                                                        PriceText:"",
                                                        Search:"",
                                                        modal:1,
                                                        IsIntCount:row.IsIntCount
                                                    })
                                                }
                                            }
                                        }
                                        this.Modal();
                                    } else {
                                        alert(JSON.stringify(data))
                                    }
                                }, (err) => {
                                    alert("网络请求失败");
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    Modal() {
        let isShow = this.state.Show;
        this.setState({
            Show: !isShow,
        });
    }

    onSubmitEditing(){
        var numberFormat2 = this.state.Number1 * this.state.ShopPrice;
        let shopprice=Math.round(numberFormat2 * 100) / 100;
        this.setState({
            numberFormat2:shopprice
        })
    }

    onNumber(){
        if(this.state.YdCountm == 6&&this.state.ydcountm==0){
            alert("库存为0，该商品不能进行配送")
        }else {
            if(this.state.Number1<0){
                if(this.state.name=="商品损溢"||this.state.name=="商品盘点"||this.state.name=="移动销售"){
                    var numberFormat2 = this.state.Number1 * this.state.ShopPrice;
                    let shopprice=Math.round(numberFormat2 * 100) / 100;
                    this.setState({
                        numberFormat2:shopprice
                    })
                    if(this.state.name=="商品采购"||this.state.name=="协配采购"||this.state.Modify==1){
                        dbAdapter.selectKgOpt('YDPosCanChangePrice').then((data) => {
                            for (let i = 0; i < data.length; i++) {
                                var datas = data.item(i);
                                if(datas.OptValue==1){
                                    this.setState({
                                        OnPrice:1,
                                        PriceText:1
                                    });
                                }
                            }
                        })
                    }else if(this.state.name=="移动销售"){
                        this.setState({
                            OnPrice:1,
                            PriceText:1
                        });
                    }else{
                        if(this.state.IsIntCount==0){
                            var number = this.state.Number1;//获取数量的数字
                            if(parseInt(number)==number) {
                                if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                    var shopInfoData = [];
                                    var shopInfo = {};
                                    shopInfo.Pid = this.state.Pid;
                                    shopInfo.ProdCode = this.state.ProdCode;
                                    shopInfo.prodname = this.state.ProdName;
                                    shopInfo.countm = this.state.Number1;
                                    shopInfo.ShopPrice = this.state.ShopPrice;
                                    if(this.state.name=="标签采集"){
                                        shopInfo.prototal = "0";
                                    }else{
                                        shopInfo.prototal = NumberUtils.numberFormat2(ShopPrice);
                                    }
                                    shopInfo.promemo = this.state.Remark;
                                    shopInfo.DepCode = this.state.DepCode;
                                    shopInfo.ydcountm = this.state.ydcountm;
                                    shopInfo.SuppCode = this.state.SuppCode;
                                    shopInfo.BarCode = this.state.BarCode;
                                    shopInfoData.push(shopInfo);
                                    //调用插入表方法
                                    dbAdapter.insertShopInfo(shopInfoData);
                                    this.setState({
                                        Number1: "",
                                        ydcountm: "",
                                        ShopPrice: "",
                                        numberFormat2: "",
                                        Remark: "",
                                        ProdName: "",
                                        modal:"",
                                    })
                                }else{
                                    if(this.state.Number1==0){
                                        ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                                    }else{
                                        var shopInfoData = [];
                                        var shopInfo = {};
                                        shopInfo.Pid = this.state.Pid;
                                        shopInfo.ProdCode = this.state.ProdCode;
                                        shopInfo.prodname = this.state.ProdName;
                                        shopInfo.countm = this.state.Number1;
                                        shopInfo.ShopPrice = this.state.ShopPrice;
                                        if(this.state.name=="标签采集"){
                                            shopInfo.prototal = "0";
                                        }else{
                                            shopInfo.prototal = NumberUtils.numberFormat2(ShopPrice);
                                        }
                                        shopInfo.promemo = this.state.Remark;
                                        shopInfo.DepCode = this.state.DepCode;
                                        shopInfo.ydcountm = this.state.ydcountm;
                                        shopInfo.SuppCode = this.state.SuppCode;
                                        shopInfo.BarCode = this.state.BarCode;
                                        shopInfoData.push(shopInfo);
                                        //调用插入表方法
                                        dbAdapter.insertShopInfo(shopInfoData);
                                        this.setState({
                                            Number1: "",
                                            ydcountm: "",
                                            ShopPrice: "",
                                            numberFormat2: "",
                                            Remark: "",
                                            ProdName: "",
                                            modal:"",
                                        })
                                    }
                                }
                            }else{
                                alert("数量不能含有小数");
                                this.setState({
                                    Total:"",
                                });
                            }
                        } else {
                            if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                var shopInfoData = [];
                                var shopInfo = {};
                                shopInfo.Pid = this.state.Pid;
                                shopInfo.ProdCode = this.state.ProdCode;
                                shopInfo.prodname = this.state.ProdName;
                                shopInfo.countm = this.state.Number1;
                                shopInfo.ShopPrice = this.state.ShopPrice;
                                if(this.state.name=="标签采集"){
                                    shopInfo.prototal = "0";
                                }else{
                                    shopInfo.prototal = shopprice;
                                }
                                shopInfo.promemo = this.state.Remark;
                                shopInfo.DepCode = this.state.DepCode;
                                shopInfo.ydcountm = this.state.ydcountm;
                                shopInfo.SuppCode = this.state.SuppCode;
                                shopInfo.BarCode = this.state.BarCode;
                                shopInfoData.push(shopInfo);
                                //调用插入表方法
                                dbAdapter.insertShopInfo(shopInfoData);
                                this.setState({
                                    Number1: "",
                                    ydcountm: "",
                                    ShopPrice: "",
                                    numberFormat2: "",
                                    Remark: "",
                                    ProdName: "",
                                    modal:"",
                                })
                            }else{
                                if(this.state.Number1==0){
                                    ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                                }else{
                                    var shopInfoData = [];
                                    var shopInfo = {};
                                    shopInfo.Pid = this.state.Pid;
                                    shopInfo.ProdCode = this.state.ProdCode;
                                    shopInfo.prodname = this.state.ProdName;
                                    shopInfo.countm = this.state.Number1;
                                    shopInfo.ShopPrice = this.state.ShopPrice;
                                    if(this.state.name=="标签采集"){
                                        shopInfo.prototal = "0";
                                    }else{
                                        shopInfo.prototal = shopprice;
                                    }
                                    shopInfo.promemo = this.state.Remark;
                                    shopInfo.DepCode = this.state.DepCode;
                                    shopInfo.ydcountm = this.state.ydcountm;
                                    shopInfo.SuppCode = this.state.SuppCode;
                                    shopInfo.BarCode = this.state.BarCode;
                                    shopInfoData.push(shopInfo);
                                    //调用插入表方法
                                    dbAdapter.insertShopInfo(shopInfoData);
                                    this.setState({
                                        Number1: "",
                                        ydcountm: "",
                                        ShopPrice: "",
                                        numberFormat2: "",
                                        Remark: "",
                                        ProdName: "",
                                        modal:"",
                                    })
                                }
                            }
                        }
                    }
                }else{
                    ToastAndroid.show('商品数量不能为负数', ToastAndroid.SHORT);
                }
            }else{
                var numberFormat2 = this.state.Number1 * this.state.ShopPrice;
                let shopprice=Math.round(numberFormat2 * 100) / 100;
                this.setState({
                    numberFormat2:shopprice
                })
                if(this.state.name=="商品采购"||this.state.name=="协配采购"||this.state.Modify==1){
                    this.setState({
                        OnPrice:1,
                        PriceText:1
                    });
                }else{
                    if(this.state.IsIntCount==0){
                        var number = this.state.Number1;//获取数量的数字
                        if(parseInt(number)==number) {
                            if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                var shopInfoData = [];
                                var shopInfo = {};
                                shopInfo.Pid = this.state.Pid;
                                shopInfo.ProdCode = this.state.ProdCode;
                                shopInfo.prodname = this.state.ProdName;
                                shopInfo.countm = this.state.Number1;
                                shopInfo.ShopPrice = this.state.ShopPrice;
                                if(this.state.name=="标签采集"){
                                    shopInfo.prototal = "0";
                                }else{
                                    shopInfo.prototal = NumberUtils.numberFormat2(ShopPrice);
                                }
                                shopInfo.promemo = this.state.Remark;
                                shopInfo.DepCode = this.state.DepCode;
                                shopInfo.ydcountm = this.state.ydcountm;
                                shopInfo.SuppCode = this.state.SuppCode;
                                shopInfo.BarCode = this.state.BarCode;
                                shopInfoData.push(shopInfo);
                                //调用插入表方法
                                dbAdapter.insertShopInfo(shopInfoData);
                                this.setState({
                                    Number1: "",
                                    ydcountm: "",
                                    ShopPrice: "",
                                    numberFormat2: "",
                                    Remark: "",
                                    ProdName: "",
                                    modal:"",
                                })
                            }else{
                                if(this.state.Number1==0){
                                    ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                                }else{
                                    var shopInfoData = [];
                                    var shopInfo = {};
                                    shopInfo.Pid = this.state.Pid;
                                    shopInfo.ProdCode = this.state.ProdCode;
                                    shopInfo.prodname = this.state.ProdName;
                                    shopInfo.countm = this.state.Number1;
                                    shopInfo.ShopPrice = this.state.ShopPrice;
                                    if(this.state.name=="标签采集"){
                                        shopInfo.prototal = "0";
                                    }else{
                                        shopInfo.prototal = NumberUtils.numberFormat2(shopprice);
                                    }
                                    shopInfo.promemo = this.state.Remark;
                                    shopInfo.DepCode = this.state.DepCode;
                                    shopInfo.ydcountm = this.state.ydcountm;
                                    shopInfo.SuppCode = this.state.SuppCode;
                                    shopInfo.BarCode = this.state.BarCode;
                                    shopInfoData.push(shopInfo);
                                    //调用插入表方法
                                    dbAdapter.insertShopInfo(shopInfoData);
                                    this.setState({
                                        Number1: "",
                                        ydcountm: "",
                                        ShopPrice: "",
                                        numberFormat2: "",
                                        Remark: "",
                                        ProdName: "",
                                        modal:"",
                                    })
                                }
                            }
                        }else{
                            alert("数量不能含有小数");
                            this.setState({
                                Total:"",
                            });
                        }
                    } else {
                        if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                            var shopInfoData = [];
                            var shopInfo = {};
                            shopInfo.Pid = this.state.Pid;
                            shopInfo.ProdCode = this.state.ProdCode;
                            shopInfo.prodname = this.state.ProdName;
                            shopInfo.countm = this.state.Number1;
                            shopInfo.ShopPrice = this.state.ShopPrice;
                            if(this.state.name=="标签采集"){
                                shopInfo.prototal = "0";
                            }else{
                                shopInfo.prototal = shopprice;
                            }
                            shopInfo.promemo = this.state.Remark;
                            shopInfo.DepCode = this.state.DepCode;
                            shopInfo.ydcountm = this.state.ydcountm;
                            shopInfo.SuppCode = this.state.SuppCode;
                            shopInfo.BarCode = this.state.BarCode;
                            shopInfoData.push(shopInfo);
                            //调用插入表方法
                            dbAdapter.insertShopInfo(shopInfoData);
                            this.setState({
                                Number1: "",
                                ydcountm: "",
                                ShopPrice: "",
                                numberFormat2: "",
                                Remark: "",
                                ProdName: "",
                                modal:"",
                            })
                        }else{
                            if(this.state.Number1==0){
                                ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                            }else{
                                var shopInfoData = [];
                                var shopInfo = {};
                                shopInfo.Pid = this.state.Pid;
                                shopInfo.ProdCode = this.state.ProdCode;
                                shopInfo.prodname = this.state.ProdName;
                                shopInfo.countm = this.state.Number1;
                                shopInfo.ShopPrice = this.state.ShopPrice;
                                if(this.state.name=="标签采集"){
                                    shopInfo.prototal = "0";
                                }else{
                                    shopInfo.prototal = shopprice;
                                }
                                shopInfo.promemo = this.state.Remark;
                                shopInfo.DepCode = this.state.DepCode;
                                shopInfo.ydcountm = this.state.ydcountm;
                                shopInfo.SuppCode = this.state.SuppCode;
                                shopInfo.BarCode = this.state.BarCode;
                                shopInfoData.push(shopInfo);
                                //调用插入表方法
                                dbAdapter.insertShopInfo(shopInfoData);
                                this.setState({
                                    Number1: "",
                                    ydcountm: "",
                                    ShopPrice: "",
                                    numberFormat2: "",
                                    Remark: "",
                                    ProdName: "",
                                    modal:"",
                                })
                            }
                        }
                    }
                }
            }
        }
    }

    NumberButton(){
        this.setState({
            PriceText:"",
            Total:"",
            OnPrice:"",
        })
    }

    PriceButton(){
        this.setState({
            OnPrice:1,
            Total:"",
        });
    }

    NumberFormat(){
        this.setState({
            OnPrice:1,
        });
    }

    add() {
        if(this.state.Number1==""&&this.state.name!=="标签采集"){
            this.setState({
                Number1:1,
                numberFormat2:this.state.ShopPrice,
            });
        } else if(this.state.name=="标签采集"&&this.state.Number1==1){
            this.setState({
                Number1:2,
            });
        }else{
            let numberFormat1 =Number(this.state.Number1)+1;
            let numberFormat2 = (numberFormat1 * this.state.ShopPrice);
            let shopprice=Math.round(numberFormat2 * 100) / 100;
            this.setState({
                Number1:Number(this.state.Number1)+1,
                numberFormat2:shopprice,
            });
        }
    }

    subtraction() {
        if (this.state.Number1 > 0) {
            var Number1 = this.state.Number1;
            this.setState({
                Number1: Number(this.state.Number1)-1,
            });
            let numberFormat1 =Number(this.state.Number1)-1;
            let numberFormat2 = (numberFormat1 * this.state.ShopPrice);
            let shopprice=Math.round(numberFormat2 * 100) / 100;
            this.setState({
                numberFormat2: shopprice,
            });
        }

        if(this.state.Number1 ==0&&this.state.name!=="标签采集"){
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
            this.setState({
                Number1:this.state.Number1,
                numberFormat2:0,
            });
        }else if(this.state.Number1 <1&&this.state.name!=="标签采集"){
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
            let numberFormat2 = (this.state.Number1 * this.state.ShopPrice);
            let shopprice=Math.round(numberFormat2 * 100) / 100;
            this.setState({
                Number1:this.state.Number1,
                numberFormat2:shopprice,
            });
        }
        if (this.state.Number1 == 0||this.state.Number1 == "") {
            ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
            this.setState({
                Number1: 0
            });
        }
    }

    clear() {
        let numberFormat2 = NumberUtils.numberFormat2((0) * (this.state.ShopPrice));
        this.setState({
            Number1: 0,
            numberFormat2: numberFormat2,
        })
    }

    onEndEditing(){
        if(this.state.Number1==""){
            this.setState({
                numberFormat2:"0.00",
            });
        }else{
            let numberFormat2 = (this.state.Number1 * this.state.ShopPrice);
            let shopprice=Math.round(numberFormat2 * 100) / 100;
            this.setState({
                numberFormat2:shopprice,
                Total:1,
                OnPrice:""
            });
        }
    }

    TotalButton(){
        if(this.state.Number1==""){
            alert("请先添加商品数量");
            this.setState({
                numberFormat2:"0.00"
            })
        }else{
            if(this.state.YdCountm == 6&&this.state.ydcountm==0){
                alert("库存为0，该商品不能进行配送")
            }else {
                if(this.state.Number1<0){
                    if(this.state.name=="商品损溢"||this.state.name=="商品盘点"||this.state.name=="移动销售"){
                        var Modify=NumberUtils.numberFormat2(this.state.numberFormat2/this.state.Number1);
                        if(this.state.OrderDetails==1){
                            if(this.state.IsIntCount==0){
                                var number = this.state.Number1;//获取数量的数字
                                if(parseInt(number)==number) {
                                    this.setState({
                                        ShopPrice:Modify,
                                        modal:'',
                                        OnPrice:'',
                                        Total:'',
                                        PriceText:''
                                    })
                                    if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                        var shopInfoData = [];
                                        var shopInfo = {};
                                        shopInfo.Pid = this.state.Pid;
                                        shopInfo.ProdCode = this.state.ProdCode;
                                        shopInfo.prodname = this.state.ProdName;
                                        shopInfo.countm = this.state.Number1;
                                        shopInfo.ShopPrice = Modify;
                                        shopInfo.prototal = this.state.numberFormat2;
                                        shopInfo.promemo = this.state.Remark;
                                        shopInfo.DepCode = this.state.DepCode;
                                        shopInfo.ydcountm = this.state.ydcountm;
                                        shopInfo.SuppCode = this.state.SuppCode;
                                        shopInfo.BarCode = this.state.BarCode;
                                        shopInfoData.push(shopInfo);
                                        //调用插入表方法
                                        dbAdapter.insertShopInfo(shopInfoData);
                                        this.setState({
                                            Number1: "",
                                            ydcountm: "",
                                            ShopPrice: "",
                                            numberFormat2: "",
                                            Remark: "",
                                            ProdName: "",
                                            modal:"",
                                        })
                                    }else{
                                        if(this.state.Number1==0){
                                            ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                                        }else{
                                            var shopInfoData = [];
                                            var shopInfo = {};
                                            shopInfo.Pid = this.state.Pid;
                                            shopInfo.ProdCode = this.state.ProdCode;
                                            shopInfo.prodname = this.state.ProdName;
                                            shopInfo.countm = this.state.Number1;
                                            shopInfo.ShopPrice = Modify;
                                            if(this.state.name=="标签采集"){
                                                shopInfo.prototal = "0";
                                            }else{
                                                shopInfo.prototal = this.state.numberFormat2;
                                            }
                                            shopInfo.promemo = this.state.Remark;
                                            shopInfo.DepCode = this.state.DepCode;
                                            shopInfo.ydcountm = this.state.ydcountm;
                                            shopInfo.SuppCode = this.state.SuppCode;
                                            shopInfo.BarCode = this.state.BarCode;
                                            shopInfoData.push(shopInfo);
                                            //调用插入表方法
                                            dbAdapter.insertShopInfo(shopInfoData);
                                            this.setState({
                                                Number1: "",
                                                ydcountm: "",
                                                ShopPrice: "",
                                                numberFormat2: "",
                                                Remark: "",
                                                ProdName: "",
                                                modal:"",
                                            })
                                        }
                                    }
                                }else{
                                    alert("数量不能含有小数");
                                    this.setState({
                                        Total:"",
                                    });
                                }
                            } else {
                                this.setState({
                                    ShopPrice:Modify,
                                    modal:'',
                                    OnPrice:'',
                                    Total:'',
                                    PriceText:''
                                })
                                if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                    var shopInfoData = [];
                                    var shopInfo = {};
                                    shopInfo.Pid = this.state.Pid;
                                    shopInfo.ProdCode = this.state.ProdCode;
                                    shopInfo.prodname = this.state.ProdName;
                                    shopInfo.countm = this.state.Number1;
                                    shopInfo.ShopPrice = Modify;
                                    shopInfo.prototal = this.state.numberFormat2;
                                    shopInfo.promemo = this.state.Remark;
                                    shopInfo.DepCode = this.state.DepCode;
                                    shopInfo.ydcountm = this.state.ydcountm;
                                    shopInfo.SuppCode = this.state.SuppCode;
                                    shopInfo.BarCode = this.state.BarCode;
                                    shopInfoData.push(shopInfo);
                                    //调用插入表方法
                                    dbAdapter.insertShopInfo(shopInfoData);
                                    this.setState({
                                        Number1: "",
                                        ydcountm: "",
                                        ShopPrice: "",
                                        numberFormat2: "",
                                        Remark: "",
                                        ProdName: "",
                                        modal:"",
                                    })
                                }else{
                                    if(this.state.Number1==0){
                                        ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                                    }else{
                                        var shopInfoData = [];
                                        var shopInfo = {};
                                        shopInfo.Pid = this.state.Pid;
                                        shopInfo.ProdCode = this.state.ProdCode;
                                        shopInfo.prodname = this.state.ProdName;
                                        shopInfo.countm = this.state.Number1;
                                        shopInfo.ShopPrice = Modify;
                                        shopInfo.prototal = this.state.numberFormat2;
                                        shopInfo.promemo = this.state.Remark;
                                        shopInfo.DepCode = this.state.DepCode;
                                        shopInfo.ydcountm = this.state.ydcountm;
                                        shopInfo.SuppCode = this.state.SuppCode;
                                        shopInfo.BarCode = this.state.BarCode;
                                        shopInfoData.push(shopInfo);
                                        //调用插入表方法
                                        dbAdapter.insertShopInfo(shopInfoData);
                                        this.setState({
                                            Number1: "",
                                            ydcountm: "",
                                            ShopPrice: "",
                                            numberFormat2: "",
                                            Remark: "",
                                            ProdName: "",
                                            modal:"",
                                        })
                                    }
                                }
                            }
                        }
                    }else{
                        ToastAndroid.show('商品数量不能为负数', ToastAndroid.SHORT);
                    }
                }else{
                    var Modify=NumberUtils.numberFormat2(this.state.numberFormat2/this.state.Number1);
                    if(this.state.OrderDetails==1){
                        if(this.state.IsIntCount==0){
                            var number = this.state.Number1;//获取数量的数字
                            if(parseInt(number)==number) {
                                this.setState({
                                    ShopPrice:Modify,
                                    modal:'',
                                    OnPrice:'',
                                    Total:'',
                                    PriceText:''
                                })
                                if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                    var shopInfoData = [];
                                    var shopInfo = {};
                                    shopInfo.Pid = this.state.Pid;
                                    shopInfo.ProdCode = this.state.ProdCode;
                                    shopInfo.prodname = this.state.ProdName;
                                    shopInfo.countm = this.state.Number1;
                                    shopInfo.ShopPrice = Modify;
                                    shopInfo.prototal = this.state.numberFormat2;
                                    shopInfo.promemo = this.state.Remark;
                                    shopInfo.DepCode = this.state.DepCode;
                                    shopInfo.ydcountm = this.state.ydcountm;
                                    shopInfo.SuppCode = this.state.SuppCode;
                                    shopInfo.BarCode = this.state.BarCode;
                                    shopInfoData.push(shopInfo);
                                    //调用插入表方法
                                    dbAdapter.insertShopInfo(shopInfoData);
                                    this.setState({
                                        Number1: "",
                                        ydcountm: "",
                                        ShopPrice: "",
                                        numberFormat2: "",
                                        Remark: "",
                                        ProdName: "",
                                        modal:"",
                                    })
                                }else{
                                    if(this.state.Number1==0){
                                        ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                                    }else{
                                        var shopInfoData = [];
                                        var shopInfo = {};
                                        shopInfo.Pid = this.state.Pid;
                                        shopInfo.ProdCode = this.state.ProdCode;
                                        shopInfo.prodname = this.state.ProdName;
                                        shopInfo.countm = this.state.Number1;
                                        shopInfo.ShopPrice = Modify;
                                        if(this.state.name=="标签采集"){
                                            shopInfo.prototal = "0";
                                        }else{
                                            shopInfo.prototal = this.state.numberFormat2;
                                        }
                                        shopInfo.promemo = this.state.Remark;
                                        shopInfo.DepCode = this.state.DepCode;
                                        shopInfo.ydcountm = this.state.ydcountm;
                                        shopInfo.SuppCode = this.state.SuppCode;
                                        shopInfo.BarCode = this.state.BarCode;
                                        shopInfoData.push(shopInfo);
                                        //调用插入表方法
                                        dbAdapter.insertShopInfo(shopInfoData);
                                        this.setState({
                                            Number1: "",
                                            ydcountm: "",
                                            ShopPrice: "",
                                            numberFormat2: "",
                                            Remark: "",
                                            ProdName: "",
                                            modal:"",
                                        })
                                    }
                                }
                            }else{
                                alert("数量不能含有小数");
                                this.setState({
                                    Total:"",
                                });
                            }
                        } else {
                            this.setState({
                                ShopPrice:Modify,
                                modal:'',
                                OnPrice:'',
                                Total:'',
                                PriceText:''
                            })
                            if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                var shopInfoData = [];
                                var shopInfo = {};
                                shopInfo.Pid = this.state.Pid;
                                shopInfo.ProdCode = this.state.ProdCode;
                                shopInfo.prodname = this.state.ProdName;
                                shopInfo.countm = this.state.Number1;
                                shopInfo.ShopPrice = Modify;
                                shopInfo.prototal = this.state.numberFormat2;
                                shopInfo.promemo = this.state.Remark;
                                shopInfo.DepCode = this.state.DepCode;
                                shopInfo.ydcountm = this.state.ydcountm;
                                shopInfo.SuppCode = this.state.SuppCode;
                                shopInfo.BarCode = this.state.BarCode;
                                shopInfoData.push(shopInfo);
                                //调用插入表方法
                                dbAdapter.insertShopInfo(shopInfoData);
                                this.setState({
                                    Number1: "",
                                    ydcountm: "",
                                    ShopPrice: "",
                                    numberFormat2: "",
                                    Remark: "",
                                    ProdName: "",
                                    modal:"",
                                })
                            }else{
                                if(this.state.Number1==0){
                                    ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                                }else{
                                    var shopInfoData = [];
                                    var shopInfo = {};
                                    shopInfo.Pid = this.state.Pid;
                                    shopInfo.ProdCode = this.state.ProdCode;
                                    shopInfo.prodname = this.state.ProdName;
                                    shopInfo.countm = this.state.Number1;
                                    shopInfo.ShopPrice = Modify;
                                    shopInfo.prototal = this.state.numberFormat2;
                                    shopInfo.promemo = this.state.Remark;
                                    shopInfo.DepCode = this.state.DepCode;
                                    shopInfo.ydcountm = this.state.ydcountm;
                                    shopInfo.SuppCode = this.state.SuppCode;
                                    shopInfo.BarCode = this.state.BarCode;
                                    shopInfoData.push(shopInfo);
                                    //调用插入表方法
                                    dbAdapter.insertShopInfo(shopInfoData);
                                    this.setState({
                                        Number1: "",
                                        ydcountm: "",
                                        ShopPrice: "",
                                        numberFormat2: "",
                                        Remark: "",
                                        ProdName: "",
                                        modal:"",
                                    })
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    numberFormat2(){
        if(this.state.Number1==""){
            alert("请先添加商品数量");
            this.setState({
                numberFormat2:"0.00"
            })
        }else{
            var Modify=NumberUtils.numberFormat2(this.state.numberFormat2/this.state.Number1);
            this.setState({
                ShopPrice:Modify
            })
        }
    }

    pressPop() {
        if(this.state.YdCountm == 6&&this.state.ydcountm==0){
            alert("库存为0，该商品不能进行配送")
        }else {
            if(this.state.Number1<0){
                if(this.state.name=="商品损溢"||this.state.name=="商品盘点"||this.state.name=="移动销售"){
                    if(this.state.IsIntCount==0){
                        var number = this.state.Number1;//获取数量的数字
                        if(parseInt(number)==number) {
                            if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                                var shopInfoData = [];
                                var shopInfo = {};
                                shopInfo.Pid = this.state.Pid;
                                shopInfo.ProdCode = this.state.ProdCode;
                                shopInfo.prodname = this.state.ProdName;
                                shopInfo.countm = this.state.Number1;
                                shopInfo.ShopPrice = this.state.ShopPrice;
                                shopInfo.prototal = this.state.numberFormat2;
                                shopInfo.promemo = this.state.Remark;
                                shopInfo.DepCode = this.state.DepCode;
                                shopInfo.ydcountm = this.state.ydcountm;
                                shopInfo.SuppCode = this.state.SuppCode;
                                shopInfo.BarCode = this.state.BarCode;
                                shopInfoData.push(shopInfo);
                                //调用插入表方法
                                dbAdapter.insertShopInfo(shopInfoData);
                                this.setState({
                                    Number1: "",
                                    ydcountm: "",
                                    ShopPrice: "",
                                    numberFormat2: "",
                                    Remark: "",
                                    ProdName: "",
                                    modal:"",
                                })
                            }else{
                                if(this.state.Number1==0&&this.state.name!=="标签采集"){
                                    ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                                } else if(this.state.Number1==0&&this.state.name=="标签采集"){
                                    ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                                }else{
                                    var shopInfoData = [];
                                    var shopInfo = {};
                                    shopInfo.Pid = this.state.Pid;
                                    shopInfo.ProdCode = this.state.ProdCode;
                                    shopInfo.prodname = this.state.ProdName;
                                    shopInfo.countm = this.state.Number1;
                                    shopInfo.ShopPrice = this.state.ShopPrice;
                                    if(this.state.name=="标签采集"){
                                        shopInfo.prototal = "0";
                                    }else{
                                        shopInfo.prototal = this.state.numberFormat2;
                                    }
                                    shopInfo.promemo = this.state.Remark;
                                    shopInfo.DepCode = this.state.DepCode;
                                    shopInfo.ydcountm = this.state.ydcountm;
                                    shopInfo.SuppCode = this.state.SuppCode;
                                    shopInfo.BarCode = this.state.BarCode;
                                    shopInfoData.push(shopInfo);
                                    //调用插入表方法
                                    dbAdapter.insertShopInfo(shopInfoData);
                                    this.setState({
                                        Number1: "",
                                        ydcountm: "",
                                        ShopPrice: "",
                                        numberFormat2: "",
                                        Remark: "",
                                        ProdName: "",
                                        modal:"",
                                    })
                                }
                            }
                        }else{
                            alert("数量不能含有小数");
                            this.setState({
                                Total:"",
                            });
                        }
                    } else {
                        if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                            var shopInfoData = [];
                            var shopInfo = {};
                            shopInfo.Pid = this.state.Pid;
                            shopInfo.ProdCode = this.state.ProdCode;
                            shopInfo.prodname = this.state.ProdName;
                            shopInfo.countm = this.state.Number1;
                            shopInfo.ShopPrice = this.state.ShopPrice;
                            if(this.state.name=="标签采集"){
                                shopInfo.prototal = "0";
                            }else{
                                shopInfo.prototal = this.state.numberFormat2;
                            }
                            shopInfo.promemo = this.state.Remark;
                            shopInfo.DepCode = this.state.DepCode;
                            shopInfo.ydcountm = this.state.ydcountm;
                            shopInfo.SuppCode = this.state.SuppCode;
                            shopInfo.BarCode = this.state.BarCode;
                            shopInfoData.push(shopInfo);
                            //调用插入表方法
                            dbAdapter.insertShopInfo(shopInfoData);
                            this.setState({
                                Number1: "",
                                ydcountm: "",
                                ShopPrice: "",
                                numberFormat2: "",
                                Remark: "",
                                ProdName: "",
                                modal:"",
                            })
                        }else{
                            if(this.state.Number1==0&&this.state.name!=="标签采集"){
                                ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                            } else if(this.state.Number1==0&&this.state.name=="标签采集"){
                                ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                            }else{
                                var shopInfoData = [];
                                var shopInfo = {};
                                shopInfo.Pid = this.state.Pid;
                                shopInfo.ProdCode = this.state.ProdCode;
                                shopInfo.prodname = this.state.ProdName;
                                shopInfo.countm = this.state.Number1;
                                shopInfo.ShopPrice = this.state.ShopPrice;
                                if(this.state.name=="标签采集"){
                                    shopInfo.prototal = "0";
                                }else{
                                    shopInfo.prototal = this.state.numberFormat2;
                                }
                                shopInfo.promemo = this.state.Remark;
                                shopInfo.DepCode = this.state.DepCode;
                                shopInfo.ydcountm = this.state.ydcountm;
                                shopInfo.SuppCode = this.state.SuppCode;
                                shopInfo.BarCode = this.state.BarCode;
                                shopInfoData.push(shopInfo);
                                //调用插入表方法
                                dbAdapter.insertShopInfo(shopInfoData);
                                this.setState({
                                    Number1: "",
                                    ydcountm: "",
                                    ShopPrice: "",
                                    numberFormat2: "",
                                    Remark: "",
                                    ProdName: "",
                                    modal:"",
                                })
                            }
                        }
                    }
                }else{
                    ToastAndroid.show('商品数量不能为负数', ToastAndroid.SHORT);
                }
            }else{
                if(this.state.IsIntCount==0){
                    var number = this.state.Number1;//获取数量的数字
                    if(parseInt(number)==number) {
                        if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                            var shopInfoData = [];
                            var shopInfo = {};
                            shopInfo.Pid = this.state.Pid;
                            shopInfo.ProdCode = this.state.ProdCode;
                            shopInfo.prodname = this.state.ProdName;
                            shopInfo.countm = this.state.Number1;
                            shopInfo.ShopPrice = this.state.ShopPrice;
                            shopInfo.prototal = this.state.numberFormat2;
                            shopInfo.promemo = this.state.Remark;
                            shopInfo.DepCode = this.state.DepCode;
                            shopInfo.ydcountm = this.state.ydcountm;
                            shopInfo.SuppCode = this.state.SuppCode;
                            shopInfo.BarCode = this.state.BarCode;
                            shopInfoData.push(shopInfo);
                            //调用插入表方法
                            dbAdapter.insertShopInfo(shopInfoData);
                            this.setState({
                                Number1: "",
                                ydcountm: "",
                                ShopPrice: "",
                                numberFormat2: "",
                                Remark: "",
                                ProdName: "",
                                modal:"",
                            })
                        }else{
                            if(this.state.Number1==0&&this.state.name!=="标签采集"){
                                ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                            } else if(this.state.Number1==0&&this.state.name=="标签采集"){
                                ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                            }else{
                                var shopInfoData = [];
                                var shopInfo = {};
                                shopInfo.Pid = this.state.Pid;
                                shopInfo.ProdCode = this.state.ProdCode;
                                shopInfo.prodname = this.state.ProdName;
                                shopInfo.countm = this.state.Number1;
                                shopInfo.ShopPrice = this.state.ShopPrice;
                                if(this.state.name=="标签采集"){
                                    shopInfo.prototal = "0";
                                }else{
                                    shopInfo.prototal = this.state.numberFormat2;
                                }
                                shopInfo.promemo = this.state.Remark;
                                shopInfo.DepCode = this.state.DepCode;
                                shopInfo.ydcountm = this.state.ydcountm;
                                shopInfo.SuppCode = this.state.SuppCode;
                                shopInfo.BarCode = this.state.BarCode;
                                shopInfoData.push(shopInfo);
                                //调用插入表方法
                                dbAdapter.insertShopInfo(shopInfoData);
                                this.setState({
                                    Number1: "",
                                    ydcountm: "",
                                    ShopPrice: "",
                                    numberFormat2: "",
                                    Remark: "",
                                    ProdName: "",
                                    modal:"",
                                })
                            }
                        }
                    }else{
                        alert("数量不能含有小数");
                        this.setState({
                            Total:"",
                        });
                    }
                } else {
                    if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                        var shopInfoData = [];
                        var shopInfo = {};
                        shopInfo.Pid = this.state.Pid;
                        shopInfo.ProdCode = this.state.ProdCode;
                        shopInfo.prodname = this.state.ProdName;
                        shopInfo.countm = this.state.Number1;
                        shopInfo.ShopPrice = this.state.ShopPrice;
                        if(this.state.name=="标签采集"){
                            shopInfo.prototal = "0";
                        }else{
                            shopInfo.prototal = this.state.numberFormat2;
                        }
                        shopInfo.promemo = this.state.Remark;
                        shopInfo.DepCode = this.state.DepCode;
                        shopInfo.ydcountm = this.state.ydcountm;
                        shopInfo.SuppCode = this.state.SuppCode;
                        shopInfo.BarCode = this.state.BarCode;
                        shopInfoData.push(shopInfo);
                        //调用插入表方法
                        dbAdapter.insertShopInfo(shopInfoData);
                        this.setState({
                            Number1: "",
                            ydcountm: "",
                            ShopPrice: "",
                            numberFormat2: "",
                            Remark: "",
                            ProdName: "",
                            modal:"",
                        })
                    }else{
                        if(this.state.Number1==0&&this.state.name!=="标签采集"){
                            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                        } else if(this.state.Number1==0&&this.state.name=="标签采集"){
                            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                        }else{
                            var shopInfoData = [];
                            var shopInfo = {};
                            shopInfo.Pid = this.state.Pid;
                            shopInfo.ProdCode = this.state.ProdCode;
                            shopInfo.prodname = this.state.ProdName;
                            shopInfo.countm = this.state.Number1;
                            shopInfo.ShopPrice = this.state.ShopPrice;
                            if(this.state.name=="标签采集"){
                                shopInfo.prototal = "0";
                            }else{
                                shopInfo.prototal = this.state.numberFormat2;
                            }
                            shopInfo.promemo = this.state.Remark;
                            shopInfo.DepCode = this.state.DepCode;
                            shopInfo.ydcountm = this.state.ydcountm;
                            shopInfo.SuppCode = this.state.SuppCode;
                            shopInfo.BarCode = this.state.BarCode;
                            shopInfoData.push(shopInfo);
                            //调用插入表方法
                            dbAdapter.insertShopInfo(shopInfoData);
                            this.setState({
                                Number1: "",
                                ydcountm: "",
                                ShopPrice: "",
                                numberFormat2: "",
                                Remark: "",
                                ProdName: "",
                                modal:"",
                            })
                        }
                    }
                }
            }
        }
    }

    _Emptydata(){
        let isShow = this.state.emptydata;
        this.setState({
            emptydata:!isShow,
        });
    }

    Emptydata(){
        this._Emptydata();
    }

    /**
     *
     * 物理键返回按钮
     */
    // onBackAndroid = () => {
    //     ToastAndroid.show('再按一次退出应用');
    //     return false;
    // };

    /**
     * 售价调整代码
     * @returns {XML}
     */
    NewNumber(){

    }

    PressPop(){
        var shopInfoData = [];
        var shopInfo = {};
        shopInfo.Pid = this.state.Pid;
        shopInfo.ProdCode = this.state.ProdCode;
        shopInfo.prodname = this.state.ProdName;
        shopInfo.countm = this.state.Number1;
        shopInfo.ShopPrice = this.state.ShopPrice;
        shopInfo.prototal = "";
        shopInfo.promemo = this.state.Remark;
        shopInfo.DepCode = this.state.DepCode;
        shopInfo.ydcountm = this.state.NewNumber;
        shopInfo.SuppCode = this.state.SuppCode;
        shopInfo.BarCode = this.state.BarCode;
        shopInfoData.push(shopInfo);
        //调用插入表方法
        dbAdapter.insertShopInfo(shopInfoData);
        this.setState({
            Number1: "",
            NewNumber:"",
            ShopPrice: "",
            Remark: "",
            ProdName: "",
            modal:"",
            PriceText:1,
        })

    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Title}>
                    {
                        (this.state.modal == "1") ?
                            <TextInput
                                returnKeyType="search"
                                style={styles.Search}
                                placeholder="请输入搜索商品名称"
                                placeholderColor="#999999"
                                underlineColorAndroid='transparent'
                                value={this.state.Search}
                                onChangeText={(value) => {
                                    this.setState({
                                        Search: value
                                    })
                                    this.inputOnBlur(value)
                                }}
                            /> :
                            <TextInput
                                autoFocus={true}
                                returnKeyType="search"
                                style={styles.Search}
                                placeholder="请输入搜索商品名称"
                                placeholderColor="#999999"
                                underlineColorAndroid='transparent'
                                value={this.state.Search}
                                onChangeText={(value) => {
                                    this.setState({
                                        Search: value
                                    })
                                    this.inputOnBlur(value)
                                }}
                            />
                    }
                    <Image source={require("../images/2.png")} style={styles.SearchImage}></Image>
                    <TouchableOpacity onPress={this.Close.bind(this)} style={styles.Right1}>
                        <View style={styles.Text1}><Text style={styles.Text}>取消</Text></View>
                    </TouchableOpacity>
                </View>
                {
                    (this.state.name == "售价调整") ?
                        <View style={styles.ScrollView}>
                            {
                                (this.state.Search=="")?
                                <View>
                                    <View style={styles.List}>
                                        <Text style={styles.left}>名称</Text>
                                        <Text style={styles.right}>{this.state.ProdName}</Text>
                                    </View>
                                    <View style={styles.List}>
                                        <View style={styles.left1}>
                                            <Text style={styles.left}>新价格</Text>
                                            <View style={styles.onPrice}>
                                                {
                                                    (this.state.PriceText == 1) ?
                                                        <TouchableOpacity style={styles.NumBer} onPress={this.NumberButton.bind(this)}>
                                                            <Text style={styles.PriceText}>{this.state.NewNumber}</Text>
                                                        </TouchableOpacity>
                                                    :
                                                        <TextInput
                                                            style={styles.Number}
                                                            returnKeyType='search'
                                                            autoFocus={true}
                                                            underlineColorAndroid='transparent'
                                                            keyboardType="numeric"
                                                            value={this.state.NewNumber.toString()}
                                                            placeholderTextColor="#333333"
                                                            onChangeText={(value)=>{this.setState({NewNumber:value})}}
                                                            onSubmitEditing={this.NewNumber.bind(this)}
                                                        />
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.List}>
                                        <View style={styles.left2}>
                                            <Text style={styles.left}>单价</Text>
                                            <Text style={styles.Price1}>{this.state.ShopPrice}</Text>
                                        </View>
                                        <View style={styles.right2}>
                                            <Text style={styles.price}>元/件</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.List, {paddingTop: 10,}]}>
                                        <View style={styles.left2}>
                                            <Text style={[styles.left, {marginTop: 9,}]}>备注</Text>
                                            <TextInput
                                                style={[styles.Number1,{fontSize:14}]}
                                                placeholder="暂无备注"
                                                placeholderTextColor="#999999"
                                                underlineColorAndroid='transparent'
                                                value={this.state.Remark.toString()}
                                                onChangeText={(value) => {
                                                    this.setState({Remark: value})
                                                }}/>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.button} onPress={this.PressPop.bind(this)}>
                                        <Text style={styles.ButtonText}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            :
                                <View style={styles.BlockList}>
                                    {
                                        (this.state.dataRows == "") ?
                                            <View style={styles.Null}>
                                                <Text style={styles.NullText}>
                                                    没有搜索到相关商品~~~
                                                </Text>
                                            </View> :
                                            <ListView
                                                dataSource={this.state.dataSource}
                                                showsVerticalScrollIndicator={true}
                                                renderRow={this._renderRow.bind(this)}
                                                ref="myInput"
                                            />
                                    }
                                </View>
                            }
                        </View>
                        :
                        //非售价调整显示页面
                        <View style={styles.out}>
                            {
                                (this.state.Search=="")?
                                    <ScrollView style={styles.ScrollView}>
                                        <View style={styles.Cont}>
                                            <View style={styles.List}>
                                                <Text style={styles.left}>名称</Text>
                                                <Text style={styles.right}>{this.state.ProdName}</Text>
                                            </View>
                                            <View style={styles.List}>
                                                {
                                                    (this.state.modal=="1")?
                                                        <View style={styles.left1}>
                                                            <Text style={styles.left}>数量</Text>

                                                            <View style={styles.onPrice}>
                                                                {
                                                                    (this.state.PriceText == 1) ?
                                                                        <TouchableOpacity style={styles.NumBer} onPress={this.NumberButton.bind(this)}>
                                                                            <Text style={styles.PriceText}>{this.state.Number1}</Text>
                                                                        </TouchableOpacity>
                                                                        :
                                                                        <TextInput
                                                                            style={styles.Number}
                                                                            returnKeyType='search'
                                                                            autoFocus={true}
                                                                            underlineColorAndroid='transparent'
                                                                            keyboardType="numeric"
                                                                            value={this.state.Number1.toString()}
                                                                            placeholderTextColor="#333333"
                                                                            onChangeText={(value)=>{this.setState({Number1:value})}}
                                                                            onSubmitEditing={this.onNumber.bind(this)}
                                                                            onEndEditing = {this.onSubmitEditing.bind(this)}
                                                                        />
                                                                }
                                                            </View>
                                                        </View>
                                                        :
                                                        <View style={styles.left1}>
                                                            <Text style={styles.left}>数量</Text>
                                                        </View>
                                                }
                                                <View style={styles.right1}>
                                                    <TouchableOpacity style={styles.sublime} onPress={this.clear.bind(this)}><Image source={require("../images/1_09.png")}/></TouchableOpacity>
                                                    <TouchableOpacity style={styles.sublime} onPress={this.add.bind(this)}><Image source={require("../images/1_15.png")}/></TouchableOpacity>
                                                    <TouchableOpacity style={styles.sublime} onPress={this.subtraction.bind(this)}><Image source={require("../images/1_13.png")}/></TouchableOpacity>
                                                </View>
                                            </View>
                                            {
                                                (this.state.YdCountm == 1||this.state.YdCountm == 6||this.state.YdCountm == 5) ?
                                                    <View style={styles.List}>
                                                        <View style={styles.left2}>
                                                            <Text style={styles.left}>现在库存</Text>
                                                            <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                                                        </View>
                                                    </View> : null
                                            }
                                            {
                                                (this.state.YdCountm == 2||this.state.name=="商品配送") ?
                                                    <View style={styles.List}>
                                                        <View style={styles.left2}>
                                                            <Text style={styles.left}>原单数量</Text>
                                                            <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                                                        </View>
                                                    </View> : null
                                            }
                                            <View style={styles.List}>
                                                <View style={styles.left2}>
                                                    {
                                                        (this.state.name=="商品配送")?
                                                            <Text style={styles.left}>配送单价</Text>
                                                            :
                                                            <Text style={styles.left}>单价</Text>
                                                    }
                                                    {
                                                        (this.state.name=="商品采购"&&this.state.OptValue==1||this.state.name=="协配采购"&&this.state.OptValue==1||this.state.name=="移动销售"||this.state.Modify==1&&this.state.OptValue==1)?
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
                                                                            onEndEditing = {this.onEndEditing.bind(this)}
                                                                        />
                                                                        :
                                                                        <TouchableOpacity onPress={this.PriceButton.bind(this)}>
                                                                            <Text style={styles.PriceText}>{this.state.ShopPrice}</Text>
                                                                        </TouchableOpacity>

                                                                }
                                                            </View>
                                                            :
                                                            <Text style={styles.Price1}>{this.state.ShopPrice}</Text>
                                                    }
                                                </View>
                                                <View style={styles.right2}>
                                                    <Text style={styles.price}>元/件</Text>
                                                </View>
                                            </View>
                                            {
                                                (this.state.YdCountm == 5) ?
                                                    null :
                                                    <View style={styles.List}>
                                                        <View style={styles.left2}>
                                                            {
                                                                (this.state.name=="商品配送")?
                                                                    <Text style={styles.left}>配送金额</Text>
                                                                    :
                                                                    <Text style={styles.left}>金额</Text>
                                                            }
                                                            {
                                                                (this.state.name=="商品采购"&&this.state.OptValue==1||this.state.name=="协配采购"&&this.state.OptValue==1||this.state.name=="移动销售"||this.state.Modify==1&&this.state.OptValue==1)?
                                                                    <View style={styles.onPrice}>
                                                                        {
                                                                            (this.state.Total == 1) ?
                                                                                <TextInput
                                                                                    autoFocus={true}
                                                                                    returnKeyType='search'
                                                                                    style={styles.Number}
                                                                                    underlineColorAndroid='transparent'
                                                                                    keyboardType="numeric"
                                                                                    value={this.state.numberFormat2.toString()}
                                                                                    placeholderTextColor="#333333"
                                                                                    onChangeText={(value)=>{
                                                                                        this.setState({
                                                                                            numberFormat2:value
                                                                                        })
                                                                                    }}
                                                                                    onSubmitEditing={this.TotalButton.bind(this)}
                                                                                    onEndEditing = {this.numberFormat2.bind(this)}
                                                                                />
                                                                                :
                                                                                <TouchableOpacity onPress={this.NumberFormat.bind(this)}>
                                                                                    <Text style={styles.PriceText}>{this.state.numberFormat2}</Text>
                                                                                </TouchableOpacity>
                                                                        }
                                                                    </View>
                                                                    :
                                                                    <Text style={styles.Price1}>{this.state.numberFormat2}</Text>
                                                            }
                                                        </View>
                                                        <View style={styles.right2}>
                                                            <Text style={styles.price}>元</Text>
                                                        </View>
                                                    </View>
                                            }
                                            <View style={[styles.List, {paddingTop: 10,}]}>
                                                <View style={styles.left2}>
                                                    <Text style={[styles.left, {marginTop: 9,}]}>备注</Text>
                                                    <TextInput
                                                        style={[styles.Number1,{fontSize:14}]}
                                                        placeholder="暂无备注"
                                                        placeholderTextColor="#999999"
                                                        underlineColorAndroid='transparent'
                                                        value={this.state.Remark.toString()}
                                                        onChangeText={(value) => {
                                                            this.setState({Remark: value})
                                                        }}/>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.button} onPress={this.pressPop.bind(this)}>
                                                <Text style={styles.ButtonText}>确定</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                    :
                                    <View style={styles.BlockList}>
                                        {
                                            (this.state.dataRows == "") ?
                                                <View style={styles.Null}>
                                                    <Text style={styles.NullText}>
                                                        没有搜索到相关商品~~~
                                                    </Text>
                                                </View> :
                                                <ListView
                                                    dataSource={this.state.dataSource}
                                                    showsVerticalScrollIndicator={true}
                                                    renderRow={this._renderRow.bind(this)}
                                                    ref="myInput"
                                                />
                                        }
                                    </View>
                            }
                        </View>
                }
                <Modal
                    transparent={true}
                    visible={this.state.emptydata}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <Image source={require("../images/background.png")} style={[styles.ModalStyle,{justifyContent: 'center',alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    请选择单据
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.Emptydata.bind(this)} style={styles.Button}>
                                <Text style={styles.ModalTitleText}>
                                    好的
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    out:{
        flex:1
    },
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    Title: {
        backgroundColor: "#ff4e4e",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
    },
    SearchImage: {
        position: "absolute",
        top: 22,
        left: 24,
    },
    Search: {
        borderRadius: 30,
        backgroundColor: "#ffffff",
        color: "#333333",
        paddingLeft: 46,
        paddingBottom: 15,
        paddingTop: 6,
        paddingBottom: 6,
        fontSize: 14,
        flex: 1,
    },
    Right1: {
        width: 60,
        flexDirection: "row",
        paddingTop: 3,
        paddingLeft: 6
    },
    HeaderImage1: {
        flex: 1,
        marginLeft: 20,
    },
    Text1: {
        flex: 1
    },
    Text: {
        fontSize: 18,
        color: "#ffffff",
        paddingTop: 5,
        paddingLeft: 10,
    },
    modal:{
        marginTop:70,
    },
    BlockList: {
        flex:1,
        flexDirection: "column",
        backgroundColor: "#ffffff"
    },
    Row: {
        flexDirection: "row",
    },
    Block: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        backgroundColor: "#ffffff"
    },
    BlockText: {
        fontSize: 14,
        color: "#333333"
    },
    Null: {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 120,
    },
    NullText: {
        color: "#cccccc",
        fontSize: 20,
        textAlign: "center"
    },
    ScrollView: {
        backgroundColor: "#f2f2f2",
        flex: 1,
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
    left: {
        fontSize: 16,
        color: "#666666",
        width: 75,
        textAlign: "right"
    },
    right: {
        fontSize: 16,
        color: "#333333",
        flexDirection: "row",
        marginLeft: 15,
        fontWeight: "200"
    },
    Right: {
        fontSize: 16,
        color: "#666666",
        flexDirection: "row",
    },
    left1: {
        flexDirection: "row",
        flex: 1,
        marginRight:120,
    },
    right1: {
        flexDirection: "row",
        position: "absolute",
        right: 15,
        top: 5,
    },
    left2: {
        flexDirection: "row",
        flex: 6,
        marginRight:35,
    },
    right2: {
        position: "absolute",
        right: 25,
        top: 12,
        flexDirection: "row",
    },
    Price1: {
        fontSize: 16,
        color: "#333333",
        marginLeft: 15,
        fontWeight: "200",
    },
    NumBer:{
        flex:1
    },
    Number: {
        fontSize:16,
        color:"#333333",
        fontWeight:"200",
        paddingLeft:5,
        flex:1,
        marginLeft:5,
        marginBottom:4,
        paddingTop:0,
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
    Number1: {
        fontSize: 16,
        color: "#333333",
        flex: 6,
        marginBottom: 1,
        fontWeight: "200"
    },
    Delete: {
        fontSize: 20,
        color: "#f63e4d",
        flex: 1,
        textAlign: "center"
    },
    Reduce: {
        fontSize: 20,
        color: "#f63e4d",
        flex: 1,
        textAlign: "center"
    },
    Increase: {
        fontSize: 20,
        color: "#f63e4d",
        flex: 1,
        textAlign: "center"
    },
    sublime: {
        marginLeft: 8,
    },
    button: {
        marginTop: 30,
        marginBottom:15,
        marginLeft: 25,
        marginRight: 25,
        backgroundColor: "#ff4e4e",
        borderRadius: 5,
        paddingTop: 13,
        paddingBottom: 13,
    },
    ButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 18,
    },
    ModalStyle:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        width:null,
        height:null,
    },
    ModalStyleCont:{
        height:130,
        paddingTop:30,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:5,
        backgroundColor:"#ffffff",
    },
    ModalStyleTitle:{
        height:40,
        paddingLeft:100,
        paddingRight:100,
        borderBottomWidth:1,
        borderBottomColor:"#f5f5f5",
    },
    ModalTitleText:{
        fontSize:16,
        color:"#333333",
        textAlign:"center",
    },
    Button:{
        paddingTop:20,
    },
});
