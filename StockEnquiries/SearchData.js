/**
 * 商品查询（搜索）StockEnquiries文件夹下
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    ListView,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager,
} from 'react-native';

import Index from "../app/Index";
import Storage from '../utils/Storage';
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";
let dbAdapter = new DBAdapter();
var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let decodepreprint = new DeCodePrePrint18();
export default class SearchData extends Component {
    constructor(props){
        super(props);
        this.state = {
            Show: false,
            ProdCode:"",
            BarCode:"",
            ProdName:"",
            ShortName:"",
            Kccount:"",
            Oprice:"",
            Cost:"",
            OutOprice:"",
            OutCost:"",
            Price:"",
            Total:"",
            SuppCode:"",
            SuppName:"",
            DepCode:"",
            DepName:"",
            BrandCode:"",
            BrandName:"",
            Coprice:"",
            AidCode:"",
            OtherCode:"",
            Spec:"",
            ProdAdr:"",
            Unit:"",
            PUnit:"",
            PUnitAmt:"",
            VipPrice1:"",
            VipPrice2:"",
            VipPrice3:"",
            PsPrice:"",
            WPrice:"",
            FNoCG:"",
            FNoSale:"",
            FNoYH:"",
            FNoPromotion:"",
            FNoTH:"",
            FNoCD:"",
            FUseSalePrice:"",
            PriceFlag:"",
            dataRows:"",
            Search:"",
            ProdCode:this.props.ProdCode ? this.props.ProdCode : "",
            DepCode:this.props.DepCode ? this.props.DepCode : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        }
        this.dataRows = [];
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.Device();
        });
    }

    Device() {
        DeviceEventEmitter.addListener("code", (reminder) => {
            decodepreprint.init(reminder, dbAdapter);
            if (reminder.length == 18 && decodepreprint.deCodePreFlag()) {
                decodepreprint.deCodeProdCode().then((datas) => {
                    dbAdapter.selectProdCode(datas, 1).then((rows) => {
                        this.ClickButton()
                    })
                });
            } else {
                dbAdapter.selectAidCode(reminder, 1).then((rows) => {
                    if (rows.length == 0) {
                        alert("该商品不存在")
                    } else {
                        Storage.get('code').then((ShopCode) => {
                            Storage.get('Usercode').then((Usercode) => {
                                Storage.get('LinkUrl').then((linkurl) => {
                                    let params = {
                                        TblName: "BasicInfoProd",
                                        reqCode: "product",
                                        ShopCode: ShopCode,
                                        Code: rows.item(0).ProdCode,
                                        UserCode: Usercode,
                                    };
                                    // alert(JSON.stringify(params))
                                    FetchUtil.post(linkurl, JSON.stringify(params)).then((data) => {
                                        // console.log(JSON.stringify(data))
                                        if(data.retcode == 1){
                                            var TblRow = data.TblRow;
                                            // alert(JSON.stringify(TblRow))
                                            var ProdCode;
                                            var BarCode;
                                            var ProdName;
                                            var ShortName;
                                            var Kccount;
                                            var Oprice;
                                            var Cost;
                                            var OutOprice;
                                            var OutCost;
                                            var Price;
                                            var Total;
                                            var SuppCode;
                                            var SuppName;
                                            var DepCode;
                                            var DepName;
                                            var BrandCode;
                                            var BrandName;
                                            var Coprice;
                                            var AidCode;
                                            var OtherCode;
                                            var Spec;
                                            var ProdAdr;
                                            var Unit;
                                            var PUnit;
                                            var PUnitAmt;
                                            var VipPrice1;
                                            var VipPrice2;
                                            var VipPrice3;
                                            var PsPrice;
                                            var WPrice;
                                            var FNoCG;
                                            var FNoSale;
                                            var FNoYH;
                                            var FNoPromotion;
                                            var FNoTH;
                                            var FNoCD;
                                            var FUseSalePrice;
                                            var PriceFlag;
                                            for (let i = 0; i < TblRow.length; i++) {
                                                var row = TblRow[i];
                                                // console.log('TblRow=',row.ProdName)
                                                ProdCode =  row.ProdCode;
                                                BarCode =  row.BarCode;
                                                ProdName =  row.ProdName;
                                                ShortName =  row.ShortName;
                                                Kccount =  row.KCcount;
                                                Oprice =  row.Oprice;
                                                Cost =  row.Cost;
                                                OutOprice =  row.OutOprice;
                                                OutCost =  row.OutCost;
                                                Price =  row.Price;
                                                Total =  row.Total;
                                                SuppCode =  row.SuppCode;
                                                SuppName =  row.SuppName;
                                                DepCode =  row.DepCode;
                                                DepName =  row.DepName;
                                                BrandCode =  row.BrandCode;
                                                BrandName =  row.BrandName;
                                                Coprice =  row.Coprice;
                                                AidCode =  row.AidCode;
                                                OtherCode =  row.OtherCode;
                                                Spec =  row.Spec;
                                                ProdAdr =  row.ProdAdr;
                                                Unit =  row.Unit;
                                                PUnit =  row.PUnit;
                                                PUnitAmt =  row.PUnitAmt;
                                                VipPrice1 =  row.VipPrice1;
                                                VipPrice2 =  row.VipPrice2;
                                                VipPrice3 =  row.VipPrice3;
                                                PsPrice =  row.PsPrice;
                                                WPrice =  row.WPrice;
                                                FNoCG =  row.FNoCG;
                                                FNoSale =  row.FNoSale;
                                                FNoYH =  row.FNoYH;
                                                FNoPromotion =  row.FNoPromotion;
                                                FNoTH =  row.FNoTH;
                                                FNoCD =  row.FNoCD;
                                                FUseSalePrice =  row.FUseSalePrice;
                                                PriceFlag =  row.PriceFlag;
                                            };
                                            if(FNoCG==1||FNoSale==1||FNoYH==1||FNoPromotion==1||FNoTH==1||FNoCD==1){
                                                this.setState({
                                                    FNoCG:"是",
                                                    FNoSale:"是",
                                                    FNoYH:"是",
                                                    FNoPromotion:"是",
                                                    FNoTH:"是",
                                                    FNoCD:"是",
                                                })
                                            }else{
                                                this.setState({
                                                    FNoCG:"否",
                                                    FNoSale:"否",
                                                    FNoYH:"否",
                                                    FNoPromotion:"否",
                                                    FNoTH:"否",
                                                    FNoCD:"否",
                                                })
                                            }
                                            this.setState({
                                                ProdCode:ProdCode,
                                                BarCode:BarCode,
                                                ProdName:ProdName,
                                                ShortName:ShortName,
                                                Kccount:Kccount,
                                                Oprice:Oprice,
                                                Cost:Cost,
                                                OutOprice:OutOprice,
                                                OutCost:OutCost,
                                                Price:Price,
                                                Total:Total,
                                                SuppCode:SuppCode,
                                                SuppName:SuppName,
                                                DepCode:DepCode,
                                                DepName:DepName,
                                                BrandCode:BrandCode,
                                                BrandName:BrandName,
                                                Coprice:Coprice,
                                                AidCode:AidCode,
                                                OtherCode:OtherCode,
                                                Spec:Spec,
                                                ProdAdr:ProdAdr,
                                                Unit:Unit,
                                                PUnit:PUnit,
                                                PUnitAmt:PUnitAmt,
                                                VipPrice1:VipPrice1,
                                                VipPrice2:VipPrice2,
                                                VipPrice3:VipPrice3,
                                                PsPrice:PsPrice,
                                                WPrice:WPrice,
                                                FUseSalePrice:FUseSalePrice,
                                                PriceFlag:PriceFlag,
                                                Search:""
                                            })
                                        }else{}
                                    },(err)=>{
                                        alert("网络请求失败");
                                    })
                                })
                            })
                        })
                    }
                })
            }
        })
    }

    return(){
        var nextRoute={
            name:"主页",
            component:Index,
            params:{
                DepCode:this.state.DepCode,
            }
        };
        this.props.navigator.push(nextRoute);
        DeviceEventEmitter.removeAllListeners();
    }

    inputOnBlur(value) {
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
            <TouchableOpacity onPress={() => this.ClickButton(rowData)} underlayColor={'red'} style={styles.Block}>
                <Text style={styles.BlockText}>{rowData.ProdName}</Text>
            </TouchableOpacity>
        );
    }

    ClickButton(rowData){
        Storage.get('code').then((ShopCode) => {
            Storage.get('Usercode').then((Usercode) => {
                Storage.get('LinkUrl').then((linkurl) => {
                    let params = {
                        TblName: "BasicInfoProd",
                        reqCode: "product",
                        ShopCode: ShopCode,
                        Code: rowData.ProdCode,
                        UserCode: Usercode,
                    };
                   // alert(JSON.stringify(params))
                    FetchUtil.post(linkurl, JSON.stringify(params)).then((data) => {
                        // console.log(JSON.stringify(data))
                        if(data.retcode == 1){
                            var TblRow = data.TblRow;
                            // alert(JSON.stringify(TblRow))
                            var ProdCode;
                            var BarCode;
                            var ProdName;
                            var ShortName;
                            var Kccount;
                            var Oprice;
                            var Cost;
                            var OutOprice;
                            var OutCost;
                            var Price;
                            var Total;
                            var SuppCode;
                            var SuppName;
                            var DepCode;
                            var DepName;
                            var BrandCode;
                            var BrandName;
                            var Coprice;
                            var AidCode;
                            var OtherCode;
                            var Spec;
                            var ProdAdr;
                            var Unit;
                            var PUnit;
                            var PUnitAmt;
                            var VipPrice1;
                            var VipPrice2;
                            var VipPrice3;
                            var PsPrice;
                            var WPrice;
                            var FNoCG;
                            var FNoSale;
                            var FNoYH;
                            var FNoPromotion;
                            var FNoTH;
                            var FNoCD;
                            var FUseSalePrice;
                            var PriceFlag;
                            for (let i = 0; i < TblRow.length; i++) {
                                var row = TblRow[i];
                                // console.log('TblRow=',row.ProdName)
                                ProdCode =  row.ProdCode;
                                BarCode =  row.BarCode;
                                ProdName =  row.ProdName;
                                ShortName =  row.ShortName;
                                Kccount =  row.KCcount;
                                Oprice =  row.Oprice;
                                Cost =  row.Cost;
                                OutOprice =  row.OutOprice;
                                OutCost =  row.OutCost;
                                Price =  row.Price;
                                Total =  row.Total;
                                SuppCode =  row.SuppCode;
                                SuppName =  row.SuppName;
                                DepCode =  row.DepCode;
                                DepName =  row.DepName;
                                BrandCode =  row.BrandCode;
                                BrandName =  row.BrandName;
                                Coprice =  row.Coprice;
                                AidCode =  row.AidCode;
                                OtherCode =  row.OtherCode;
                                Spec =  row.Spec;
                                ProdAdr =  row.ProdAdr;
                                Unit =  row.Unit;
                                PUnit =  row.PUnit;
                                PUnitAmt =  row.PUnitAmt;
                                VipPrice1 =  row.VipPrice1;
                                VipPrice2 =  row.VipPrice2;
                                VipPrice3 =  row.VipPrice3;
                                PsPrice =  row.PsPrice;
                                WPrice =  row.WPrice;
                                FNoCG =  row.FNoCG;
                                FNoSale =  row.FNoSale;
                                FNoYH =  row.FNoYH;
                                FNoPromotion =  row.FNoPromotion;
                                FNoTH =  row.FNoTH;
                                FNoCD =  row.FNoCD;
                                FUseSalePrice =  row.FUseSalePrice;
                                PriceFlag =  row.PriceFlag;
                            };
                            if(FNoCG==1||FNoSale==1||FNoYH==1||FNoPromotion==1||FNoTH==1||FNoCD==1){
                                this.setState({
                                    FNoCG:"是",
                                    FNoSale:"是",
                                    FNoYH:"是",
                                    FNoPromotion:"是",
                                    FNoTH:"是",
                                    FNoCD:"是",
                                })
                            }else{
                                this.setState({
                                    FNoCG:"否",
                                    FNoSale:"否",
                                    FNoYH:"否",
                                    FNoPromotion:"否",
                                    FNoTH:"否",
                                    FNoCD:"否",
                                })
                            }
                            this.setState({
                                ProdCode:ProdCode,
                                BarCode:BarCode,
                                ProdName:ProdName,
                                ShortName:ShortName,
                                Kccount:Kccount,
                                Oprice:Oprice,
                                Cost:Cost,
                                OutOprice:OutOprice,
                                OutCost:OutCost,
                                Price:Price,
                                Total:Total,
                                SuppCode:SuppCode,
                                SuppName:SuppName,
                                DepCode:DepCode,
                                DepName:DepName,
                                BrandCode:BrandCode,
                                BrandName:BrandName,
                                Coprice:Coprice,
                                AidCode:AidCode,
                                OtherCode:OtherCode,
                                Spec:Spec,
                                ProdAdr:ProdAdr,
                                Unit:Unit,
                                PUnit:PUnit,
                                PUnitAmt:PUnitAmt,
                                VipPrice1:VipPrice1,
                                VipPrice2:VipPrice2,
                                VipPrice3:VipPrice3,
                                PsPrice:PsPrice,
                                WPrice:WPrice,
                                FUseSalePrice:FUseSalePrice,
                                PriceFlag:PriceFlag,
                                Search:""
                            })
                        }else{}
                    },(err)=>{
                        alert("网络请求失败");
                    })
                })
            })
        })
    }

    PressPop(){
        var nextRoute={
            name:"主页",
            component:Index,
            params:{
                DepCode:this.state.DepCode,
            }
        };
        this.props.navigator.push(nextRoute);
    }

    Close() {
        DeviceEventEmitter.removeAllListeners();
        var nextRoute = {
            name: "主页",
            component: Index,
        };
        this.props.navigator.push(nextRoute);

    }

    Modal() {
        let isShow = this.state.Show;
        this.setState({
            Show: !isShow,
        });
    }

    onSubmitEditing(){
        dbAdapter.selectAidCode(this.state.Search, 1).then((rows) => {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
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
                        onSubmitEditing={this.onSubmitEditing.bind(this)}
                    />
                    <Image source={require("../images/2.png")} style={styles.SearchImage}></Image>
                    <TouchableOpacity onPress={this.Close.bind(this)} style={styles.Right1}>
                        <View style={styles.Text1}><Text style={styles.Text}>取消</Text></View>
                    </TouchableOpacity>
                </View>
                {
                    (this.state.Search == "") ?
                        <ScrollView style={styles.container}>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>商品编码：</Text>
                                    <Text style={styles.right}>{this.state.ProdCode}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>商品条码：</Text>
                                    <Text style={styles.right}>{this.state.BarCode}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>商品名称：</Text>
                                    <Text style={styles.right}>{this.state.ProdName}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>商品简称：</Text>
                                    <Text style={styles.right}>{this.state.ShortName}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>库存数量：</Text>
                                    <Text style={styles.right}>{this.state.Kccount}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>进价：</Text>
                                    <Text style={styles.right}>{this.state.Oprice}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>含税成本：</Text>
                                    <Text style={styles.right}>{this.state.Cost}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>去税进价：</Text>
                                    <Text style={styles.right}>{this.state.OutOprice}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>去税成本：</Text>
                                    <Text style={styles.right}>{this.state.OutCost}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>售价：</Text>
                                    <Text style={styles.right}>{this.state.Price}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>售价成本：</Text>
                                    <Text style={styles.right}>{this.state.Total}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>供应商编码：</Text>
                                    <Text style={styles.right}>{this.state.SuppCode}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>供应商名称：</Text>
                                    <Text style={styles.right}>{this.state.SuppName}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>品类编码：</Text>
                                    <Text style={styles.right}>{this.state.DepCode}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>品类名称：</Text>
                                    <Text style={styles.right}>{this.state.DepName}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>品牌编码：</Text>
                                    <Text style={styles.right}>{this.state.BrandCode}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>品牌名称：</Text>
                                    <Text style={styles.right}>{this.state.BrandName}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>最近进价：</Text>
                                    <Text style={styles.right}>{this.state.Coprice}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>助记码：</Text>
                                    <Text style={styles.right}>{this.state.AidCode}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>其他编码：</Text>
                                    <Text style={styles.right}>{this.state.OtherCode}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>规格：</Text>
                                    <Text style={styles.right}>{this.state.Spec}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>产地：</Text>
                                    <Text style={styles.right}>{this.state.ProdAdr}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>计量单位：</Text>
                                    <Text style={styles.right}>{this.state.Unit}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>包装单位：</Text>
                                    <Text style={styles.right}>{this.state.PUnit}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>包装系数：</Text>
                                    <Text style={styles.right}>{this.state.PUnitAmt}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>会员价1：</Text>
                                    <Text style={styles.right}>{this.state.VipPrice1}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>会员价2：</Text>
                                    <Text style={styles.right}>{this.state.VipPrice2}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>会员价3：</Text>
                                    <Text style={styles.right}>{this.state.VipPrice3}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>配送价：</Text>
                                    <Text style={styles.right}>{this.state.PsPrice}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>批发价：</Text>
                                    <Text style={styles.right}>{this.state.WPrice}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>禁止采购：</Text>
                                    <Text style={styles.right}>{this.state.FNoCG}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>禁止销售：</Text>
                                    <Text style={styles.right}>{this.state.FNoSale}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>禁止要货：</Text>
                                    <Text style={styles.right}>{this.state.FNoYH}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>禁止促销：</Text>
                                    <Text style={styles.right}>{this.state.FNoPromotion}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>禁止退货：</Text>
                                    <Text style={styles.right}>{this.state.FNoTH}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>禁止厨打：</Text>
                                    <Text style={styles.right}>{this.state.FNoCD}</Text>
                                </View>
                            </View>
                            <View style={styles.RowList}>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>按金额销售：</Text>
                                    <Text style={styles.right}>{this.state.FUseSalePrice}</Text>
                                </View>
                                <View style={styles.LeftList}>
                                    <Text style={styles.name}>可变价格：</Text>
                                    <Text style={styles.right}>{this.state.PriceFlag}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.button} onPress={this.PressPop.bind(this)}>
                                <Text style={styles.ButtonText}>确定</Text>
                            </TouchableOpacity>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header:{
        flexDirection:"row",
        backgroundColor:"#ff4e4e",
        paddingTop:10,
        paddingBottom:10,
    },
    Search: {
        borderRadius: 30,
        backgroundColor: "#ffffff",
        color: "#333333",
        paddingLeft: 46,
        paddingBottom: 6,
        paddingTop: 6,
        fontSize: 14,
        flex: 1,
    },
    SearchImage: {
        position: "absolute",
        top: 15,
        left: 12,
    },
    Right1: {
        width: 60,
        flexDirection: "row",
        paddingTop: 6,
        paddingLeft: 6
    },
    Text1: {
        flex: 1,
    },
    Text: {
        color:"#ffffff",
        fontSize:16,
    },
    RowList:{
        flexDirection:"row",
        paddingLeft:16,
        paddingRight:16,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2"
    },
    LeftList:{
        flex:1,
        flexDirection:"row",
    },
    name:{
        width:100,
        fontSize:16,
        color:"#666666",
        textAlign:"right",
        marginRight:5,
    },
    right:{
        flex:1,
        color:"#333333",
        fontSize:16,
    },
    button:{
        marginTop:30,
        marginBottom:30,
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
    BlockList: {
        flex:1,
        flexDirection: "column",
        backgroundColor: "#ffffff"
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
});
