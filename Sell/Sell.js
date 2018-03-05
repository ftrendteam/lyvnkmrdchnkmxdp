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
    ListView,
    TextInput,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    InteractionManager,
    DeviceEventEmitter,
} from 'react-native';
import Index from "../app/Index";
import Pay from "../Sell/Pay";
import DPPromotionManager from "../Sell/promotion/DPPromotionManager";
import GoodsDetails from "../app/OrderDetails";
import NetUtils from "../utils/NetUtils";
import Storage from "../utils/Storage";
import NumberUtils from "../utils/NumberUtils";
import Swiper from 'react-native-swiper';
import DBAdapter from "../adapter/DBAdapter";
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";
import FetchUtil from "../utils/FetchUtils";
import VipPrice from "../utils/VipPrice";
import NumFormatUtils from "../utils/NumFormatUtils";
import { SwipeListView } from 'react-native-swipe-list-view';
let decodepreprint = new DeCodePrePrint18();
let dbAdapter = new DBAdapter();
import MZPromotionManger from '../Sell/promotion/MZPromotionManger';
import BPPromotionsManger from '../Sell/promotion/BPPromotionsManger';
import MJPromotionManger from '../Sell/promotion/MJPromotionManger'
var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
var TblRow1;

export default class Sell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            VipCardNo: "",
            vipPrice:"",
            ShopAmount:"",
            ShopNumber: "",
            BalanceTotal: "",
            JfBal: "",
            CardTypeCode:"",
            numform:"",
            MemberTextInput: "",
            promemo:"",
            Countm:1,
            Show: false,
            Member: false,
            // dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
            // dataSource:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => true}),
        }
        this.dataRow = [];
        this.TblRow = [];
    }

    modal() {
        let isShow = this.state.Show;
        this.setState({
            Show: !isShow,
        });
    }

    Member() {
        let isShow = this.state.Member;
        this.setState({
            Member: !isShow,
        });
    }

    componentDidMount() {
        // alert(JSON.stringify(TblRow1))
        InteractionManager.runAfterInteractions(() => {
            //获取流水号
            NumFormatUtils.createLsNo().then((data) => {
                this.setState({
                    numform:data
                })
                Storage.save("LsNo",this.state.numform);
            });
            Storage.get('Name').then((tags) => {
                this.setState({
                    name: tags
                });
            });

            this._dbSearch();
            this.Device();
        })
    }

    _dbSearch() {
        this.modal();
        dbAdapter.selectShopInfo().then((rows) => {
            var shopnumber = 0;
            var shopAmount = 0;
            var ShopPrice=0;
            var vipPrice = 0;
            for (let i = 0; i < rows.length; i++) {
                var row = rows.item(i);
                ShopPrice = (row.ShopNumber * row.ShopPrice);
                shopAmount +=ShopPrice;
                Storage.save("vipPrice", JSON.stringify(shopAmount));
                var number = row.ShopNumber;
                shopnumber += parseInt(row.ShopNumber);
                if(this.state.VipCardNo !==""){
                    vipPrice = VipPrice.vipPrice(TblRow1[0],this.VipTblRow);
                }
                var VIPprice = shopAmount-vipPrice;
                if (number !== 0) {
                    this.dataRow.push(row);
                    this.TblRow.push(row);
                }
            }
          //MZPromotionManger.mzPromotion("*",this.dataRow,dbAdapter);
          //MJPromotionManger.MJPromotion(this.dataRow,"*",dbAdapter).then((cc)=>{
          //      console.log("wtf===",cc)
          //});
          // BPPromotionsManger.bpPromotons(row,"*",dbAdapter);
            if (this.dataRow == 0) {
                this.modal();
                return;
            } else {
                Storage.get('VipPrice').then((vipPrice) => {
                    this.setState({
                        ShopNumber: shopnumber,//数量
                        ShopAmount: VIPprice,//总金额this.dataRow
                        dataSource: this.state.dataSource.cloneWithRows(this.dataRow),
                    })
                })
                this.modal();
            }
        });
    }

    Return() {
        // this.props.navigator.pop();
        var nextRoute = {
            name: "Index",
            component: Index,
        };
        this.props.navigator.push(nextRoute);
    }

    Device(){
        DeviceEventEmitter.addListener("code", (reminder) => {
            decodepreprint.init(reminder,dbAdapter);
            if(reminder.length==18&&decodepreprint.deCodePreFlag()){
                decodepreprint.deCodeProdCode().then((datas)=>{
                    dbAdapter.selectProdCode(datas,1).then((rows)=>{
                        dbAdapter.selectAidCode(reminder,1).then((rows)=>{
                            var shopnumber = 0;
                            var shopAmount = 0;
                            var vipPrice = 0;
                            for (let i = 0; i < rows.length; i++) {
                                var row = rows.item(i);
                                this.TblRow.push(row);
                                if(this.state.VipCardNo !==""){
                                    vipPrice = VipPrice.vipPrice(TblRow1[0],this.TblRow);
                                    // Storage.save("VipPrice", vipPrice);
                                }
                                var VIPprice = this.state.ShopAmount-vipPrice;
                                var ShopPrice = row.StdPrice;
                                var prototal=this.state.Countm*row.StdPrice;
                                var number = row.ShopNumber;
                                shopnumber = this.state.Countm+this.state.ShopNumber;
                                var DataRows = {
                                    'ProdCode':row.ProdCode,
                                    'ProdName':row.ProdName,
                                    'ShopPrice':row.StdPrice,
                                    'ShopNumber': this.state.Countm,
                                    'ShopAmount': prototal,
                                    'pid':row.Pid,
                                };
                                this.dataRow.push(DataRows);
                            };
                            shopAmount =ShopPrice+VIPprice;
                            this.setState({
                                vipPrice:vipPrice,
                                ShopNumber: shopnumber,
                                ShopAmount: shopAmount,
                                dataSource: this.state.dataSource.cloneWithRows(this.dataRow),
                            });
                            //存表
                            var shopInfoData = [];
                            var shopInfo = {};
                            shopInfo.Pid = row.Pid;
                            shopInfo.ProdCode=row.ProdCode;
                            shopInfo.prodname = row.ProdName;
                            shopInfo.countm = this.state.Countm;
                            shopInfo.ShopPrice = row.StdPrice;
                            shopInfo.prototal =(this.state.Countm)*(row.StdPrice);
                            shopInfo.promemo = this.state.promemo;
                            shopInfo.DepCode = row.DepCode;
                            shopInfo.ydcountm = "";
                            shopInfo.SuppCode = row.SuppCode;
                            shopInfo.BarCode = row.BarCode;
                            shopInfoData.push(shopInfo);
                            //调用插入表方法
                            dbAdapter.insertShopInfo(shopInfoData);
                        })
                    })
                });
            }else{
                dbAdapter.selectAidCode(reminder,1).then((rows)=>{
                    var shopnumber = 0;
                    var shopAmount = 0;
                    var vipPrice = 0;
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                        this.TblRow.push(row);
                        if(this.state.VipCardNo !==""){
                            vipPrice = VipPrice.vipPrice(TblRow1[0],this.TblRow);
                        }
                        var VIPprice = this.state.ShopAmount-vipPrice;
                        var ShopPrice = row.StdPrice;
                        var prototal=this.state.Countm*row.StdPrice;
                        var number = row.ShopNumber;
                        shopnumber = this.state.Countm+this.state.ShopNumber;
                        var DataRows = {
                            'ProdCode':row.ProdCode,
                            'ProdName':row.ProdName,
                            'ShopPrice':row.StdPrice,
                            'ShopNumber': this.state.Countm,
                            'ShopAmount': prototal,
                            'pid':row.Pid,
                        };
                        this.dataRow.push(DataRows);
                    };
                    shopAmount =ShopPrice+VIPprice;
                    this.setState({
                        vipPrice:vipPrice,
                        ShopNumber: shopnumber,
                        ShopAmount: shopAmount,
                        dataSource: this.state.dataSource.cloneWithRows(this.dataRow),
                    });
                    //存表
                    var shopInfoData = [];
                    var shopInfo = {};
                    shopInfo.Pid = row.Pid;
                    shopInfo.ProdCode=row.ProdCode;
                    shopInfo.prodname = row.ProdName;
                    shopInfo.countm = this.state.Countm;
                    shopInfo.ShopPrice = row.StdPrice;
                    shopInfo.prototal =(this.state.Countm)*(row.StdPrice);
                    shopInfo.promemo = this.state.promemo;
                    shopInfo.DepCode = row.DepCode;
                    shopInfo.ydcountm = "";
                    shopInfo.SuppCode = row.SuppCode;
                    shopInfo.BarCode = row.BarCode;
                    shopInfoData.push(shopInfo);
                    //调用插入表方法
                    dbAdapter.insertShopInfo(shopInfoData);
                })
            }
        })
    }

    Code(){
        RNScannerAndroid.openScanner();
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity  onPress={()=>this.ListButton(rowData)} style={styles.ShopList1}>
                <Text style={styles.Name}>{rowData.ProdCode}</Text>
                <Text style={styles.Name}>{rowData.ProdName}</Text>
                <Text style={styles.Number}>{rowData.ShopPrice}</Text>
                <Text style={styles.Number}>{rowData.ShopNumber}</Text>
                <Text style={styles.Number}>{rowData.ShopAmount}</Text>
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

    deteleShopInfo(rowData, sectionID, rowID){
        dbAdapter.deteleShopInfo(rowData.ProdCode).then((rows)=>{});
        dbAdapter.selectShopInfo().then((rows)=>{
            var shopnumber = 0;
            var shopAmount = 0;
            var vipPrice = 0;
            this.dataRow=[];
            this.VipTblRow=[];
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                this.VipTblRow.push(row);
                var number = row.ShopNumber;
                shopAmount += parseInt(row.ShopAmount);
                shopnumber += parseInt(row.ShopNumber);
                if(number!==0){
                    this.dataRow.push(row);
                }
            }
            if(this.state.VipCardNo !==""){
                vipPrice = VipPrice.vipPrice(TblRow1[0],this.VipTblRow);
            }
            var VIPprice = shopAmount-vipPrice;
            this.setState({
                vipPrice:vipPrice,
                number1:number,
                ShopNumber:shopnumber,//数量
                ShopAmount:VIPprice,//总金额
                dataSource:this.state.dataSource.cloneWithRows(this.dataRow),
            })
        });
        dbAdapter.selectShopInfoAllCountm().then((rows)=>{
            var ShopCar = rows.item(0).countm;
            this.setState({
                shopcar:ShopCar
            });
        });
    }

    ListButton(rowData){
        this.props.navigator.push({
            component:GoodsDetails,
            params:{
                ProdCode:rowData.ProdCode,
                ProdName:rowData.ProdName,
                Pid:rowData.Pid,
                ShopPrice:rowData.ShopPrice,
                Remark:this.state.promemo,
                prototal:(this.state.Countm)*(rowData.ShopPrice),
                countm:rowData.ShopNumber,
                DepCode:rowData.DepCode,
                ydcountm:"",
                promemo:"",
                SuppCode:rowData.SuppCode,
                BarCode:rowData.BarCode,
                DataName:'销售',
            }
        })
    }

    MemberButton() {
        this.Member();
    }

    CloseButton() {
        this.Member();
    }

    Button() {
        if(this.state.VipCardNo !==""){
            Storage.get('vipPrice').then((vipPrice) => {
                this.setState({
                    ShopAmount:vipPrice
                })
            })
        }
        this.modal();
        Storage.get('ShopCode').then((ShopCode) => {
            Storage.get('PosCode').then((PosCode) => {
                let params = {
                    TblName: "ReadVipInfo",
                    CardFaceNo: this.state.CardNumber,
                    Mobile: "",
                    ShopCode: ShopCode,
                    PosCode: PosCode,
                    IsChuZhi: "",
                };
                Storage.get('LinkUrl').then((tags) => {
                    FetchUtil.post(tags,JSON.stringify(params)).then((data) => {
                        if (data.retcode == 1) {
                            var TblRow = data.TblRow;
                            var VipCardNo;
                            var BalanceTotal;
                            var JfBal;
                            var CardFaceNo;
                            var CardTypeCode;
                            for (let i = 0; i < TblRow.length; i++) {
                                var row = TblRow[i];
                                VipCardNo =  JSON.stringify(row.VipCardNo);//卡号
                                BalanceTotal = JSON.stringify(row.BalanceTotal);//余额
                                JfBal = JSON.stringify(row.JfBal);//积分
                                CardTypeCode=JSON.stringify(row.CardTypeCode);
                            };
                            let vipPrice = VipPrice.vipPrice(TblRow[0],this.TblRow);
                            var VIPprice = this.state.ShopAmount-vipPrice;
                            TblRow1=data.TblRow;
                            this.setState({
                                VipCardNo: VipCardNo,
                                BalanceTotal: BalanceTotal,
                                JfBal: JfBal,
                                ShopAmount: VIPprice,
                                vipPrice:vipPrice,
                                CardTypeCode:CardTypeCode
                            });
                            this.modal();
                            this.Member();
                        } else {
                            this.modal();
                            alert(JSON.stringify(data));
                        }
                    })
                })
            })
        })
    }

    PayButton() {
        if(this.dataRow==""){
            alert("请添加商品");
        }else{
            if(this.state.name=="退货"){
                var dataRows=this.dataRow;
                var nextRoute = {
                    name: "Pay",
                    component: Pay,
                    params: {
                        VipCardNo:this.state.VipCardNo,
                        JfBal: this.state.JfBal,
                        BalanceTotal: this.state.BalanceTotal,
                        CardTypeCode:this.state.CardTypeCode,
                        ShopAmount: this.state.ShopAmount,
                        numform:this.state.numform,
                        vipData:JSON.stringify(this.state.vipPrice),
                        Seles:"R",
                        dataRows:dataRows,
                    }
                };
                this.props.navigator.push(nextRoute);
            }else if(this.state.name=="销售"){
                var dataRows=this.dataRow;
                var nextRoute = {
                    name: "Pay",
                    component: Pay,
                    params: {
                        VipCardNo:this.state.VipCardNo,
                        JfBal: this.state.JfBal,
                        BalanceTotal: this.state.BalanceTotal,
                        CardTypeCode:this.state.CardTypeCode,
                        ShopAmount: this.state.ShopAmount,
                        numform:this.state.numform,
                        vipData:JSON.stringify(this.state.vipPrice),
                        Seles:"T",
                        dataRows:dataRows,
                    }
                };
                this.props.navigator.push(nextRoute);
            };

        }
        //界面跳转
        // let currentRoutes = this.props.navigator.getCurrentRoutes();
        // for (let i = 0;i<currentRoutes.length;i++){
        //     let currentRoute = currentRoutes[i];
        //     let name = currentRoute.name;
        //     if("Pay"==name){
        //         this.props.navigator.jumpForward();
        //         break;
        //     }else if(i==currentRoutes.length-1){
        //         this.props.navigator.push(nextRoute);
        //         break;
        //     }
        // }
    }

    ReturnGoods(){
        // Storage.get('ShopCode').then((ShopCode) => {
        //     Storage.get('PosCode').then((PosCode) => {
        //         let params = {
        //             TblName: "VipCardPay_Ret",
        //             PayOrderNo: this.state.numform,
        //             CardPwd: "",
        //             shopcode: ShopCode,
        //             poscode: PosCode,
        //             CardFaceNo: "",
        //             OrderTotal: "",
        //             SaleTotal: "",
        //             JfValue: "",
        //             TransFlag: "",
        //         }
        //     })
        // })
        this.setState({
            name:"退货"
        });

    }

    DeleteShop(){
        if(this.dataRow==""){
            alert("请添加商品");
        }else {
            dbAdapter.deleteData("shopInfo");
            this.dataRow = [];
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.dataRow),
                ShopNumber:"",
                ShopAmount:"",
            })
        }
    }

    inputOnBlur(){
        dbAdapter.selectAidCode(this.state.MnCode,1).then((rows)=>{
            if(rows.length==0){
                alert("助记码不存在")
            }else{
                var shopnumber = 0;
                var shopAmount = 0;
                for (let i = 0; i < rows.length; i++) {
                    var row = rows.item(i);
                    var ShopPrice = row.ShopPrice;
                    var prototal=this.state.Countm*row.ShopPrice;
                    var number = row.ShopNumber;
                    shopnumber = this.state.Countm+this.state.ShopNumber;
                    var DataRows = {
                        'ProdCode':row.ProdCode,
                        'prodname':row.ProdName,
                        'ShopPrice':row.ShopPrice,
                        'countm': this.state.Countm,
                        'prototal': prototal,
                        'pid':row.Pid,
                    };
                    this.dataRow.push(DataRows);
                };
                shopAmount =ShopPrice+this.state.ShopAmount;
                this.setState({
                    ShopNumber: shopnumber,
                    ShopAmount: shopAmount,
                    dataSource: this.state.dataSource.cloneWithRows(this.dataRow),
                });
                var shopInfoData = [];
                var shopInfo = {};
                shopInfo.Pid = row.Pid;
                shopInfo.ProdCode=row.ProdCode;
                shopInfo.prodname = row.ProdName;
                shopInfo.countm = this.state.Countm;
                shopInfo.ShopPrice = row.ShopPrice;
                shopInfo.prototal =(this.state.Countm)*(row.ShopPrice);
                shopInfo.promemo = this.state.promemo;
                shopInfo.DepCode = row.DepCode;
                shopInfo.ydcountm = "";
                shopInfo.SuppCode = row.SuppCode;
                shopInfo.BarCode = row.BarCode;
                shopInfoData.push(shopInfo);
                //调用插入表方法
                dbAdapter.insertShopInfo(shopInfoData);
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Top}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={this.Return.bind(this)} style={styles.return}>
                            <Image source={require("../images/2_01.png")}></Image>
                        </TouchableOpacity>
                        <View style={styles.HeaderList}><Text style={styles.HeaderText}>{this.state.name}</Text></View>
                        <TouchableOpacity onPress={this.Code.bind(this)} style={styles.SearchImage}>
                            <Image source={require("../images/1_05.png")}></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.TitleCont}>
                        <View style={styles.FristList}>
                            <View style={[styles.List, {flex: 2}]}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText, {textAlign: "center"}]}>流水号：</Text>
                                </View>
                                <View style={styles.ListView}>
                                    <Text style={styles.ListText}>{this.state.numform}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={this.ReturnGoods.bind(this)} style={styles.refund}>
                                <Text style={styles.Goods}>退货</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.Center}>
                    <View style={styles.ShopCont}>
                        <View style={[{
                            backgroundColor: "#ff4e4e",
                            width: 10,
                            height: 60,
                            position: "absolute",
                            left: 0,
                        }]}></View>
                        <View style={[{
                            backgroundColor: "#ff4e4e",
                            width: 10,
                            height: 60,
                            position: "absolute",
                            right: 0,
                        }]}></View>
                        <ScrollView style={styles.ShopList}>
                            <View style={styles.ListTitle}>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>商品编码</Text>
                                </View>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>商品名称</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>零售价</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>数量</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>小计</Text>
                                </View>
                            </View>
                            <SwipeListView
                                style={styles.SwipeList}
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow.bind(this)}
                                renderHiddenRow={this.renderHiddenRow.bind(this)}
                                rightOpenValue={-100}
                            />
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.Bottom}>
                    <View style={styles.ShopCont}>
                        <View style={styles.Prece}>
                            <View style={styles.InputingLeft}>
                                <Text style={[styles.InpuTingText, {width: 60, marginTop: 10,}]}>请输入:</Text>
                            </View>
                            <View style={styles.InputingRight}>
                                <TextInput
                                    autofocus={true}
                                    numberoflines={1}
                                    keyboardType="numeric"
                                    textalign="center"
                                    underlineColorAndroid='transparent'
                                    style={styles.TextInput}
                                    onChangeText={(value)=>{
                                        this.setState({
                                            MnCode:value
                                        })
                                    }}
                                    onSubmitEditing={this.inputOnBlur.bind(this)}
                                />
                            </View>
                        </View>
                        <View style={[styles.Prece, {height: 28, marginTop: 16, backgroundColor: "#f2f2f2"}]}>
                            <View style={styles.Inputing}>
                                <View style={styles.Inputingleft}>
                                    <Text style={[styles.InputingText, {fontWeight: "bold"}]}>金额:</Text>
                                </View>
                                <View style={styles.Inputingright}>
                                    <Text style={[styles.InputingText, {fontWeight: "bold", fontSize: 20, color: "red"}]}>{this.state.ShopAmount}</Text>
                                </View>
                            </View>
                            <View style={styles.Inputing1}>
                                <View style={styles.Inputingleft}>
                                    <Text style={styles.InputingText}>卡号:</Text>
                                </View>
                                <View style={styles.Inputingright}>
                                    <Text style={styles.InputingText}>{this.state.VipCardNo}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.Prece, {height: 28, marginTop: 16, backgroundColor: "#f2f2f2"}]}>
                            <View style={styles.Inputing}>
                                <View style={styles.Inputingleft}>
                                    <Text style={[styles.InputingText, {fontWeight: "bold"}]}>数量:</Text>
                                </View>
                                <View style={styles.Inputingright}>
                                    <Text style={[styles.InputingText, {fontWeight: "bold", fontSize: 20, color: "red"}]}>{this.state.ShopNumber}</Text>
                                </View>
                            </View>
                            <View style={styles.Inputing1}>
                                <View style={[styles.Inputingright, styles.Inputing1Left]}>
                                    <View style={styles.Inputingleft}>
                                        <Text style={styles.InputingText}>积分:</Text>
                                    </View>
                                    <View style={styles.Inputingright}>
                                        <Text style={styles.InputingText}>{this.state.JfBal}</Text>
                                    </View>
                                </View>
                                <View style={[styles.Inputingright, styles.Inputing1Left]}>
                                    <View style={styles.Inputingleft}>
                                        <Text style={styles.InputingText}>余额:</Text>
                                    </View>
                                    <View style={styles.Inputingright}>
                                        <Text style={styles.InputingText}>{this.state.BalanceTotal}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.Swiper}>
                        <Swiper
                            style={styles.swiper}          //样式
                            height={200}                   //组件高度
                            loop={true}                    //如果设置为false，那么滑动到最后一张时，再次滑动将不会滑到第一张图片。
                            autoplayTimeout={4}                //每隔4秒切换
                            horizontal={true}              //水平方向，为false可设置为竖直方向
                            paginationStyle={{bottom: 10}} //小圆点的位置：距离底部10px
                            showsButtons={false}           //为false时不显示控制按钮
                            showsPagination={false}       //为false不显示下方圆点
                            dot={<View style={{           //未选中的圆点样式
                                backgroundColor: 'rgba(0,0,0,.2)',
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                marginTop: 9,
                                marginBottom: 9,
                            }}/>}
                            activeDot={<View style={{    //选中的圆点样式
                                backgroundColor: '#007aff',
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                marginTop: 9,
                                marginBottom: 9,
                            }}/>}
                        >
                            <View style={styles.FristPage}>
                                <View style={styles.PageRow}>
                                    <TouchableOpacity onPress={this.MemberButton.bind(this)}
                                                      style={[styles.PageRowButton, {marginRight: 5}]}>
                                        <Text style={styles.PageRowText}>
                                            会员
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.PayButton.bind(this)}
                                                      style={[styles.PageRowButton, {marginRight: 5}]}>
                                        <Text style={styles.PageRowText}>
                                            付款
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton, {marginRight: 5}]}>
                                        <Text style={styles.PageRowText}>
                                            销售
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.FristPage}>
                                <View style={styles.PageRow}>
                                    <TouchableOpacity onPress={this.DeleteShop.bind(this)}
                                                      style={[styles.PageRowButton, {marginRight: 5}]}>
                                        <Text style={styles.PageRowText}>
                                            清空商品
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Swiper>
                    </View>
                </View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.Show}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.LoadCenter}>
                        <View style={styles.loading}>
                            <ActivityIndicator key="1" color="#ffffff" size="large"
                                               style={styles.activity}></ActivityIndicator>
                            <Text style={styles.TextLoading}>加载中</Text>
                        </View>
                    </View>
                </Modal>
                <Modal
                    transparent={true}
                    visible={this.state.Member}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.MemberBounces}>
                        <View style={styles.Cont}>
                            <View style={styles.BouncesTitle}>
                                <Text style={[styles.TitleText, {fontSize: 18}]}>会员</Text>
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
                                                    CardNumber: value
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Top:{
        height:100,
        backgroundColor:"#ccc"
    },
    Center:{
      flex:1,
    },
    Bottom:{
        height:220,
    },
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        height: 60,
        backgroundColor: "#ff4e4e",
        paddingTop: 10,
        paddingLeft: 16,
        paddingRight: 16,
        flexDirection: "row",
    },
    return:{
        width:60,
    },
    HeaderList: {
        flex: 1,
        paddingRight: 56,
        marginTop: 3,
    },
    HeaderText:{
        textAlign: "center",
        color: "#ffffff",
        fontSize: 22,
    },
    SearchImage:{
        width:60,
        paddingLeft:20
    },
    TitleCont: {
        height: 40,
        backgroundColor: "#ff4e4e",
        paddingLeft: 20,
        paddingRight: 20,
    },
    FristList: {
        height: 38,
        paddingBottom: 6,
        flexDirection: "row",
    },
    FristList1: {
        height: 38,
        paddingTop: 12,
        flexDirection: "row",
    },
    List: {
        flex: 1,
        flexDirection: "row",
        marginTop:5,
    },
    refund:{
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:15,
        paddingRight:15,
        backgroundColor:"#ffba00",
        borderRadius:5,
    },
    Goods:{
        fontSize:16,
        color:"#ffffff",
        textAlign:"center"
    },
    ListView1: {
        width: 70,
    },
    ListView: {
        flex: 1,
        height: 20,
        overflow: "hidden",
        backgroundColor: "#ff4e4e"
    },
    ListText: {
        color: "#ffffff",
        fontSize: 16,
    },
    ShopCont: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    SwipeList:{

    },
    ShopList: {
        minHeight: 100,
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
        flex: 3
    },
    ListClass1: {
        flex: 2
    },
    ListClassText: {
        color: "#666666",
        fontSize: 16,
        textAlign: "center"
    },
    Prece: {
        height: 45,
        marginTop: 10,
        flexDirection: "row"
    },
    InpuTingText: {
        color: "#333333",
        fontSize: 16,
    },
    InputingRight: {
        flex: 1,
        height: 45,
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
        width: 50,
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
    Swiper: {
        height: 50,
        marginTop: 16,
    },
    FristPage: {
        marginLeft: 10,
        marginRight: 10,
    },
    PageRow: {
        height: 50,
        flexDirection: "row"
    },
    PageRowButton: {
        flex: 1,
        backgroundColor: "#ff4e4e",
        borderRadius: 5,
        paddingTop: 14,
    },
    PageRowText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "center"
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
    Name: {
        flex: 3,
        textAlign: "center",
        color: "#333333",
        fontSize: 16,
        height: 22,
        overflow: "hidden",
    },
    Number: {
        flex: 2,
        textAlign: "center",
        color: "#333333",
        fontSize: 16,
        height: 22,
        overflow: "hidden",
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
        height: 150,
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
        fontSize: 16,
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
    rowBack:{
        backgroundColor:"#ff4e4e",
        paddingTop:10,
        paddingBottom:10,
        paddingRight:35
    },
    rowBackText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"right"
    }
});
