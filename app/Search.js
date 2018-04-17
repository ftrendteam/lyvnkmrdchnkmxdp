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
    InteractionManager
} from 'react-native';

import Index from "./Index";
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
            BQNumber:"",
            Modify:"",
            OnPrice:"",
            Total:"",
            Price:"",
            OrderDetails:1,
            Show: false,
            emptydata:false,
            dataRows: "1",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
            ShoppData:this.props.ShoppData ? this.props.ShoppData : "",
        };
        this.dataRows = [];
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
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
                                    var ShopCar = rows.item(0).ProdName;
                                    if (rows.item(0).ShopNumber == 0) {
                                        this.setState({
                                            Number1: "",
                                        })
                                    } else {
                                        this.setState({
                                            Number1: rows.item(0).ShopNumber,
                                        })
                                    }
                                    this.setState({
                                        ProdName: rows.item(0).ProdName,
                                        ShopPrice: rows.item(0).ShopPrice,
                                        Pid: rows.item(0).Pid,
                                        Remark: rows.item(0).ShopRemark,
                                        prototal: rows.item(0).prototal,
                                        ProdCode: rows.item(0).ProdCode,
                                        DepCode: rows.item(0).DepCode1,
                                        SuppCode: rows.item(0).SuppCode,
                                        BarCode: rows.item(0).BarCode,
                                        ydcountm: countm,
                                        focus: true,
                                        Search: "",
                                        modal: 1,
                                    })
                                    Storage.get('YdCountm').then((ydcountm) => {
                                        if (ydcountm == 2) {//原单数量
                                            this.setState({
                                                Number1: countm
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
                                } else {
                                    alert(JSON.stringify(data))
                                }
                            }, (err) => {
                                alert("网络请求失败");
                            })
                        })
                    })
                });
            } else {
                dbAdapter.selectAidCode(reminder, 1).then((rows) => {
                    if (rows.length == 0) {
                        alert("该商品不存在");
                    } else {
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
                                ProdCode: rows.item(0).ProdCode,
                                OrgFormno: this.state.OrgFormno,
                                FormType: this.state.FormType,
                            };
                            FetchUtil.post(this.state.LinkUrl, JSON.stringify(params)).then((data) => {
                                var countm = JSON.stringify(data.countm);
                                var ShopPrice = JSON.stringify(data.ShopPrice);
                                if (data.retcode == 1) {
                                    var ShopCar = rows.item(0).ProdName;
                                    if (rows.item(0).ShopNumber == 0) {
                                        this.setState({
                                            Number1: "",
                                        })
                                    } else {
                                        this.setState({
                                            Number1: rows.item(0).ShopNumber,
                                        })
                                    }
                                    this.setState({
                                        ProdName: rows.item(0).ProdName,
                                        ShopPrice: rows.item(0).ShopPrice,
                                        Pid: rows.item(0).Pid,
                                        Remark: rows.item(0).ShopRemark,
                                        prototal: rows.item(0).ShopAmount,
                                        ProdCode: rows.item(0).ProdCode,
                                        DepCode: rows.item(0).DepCode1,
                                        SuppCode: rows.item(0).SuppCode,
                                        BarCode: rows.item(0).BarCode,
                                        ydcountm: countm,
                                        focus: true,
                                        Search: "",
                                        modal: 1,
                                    })
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
                                } else {
                                    alert(JSON.stringify(data))
                                }
                            }, (err) => {
                                alert("网络请求失败");
                            })
                        })
                    }
                })
            }
        })

    }

    Storage() {
        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
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

    }

    Close() {
        DeviceEventEmitter.removeAllListeners();
        if(this.state.ShoppData=="0"){
            var nextRoute = {
                name: "清单",
                component: ShoppingCart,
            };
            this.props.navigator.push(nextRoute);
        }else{
            var nextRoute = {
                name: "主页",
                component: Index,
            };
            this.props.navigator.push(nextRoute);
        }

    }

    inputOnBlur(value) {
        this.Modal();
        dbAdapter.selectAidCode(value, 1).then((rows) => {
            this.dataRows = [];
            console.log("row==",rows.length)
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

    OrderDetails(rowData) {
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
        dbAdapter.selectAidCode(rowData.ProdCode, 1).then((rows) => {
            Storage.get('userName').then((tags) => {
                let params = {
                    reqCode: "App_PosReq",
                    reqDetailCode: "App_Client_CurrProdQry",
                    ClientCode: this.state.ClientCode,
                    sDateTime: Date.parse(new Date()),
                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                    username: tags,
                    usercode: this.state.Usercode,
                    SuppCode: rowData.SuppCode,
                    ShopCode: this.state.ShopCode,
                    ChildShopCode: this.state.ChildShopCode,
                    ProdCode: rowData.ProdCode,
                    OrgFormno: this.state.OrgFormno,
                    FormType: this.state.FormType,
                };
                FetchUtil.post(this.state.LinkUrl, JSON.stringify(params)).then((data) => {
                    var countm = JSON.stringify(data.countm);
                    var ShopPrice = JSON.stringify(data.ShopPrice);
                    if (data.retcode == 1) {
                        for (let i = 0; i < rows.length; i++) {
                            var row = rows.item(i);
                            if (this.state.name == "商品采购" || this.state.name == "协配采购" || this.state.Modify == 1) {
                                if (rowData.ShopNumber == 0) {
                                    this.setState({
                                        ShopPrice: ShopPrice,
                                        ProdName: rowData.ProdName,
                                        Pid: rowData.Pid,
                                        Number1: '',
                                        Remark: rowData.ShopRemark,
                                        prototal: rowData.prototal,
                                        ProdCode: rowData.ProdCode,
                                        DepCode: rowData.DepCode1,
                                        SuppCode: rowData.SuppCode,
                                        BarCode: rowData.BarCode,
                                        ydcountm: countm,
                                        Search:"",
                                        modal:1,
                                        numberFormat2:0.00,
                                    })
                                }else{
                                    let numberFormat2 = NumberUtils.numberFormat2((rowData.ShopNumber)*(row.ShopPrice));
                                    this.setState({
                                        ShopPrice: row.ShopPrice,
                                        ProdName: rowData.ProdName,
                                        Pid: rowData.Pid,
                                        Number1: rowData.ShopNumber,
                                        Remark: rowData.ShopRemark,
                                        prototal: rowData.prototal,
                                        ProdCode: rowData.ProdCode,
                                        DepCode: rowData.DepCode1,
                                        SuppCode: rowData.SuppCode,
                                        BarCode: rowData.BarCode,
                                        ydcountm: countm,
                                        Search:"",
                                        modal:1,
                                        numberFormat2:numberFormat2,
                                    })
                                }
                            }else{
                                let numberFormat2 = NumberUtils.numberFormat2((rowData.ShopNumber)*(ShopPrice));
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
                                    Search:"",
                                    modal:1,
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
        })
    }

    Modal() {
        let isShow = this.state.Show;
        this.setState({
            Show: !isShow,
        });
    }

    onSubmitEditing(){
        var ShopPrice = this.state.Number1 * this.state.ShopPrice
        this.setState({
            numberFormat2:ShopPrice
        })
    }

    onNumber(){
        var ShopPrice = (this.state.Number1 * this.state.ShopPrice);
        this.setState({
            numberFormat2:NumberUtils.numberFormat2(ShopPrice),
        });
        if(this.state.name=="商品采购"||this.state.name=="协配采购"||this.state.Modify==1){
            this.setState({
                OnPrice:1,
                PriceText:1
            });
        }else{
            var x = this.state.Number1;//获取数量的数字
            var y = String(x).indexOf(".") + 1;//获取小数点的位置
            if(y > 0) {
                alert("数量不能含有小数");
            } else {
                if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                    var shopInfoData = [];
                    var shopInfo = {};
                    shopInfo.Pid = this.state.Pid;
                    shopInfo.ProdCode = this.state.ProdCode;
                    shopInfo.prodname = this.state.ProdName;
                    shopInfo.countm = this.state.Number1;
                    shopInfo.ShopPrice = this.state.ShopPrice;
                    if(this.state.BQNumber==3){
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
                        if(this.state.BQNumber==3){
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
        if(this.state.Number1==""){
            this.setState({
                Number1:1,
                BQNumber:parseInt(this.state.BQNumber)+1,
                numberFormat2:this.state.ShopPrice,
            });
        }else{
            let numberFormat2 = NumberUtils.numberFormat2((parseInt(this.state.Number1)+1)*(this.state.ShopPrice));
            this.setState({
                Number1:parseInt(this.state.Number1)+1,
                BQNumber:parseInt(this.state.BQNumber)+1,
                numberFormat2:numberFormat2,
            });
        }
    }

    subtraction() {
        if (this.state.Number1 > 0||this.state.BQNumber >1) {
            var Number1 = this.state.Number1;
            var BQNumber1=this.state.BQNumber;
            this.setState({
                Number1: parseInt(Number1) - 1,
                BQNumber:parseInt(BQNumber1)-1,
            });
            let numberFormat2 = NumberUtils.numberFormat2((parseInt(Number1) - 1) * (this.state.ShopPrice));
            this.setState({
                numberFormat2: numberFormat2,
            });
        }
        if (this.state.Number1 == 0||this.state.Number1 == "") {
            ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
            this.setState({
                Number1: ""
            });
        }
    }

    clear() {
        let numberFormat2 = NumberUtils.numberFormat2((0) * (this.state.ShopPrice));
        this.setState({
            Number1: 0,
            BQNumber:1,
            numberFormat2: numberFormat2,
        })
    }

    onEndEditing(){
        if(this.state.Number1==""){
            this.setState({
                numberFormat2:"0.00",
            });
        }else{
            let numberFormat2 = NumberUtils.numberFormat2((parseInt(this.state.Number1))*(this.state.ShopPrice));
            this.setState({
                numberFormat2:numberFormat2,
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
            var Modify=NumberUtils.numberFormat2(this.state.numberFormat2/this.state.Number1);
            this.setState({
                ShopPrice:Modify,
                modal:'',
                OnPrice:'',
                Total:'',
                PriceText:''
            })
            if(this.state.OrderDetails==1){
                var x = this.state.Number1;//获取数量的数字
                var y = String(x).indexOf(".") + 1;//获取小数点的位置
                if(y > 0) {
                    alert("数量不能含有小数");
                } else {
                    if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                        var shopInfoData = [];
                        var shopInfo = {};
                        shopInfo.Pid = this.state.Pid;
                        shopInfo.ProdCode = this.state.ProdCode;
                        shopInfo.prodname = this.state.ProdName;
                        shopInfo.countm = this.state.Number1;
                        shopInfo.ShopPrice = Modify;
                        if(this.state.BQNumber==3){
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
                            if(this.state.BQNumber==3){
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
        var x = this.state.Number1;//获取数量的数字
        var y = String(x).indexOf(".") + 1;//获取小数点的位置
        if(y > 0) {
            alert("数量不能含有小数");
        } else {
            if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                var shopInfoData = [];
                var shopInfo = {};
                shopInfo.Pid = this.state.Pid;
                shopInfo.ProdCode = this.state.ProdCode;
                shopInfo.prodname = this.state.ProdName;
                shopInfo.countm = this.state.Number1;
                shopInfo.ShopPrice = this.state.ShopPrice;
                if(this.state.BQNumber==3){
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
                    if(this.state.BQNumber==3){
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

    _Emptydata(){
        let isShow = this.state.emptydata;
        this.setState({
            emptydata:!isShow,
        });
    }

    Emptydata(){
        this._Emptydata();
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
                                    (this.state.YdCountm == 1||this.state.YdCountm == 5) ?
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
                                            (this.state.name=="商品采购"||this.state.name=="协配采购"||this.state.Modify=="1")?
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
                                                    (this.state.name=="商品采购"||this.state.name=="商品验收"||this.state.name=="协配采购")?
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
        flex: 1,
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
