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
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import Index from "../app/Index";
import Storage from '../utils/Storage';
import FetchUtil from "../utils/FetchUtils";

export default class Shopsearch extends Component {
    constructor(props){
        super(props);
        this.state = {
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
            ProdCode:this.props.ProdCode ? this.props.ProdCode : "",
            DepCode:this.props.DepCode ? this.props.DepCode : "",
        }
    }

    componentDidMount(){
        Storage.get('code').then((ShopCode) => {
            Storage.get('Usercode').then((Usercode) => {
                Storage.get('LinkUrl').then((linkurl) => {
                    let params = {
                        TblName: "BasicInfoProd",
                        reqCode: "product",
                        ShopCode: ShopCode,
                        Code: this.state.ProdCode,
                        UserCode: Usercode,
                    };
                    // console.log(JSON.stringify(params))
                    FetchUtil.post(linkurl, JSON.stringify(params)).then((data) => {
                        // console.log(JSON.stringify(data))
                        if(data.retcode == 1){
                            var TblRow = data.TblRow;
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
                            })

                        }else{}
                    }),(err)=>{
                        alert("网络请求失败");
                    }
                })
            })
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

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.return.bind(this)} style={styles.return}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderText}>{this.state.ProdCode}</Text>
                    </View>
                </View>
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header:{
        backgroundColor:"#ff4e4e",
        paddingTop:10,
        paddingBottom:10,
    },
    cont:{
        flexDirection:"row",
        paddingLeft:16,
        paddingRight:16,
    },
    return:{
        width:80,
    },
    HeaderImage:{
        marginRight:25,
    },
    HeaderText:{
        flex:6,
        textAlign:"center",
        paddingRight:56,
        color:"#ffffff",
        fontSize:22,
        marginTop:5,
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
});
