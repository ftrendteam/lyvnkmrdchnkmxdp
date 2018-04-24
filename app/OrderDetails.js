/**
 * 商品详情选择商品数量
 */

import React, {Component} from 'react';
import {Image, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View,} from 'react-native';
import Index from "./Index";
import ShoppingCart from "./ShoppingCart";
import Search from "./Search";
import Sell from "../Sell/Sell";
import NumberUtils from "../utils/NumberUtils";
import Storage from "../utils/Storage";
import BigDecimalUtils from "../utils/BigDecimalUtils";
import DBAdapter from "../adapter/DBAdapter";

let dbAdapter = new DBAdapter();

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;

export default class GoodsDetails extends Component {
    constructor(props){
        super(props);
        this.state = {
            ProdCode:this.props.ProdCode ? this.props.ProdCode : "",//接受传入的值
            ProdName:this.props.ProdName ? this.props.ProdName : "",
            Pid:this.props.Pid ? this.props.Pid : "",
            ShopPrice:this.props.ShopPrice ? this.props.ShopPrice : "",
            Remark:this.props.Remark ? this.props.Remark : "",
            Number:this.props.countm ? this.props.countm : "",
            DepCode:this.props.DepCode ? this.props.DepCode : "",
            ydcountm:this.props.ydcountm ? this.props.ydcountm : "",
            SuppCode:this.props.SuppCode ? this.props.SuppCode : "",
            BarCode:this.props.BarCode ? this.props.BarCode : "",
            ShoppData:this.props.ShoppData ? this.props.ShoppData : "",
            Price:"",
            totalPrice:"",
            name:"",
            YdCountm:"",
            shuliang:"",
            numberFormat2:"",
            Modify:"",
            OnPrice:"",
            Total:"",
            Price:"",
            DataName:"",
            OrderDetails:1,
            BQNumber:this.props.countm ? this.props.countm : 1,
        }
    }

    componentDidMount(){
        this.setState({
            focus:true
        })
      dbAdapter.selectShopInfoData(this.state.Pid).then((data)=>{
            if(data.length>=0){
                this.setState({
                    Number:data.item(0).countm
                });
            }
      });
        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
            });
        });

        Storage.get('DataName').then((tags) => {
            this.setState({
                DataName: tags
            });
        });

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

        Storage.get('YuanDan').then((tags)=>{
            if(tags==1){
                if(this.state.ydcountm>0){
                    this.setState({
                        Number:this.state.ydcountm
                    })
                }
            }
            let numberFormat1 = NumberUtils.numberFormat2(this.state.ShopPrice);
            let numberFormat2 = NumberUtils.numberFormat2((this.state.Number)*(this.state.ShopPrice));
            this.setState({
                ShopPrice:numberFormat1,
                numberFormat2:numberFormat2,
            })
        })

    }

    GoodsDetails(){
        if(this.state.name=="移动销售"){
            var nextRoute={
                name:"移动销售",
                component:Sell,
            };
            this.props.navigator.push(nextRoute);
        }else if(this.state.ShoppData=="0"){
            var nextRoute={
                name:"清单",
                component:ShoppingCart,
                params:{
                    DepCode:this.state.DepCode,
                }
            };
            this.props.navigator.push(nextRoute);
        }else{
            var nextRoute={
                name:"主页",
                component:Index,
                params:{
                    DepCode:this.state.DepCode,
                }
            };
            this.props.navigator.push(nextRoute);
        }
    }

    onSubmitEditing(){
        var ShopPrice = (this.state.Number * this.state.ShopPrice);
        this.setState({
            numberFormat2:NumberUtils.numberFormat2(ShopPrice)
        })
    }

    onNumber(){
        var ShopPrice = (this.state.Number * this.state.ShopPrice);
        this.setState({
            numberFormat2: NumberUtils.numberFormat2(ShopPrice),
        })
        if(this.state.name=="商品采购"||this.state.name=="协配采购"||this.state.name=="移动销售"||this.state.Modify==1){
            this.setState({
                OnPrice:1,
                PriceText:1
            });
        }else{
            var x = this.state.Number;//获取数量的数字
            var y = String(x).indexOf(".") + 1;//获取小数点的位置
            if(y > 0&&!this.state.DataName=="移动销售") {
                alert("数量不能含有小数");
            }else if(this.state.name=="商品配送"&&this.state.ydcountm==0){
                alert("库存为0，该商品不能进行配送")
            } else {
                if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                    var shopInfoData = [];
                    var shopInfo = {};
                    shopInfo.Pid = this.state.Pid;
                    shopInfo.ProdCode=this.state.ProdCode;
                    shopInfo.prodname = this.state.ProdName;
                    shopInfo.countm = this.state.Number;
                    shopInfo.ShopPrice = this.state.ShopPrice;
                    if(this.state.YdCountm == 5){
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
                    if(this.state.name=="移动销售"){
                        var nextRoute={
                            name:"移动销售",
                            component:Sell,
                        };
                        this.props.navigator.push(nextRoute);
                    }else if(this.state.ShoppData=="0"){
                        var nextRoute={
                            name:"清单",
                            component:ShoppingCart,
                            params:{
                                DepCode:this.state.DepCode,
                            }
                        };
                        this.props.navigator.push(nextRoute);
                    }else{
                        var nextRoute={
                            name:"主页",
                            component:Index,
                            params:{
                                DepCode:this.state.DepCode,
                            }
                        };
                        this.props.navigator.push(nextRoute);
                    }
                }else{
                    if(this.state.Number==0){
                        ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                    }else{
                        var shopInfoData = [];
                        var shopInfo = {};
                        shopInfo.Pid = this.state.Pid;
                        shopInfo.ProdCode=this.state.ProdCode;
                        shopInfo.prodname = this.state.ProdName;
                        shopInfo.countm = this.state.Number;
                        shopInfo.ShopPrice = this.state.ShopPrice;
                        if(this.state.YdCountm == 5){
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
                        if(this.state.name=="移动销售"){
                            var nextRoute={
                                name:"移动销售",
                                component:Sell,
                            };
                            this.props.navigator.push(nextRoute);
                        }else if(this.state.ShoppData=="0"){
                            var nextRoute={
                                name:"清单",
                                component:ShoppingCart,
                                params:{
                                    DepCode:this.state.DepCode,
                                }
                            };
                            this.props.navigator.push(nextRoute);
                        }else{
                            var nextRoute={
                                name:"主页",
                                component:Index,
                                params:{
                                    DepCode:this.state.DepCode,
                                }
                            };
                            this.props.navigator.push(nextRoute);
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
            Total:1
        });
    }

    add(){
        // var Number1=this.state.Number;
        if(this.state.Number==""&&this.state.name!=="标签采集"){
            this.setState({
                Number:1,
                numberFormat2:this.state.ShopPrice,
            });
        }
        else if(this.state.name=="标签采集"&&this.state.BQNumber==1){
            this.setState({
                BQNumber:parseInt(this.state.BQNumber)+1,
            });
        }else{
         
            //let numberFormat2 = NumberUtils.numberFormat2((parseInt(this.state.Number)+1)*(this.state.ShopPrice));
            let numberFormat2 = BigDecimalUtils.multiply(BigDecimalUtils.add(this.state.Number,1,2),this.state.ShopPrice,2);
            this.setState({
                Number:BigDecimalUtils.add(this.state.Number,1,2),
                BQNumber:BigDecimalUtils.add(this.state.BQNumber,1,2),
                numberFormat2:numberFormat2,
            });
        }
    }

    subtraction(){
            var Number1=this.state.Number;
            var BQNumber1=this.state.BQNumber;
            this.setState({
                Number:parseInt(Number1)-1,
                BQNumber:parseInt(BQNumber1)-1,
            });
            //let numberFormat2 = NumberUtils.numberFormat2((parseInt(Number1)-1)*(this.state.ShopPrice));
            let numberFormat2 = BigDecimalUtils.multiply(BigDecimalUtils.subtract(Number1,1,2),this.state.ShopPrice,2);
            this.setState({
                numberFormat2:numberFormat2,
            });
        if(this.state.Number == 1&&this.state.name!=="标签采集"){
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
            this.setState({
               Number:1,
               numberFormat2:this.state.ShopPrice,
            });
            return;
        }else if(this.state.BQNumber == 1&&this.state.name=="标签采集"){
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
            this.setState({
                BQNumber:1,
                numberFormat2:this.state.ShopPrice,
            });
        }
    }

    clear(){
        let numberFormat2 = NumberUtils.numberFormat2((0)*(this.state.ShopPrice));
        this.setState({
            Number:0,
            BQNumber:1,
            numberFormat2:numberFormat2,
        })
    }

    onEndEditing(){
        if(this.state.Number==""){
            this.setState({
                numberFormat2:"0.00",
            });
        }else{
            let numberFormat2 = NumberUtils.numberFormat2((parseInt(this.state.Number))*(this.state.ShopPrice));
            this.setState({
                numberFormat2:numberFormat2,
                Total:1,
                OnPrice:""
            });
        }
    }

    TotalButton(){
        if(this.state.Number==""){
            alert("请先添加商品数量");
            this.setState({
                numberFormat2:"0.00"
            })
        }else{
            var Modify=NumberUtils.numberFormat2(this.state.numberFormat2/this.state.Number);
            this.setState({
                ShopPrice:Modify,
            })
            if(this.state.OrderDetails==1){
                var x = this.state.Number;//获取数量的数字
                var y = String(x).indexOf(".") + 1;//获取小数点的位置
                if(y > 0&&!this.state.DataName=="移动销售") {
                    alert("数量不能含有小数");
                } else {
                    if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                        var shopInfoData = [];
                        var shopInfo = {};
                        shopInfo.Pid = this.state.Pid;
                        shopInfo.ProdCode=this.state.ProdCode;
                        shopInfo.prodname = this.state.ProdName;
                        shopInfo.countm = this.state.Number;
                        shopInfo.ShopPrice = Modify;
                        if(this.state.YdCountm == 5){
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
                        if(this.state.ShoppData=="0"){
                            var nextRoute={
                                name:"清单",
                                component:ShoppingCart,
                                params:{
                                    DepCode:this.state.DepCode,
                                }
                            };
                            this.props.navigator.push(nextRoute);
                        }else{

                            var nextRoute={
                                name:"主页",
                                component:Index,
                                params:{
                                    DepCode:this.state.DepCode,
                                }
                            };
                            this.props.navigator.push(nextRoute);
                        }
                    }else{
                        if(this.state.Number==0){
                            ToastAndroid.show('商品数量不能为空', ToastAndroid.SHORT);
                        }else{
                            var shopInfoData = [];
                            var shopInfo = {};
                            shopInfo.Pid = this.state.Pid;
                            shopInfo.ProdCode=this.state.ProdCode;
                            shopInfo.prodname = this.state.ProdName;
                            if(this.state.name=="标签采集"){
                                shopInfo.countm = this.state.BQNumber;
                            }else{
                                shopInfo.countm = this.state.Number;
                            }
                            shopInfo.ShopPrice = Modify;
                            if(this.state.YdCountm == 5){
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
                            if(this.state.DataName=="移动销售"){
                                var nextRoute={
                                    name:"移动销售",
                                    component:Sell,
                                };
                                this.props.navigator.push(nextRoute);
                            }else if(this.state.ShoppData=="0"){
                                var nextRoute={
                                    name:"清单",
                                    component:ShoppingCart,
                                    params:{
                                        DepCode:this.state.DepCode,
                                    }
                                };
                                this.props.navigator.push(nextRoute);
                            }else{
                                var nextRoute={
                                    name:"主页",
                                    component:Index,
                                    params:{
                                        DepCode:this.state.DepCode,
                                    }
                                };
                                this.props.navigator.push(nextRoute);
                            }
                        }
                    }
                }
            }
        }
    }

    numberFormat2(){
        if(this.state.Number==""){
            alert("请先添加商品数量");
            this.setState({
                numberFormat2:"0.00"
            })
        }else{
            var Modify=NumberUtils.numberFormat2(this.state.numberFormat2/this.state.Number);
            this.setState({
                ShopPrice:Modify,
            })
        }
    }

    pressPop(){
        var x = this.state.Number;//获取数量的数字
        var y = String(x).indexOf(".") + 1;//获取小数点的位置
        if(y > 0&&!this.state.DataName=="移动销售") {
            alert("数量不能含有小数");
        }else if(this.state.name=="商品配送"&&this.state.ydcountm==0){
            alert("库存为0，该商品不能进行配送")
        }else {
            if(this.state.name=="实时盘点"||this.state.name=="商品盘点"){
                var shopInfoData = [];
                var shopInfo = {};
                shopInfo.Pid = this.state.Pid;
                shopInfo.ProdCode=this.state.ProdCode;
                shopInfo.prodname = this.state.ProdName;
                shopInfo.countm = this.state.Number;
                shopInfo.ShopPrice = this.state.ShopPrice;
                if(this.state.YdCountm == 5){
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
                if(this.state.ShoppData=="0"){
                    var nextRoute={
                        name:"清单",
                        component:ShoppingCart,
                        params:{
                            DepCode:this.state.DepCode,
                        }
                    };
                    this.props.navigator.push(nextRoute);
                }else{
                    var nextRoute={
                        name:"主页",
                        component:Index,
                        params:{
                            DepCode:this.state.DepCode,
                        }
                    };
                    this.props.navigator.push(nextRoute);
                }
            }else{
                if(this.state.Number==0&&this.state.name!=="标签采集"){
                    ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                } else if(this.state.BQNumber==0&&this.state.name=="标签采集"){
                    ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
                }else{
                    var shopInfoData = [];
                    var shopInfo = {};
                    shopInfo.Pid = this.state.Pid;
                    shopInfo.ProdCode=this.state.ProdCode;
                    shopInfo.prodname = this.state.ProdName;
                    if(this.state.name=="标签采集"){
                        shopInfo.countm = this.state.BQNumber;
                    }else{
                        shopInfo.countm = this.state.Number;
                    }
                    shopInfo.ShopPrice = this.state.ShopPrice;
                    if(this.state.YdCountm == 5){
                        shopInfo.prototal = "0";
                    }else{
                        shopInfo.prototal = this.state.numberFormat2;
                    }
                    shopInfo.promemo = this.state.Remark;
                    shopInfo.DepCode = this.state.DepCode;
                    shopInfo.ydcountm = this.state.ydcountm;
                    shopInfo.SuppCode = this.state.SuppCode;
                    shopInfo.BarCode = this.state.BarCode;
                    console.log("a=",shopInfo.countm)
                    shopInfoData.push(shopInfo);
                    //调用插入表方法
                    dbAdapter.insertShopInfo(shopInfoData);
                    if(this.state.DataName=="移动销售"){
                        var nextRoute={
                            name:"移动销售",
                            component:Sell,
                        };
                        this.props.navigator.push(nextRoute);
                    }else if(this.state.ShoppData=="0"){
                        var nextRoute={
                            name:"清单",
                            component:ShoppingCart,
                            params:{
                                DepCode:this.state.DepCode,
                            }
                        };
                        this.props.navigator.push(nextRoute);
                    }else{
                        var nextRoute={
                            name:"主页",
                            component:Index,
                            params:{
                                DepCode:this.state.DepCode,
                            }
                        };
                        this.props.navigator.push(nextRoute);
                    }
                }
            }
        }
    }

  render() {
    return (
      <ScrollView style={styles.container}>
        <ScrollView style={styles.ScrollView} scrollEnabled={false}>
            <View style={styles.header}>
              <View style={styles.cont}>
                    <TouchableOpacity onPress={this.GoodsDetails.bind(this)}>
                          <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                    </TouchableOpacity>
                    <Text style={styles.HeaderList}>{this.state.name}</Text>
              </View>
            </View>
            <View style={styles.Cont}>
                <View style={styles.List}>
                    <Text style={styles.left}>名称</Text>
                    <Text style={styles.right}>{this.state.ProdName}</Text>
                </View>
                <View style={styles.List}>
                    <View style={styles.left1}>
                        <Text style={styles.left}>数量</Text>
                        {
                            (this.state.YdCountm == 5) ?
                                <View style={styles.onPrice}>
                                    <TextInput
                                        style={styles.Number}
                                        autoFocus={true}
                                        underlineColorAndroid='transparent'
                                        keyboardType="numeric"
                                        value={this.state.BQNumber.toString()}
                                        placeholderTextColor="#333333"
                                        onChangeText={(value)=>{this.setState({BQNumber:value})}}
                                        onSubmitEditing={this.onSubmitEditing.bind(this)}
                                        onEndEditing = {this.onSubmitEditing.bind(this)}
                                    />
                                </View>
                                :
                                <View style={styles.onPrice}>
                                    {
                                        (this.state.PriceText == 1) ?
                                            <TouchableOpacity onPress={this.NumberButton.bind(this)}>
                                                <Text style={styles.PriceText}>{this.state.Number}</Text>
                                            </TouchableOpacity>
                                            :
                                            <TextInput
                                                style={styles.Number}
                                                returnKeyType='search'
                                                autoFocus={true}
                                                underlineColorAndroid='transparent'
                                                keyboardType="numeric"
                                                value={this.state.Number.toString()}
                                                placeholderTextColor="#333333"
                                                onChangeText={(value)=>{this.setState({Number:value})}}
                                                onSubmitEditing={this.onNumber.bind(this)}
                                                onEndEditing = {this.onSubmitEditing.bind(this)}
                                            />
                                    }
                                </View>
                        }
                    </View>
                    <View style={styles.right1}>
                        <TouchableOpacity style={[styles.sublime,{marginLeft:0,}]} onPress={this.clear.bind(this)}><Image source={require("../images/1_09.png")}/></TouchableOpacity>
                        <TouchableOpacity style={styles.sublime} onPress={this.add.bind(this)}><Image source={require("../images/1_15.png")}/></TouchableOpacity>
                        <TouchableOpacity style={styles.sublime} onPress={this.subtraction.bind(this)}><Image source={require("../images/1_13.png")}/></TouchableOpacity>
                    </View>
                </View>
                {
                    (this.state.YdCountm==1||this.state.YdCountm==5)?
                    <View style={styles.List}>
                        <View style={styles.left2}>
                            <Text style={styles.left}>现在库存</Text>
                            <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                        </View>
                    </View>:null
                }
                {
                    (this.state.YdCountm==2||this.state.name=="商品配送")?
                        <View style={styles.List}>
                            <View style={styles.left2}>
                                <Text style={styles.left}>原单数量</Text>
                                <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                            </View>
                        </View>:null
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
                            (this.state.name=="商品采购"||this.state.name=="协配采购"||this.state.name=="移动销售"||this.state.Modify==1)?
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
                                                onEndEditing = {this.onSubmitEditing.bind(this)}
                                            />
                                            :
                                            <TouchableOpacity onPress={this.PriceButton.bind(this)}>
                                                <Text style={styles.PriceText}>{this.state.ShopPrice}</Text>
                                            </TouchableOpacity>

                                    }
                                </View>
                                :
                                <View>
                                    <Text style={styles.Price1}>{this.state.ShopPrice}</Text>
                                </View>
                        }
                    </View>
                    <View style={styles.right2}>
                        <Text style={styles.price}>元/件</Text>
                    </View>
                </View>
                {
                    (this.state.YdCountm == 5) ?
                        null:
                        <View style={styles.List}>
                            <View style={styles.left2}>
                                {
                                    (this.state.name=="商品配送")?
                                        <Text style={styles.left}>配送金额</Text>
                                        :
                                        <Text style={styles.left}>金额</Text>
                                }

                                {
                                    (this.state.name=="商品采购"||this.state.name=="商品验收"||this.state.name=="移动销售"||this.state.name=="协配采购")?
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
                {
                    (this.state.YdCountm == 4) ?
                        null:
                        <View style={[styles.List,{paddingTop:10,}]}>
                            <View style={styles.left2}>
                                <Text style={[styles.left,{marginTop:9,}]}>备注</Text>
                                <TextInput
                                    style={[styles.Number1,{fontSize:14}]}
                                    placeholder="暂无备注"
                                    placeholderTextColor="#999999"
                                    maxLength={50}
                                    value={this.state.Remark.toString()}
                                    underlineColorAndroid='transparent'
                                    onChangeText={(value)=>{this.setState({Remark:value})}}/>
                            </View>
                        </View>
                }
                <TouchableOpacity style={styles.button} onPress={this.pressPop.bind(this)}>
                    <Text style={styles.ButtonText}>确定</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
      height:60,
      backgroundColor:"#ff4e4e",
      paddingTop:10,
  },
  cont:{
      flexDirection:"row",
      paddingLeft:16,
      paddingRight:16,
  },
  HeaderImage1:{
    marginRight:25,
    marginTop:5
  },
  HeaderList:{
      flex:6,
      textAlign:"center",
      paddingRight:56,
      color:"#ffffff",
      fontSize:22,
      marginTop:3,
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
  left:{
    fontSize:16,
    color:"#666666",
    width:75,
    textAlign:"right"
  },
  right:{
    fontSize:16,
    color:"#333333",
    flexDirection:"row",
    marginLeft:15,
    fontWeight:"200"
  },
  Right:{
    fontSize:16,
    color:"#666666",
    flexDirection:"row",
  },
  left1:{
      flexDirection:"row",
      flex:1,
  },
  right1:{
      flexDirection:"row",
      flex:1,
      position:"absolute",
      right:5,
      top:5
  },
  left2:{
    flexDirection:"row",
    flex:6,
  },
  right2:{
    position:"absolute",
    right:25,
    top:12,
    flexDirection:"row",
  },
  Price1:{
    fontSize:16,
    color:"#333333",
    marginLeft:15,
    fontWeight:"200",
  },
  Number:{
    fontSize:16,
    color:"#333333",
    fontWeight:"200",
    paddingLeft:5,
    paddingTop:0,
    marginLeft:5,
    marginBottom:4,
    flex:1,
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
  Number1:{
    fontSize:16,
    color:"#333333",
    flex:6,
    marginBottom:1,
    fontWeight:"200"
  },
  Delete:{
    fontSize:20,
    color:"#f63e4d",
    flex:1,
    textAlign:"center"
  },
  Reduce:{
    fontSize:20,
    color:"#f63e4d",
    flex:1,
    textAlign:"center"
  },
  Increase:{
    fontSize:20,
    color:"#f63e4d",
    flex:1,
    textAlign:"center"
  },
  sublime:{
      marginLeft:8,
  },
  button:{
    marginTop:30,
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