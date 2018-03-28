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
    Modal,
    FlatList,
    ListView,
    TextInput,
    ScrollView,
    ToastAndroid,
    TouchableOpacity
} from 'react-native';
import Index from "../app/Index";
import Sell from "../Sell/Sell";
import DPPromotionManager from "../Sell/promotion/DPPromotionManager";
import BGPromotionManager from "../Sell/promotion/BGPromotionManager";
import MJPromotionManger from "../Sell/promotion/MJPromotionManger";
import MZPromotionManger from "../Sell/promotion/MZPromotionManger";
import BPPromotionsManger from "../Sell/promotion/BPPromotionsManger";
import GSPromotionsManger from "../Sell/promotion/GSPromotionsManger";
import EOPromotionsManger from "../Sell/promotion/EOPromotionsManger";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import Storage from "../utils/Storage";
import NumberUtils from "../utils/NumberUtils";
import NumFormatUtils from "../utils/NumFormatUtils";
import FormatPrice from "../utils/FormatPrice";
import BigDecimalUtils from "../utils/BigDecimalUtils";
import VipPrice from "../utils/VipPrice";
import Swiper from 'react-native-swiper';
import DBAdapter from "../adapter/DBAdapter";

let dbAdapter = new DBAdapter();
export default class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: false,
            RefundTotal: false,
            LayerShow: false,
            ModalShow: false,
            NewAllPrice:false,
            MZPrice:false,
            CardFaceNo: "",
            CardPwd: "",
            name: "",
            amount: "",
            AMount: 0,
            payments: 0,
            pressStatus:0,
            PressStatus:0,
            Total: "",
            data: "",
            cardfaceno: "",
            DataTime: "",
            RetSerinalNo: "",
            subtract: "",
            VipPrice:"",
            ShopNewAmount:"",
            NewPrice:"",
            discount:"",
            ShopPrice:"",
            VipCardNo: this.props.VipCardNo ? this.props.VipCardNo : "",
            JfBal: this.props.JfBal ? this.props.JfBal : "",
            BalanceTotal: this.props.BalanceTotal ? this.props.BalanceTotal : "",
            CardTypeCode: this.props.CardTypeCode ? this.props.CardTypeCode : "",
            numform: this.props.numform ? this.props.numform : "",
            Seles: this.props.Seles ? this.props.Seles : "",
            vipData:this.props.vipData ? this.props.vipData : "",
            dataRows: this.props.dataRows ? this.props.dataRows : "",
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => true}),
            DataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        }
        this.dataRows = [];
        this.productData = [];
        this.DisCount=[]
    }

    //弹框
    Total() {
        let isShow = this.state.total;
        this.setState({
            total: !isShow,
        })
    }

    RefundTotal() {
        let isShow = this.state.RefundTotal;
        this.setState({
            RefundTotal: !isShow,
        })
    }

    LayerShow() {
        let isShow = this.state.LayerShow;
        this.setState({
            LayerShow: !isShow,
        })
    }

    ModeButton() {
        this.LayerShow();
    }

    ModalShow() {
        let isShow = this.state.ModalShow;
        this.setState({
            ModalShow: !isShow,
        })
    }

    ModalButton() {
        this.ModalShow();
    }

    MZPrice(){
        let isShow = this.state.MZPrice;
        this.setState({
            MZPrice: !isShow,
        })
    }
//整单优惠
    NewAllPrice(){
        let isShow = this.state.NewAllPrice;
        this.setState({
            NewAllPrice: !isShow,
        })
    }

    NewPriceButton(){
        this.NewAllPrice();
    }
    //整单优惠计算
    PriceButton(){
        if(this.state.discount==""){
            alert("请选择优惠方式")
        }else{
            Storage.get('usercode').then((tags)=>{
                dbAdapter.selectKgtuser(tags).then((rows) => {
                    var newAllPrice;
                    var disCount;
                    var disPrice;
                    var disNewPrice;
                    var shopAmount = 0;
                    var ShopPrice=0;
                    var row =rows.HDscRate;
                    if(this.state.NewPrice==""){
                        alert("请输入金额")
                    }else if(this.state.NewPrice>row){
                        alert("没有此优惠权限")
                    }else if(this.state.NewPrice<=row){
                        if(this.state.discount=="1"){
                            newAllPrice = BigDecimalUtils.subtract(this.state.ShopAmount,this.state.NewPrice);
                            console.log('newAllPrice',newAllPrice)
                            disPrice = VipPrice.disCount(this.DisCount,this.state.ShopAmount,this.state.NewPrice);
                            this.setState({
                                ShopAmount: newAllPrice,
                                amount:newAllPrice,
                            });
                            this.NewPriceButton();
                        }else if(this.state.discount=="2"){
                            disCount = BigDecimalUtils.multiply(this.state.ShopAmount,BigDecimalUtils.subtract(1,BigDecimalUtils.divide(this.state.NewPrice,100)));
                            console.log('disCount',disCount)
                            disNewPrice = BigDecimalUtils.subtract(this.state.ShopAmount,disCount);
                            console.log('disNewPrice',disNewPrice)
                            disPrice = VipPrice.disCount(this.DisCount,this.state.ShopAmount,disNewPrice);
                            console.log(this.DisCount)
                            this.setState({
                                ShopAmount: disCount,
                                amount:disCount,
                            });
                            this.NewPriceButton();
                        }
                    }

                })
            })
        }
    }
//取消优惠弹层
    PriceClose(){
        this.NewPriceButton();
    }
//优惠价，折扣价选择
    NewPriceLeft(){
        this.setState({
            pressStatus:'pressin',
            PressStatus:'0',
            discount:1,
        });
    }
    NewPriceRight(){
        this.setState({
            PressStatus:'Pressin',
            pressStatus:0,
            discount:2,
        });
    }

    //物理键
    // componentWillMount(){
    //     if (Platform.OS === 'android') {
    //         BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    //     if (Platform.OS === 'android') {
    //         BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    //     onBackAndroid = () => {
    //         const nav = this.navigator;
    //         const routers = nav.getCurrentRoutes();
    //         if (routers.length > 1) {
    //             nav.pop();
    //             return true;
    //         }
    //         return false;
    //     };
    // }

    componentDidMount(){
        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
            })
        })
        this.dbadapter();
    }
//促销价及四舍五入
    dbadapter() {
        var rows=this.state.dataRows;
        var shopAmount = 0;
        var ShopPrice=0;
        let promises=[];
        let BGPromotion=[];
        let MJPromotion=[];
        let bpPromotons=[];
        for (let i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (this.state.VipCardNo !== "") {
                promises.push(DPPromotionManager.dp(this.state.CardTypeCode, row, dbAdapter));
                BGPromotion.push(BGPromotionManager.BGPromotion(this.state.CardTypeCode, row, dbAdapter));
                bpPromotons.push(BPPromotionsManger.bpPromotons(row, this.state.CardTypeCode, dbAdapter));
            }else if(this.state.VipCardNo == ""){
                promises.push(DPPromotionManager.dp("*", row, dbAdapter));
                BGPromotion.push(BGPromotionManager.BGPromotion("*", row, dbAdapter));
                bpPromotons.push(BPPromotionsManger.bpPromotons(row, "*", dbAdapter));
            }
        }
        //单品促销
        new Promise.all(promises).then((rows)=> {
            var Datafasle;
            for(let i = 0;i<rows.length; i++){
                var row=rows[0];
                if(row==true){
                    Datafasle=true;
                }else if(row==false){
                    Datafasle=false;
                }
            }
            if(Datafasle==false){
                //分组促销
                new Promise.all(BGPromotion).then((rows) => {
                    // var BGDatafasle;
                    // for(let i = 0;i<rows.length; i++){
                    //     var row=rows[0];
                    //     console.log('abc=',rows)
                    //     if(row==true){
                    //         BGDatafasle=true;
                    //     }else if(row==false){
                    //         BGDatafasle=false;
                    //     }
                    // }
                    // console.log('BGDatafasle=', BGDatafasle);
                    var Fenzu = 0;
                    var FenzuAmount = 0;
                    for(let i = 0;i<this.state.dataRows.length;i++) {
                        var Rows = this.state.dataRows[i];
                        console.log('分组=',Rows);
                        this.DisCount.push(Rows);
                        Fenzu = Rows.ShopAmount;
                        FenzuAmount += Fenzu;
                    }
                    this.setState({
                        ShopAmount: FenzuAmount,
                        amount:FenzuAmount,
                    })
                })

                //满减促销
                MJPromotionManger.MJPromotion(this.state.dataRows,"*",dbAdapter).then((rows) => {
                    var Manjian = 0;
                    var ManJian = 0;
                    for(let i = 0;i<this.state.dataRows.length;i++) {
                        var Rows = this.state.dataRows[i];
                        console.log('满减=',Rows);
                        this.DisCount.push(Rows);
                        Manjian = Rows.ShopAmount;
                        ManJian += Manjian;
                    }
                    this.setState({
                        ShopAmount: ManJian,
                        amount:ManJian,
                    })

                })

                //满赠促销
                MZPromotionManger.mzPromotion("*",this.state.dataRows,dbAdapter).then((rows)=>{
                    console.log('rows=',rows)
                    var Manze = 0;
                    var ManZe = 0;
                    for(let i = 0;i<this.state.dataRows.length;i++) {
                        var Rows = this.state.dataRows[i];
                        console.log('满赠=',Rows);
                        this.DisCount.push(Rows);
                        Manze = Rows.ShopAmount;
                        shopAmount += Manze;
                    }
                    this.setState({
                        ShopPrice:rows[0],
                        ManZe: ManZe,
                        amount:ManZe,
                    })

                    let ShopPrice=[];
                    if(rows.length==2){
                        dbAdapter.selectTdscPresent(rows[1]).then((rows) => {
                            ShopPrice.push(rows.item(0))
                            console.log('ShopPrice=',ShopPrice)
                            this.setState({
                                DataSource: this.state.DataSource.cloneWithRows(ShopPrice),
                            })
                            this.MZPrice();

                        })
                    }
                })

               // 买赠促销
                new Promise.all(bpPromotons).then((rows)=> {
                    console.log('MZ=',rows);
                    var Maize = 0;
                    var MaiZe = 0;
                    for(let i = 0;i<this.state.dataRows.length;i++) {
                        var Rows = this.state.dataRows[i];
                        console.log('买赠=',Rows);
                        this.DisCount.push(Rows);
                        Maize = Rows.ShopAmount;
                        MaiZe += Maize;
                    }
                    this.setState({
                        ShopAmount: MaiZe,
                        amount:MaiZe,
                    })
                    console.log('length=',rows.length)
                    let MZShopPrice=[];
                    if(rows.length>=1&&rows[0]!=""){
                        dbAdapter.selectTdscPresent(rows[0]).then((rows) => {
                            MZShopPrice.push(rows.item(0))
                            console.log('买赠1=',MZShopPrice)
                            this.setState({
                                DataSource: this.state.DataSource.cloneWithRows(MZShopPrice),
                            })
                            this.MZPrice();
                        })
                    }
                })

                //组合促销
                GSPromotionsManger.gsPromotionsManger(this.state.dataRows,"*",dbAdapter).then((rows) => {
                    console.log('ZH=',rows)
                    console.log('DataRows1111=',this.state.dataRows)
                    var Zuhe = 0;
                    var ZuHe = 0;
                    for(let i = 0;i<this.state.dataRows.length;i++) {
                        var Rows = this.state.dataRows[i];
                        this.DisCount.push(Rows);
                        console.log("组合",this.state.dataRows);
                        Zuhe = Rows.ShopAmount;
                        ZuHe += Zuhe;
                    }
                    this.setState({
                        ShopAmount: ZuHe,
                        amount:ZuHe,
                    })
                    //奇偶促销
                })
                //奇偶促销
                EOPromotionsManger.eoPromotionsManger(this.state.dataRows,"*",dbAdapter).then((rows) => {
                    var Jiou = 0;
                    var JiOu = 0;
                    for(let i = 0;i<this.state.dataRows.length;i++) {
                        var Rows = this.state.dataRows[i];
                        this.DisCount.push(Rows);
                        console.log("奇偶",this.state.dataRows);
                        Jiou = Rows.ShopAmount;
                        JiOu += Jiou;
                    }
                    this.setState({
                        ShopAmount: JiOu,
                        amount:JiOu,
                    })
                })

            }else{
                for(let i = 0;i<this.state.dataRows.length;i++) {
                    var Rows = this.state.dataRows[i];
                    console.log('DataRows=',Rows);
                    this.DisCount.push(Rows);
                    ShopPrice = Rows.ShopAmount;
                    shopAmount += ShopPrice;
                }
                this.setState({
                    ShopAmount: shopAmount,
                    amount:shopAmount,
                })
            }
        })

        dbAdapter.selectPosOpt('CUTLEVEL').then((rows) => {
            for (let i = 0; i < rows.length; i++) {
                var row = rows.item(i);
                var CUTLEVEL = row.OptValue;
            }
            if (this.state.ShopAmount > CUTLEVEL) {
                dbAdapter.selectPosOpt('AUTOCUT').then((rows) => {
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                        var AUTOCUT = row.OptValue;
                    }
                    if (AUTOCUT == '1') {
                        dbAdapter.selectPosOpt('CUTDEGREE').then((rows) => {
                            var round;
                            var RoundPrice;
                            var subtract;
                            var vipData;
                            for (let i = 0; i < rows.length; i++) {
                                var row = rows.item(i);
                                var CUTDEGREE = row.OptValue;
                            }
                            round = FormatPrice.round(CUTDEGREE, this.state.ShopAmount, this.state.dataRows);
                            subtract = BigDecimalUtils.subtract(this.state.ShopAmount, round, 2);//总价格减去四舍五入的价格
                            vipData = BigDecimalUtils.add(this.state.vipData, subtract, 2);
                            this.setState({
                                ShopAmount: round,
                                subtract: subtract,
                                VipPrice:vipData,
                            })
                        })
                    } else {
                        var vipData;
                        vipData = BigDecimalUtils.add(this.state.vipData, 0, 2);
                        this.setState({
                            subtract: 0,
                            ShopAmount:this.state.ShopAmount,
                            amount:this.state.ShopAmount,
                            VipPrice:vipData,
                        })
                    }
                })
            } else {
                var vipData;
                vipData = BigDecimalUtils.add(this.state.vipData, 0, 2);
                this.setState({
                    subtract: 0,
                    ShopAmount:this.state.ShopAmount,
                    amount:this.state.ShopAmount,
                    VipPrice:vipData,
                })
                // console.log("123")
            }
        })

        dbAdapter.selectAllData("payInfo").then((rows) => {
            let priductData = [];
            for (let i = 0; i < rows.length; i++) {
                var row = rows.item(i);
                priductData.push(row);
            }
            this.productData = priductData;
            this.setState({
                data: priductData,
            })
            // console.log("456")
        });
    }

    Return() {
        if (this.state.CardFaceNo == "") {
            var nextRoute = {
                name: "Sell",
                component: Sell,
            };
            this.props.navigator.push(nextRoute);
        } else {
            ToastAndroid.show('订单未完成', ToastAndroid.SHORT)
        }
    }
//整单优惠button
    discount(){
        this.NewPriceButton();
    }
//继续交易
    JiaoYi() {
        if (this.dataRows == '') {
            var nextRoute = {
                name: "Sell",
                component: Sell,
            };
            this.props.navigator.push(nextRoute);
        } else {
            ToastAndroid.show('订单未完成', ToastAndroid.SHORT)
        }
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <View style={styles.ShopList1} onPress={() => this.OrderDetails(rowData)}>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.payName}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.CardFaceNo}</Text></View>
                {
                    (rowData.payName == "现金") ?
                        <View style={styles.Row}><Text style={styles.Name}>{rowData.Total}</Text></View>
                        :
                        <View style={styles.Row}><Text style={styles.Name}>{rowData.total}</Text></View>
                }
                <View style={styles.Row}><Text style={styles.Name}>{rowData.retZjf}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.ReferenceNo}</Text></View>
            </View>
        );
    }

    ShopPrice(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity style={styles.ShopPRice} onPress={() => this.ShopAmount(rowData)}>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.ProdName}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.StdPrice}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.FormNo}</Text></View>
            </TouchableOpacity>
        );
    }

    //满赠 买赠促销商品插入shopinfo表
    ShopAmount(rowData){
        var shopInfoData = [];
        var shopInfo = {};
        shopInfo.Pid = "";
        shopInfo.ProdCode= rowData.ProdCode;
        shopInfo.prodname = rowData.ProdName;
        shopInfo.countm = "";
        shopInfo.ShopPrice = rowData.StdPrice;
        shopInfo.prototal = "";
        shopInfo.promemo = "";
        shopInfo.DepCode = "";
        shopInfo.ydcountm = "";
        shopInfo.SuppCode = "";
        shopInfo.BarCode = "";
        shopInfoData.push(shopInfo);
        //调用插入表方法
        dbAdapter.insertShopInfo(shopInfoData);
        this.MZPrice();
        var AllShop= this.state.ShopAmount+this.state.ShopPrice;
        // console.log('AllShop=',AllShop)
        this.setState({
            ShopAmount: AllShop,
            amount:AllShop,
        })
    }

    ShopClose(){
        this.MZPrice();
    }

    HorButton(item) {
        if (this.state.amount == "") {
            this.LayerShow();
        } else {
            if (item.item.PayCode == "01") {
                if (this.state.Seles == "R") {
                    if (this.state.amount > Number(this.state.Total) && this.state.Total < 0) {
                        this.ModalShow()
                    } else {
                        this.RefundTotal()
                    }
                } else if (this.state.Seles == "T") {
                    if (this.state.amount > Number(this.state.Total) && this.state.Total > 0) {
                        this.ModalShow()
                    } else {
                        this.Total()
                    }
                }
            } else if (item.item.PayCode == "00") {
                if (this.state.Seles == "R") {
                    var payTotal = Number(this.state.amount) + Number(this.state.payments);
                    this.state.payments += -(Number(this.state.amount));
                    var payamount = Number(this.state.AMount) - Number(this.state.amount);
                    var Total = BigDecimalUtils.add(this.state.ShopAmount, this.state.payments, 2);
                    var aptotal = BigDecimalUtils.subtract(payamount, Total, 2);
                    if (this.state.ShopAmount < payTotal) {
                        var Amount = {
                            'payName': '现金',
                            'CardFaceNo': '',
                            'Total': payamount,
                            'total': aptotal,
                            'payRT': '',
                            'PayCode': item.item.PayCode,
                            'pid': item.item.Pid,
                        }
                    } else {
                        var Amount = {
                            'payName': '现金',
                            'CardFaceNo': '',
                            'Total': payamount,
                            'total': payamount,
                            'payRT': '',
                            'PayCode': item.item.PayCode,
                            'pid': item.item.Pid,
                        }
                    }
                    if (this.dataRows.length == 0) {
                        this.dataRows.push(Amount);
                        this.setState({
                            AMount: payamount,
                            payments: this.state.payments,
                            payname: "现金",
                            Total: Total,
                            cardfaceno: "",
                            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                        })
                    } else {
                        for (let i = 0; i < this.dataRows.length; i++) {
                            let RowsList = this.dataRows[i];
                            if (RowsList.payName == "现金") {
                                RowsList.Total = payamount;
                                RowsList.total = aptotal;
                                this.setState({
                                    AMount: payamount,
                                    payments: this.state.payments,
                                    Total: Total,
                                    cardfaceno: "",
                                    dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                                });
                                break
                            } else if (i == this.dataRows.length - 1) {
                                this.dataRows.push(Amount);
                                this.setState({
                                    AMount: payamount,
                                    payments: this.state.payments,
                                    Total: Total,
                                    cardfaceno: "",
                                    dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                                })
                            }
                        }
                    }
                    this.restorage1()
                } else if (this.state.Seles == "T") {
                    var payTotal = Number(this.state.amount) + Number(this.state.payments);
                    this.state.payments += Number(this.state.amount);
                    var Total = -(BigDecimalUtils.subtract(this.state.ShopAmount, this.state.payments, 2));
                    var payamount = Number(this.state.AMount) + Number(this.state.amount);
                    var aptotal = BigDecimalUtils.subtract(payamount, Total, 2);
                    if (payTotal>=this.state.ShopAmount) {
                        var Amount = {
                            'payName': '现金',
                            'CardFaceNo': '',
                            'Total': payamount,
                            'total': aptotal,
                            'payRT': '',
                            'PayCode': item.item.PayCode,
                            'pid': item.item.Pid,
                        }
                    } else {
                        var Amount = {
                            'payName': '现金',
                            'CardFaceNo': '',
                            'Total': payamount,
                            'total': payamount,
                            'payRT': '',
                            'PayCode': item.item.PayCode,
                            'pid': item.item.Pid,
                        }
                    }
                    if (this.dataRows.length == 0) {
                        this.dataRows.push(Amount);
                        this.setState({
                            AMount: payamount,
                            payments: this.state.payments,
                            Total: Total,
                            cardfaceno: "",
                            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                        })
                    } else {
                        for (let i = 0; i < this.dataRows.length; i++) {
                            let RowsList = this.dataRows[i];
                            RowsList.Total = payamount;
                            if (RowsList.payName == "现金") {
                                RowsList.total = aptotal;
                                this.setState({
                                    AMount: payamount,
                                    payments: this.state.payments,
                                    Total: Total,
                                    cardfaceno: "",
                                    dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                                });
                                break
                            } else if (i == this.dataRows.length - 1) {
                                this.dataRows.push(Amount);
                                this.setState({
                                    AMount: payamount,
                                    payments: this.state.payments,
                                    payname: "现金",
                                    Total: Total,
                                    cardfaceno: "",
                                    dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                                })
                            }
                        }
                    }
                    this.restorage();
                };
            };
        };
    };

//保存流水表及detail表
    restorage() {
        Storage.get('Pid').then((Pid) => {
            Storage.get('usercode').then((usercode) => {
                Storage.get('userName').then((userName) => {
                    if (this.state.ShopAmount == this.state.payments || this.state.ShopAmount < this.state.payments) {
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
                        var InnerNo = NumFormatUtils.CreateInnerNo();
                        for (let i = 0; i < this.dataRows.length; i++) {
                            var dataRows = this.dataRows[i];
                            console.log('wtf=',dataRows)
                            console.log(dataRows.pid)
                            var ino;
                            ino = i + 1
                            var SumData = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
                            //插入Sum表
                            var sumDatas = [];
                            var sum = {};
                            sum.LsNo = this.state.numform;
                            sum.sDateTime = SumData;
                            sum.CashierId = Pid;
                            sum.CashierCode = usercode;
                            sum.CashierName = userName;
                            sum.ino = ino;
                            sum.Total = this.state.ShopAmount;
                            sum.TotalPay = this.state.payments;
                            sum.Change = this.state.Total;
                            sum.TradeFlag = this.state.Seles;
                            if (this.state.VipCardNo == "") {
                                sum.DscTotal = 0;
                                sum.CustType = '0';
                                sum.CustCode = "";
                            } else {
                                sum.DscTotal = this.state.VipPrice;
                                sum.CustType = '2';
                                sum.CustCode = this.state.VipCardNo;
                            }

                            sum.PayId = dataRows.pid;
                            sum.PayCode = dataRows.PayCode;
                            sum.Amount = dataRows.total;
                            sum.OldAmount = dataRows.total;
                            sum.TendPayCode = this.state.VipCardNo;
                            sum.InnerNo = InnerNo;
                            sumDatas.push(sum);
                            dbAdapter.insertSum(sumDatas);
                        };
                        for (let i = 0; i < this.state.dataRows.length; i++) {
                            var DataRows = this.state.dataRows[i];
                            console.log('WTF=',DataRows)
                            var OrderNo = 0;
                            OrderNo = i + 1;
                            var BarCode;
                            var pid;
                            var ProdCode;
                            var ProdName;
                            var DepCode;
                            var Count;
                            var ShopPrice;
                            var prototal;
                            BarCode = DataRows.BarCode;
                            pid = DataRows.Pid;
                            ProdCode = DataRows.ProdCode;
                            ProdName = DataRows.ProdName;
                            DepCode = DataRows.DepCode;
                            Count = DataRows.ShopNumber;
                            ShopPrice = DataRows.ShopPrice;
                            prototal = DataRows.ShopAmount;
                            var SumData = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
                            var detailDatas = [];
                            var detail = {};
                            detail.LsNo = this.state.numform;
                            detail.sDateTime = SumData;
                            detail.TradeFlag = this.state.Seles;
                            detail.CashierId = Pid;
                            detail.CashierCode = usercode;
                            detail.CashierName = userName;
                            detail.ClerkId = -999;
                            detail.ClerkCode = "";
                            detail.Pid = pid;
                            detail.BarCode = BarCode;
                            detail.ClerkName = "";
                            detail.ProdCode = ProdCode;
                            detail.ProdName = ProdName;
                            detail.DepCode = DepCode;
                            detail.Price = ShopPrice;
                            detail.Amount = Count;
                            detail.DscTotal = 0;
                            detail.Total = NumberUtils.numberFormat2(prototal);
                            detail.HandDsc = 0;
                            if (i == 0) {
                                detail.AutoDscTotal = this.state.subtract;
                            } else {
                                detail.AutoDscTotal = 0;
                            }
                            detail.InnerNo = InnerNo;
                            detail.OrderNo = OrderNo + "";
                            detailDatas.push(detail);
                            dbAdapter.insertDetail(detailDatas);

                        };
                        dbAdapter.selectSum().then((rows) => {
                            let sums = [];
                            let details = [];
                            let index = 0;
                            for (let i = 0; i < rows.length; i++) {
                                dbAdapter.selectSumAllData(rows.item(i).LsNo, rows.item(i).InnerNo, rows.item(i).sDateTime).then((sum) => {
                                    for (let j = 0; j < sum.length; j++) {
                                        sums.push(sum.item(j));
                                    }
                                })
                                dbAdapter.selectDetailAllData(rows.item(i).LsNo, rows.item(i).sDateTime).then((detail) => {
                                    for (let j = 0; j < detail.length; j++) {
                                        details.push(detail.item(j));
                                    }
                                    index++;
                                    if (index == rows.length) {//此处执行流水上传操作
                                        Storage.get('LinkUrl').then((tags) => {
                                            Storage.get('ShopCode').then((ShopCode) => {
                                                Storage.get('PosCode').then((PosCode) => {
                                                    let requestBody = JSON.stringify({
                                                        'TblName': 'upsum',
                                                        'ShopCode': ShopCode,
                                                        'PosCode': PosCode,
                                                        'detail': details,
                                                        'sum': sums,
                                                    });
                                                    console.log(requestBody)
                                                    FetchUtil.post(tags, requestBody).then((success) => {
                                                        if ((success.retcode == 1)) {//表示流水上传成功 修改数据库标识
                                                            dbAdapter.upDateSum(rows.item(i).LsNo, rows.item(i).sDateTime).then((upDateSum) => {
                                                            });
                                                            dbAdapter.upDateDetail(rows.item(i).LsNo, rows.item(i).sDateTime).then((upDateDetail) => {
                                                            });
                                                        } else {
                                                            alert(JSON.stringify(success))
                                                        }
                                                    }, (error) => {
                                                        alert('网络请求失败');
                                                    });
                                                });
                                            });
                                        });
                                    }
                                })
                            }
                        });
                        var nextRoute = {
                            name: "Index",
                            component: Index,
                        };
                        this.props.navigator.push(nextRoute);
                        dbAdapter.deleteData("shopInfo");
                        Storage.delete("VipPrice");
                    }
                })
            })
        })
    }

    restorage1() {
        Storage.get('Pid').then((Pid) => {
            Storage.get('usercode').then((usercode) => {
                Storage.get('userName').then((userName) => {
                    if (-this.state.ShopAmount == this.state.payments || -this.state.ShopAmount > this.state.payments) {
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
                        var InnerNo = NumFormatUtils.CreateInnerNo();
                        for (let i = 0; i < this.dataRows.length; i++) {
                            var dataRows = this.dataRows[i];
                            var ino;
                            ino = i + 1
                            var SumData = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
                            //插入Sum表
                            var sumDatas = [];
                            var sum = {};
                            sum.LsNo = this.state.numform;
                            sum.sDateTime = SumData;
                            sum.CashierId = Pid;
                            sum.CashierCode = usercode;
                            sum.CashierName = userName;
                            sum.ino = ino;
                            sum.Total = -this.state.ShopAmount;
                            sum.TotalPay = this.state.payments;
                            sum.Change = 0;
                            sum.TradeFlag = this.state.Seles;
                            if (this.state.VipCardNo == "") {
                                sum.DscTotal = 0;
                                sum.CustType ='0';
                                sum.CustCode = "";
                            } else {
                                sum.DscTotal = this.state.VipPrice;
                                sum.CustType = '2';
                                sum.CustCode = this.state.VipCardNo;
                            }
                            sum.PayId = dataRows.pid;
                            sum.PayCode = dataRows.PayCode;
                            sum.Amount = dataRows.total;
                            sum.OldAmount = dataRows.total;
                            sum.TendPayCode = this.state.VipCardNo;
                            sum.InnerNo = InnerNo;
                            sumDatas.push(sum);
                            dbAdapter.insertSum(sumDatas);
                        };
                        for (let i = 0; i < this.state.dataRows.length; i++) {
                            var DataRows = this.state.dataRows[i];
                            var OrderNo = 0;
                            OrderNo = i + 1;
                            var BarCode;
                            var pid;
                            var ProdCode;
                            var ProdName;
                            var DepCode;
                            var Count;
                            var ShopPrice;
                            var prototal;
                            BarCode = DataRows.BarCode;
                            pid = DataRows.Pid;
                            ProdCode = DataRows.ProdCode;
                            ProdName = DataRows.ProdName;
                            DepCode = DataRows.DepCode;
                            Count = DataRows.ShopNumber;
                            ShopPrice = DataRows.ShopPrice;
                            prototal = DataRows.ShopAmount;
                            var SumData = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
                            var detailDatas = [];
                            var detail = {};
                            detail.LsNo = this.state.numform;
                            detail.sDateTime = SumData;
                            detail.TradeFlag = this.state.Seles;
                            detail.CashierId = Pid;
                            detail.CashierCode = usercode;
                            detail.CashierName = userName;
                            detail.ClerkId = -999;
                            detail.ClerkCode = "";
                            detail.Pid = pid;
                            detail.BarCode = BarCode;
                            detail.ClerkName = "";
                            detail.ProdCode = ProdCode;
                            detail.ProdName = ProdName;
                            detail.DepCode = DepCode;
                            detail.Price = -ShopPrice;
                            detail.Amount = Count;
                            detail.DscTotal = 0;
                            detail.Total = -(NumberUtils.numberFormat2(prototal));
                            if (i == 0) {
                                detail.AutoDscTotal = this.state.subtract;
                            } else {
                                detail.AutoDscTotal = 0;
                            }
                            detail.HandDsc = 0;
                            detail.InnerNo = InnerNo;
                            detail.OrderNo = OrderNo + "";
                            detailDatas.push(detail);
                            dbAdapter.insertDetail(detailDatas);
                        };
                        dbAdapter.selectSum().then((rows) => {
                            let sums = [];
                            let details = [];
                            let index = 0;
                            for (let i = 0; i < rows.length; i++) {
                                dbAdapter.selectSumAllData(rows.item(i).LsNo, rows.item(i).InnerNo, rows.item(i).sDateTime).then((sum) => {
                                    for (let j = 0; j < sum.length; j++) {
                                        sums.push(sum.item(j));
                                    }
                                })
                                dbAdapter.selectDetailAllData(rows.item(i).LsNo, rows.item(i).sDateTime).then((detail) => {
                                    for (let j = 0; j < detail.length; j++) {
                                        details.push(detail.item(j));
                                    }
                                    index++;
                                    if (index == rows.length) {//此处执行流水上传操作
                                        Storage.get('LinkUrl').then((tags) => {
                                            Storage.get('ShopCode').then((ShopCode) => {
                                                Storage.get('PosCode').then((PosCode) => {
                                                    let requestBody = JSON.stringify({
                                                        'TblName': 'upsum',
                                                        'ShopCode': ShopCode,
                                                        'PosCode': PosCode,
                                                        'detail': details,
                                                        'sum': sums,
                                                    });
                                                    FetchUtil.post(tags, requestBody).then((success) => {
                                                        if ((success.retcode == 1)) {//表示流水上传成功 修改数据库标识
                                                            dbAdapter.upDateSum(rows.item(i).LsNo, rows.item(i).sDateTime).then((upDateSum) => {
                                                            });
                                                            dbAdapter.upDateDetail(rows.item(i).LsNo, rows.item(i).sDateTime).then((upDateDetail) => {
                                                            });
                                                        } else {
                                                            alert(JSON.stringify(success))
                                                        }
                                                    }, (error) => {
                                                        alert('网络请求失败');
                                                    });
                                                });
                                            });
                                        });
                                    }
                                })
                            }
                        });
                        var nextRoute = {
                            name: "Index",
                            component: Index,
                        };
                        this.props.navigator.push(nextRoute);
                        dbAdapter.deleteData("shopInfo");
                        Storage.delete("VipPrice");
                    };
                });
            });
        });
    }

//Flatlist字段
    _renderItem(item, index) {
        return (
            <TouchableOpacity onPress={() => this.HorButton(item)} style={[styles.PageRowButton, {marginRight: 5}]}>
                <Text style={styles.PageRowText}>
                    {item.item.payName}
                </Text>
            </TouchableOpacity>
        )
    }

//FlatList加入kay值
    keyExtractor(item: Object, index: number) {
        return item.payName//FlatList使用json中的ProdName动态绑定key
    }

//付款储值卡网络请求
    Button() {
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
        var sum = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
        return new Promise((resolve, reject) => {
            Storage.get('ShopCode').then((ShopCode) => {
                Storage.get('PosCode').then((PosCode) => {
                    let params = {
                        TblName: "VipCardPay",
                        PayOrderNo: this.state.numform,
                        CardPwd: NetUtils.MD5(this.state.CardPwd) + '',
                        shopcode: ShopCode,
                        poscode: PosCode,
                        CardFaceNo: this.state.CardFaceNo,
                        OrderTotal: this.state.amount,
                        SaleTotal: this.state.ShopAmount,
                        JfValue: 0,
                        TransFlag: sum,
                    }
                    Storage.get('LinkUrl').then((tags) => {
                        FetchUtil.post(tags, JSON.stringify(params)).then((data) => {
                            if (data.retcode == 1) {
                                var TblRow = data.TblRow;
                                var retcurrJF;
                                var retZjf;
                                var ReferenceNo;
                                var retTxt;
                                var PayretcurrJF;
                                //付款方式
                                for (let i = 0; i < TblRow.length; i++) {
                                    var row = TblRow[i];
                                    retcurrJF = row.retcurrJF;
                                    retZjf = row.retZjf;
                                    ReferenceNo = row.ReferenceNo;
                                    retTxt = row.retTxt;
                                }
                                ;
                                //支付方式
                                for (let i = 0; i < this.productData.length; i++) {
                                    var Pid;
                                    var PayCode;
                                    var productData = this.productData[i];
                                    if (productData.payName == "储值卡") {
                                        Pid = productData.Pid;
                                        PayCode = productData.PayCode;
                                    }
                                }
                                ;
                                var TblRowconcat = {
                                    'payName': '储值卡',
                                    'CardFaceNo': this.state.CardFaceNo,
                                    'total': retcurrJF,
                                    'retZjf': retZjf,
                                    'ReferenceNo': ReferenceNo,
                                    'PayretcurrJF': PayretcurrJF,
                                    'pid': Pid,
                                    'PayCode': PayCode,
                                };
                                this.dataRows.push(TblRowconcat);
                                this.state.payments += retcurrJF;
                                var Total = (BigDecimalUtils.subtract(this.state.ShopAmount, this.state.payments, 2));
                                this.setState({
                                    payments: this.state.payments,
                                    Amount: retcurrJF,
                                    Total: Total,
                                    dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                                });
                                this.restorage();
                                this.Total();

                            } else {
                                alert(JSON.stringify(data))
                            }
                            ;
                        }, (err) => {
                            alert("网络请求失败");
                        });
                    })
                })
            })
        })
    }

    CloseButton() {
        this.Total();
    }

//退货储值卡
    RetButton() {
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
        var sum = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
        var Datatime = this.state.DataTime;
        if (this.state.DataTime.length == 8) {
            var reg = /(.{4})(.*)/;
            Datatime = Datatime.replace(reg, "$1-$2");
            var Reg = /(.{7})(.*)/;
            Datatime = Datatime.replace(Reg, "$1-$2");
            return new Promise((resolve, reject) => {
                Storage.get('ShopCode').then((ShopCode) => {
                    Storage.get('PosCode').then((PosCode) => {
                        let params = {
                            TblName: "VipCardPay_Ret",
                            PayOrderNo: this.state.numform,
                            CardPwd: this.state.CardPwd,
                            shopcode: ShopCode,
                            poscode: PosCode,
                            CardFaceNo: this.state.CardFaceNo,
                            OrderTotal: this.state.amount,
                            SaleTotal: this.state.ShopAmount,
                            JfValue: 0,
                            TransFlag: sum,
                            OldSaleDate: Datatime,
                            RetSerinalNo: this.state.RetSerinalNo,

                        };
                        Storage.get('LinkUrl').then((tags) => {
                            FetchUtil.post(tags, JSON.stringify(params)).then((data) => {
                                if (data.retcode == 1) {
                                    var TblRow = data.TblRow;
                                    var retcurrJF;
                                    var retZjf;
                                    var ReferenceNo;
                                    var retTxt;
                                    var PayretcurrJF;
                                    //付款方式
                                    for (let i = 0; i < TblRow.length; i++) {
                                        var row = TblRow[i];
                                        retcurrJF = row.retcurrJF;
                                        retZjf = row.retZjf;
                                        ReferenceNo = row.ReferenceNo;
                                        retTxt = row.retTxt;

                                    }
                                    ;
                                    //支付方式
                                    for (let i = 0; i < this.productData.length; i++) {
                                        var Pid;
                                        var PayCode;
                                        var productData = this.productData[i];
                                        if (productData.payName == "储值卡") {
                                            Pid = productData.Pid;
                                            PayCode = productData.PayCode;
                                        }
                                    }
                                    ;
                                    var TblRowconcat = {
                                        'payName': '储值卡',
                                        'CardFaceNo': this.state.CardFaceNo,
                                        'total': -retcurrJF,
                                        'retZjf': retZjf,
                                        'ReferenceNo': ReferenceNo,
                                        'PayretcurrJF': PayretcurrJF,
                                        'pid': Pid,
                                        'PayCode': PayCode,
                                    };
                                    this.dataRows.push(TblRowconcat);
                                    this.state.payments -= retcurrJF;
                                    var Total = BigDecimalUtils.add(this.state.ShopAmount, this.state.payments, 2);
                                    this.setState({
                                        payments: this.state.payments,
                                        Amount: retcurrJF,
                                        retZjf: retZjf,
                                        ReferenceNo: ReferenceNo,
                                        retTxt: retTxt,
                                        CardFaceNo: this.state.CardFaceNo,
                                        Total: Total,
                                        payname: "储值卡",
                                        dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                                    });
                                    this.restorage1();
                                    this.RefundTotal();
                                } else {
                                    alert(JSON.stringify(data))
                                }
                                ;
                            }, (err) => {
                                alert("网络请求失败");
                            });
                        });
                    });
                });
            });
        } else {
            alert("请输入正确的时间")
        }
    }

    CloseRetButton() {
        this.RefundTotal();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>付款</Text>
                    </View>
                </View>
                <View style={styles.TitleCont}>
                    <View style={styles.FristList}>
                        <View style={styles.List}>
                            <View style={styles.ListView1}>
                                <Text style={[styles.ListText, {textAlign: "center"}]}>应付金额</Text>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.ListView1}>
                                <Text style={[styles.ListText, {textAlign: "center"}]}>支付金额</Text>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.ListView1}>
                                <Text style={[styles.ListText, {textAlign: "center"}]}>剩余金额</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.FristList}>
                        {
                            (this.state.Seles == "T") ?
                                <View style={styles.List}>
                                    <View style={styles.ListView1}>
                                        <Text
                                            style={[styles.ListText, {textAlign: "center"}]}>{this.state.ShopAmount}</Text>
                                    </View>
                                </View> :
                                <View style={styles.List}>
                                    <View style={styles.ListView1}>
                                        <Text style={[styles.ListText, {textAlign: "center"}]}>-{this.state.ShopAmount}</Text>
                                    </View>
                                </View>
                        }
                        <View style={styles.List}>
                            <View style={styles.ListView1}>
                                <Text style={[styles.ListText, {textAlign: "center"}]}>{this.state.payments}</Text>
                            </View>
                        </View>
                        <View style={styles.List}>
                            <View style={styles.ListView1}>
                                <Text style={[styles.ListText, {textAlign: "center"}]}>{this.state.Total}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.ShopCont}>
                    <View style={[{backgroundColor: "#ff4e4e", width: 10, height: 60, position: "absolute", left: 0,}]}></View>
                    <View style={[{backgroundColor: "#ff4e4e", width: 10, height: 60, position: "absolute", right: 0,}]}></View>
                    <View style={styles.ShopList}>
                        <View style={styles.ListTitle}>
                            <View style={styles.ListClass}>
                                <Text style={styles.ListClassText}>付款方式</Text>
                            </View>
                            <View style={styles.ListClass}>
                                <Text style={styles.ListClassText}>卡号</Text>
                            </View>
                            <View style={styles.ListClass}>
                                <Text style={styles.ListClassText}>金额</Text>
                            </View>
                            <View style={styles.ListClass}>
                                <Text style={styles.ListClassText}>余额</Text>
                            </View>
                            <View style={styles.ListClass}>
                                <Text style={styles.ListClassText}>凭证</Text>
                            </View>
                        </View>
                        <ListView
                            style={styles.scrollview}
                            dataSource={this.state.dataSource}
                            showsVerticalScrollIndicator={true}
                            renderRow={this._renderRow.bind(this)}
                        />
                    </View>
                </View>
                <ScrollView style={styles.ScrollView}>
                    <View style={styles.MemberMent}>
                        <View style={styles.Member}>
                            <View style={styles.MemberLeft}>
                                <Text style={styles.MemberText}>积分：</Text>
                            </View>
                            <View style={styles.MemberRight}>
                                <Text style={styles.MemberText}>{this.state.JfBal}</Text>
                            </View>
                        </View>
                        <View style={styles.Member}>
                            <View style={styles.MemberLeft}>
                                <Text style={styles.MemberText}>余额：</Text>
                            </View>
                            <View style={styles.MemberRight}>
                                <Text style={styles.MemberText}>{this.state.BalanceTotal}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.PayMent}>
                        <View style={styles.FirstMent}>
                            <View style={styles.paymentleft}>
                                <Text style={styles.InpuTingText}>付款额：</Text>
                            </View>
                            <View style={styles.paymentright}>
                                <TextInput
                                    numberoflines={1}
                                    keyboardType="numeric"
                                    textalign="center"
                                    underlineColorAndroid='transparent'
                                    style={styles.paymentinput}
                                    defaultValue ={this.state.ShopAmount}
                                    onChangeText={(value) => {
                                        this.setState({
                                            amount: value
                                        })
                                    }}
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.discount.bind(this)} style={styles.FirstMent1}>
                            <Text style={styles.FirstMentText}>整单优惠</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.JiaoYi.bind(this)} style={styles.FirstMent1}>
                            <Text style={styles.FirstMentText}>继续交易</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal={true}
                        key={item => item.Pid}
                        style={styles.horizontal}
                        renderItem={this._renderItem.bind(this)}
                        data={this.state.data}
                        keyExtractor={this.keyExtractor}
                        getItemLayout={(data, index) => (
                            {length: 50, offset: 50 * index, index}
                        )}
                    />
                    <Modal
                        transparent={true}
                        visible={this.state.total}
                        onShow={() => {
                        }}
                        onRequestClose={() => {
                        }}>
                        <View style={styles.MemberBounces}>
                            <View style={styles.Cont}>
                                <View style={styles.BouncesTitle}>
                                    <Text style={[styles.TitleText, {fontSize: 18}]}>储值卡</Text>
                                </View>
                                <View style={styles.MemberCont}>
                                    <View style={styles.MemberView}>
                                        <View style={styles.Card}>
                                            <Text style={styles.CardText}>卡号：</Text>
                                        </View>
                                        <View style={styles.CardNumber}>
                                            <TextInput
                                                returnKeyType='search'
                                                keyboardType="numeric"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.CardTextInput}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        CardFaceNo: value
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.MemberView}>
                                        <View style={styles.Card}>
                                            <Text style={styles.CardText}>密码：</Text>
                                        </View>
                                        <View style={styles.CardNumber}>
                                            <TextInput
                                                returnKeyType='search'
                                                keyboardType="numeric"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.CardTextInput}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        CardPwd: value
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.MemberButton}>
                                        <TouchableOpacity onPress={this.CloseButton.bind(this)}
                                                          style={[styles.MemberClose, {marginRight: 15,}]}>
                                            <Text style={styles.TitleText}>取消</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.Button.bind(this)} style={styles.MemberClose}>
                                            <Text style={styles.TitleText}>确定</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        transparent={true}
                        visible={this.state.NewAllPrice}
                        onShow={() => {
                        }}
                        onRequestClose={() => {
                        }}>
                        <View style={styles.MemberBounces}>
                            <View style={styles.Cont}>
                                <View style={styles.BouncesTitle}>
                                    <Text style={[styles.TitleText, {fontSize: 18}]}>整单优惠</Text>
                                </View>
                                <View style={styles.NewPriceList}>
                                    <TouchableOpacity onPress={this.NewPriceLeft.bind(this)} style={styles.NewPriceleft}>
                                        <View style={styles.Priceleft}>
                                            <Image source = {this.state.pressStatus =='pressin' ? require("../images/1_431.png") : require("../images/1_43.png")} />
                                        </View>
                                        <View style={styles.Priceright}>
                                            <Text style={styles.PricerightText}>优惠价</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.NewPriceRight.bind(this)} style={styles.NewPriceright}>
                                        <View style={styles.Priceleft}>
                                            <Image source = {this.state.PressStatus =='Pressin' ? require("../images/1_431.png") : require("../images/1_43.png")}  />
                                        </View>
                                        <View style={styles.Priceright}>
                                            <Text style={styles.PricerightText}>折扣价</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.MemberCont,{height:150}]}>
                                    <View style={[styles.MemberView,{marginTop:0}]}>
                                        <View style={styles.Card}>
                                            <Text style={styles.CardText}>金额(折扣率)：</Text>
                                        </View>
                                        <View style={styles.CardNumber}>
                                            <TextInput
                                                returnKeyType='search'
                                                keyboardType="numeric"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.CardTextInput}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        NewPrice: value
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.MemberButton}>
                                        <TouchableOpacity onPress={this.PriceClose.bind(this)}
                                                          style={[styles.MemberClose, {marginRight: 15,}]}>
                                            <Text style={styles.TitleText}>取消</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.PriceButton.bind(this)} style={styles.MemberClose}>
                                            <Text style={styles.TitleText}>确定</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        transparent={true}
                        visible={this.state.RefundTotal}
                        onShow={() => {
                        }}
                        onRequestClose={() => {
                        }}>
                        <View style={styles.MemberBounces}>
                            <View style={styles.Cont}>
                                <View style={styles.BouncesTitle}>
                                    <Text style={[styles.TitleText, {fontSize: 18}]}>储值卡</Text>
                                </View>
                                <View style={styles.MemberCont1}>
                                    <View style={styles.MemberView}>
                                        <View style={styles.Card}>
                                            <Text style={styles.CardText}>卡号：</Text>
                                        </View>
                                        <View style={styles.CardNumber}>
                                            <TextInput
                                                returnKeyType='search'
                                                keyboardType="numeric"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.CardTextInput}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        CardFaceNo: value
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.MemberView}>
                                        <View style={styles.Card}>
                                            <Text style={styles.CardText}>密码：</Text>
                                        </View>
                                        <View style={styles.CardNumber}>
                                            <TextInput
                                                returnKeyType='search'
                                                keyboardType="numeric"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.CardTextInput}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        CardPwd: value
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.MemberView}>
                                        <View style={styles.Card}>
                                            <Text style={styles.CardText}>时间：</Text>
                                        </View>
                                        <View style={styles.CardNumber}>
                                            <TextInput
                                                returnKeyType='search'
                                                keyboardType="numeric"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.CardTextInput}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        DataTime: value
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.MemberView}>
                                        <View style={styles.Card}>
                                            <Text style={styles.CardText}>退货凭证：</Text>
                                        </View>
                                        <View style={styles.CardNumber}>
                                            <TextInput
                                                returnKeyType='search'
                                                keyboardType="numeric"
                                                textalign="center"
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor="#bcbdc1"
                                                style={styles.CardTextInput}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        RetSerinalNo: value
                                                    })
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.MemberButton}>
                                        <TouchableOpacity onPress={this.CloseRetButton.bind(this)}
                                                          style={[styles.MemberClose, {marginRight: 15,}]}>
                                            <Text style={styles.TitleText}>取消</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={this.RetButton.bind(this)}
                                                          style={styles.MemberClose}>
                                            <Text style={styles.TitleText}>确定</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        transparent={true}
                        visible={this.state.LayerShow}
                        onShow={() => {
                        }}
                        onRequestClose={() => {
                        }}>
                        <Image source={require("../images/background.png")} style={styles.ModalStyle}>
                            <View style={styles.ModalStyleCont}>
                                <View style={styles.ModalStyleTitle}>
                                    <Text style={styles.ModalTitleText}>
                                        请输入付款额
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={this.ModeButton.bind(this)} style={styles.Button}>
                                    <Text style={styles.ModalTitleText}>
                                        好的
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Image>
                    </Modal>
                    <Modal
                        transparent={true}
                        visible={this.state.ModalShow}
                        onShow={() => {
                        }}
                        onRequestClose={() => {
                        }}>
                        <Image source={require("../images/background.png")} style={styles.ModalStyle}>
                            <View style={styles.ModalStyleCont}>
                                <View style={styles.ModalStyleTitle}>
                                    <Text style={styles.ModalTitleText}>
                                        付款额不能大于剩余金额
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={this.ModalButton.bind(this)} style={styles.Button}>
                                    <Text style={styles.ModalTitleText}>
                                        好的
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Image>
                    </Modal>
                    <Modal
                        transparent={true}
                        visible={this.state.MZPrice}
                        onShow={() => {
                        }}
                        onRequestClose={() => {
                        }}>
                        <View style={styles.MemberBounces}>
                            <View style={styles.Cont}>
                                <View style={styles.BouncesTitle}>
                                    <Text style={[styles.TitleText, {fontSize: 18}]}>添加{this.state.ShopPrice}元 赠送以下商品</Text>
                                </View>
                                <View style={styles.ShopAmount}>
                                    <View style={styles.ShopName}>
                                        <Text style={styles.ShopText}>商品名</Text>
                                    </View>
                                    <View style={styles.ShopName}>
                                        <Text style={styles.ShopText}>数量</Text>
                                    </View>
                                    <View style={styles.ShopName}>
                                        <Text style={styles.ShopText}>组号</Text>
                                    </View>
                                </View>
                                <ListView
                                    style={styles.ShopData}
                                    dataSource={this.state.DataSource}
                                    showsVerticalScrollIndicator={true}
                                    renderRow={this.ShopPrice.bind(this)}
                                />
                                <TouchableOpacity style={styles.ShopDataClose} onPress={this.ShopClose.bind(this)}>
                                    <Text style={styles.PageRowText}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ShopDataClose:{
        marginLeft:30,
        marginRight:30,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor: "#ff4e4e",
        borderRadius: 5,
    },
    ShopAmount:{
        paddingTop:10,
        paddingBottom:10,
        flexDirection:"row",
    },
    ShopName:{
        flex:1
    },
    ShopText:{
        color: "#666666",
        fontSize: 16,
        textAlign: "center"
    },
    ShopPRice: {
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        flexDirection: "row",
    },
    ShopData:{
        height:180,
    },
    NewPriceList:{
        flexDirection:"row",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:15,
    },
    NewPriceleft:{
      flex:1,
        flexDirection:"row",
    },
    NewPriceright:{
        flex:1,
        flexDirection:"row",
    },
    Priceleft:{
        width:26,
    },
    Priceright:{
        marginLeft:7,
        flex:1,
    },
    PricerightText:{
      fontSize:16,
      color:"#333333"
    },

    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingBottom: 10,
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
    HeaderList: {
        flex: 6,
        textAlign: "center",
        paddingRight: 56,
        color: "#ffffff",
        fontSize: 22,
        marginTop: 3,
    },
    TitleCont: {
        height: 74,
        backgroundColor: "#ff4e4e",
        paddingLeft: 10,
        paddingRight: 10,
    },
    FristList: {
        height: 30,
        paddingTop: 5,
        flexDirection: "row",
    },
    List: {
        flex: 1,
        flexDirection: "row",
    },
    ListView: {
        flex: 1,
        height: 20,
        overflow: "hidden",
        backgroundColor: "#ff4e4e"
    },
    ListView1: {
        flex: 1
    },
    ListText: {
        color: "#ffffff",
        fontSize: 16,
    },
    ShopCont: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    ShopList: {
        height: 180,
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    ListTitle: {
        height: 54,
        paddingTop: 16,
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    ListClass: {
        flex: 1
    },
    ListClassText: {
        color: "#666666",
        fontSize: 16,
        textAlign: "center"
    },
    Prece: {
        height: 54,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: "row"
    },
    InputingLeft: {
        width: 80,
        marginTop: 15
    },
    InpuTingText: {
        color: "#333333",
        fontSize: 16,
    },
    InputingRight: {
        flex: 1,
        height: 54,
        paddingTop: 6,
        backgroundColor: "#ffffff",
        borderRadius: 5,
    },
    Inputing: {
        flex: 2,
        flexDirection: "row"
    },
    Inputing1: {
        flex: 3,
        flexDirection: "row"
    },
    Inputingleft: {
        width: 65,
        height: 20,
    },
    Inputingright: {
        flex: 1,
        height: 20,
        overflow: "hidden",
    },
    InputingText: {
        fontSize: 18,
        color: "#333333",
    },
    Inputing1Left: {
        flexDirection: "row"
    },
    horizontal: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 20,
        paddingBottom: 15,
    },
    PageRowButton: {
        backgroundColor: "#ff4e4e",
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        height: 46,
    },
    PageRowText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center"
    },
    MemberMent: {
        height: 35,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: "row"
    },
    MemberText: {
        color: "#333333",
        fontSize: 16,
    },
    Member: {
        flex: 1,
        flexDirection: "row",
    },
    MemberLeft: {
        width: 50,
    },
    MemberRight: {
        flex: 1
    },
    PayMent: {
        height: 45,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: "row"
    },
    FirstMent: {
        flex: 1,
        flexDirection: "row"
    },
    FirstMent1: {
        width: 70,
        marginLeft: 3,
        marginRight: 3,
        backgroundColor: "#ff4e4e",
        borderRadius: 5,
        paddingTop: 6,
        height: 35
    },
    FirstMentText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center",
    },
    paymentleft: {
        width: 65,
        paddingTop: 7,
    },
    paymentright: {
        flex: 1,
        height: 35,
        backgroundColor: "#ffffff",
        borderRadius: 5,
    },
    paymentinput: {
        flex: 1,
    },
    ShopList1: {
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        flexDirection: "row",
    },
    Row: {
        flex: 1,
    },
    Name: {
        fontSize: 16,
        color: "#333333",
        overflow: "hidden",
        textAlign: "center"
    },
    MemberBounces: {
        backgroundColor: "#3e3d3d",
        opacity: 0.9,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Cont: {
        width: 280,
        borderRadius: 5,
        paddingBottom: 20,
        backgroundColor: "#f2f2f2",
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
    MemberCont: {
        height: 200,
        paddingLeft: 15,
        paddingRight: 15,
    },
    MemberCont1: {
        height: 350,
        paddingLeft: 15,
        paddingRight: 15,
    },
    MemberView: {
        flexDirection: "row",
        marginTop: 20,
    },
    Card: {
        width: 50,
        marginTop: 11,
    },
    CardText: {
        fontSize: 14,
        color: "#333333",
    },
    CardNumber: {
        flex: 1,
    },
    CardTextInput: {
        borderRadius: 5,
        backgroundColor: "#ffffff",
        color: "#333333",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        fontSize: 16,
    },
    MemberButton: {
        marginTop: 20,
        flexDirection: "row"
    },
    MemberClose: {
        flex: 1,
        backgroundColor: "#ff4e4e",
        height: 34,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 5,
    },
    ModalStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    ModalStyleCont: {
        height: 130,
        paddingTop: 30,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        backgroundColor: "#ffffff",
    },
    ModalStyleTitle: {
        height: 40,
        paddingLeft: 50,
        paddingRight: 50,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
    },
    ModalTitleText: {
        fontSize: 16,
        color: "#333333",
        textAlign: "center",
    },
    Button: {
        paddingTop: 20,
    },
});