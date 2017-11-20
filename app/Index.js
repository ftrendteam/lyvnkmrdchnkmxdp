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
import HistoricalDocument from "./HistoricalDocument";
import ShoppingCart from "./ShoppingCart";
import Code from "./Code";
import admin from "./admin";
import OrderDetails from "./OrderDetails";
import Search from "./Search";
import Query from "./Query";
import Distrition from "./Distrition";
import ProductCG from "./ProductCG";
import ProductYS from "./ProductYS";
import ProductXP from "./ProductXP";
import ProductSH from "./ProductSH";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import SideMenu from 'react-native-side-menu';

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let db;
let page =1;
let total = 0;
let totalPage = 0;
const lastDepCode = "";

export default class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentindex:0,
            pickedDate:"",
            pid:"",
            DepCode:"",
            head:"",
            shopcar:"",
            Counmnmber:"",
            Page:"",
            data:"",
            ShopNumber:"",
            ShopCar1:"",
            usercode:"",
            License:"",
            username:"",
            active:"",
            ClientCode:"",
            Usercode:"",
            SuppCode:"",
            ShopCode:"",
            ChildShopCode:"",
            OrgFormno:"",
            FormType:"",
            LinkUrl:"",
            nomore: true,
            isloading:true,
            show:false,
            Show:false,
            depcode:this.props.DepCode ? this.props.DepCode : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        };
        this.dataRows = [];
        this.productData = [];
        this.moreTime = 0;
        var timer1 = null;
        if (!db) {
            db = dbAdapter.open();
        }
    }

    _refreshMsssage= (id) =>{
        this.setState({
            currentindex:id
        });
    }

    HISTORY(){
        var nextRoute={
            name:"主页",
            component:HistoricalDocument
        };
        this.props.navigator.push(nextRoute)
    }

    HOME(){
        var nextRoute={
            name:"主页",
            component:Index
        };
        this.props.navigator.push(nextRoute)
    }

    SHOP(){
        var nextRoute={
            name:"主页",
            component:ShoppingCart
        };
        this.props.navigator.push(nextRoute)
    }

    pressPush(){
        var nextRoute={
            name:"主页",
            component:Search
        };
        this.props.navigator.push(nextRoute)
    }

    Code(){
        RNScannerAndroid.openScanner();
        DeviceEventEmitter.addListener("code", (reminder) => {
            dbAdapter.selectAidCode(reminder,1).then((rows)=>{
                if(rows.length==0){
                    alert("该商品不存在")
                }else{
                    Storage.get('FormType').then((tags)=>{
                        this.setState({
                            FormType:tags
                        })
                    })

                    Storage.get('LinkUrl').then((tags) => {
                        this.setState({
                            LinkUrl:tags
                        })
                    })
                    //商品查询
                    Storage.get('userName').then((tags)=>{
                        let params = {
                            reqCode:"App_PosReq",
                            reqDetailCode:"App_Client_CurrProdQry",
                            ClientCode:this.state.ClientCode,
                            sDateTime:Date.parse(new Date()),
                            Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                            username:tags,
                            usercode:this.state.Usercode,
                            SuppCode:rows.item(0).SuppCode,
                            ShopCode:this.state.ShopCode,
                            ChildShopCode:this.state.ChildShopCode,
                            ProdCode:rows.item(0).ProdCode,
                            OrgFormno:this.state.OrgFormno,
                            FormType:this.state.FormType,
                        };
                        alert(JSON.stringify(params))
                        FetchUtil.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
                            var countm=JSON.stringify(data.countm);
                            var ShopPrice=JSON.stringify(data.ShopPrice);
                            if(data.retcode == 1){
                                // if(data.isFond==1){
                                var ShopCar = rows.item(0).ProdName;
                                this.props.navigator.push({
                                    component:OrderDetails,
                                    params:{
                                        ProdName:rows.item(0).ProdName,
                                        ShopPrice:rows.item(0).ShopPrice,
                                        Pid:rows.item(0).Pid,
                                        countm:rows.item(0).ShopNumber,
                                        promemo:rows.item(0).promemo,
                                        prototal:rows.item(0).prototal,
                                        ProdCode:rows.item(0).ProdCode,
                                        DepCode:rows.item(0).DepCode1,
                                        SuppCode:rows.item(0).SuppCode,
                                        ydcountm:countm,
                                    }
                                })
                                // }else{
                                //     // alert('该商品暂时无法购买')
                                // }
                            }else{}
                        })
                    })
                }
            })
        })
    }

    pullOut(){
        Storage.delete('username');
        Storage.delete('history');
        Storage.delete('FirstTime1');
        this._setModalVisible();
        if(this.state.ShopCar1>0){
            alert("商品未提交")
        }else{

            Storage.delete('Name');

            var nextRoute={
                name:"主页",
                component:admin
            };
            this.props.navigator.push(nextRoute)
        }
    }

    pressPop(){
        this._setModalVisible()
        this.props.navigator.pop();
    }

    _rightButtonClick() {
        this._setModalVisible();
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }

    //进入页面执行方法
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            this.Storage();
            this._fetch();
            this.function();
            if(lastDepCode ==1){
                page= 1;
            }
        });
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

    //获取左侧商品品类信息、商品总数、触发第一个列表
    _fetch(){
        dbAdapter.selectTDepSet('1').then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                this.dataRows.push(row);
                var ShopCar = rows.item(0).DepCode;
                var ShopCar1 = rows.item(0).ShopNumber;
            }
            if(this.state.depcode == "") {
                this.setState({
                    depcode :ShopCar,
                })
                lastDepCode = this.state.depcode;
            }
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                isloading:true,
                ShopCar1:ShopCar1
            })
            //触发第一个左侧品类
            let priductData=[];
            dbAdapter.selectProduct(this.state.depcode,page,1).then((rows)=>{
                if(lastDepCode !==""){
                    page= 1;
                }
                for(let i =0;i<rows.length;i++){
                    var row = rows.item(i);
                    priductData.push(row);
                }
                total = this.state.Page;
                totalPage = total % 15 == 0 ? total / 15 : Math.floor(total / 15) + 1;
                this.productData=priductData;
                this.setState({
                    data:priductData,
                    isloading:false
                })
            });
        });
        //获取商品总数
        dbAdapter.selectProduct1(1,1).then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
            };
            var priductdata = JSON.stringify(row.countn);
            this.setState({
                Page:priductdata,
            })
        });
        this._fetch1();
    }

    _fetch1(){
        dbAdapter.selectShopInfo("1").then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
            }
        });
        dbAdapter.selectShopInfoAllCountm().then((rows)=>{
            var ShopCar = rows.item(0).countm;
            this.setState({
                shopcar:ShopCar
            });
        });
    }

    _renderRow(rowData, sectionID, rowID){
        // alert(sectionID);
        return (
            // this.dataRows.map((item,index) => {
            //
            // })

            // let sclick= this.state.currentindex?styles.click:styles.clickes;

        <TouchableOpacity onPress={() => this._pressRow(rowData)} style={styles.Active}>
            {
                (rowData.ShopNumber == 0) ?
                    null :
                    <View style={styles.addnumber}>
                        <Text style={styles.Reduction1}>{rowData.ShopNumber}</Text>
                    </View>
            }

            <Text onPress={() =>this._refreshMsssage(this,rowID)} key={rowID} style={this.state.currentindex?styles.click:styles.clickes}>{rowData.DepName}></Text>

        </TouchableOpacity>
        );


    }

    //点击商品品类获取商品信息
    _pressRow(rowData){
        if(lastDepCode ==""){
            lastDepCode = rowData.DepCode;
        }
        if(lastDepCode!==''){
            page= 1;
        }
        dbAdapter.selectProduct1(rowData.DepCode,1).then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
            };
            var priductdata = JSON.stringify(row.countn);
            this.setState({
                Page:priductdata,
            })
        });
        let priductData=[];
        var DEPCODE = (rowData.DepCode);
        this.setState({
            depcode:DEPCODE,
            isloading:true,
        })
        dbAdapter.selectProduct(rowData.DepCode,page,1).then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                priductData.push(row);
            };
            total = this.state.Page;
            totalPage = total % 15 == 0 ? total / 15 : Math.floor(total / 15) + 1;
            this.productData=priductData;
            this.setState({
                data:priductData,
                isloading:false
            })
            if(totalPage==0){
                this.setState({
                    nomore: false,
                })
            }
            if(totalPage>0){
                this.setState({
                    nomore: true,
                })
            }
        });
        this._fetch1();
        //var startTime = (new Date()).valueOf();//获取当前时间
        //var endTime = (new Date()).valueOf();//获取结束时间
        //alert(endTime-startTime);
    }

    _renderItem(item,index){
        return(
            <View style={styles.Border}>
                <View style={styles.AddNumber} ref="goodsCodeOrName">
                    {
                        (item.item.ShopNumber==0)?
                            null:
                            <TouchableOpacity style={styles.Subtraction} onPress={()=>this.Countm(item)}>
                                <Text style={styles.Number}>{item.item.ShopNumber}</Text>
                                <View style={styles.subtraction}><Text style={styles.Reduction}>-</Text></View>
                            </TouchableOpacity>
                    }
                </View>
                <TouchableOpacity onPress={()=>this.OrderDetails(item)}>
                    <View style={styles.Image}>
                        <Image source={require("../images/image.png")}></Image>
                    </View>
                    <Text style={styles.Text}>{item.item.ProdName}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    //商品减少查询
    Countm(item){
        //调取数量
        dbAdapter.upDataShopInfoCountmSub(item.item.ProdCode).then((rows)=>{});
        item.item.ShopNumber=item.item.ShopNumber-1;
        let select =0;
        for (let i = 0; i < this.dataRows.length; i++) {
            if (item.item.DepCode1 == this.dataRows[i].DepCode) {//判断当前品类是否相等
                select = i;
                let ShopNumber = this.dataRows[i].ShopNumber;
                this.dataRows[i].ShopNumber = ShopNumber - 1;
            }
        }
        if ((select != 0)) {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataRows,select),
            })
        }
        this._fetch1();
    }

    _separator = () => {
        return <View style={{height:1,backgroundColor:'#f5f5f5'}}/>;
    }

    _createEmptyView() {
        return (
            <View style={styles.footerView}>
                {
                    this.state.nomore ?[<ActivityIndicator key="1"></ActivityIndicator>,<Text key="2" style={styles.fontColorGray}>加载中</Text>]:<Text style={styles.nomore}>没有更多了</Text>
                }
            </View>
        );
    }

    OrderDetails(item){
        var title = this.state.head;
        Storage.get('FormType').then((tags)=>{
            this.setState({
                FormType:tags
            })
        })

        Storage.get('LinkUrl').then((tags) => {
            this.setState({
                LinkUrl:tags
            })
        })

        if(title ==null){
            alert("请选择单据");
        }else{
            //商品查询
            Storage.get('userName').then((tags)=>{
                let params = {
                    reqCode:"App_PosReq",
                    reqDetailCode:"App_Client_CurrProdQry",
                    ClientCode:this.state.ClientCode,
                    sDateTime:Date.parse(new Date()),
                    Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                    username:tags,
                    usercode:this.state.Usercode,
                    SuppCode:item.item.SuppCode,
                    ShopCode:this.state.ShopCode,
                    ChildShopCode:this.state.ChildShopCode,
                    ProdCode:item.item.ProdCode,
                    OrgFormno:this.state.OrgFormno,
                    FormType:this.state.FormType,
                };
                FetchUtil.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
                    var countm=JSON.stringify(data.countm);
                    var ShopPrice=JSON.stringify(data.ShopPrice);
                    if(data.retcode == 1){
                        // if(data.isFond==1){
                            this.props.navigator.push({
                                component:OrderDetails,
                                params:{
                                    ProdName:item.item.ProdName,
                                    ShopPrice:ShopPrice,
                                    Pid:item.item.Pid,
                                    countm:item.item.ShopNumber,
                                    promemo:item.item.promemo,
                                    prototal:item.item.prototal,
                                    ProdCode:item.item.ProdCode,
                                    DepCode:item.item.DepCode1,
                                    SuppCode:item.item.SuppCode,
                                    ydcountm:countm,
                                }
                            })
                        // }else{
                        //     // alert('该商品暂时无法购买')
                        // }
                    }else{}
                })
            })

        }
    }

    //功能授权
    function(){
        Storage.get('username').then((tags) => {
            this.setState({
                usercode:tags
            })

        });
    }

    //功能分类
    Home(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        Storage.delete('YuanDan');
        Storage.delete('Screen');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else{
            dbAdapter.selectUserRight(this.state.usercode,"K0801").then((rows)=>{
                if(rows==true){
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                        if(rows==true){
                            var date = new Date();
                            var data=JSON.stringify(date.getTime());
                            Storage.save('Name','要货单');
                            Storage.save('FormType','YWYW');
                            Storage.save('ProYH','ProYH');
                            Storage.save('YdCountm','3');
                            var invoice = "要货单";
                            this.setState({
                                head:invoice,
                                active:data,
                            });
                            Storage.save('Date',this.state.active);
                            this._setModalVisible();
                        }
                    })
                }else if(rows==false){
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })

            //将内容保存到本地数据库
            Storage.save('valueOf','App_Client_ProYH');
            Storage.save('history','App_Client_ProYHQ');
            Storage.save('historyClass','App_Client_ProYHDetailQ');
        }
    }

    Home1(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        Storage.delete('YuanDan');
        Storage.delete('Screen');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            dbAdapter.selectUserRight(this.state.usercode,"K0604").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            var date = new Date();
                            var data=JSON.stringify(date.getTime());
                            Storage.save('Name','损益单');
                            Storage.save('FormType','SYYW');
                            Storage.save('ProYH','ProSY');
                            Storage.save('YdCountm','3');
                            var invoice = "损益单";
                            this.setState({
                                head: invoice,
                                active:data,
                            });
                            Storage.save('Date',this.state.active);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
            Storage.save('valueOf', 'App_Client_ProSY');
            Storage.save('history', 'App_Client_ProSYQ');
            Storage.save('historyClass', 'App_Client_ProSYDetailQ');
        }
    }

    Query(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        Storage.delete('YuanDan');
        Storage.delete('Screen');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            dbAdapter.selectUserRight(this.state.usercode,"K0611").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            var date = new Date();
                            var data=JSON.stringify(date.getTime());
                            Storage.save('Name','实时盘点单');
                            Storage.save('FormType','CUPCYW');
                            Storage.save('ProYH','ProCurrPC');
                            Storage.save('YdCountm','1');
                            var invoice = "实时盘点单";
                            this.setState({
                                head: invoice,
                                active:data,
                            });
                            Storage.save('Date',this.state.active);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
            Storage.save('valueOf', 'App_Client_ProCurrPC');
            Storage.save('history', 'App_Client_ProCurrPCQ');
            Storage.save('historyClass', 'App_Client_ProCurrPCDetailQ');
        }
    }

    Query1(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            // Storage.delete("Name");
            dbAdapter.selectUserRight(this.state.usercode,"K0607").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            Storage.save('invoice','商品盘点单');
                            Storage.save('YdCountm','3');
                            var nextRoute = {
                                name: "主页",
                                component: Query
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
        }

    }

    Home2(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            // Storage.delete("Name");
            dbAdapter.selectUserRight(this.state.usercode,"K0802").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            Storage.save("invoice", "配送收货单");
                            Storage.save('YdCountm','2');
                            var nextRoute = {
                                name: "主页",
                                component: Distrition
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
        }

    }

    Shopp(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            // Storage.delete("Name");
            dbAdapter.selectUserRight(this.state.usercode,"K0504").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            Storage.save("invoice", "商品采购单");
                            var nextRoute = {
                                name: "主页",
                                component: ProductCG
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
        }
    }

    Shopp1(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            // Storage.delete("Name");
            dbAdapter.selectUserRight(this.state.usercode,"K0505").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            Storage.save("invoice", "商品验收单");
                            Storage.save('YdCountm','2');
                            var nextRoute = {
                                name: "主页",
                                component: ProductYS
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
        }
    }

    Shopp2(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            // Storage.delete("Name");
            dbAdapter.selectUserRight(this.state.usercode,"K0707").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            Storage.save("invoice", "协配采购单");
                            Storage.save('YdCountm','3');
                            var nextRoute = {
                                name: "主页",
                                component: ProductXP
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
        }
    }

    Shopp3(){
        Storage.delete('OrgFormno');
        Storage.delete('scode');
        Storage.delete('shildshop');
        if(this.state.ShopCar1>0){
            this._setModalVisible();
            alert("商品未提交")
        }else if(this.state.username==null){
            this._setModalVisible();
        }else {
            // Storage.delete("Name");
            dbAdapter.selectUserRight(this.state.usercode,"K0803").then((rows) => {
                if (rows == true) {
                    dbAdapter.selecUserRightA1012(this.state.usercode).then((rows) => {
                        if (rows == true) {
                            Storage.save("invoice", "协配收货单");
                            Storage.save('YdCountm','2');
                            var nextRoute = {
                                name: "主页",
                                component: ProductSH
                            };
                            this.props.navigator.push(nextRoute);
                            this._setModalVisible();
                        }
                    })
                } else if (rows == false) {
                    alert("该店铺没有此权限");
                    this._setModalVisible();
                }
            })
        }
    }

    Home3(){
        this._setModalVisible();
    }

    keyExtractor(item: Object, index: number) {
        return item.ProdName//FlatList使用json中的ProdName动态绑定key
    }

    //翻页列表
    _onload(){
        if(this.state.isloading){
            return true
        }
        page=page+1;
        this.setState({
            nomore: true,
            isloading:true
        });
        if(this.state.depcode!=lastDepCode){
            page= 1;
        }
        let priductData=[];
        if(totalPage>1&&page<totalPage){
            dbAdapter.selectProduct(this.state.depcode,page,1).then((rows)=>{
                for(let i =0;i<rows.length;i++){
                    var row = rows.item(i);
                    priductData.push(row);
                };
                if(this.state.depcode!=lastDepCode){
                    this.productData.splice(0,this.productData.length);
                    lastDepCode = this.state.depcode;
                }
                this.productData = this.productData.concat(priductData);
                this.setState({
                    data:this.productData,
                    isloading:false
                });
            });

        }else{
            this.setState({
                nomore: false,
            });
        }
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
                            onEndReachedThreshold = {0.1}
                            onEndReached={() =>{this._onload()}}
                            getItemLayout={(data, index) => (
                                // 120 是被渲染 item 的高度 ITEM_HEIGHT。
                                {length: 120, offset: 120 * index, index}
                            )}
                        />
                    </View>
                </View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.modalStyle}>
                        <View style={styles.ModalTitle}>
                            <View style={styles.ModalLeft}>
                                <View>
                                    <Image source={require("../images/1_42.png")} />
                                </View>
                                <TouchableOpacity>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_39.png")} />
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        触摸
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLeft1}>
                                <Image source={require("../images/1_47.png")} />
                            </View>
                            <View style={styles.ModalLeft}>
                                <View style={[{marginLeft:14}]}>
                                    <Image source={require("../images/1_43.png")} />
                                </View>
                                <TouchableOpacity>
                                    <Text style={styles.ModalImage}>
                                        <Image source={require("../images/1_41.png")} />
                                    </Text>
                                    <Text style={styles.ModalText}>
                                        扫码
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.ModalCont}>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity style={[styles.ModalHeadImage,{borderRightWidth:1,borderRightColor:"#f2f2f2"}]} onPress={this.Home.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_25.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        要货
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ModalHeadImage,{borderRightWidth:1,borderRightColor:"#f2f2f2"}]} onPress={this.Home2.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_28.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        配送收货
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress={this.Query.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_29.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        实时盘点
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine} />
                            </View>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity style={[styles.ModalHeadImage,{borderRightWidth:1,borderRightColor:"#f2f2f2"}]} onPress={this.Query1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_36.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品盘点
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ModalHeadImage,{borderRightWidth:1,borderRightColor:"#f2f2f2"}]} onPress={this.Home1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_38.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        损益
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress={this.Shopp.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_40.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品采购
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine} />
                            </View>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity style={[styles.ModalHeadImage,{borderRightWidth:1,borderRightColor:"#f2f2f2"}]} onPress={this.Shopp1.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_44.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        商品验收
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.ModalHeadImage,{borderRightWidth:1,borderRightColor:"#f2f2f2"}]} onPress={this.Shopp2.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_45.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        协配采购
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage} onPress={this.Shopp3.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_46.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        协配收货
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalLine}>
                                <Image source={require("../images/1_48.png")} style={styles.ModalImageLine} />
                            </View>
                            <View style={styles.ModalHead}>
                                <TouchableOpacity style={[styles.ModalHeadImage,{borderRightWidth:1,borderRightColor:"#f2f2f2"}]} onPress={this.pullOut.bind(this)}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_56.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        退出账号
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage}>
                                    <Text style={styles.ModalHeadImage1}>
                                        <Image source={require("../images/1_59.png")} />
                                    </Text>
                                    <Text style={styles.ModalHeadText}>
                                        数据更新
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ModalHeadImage}>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.Home} onPress={this.HISTORY.bind(this)}><Image source={require("../images/1_300.png")}></Image><Text style={styles.home1}>历史单据查询</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home}><Image source={require("../images/1_31.png")}></Image><Text style={styles.home2}>商品</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.SHOP.bind(this)}>
                        <View>
                            <Image source={require("../images/1_322.png")}>
                                {
                                    (this.state.shopcar==0)?
                                        null:
                                        <Text style={styles.ShopCar}>{this.state.shopcar}</Text>
                                }
                            </Image>
                        </View>
                        <Text style={styles.home1}>清单</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#f2f2f2",
    },
    login:{
        marginLeft:60,
        marginRight:60,
        marginTop:40,
        paddingTop:12,
        paddingBottom:12,
        backgroundColor:"#f47882",
        color:"#ffffff",
        borderRadius:3,
        textAlign:"center",
        fontSize:20,
    },
    header:{
        height:60,
        backgroundColor:"#ff4f4d",
        paddingTop:10,
    },
    cont:{
        flexDirection:"row",
        paddingLeft:16,
        paddingRight:16,
    },
    onclick:{
        marginLeft:18,
    },
    HeaderImage1:{
        marginRight:25,
        marginTop:5,
    },
    HeaderList:{
        flex:6,
        textAlign:"center",
        color:"#ffffff",
        fontSize:22,
        marginTop:2,
    },
    scrollview:{
        width:130,
        backgroundColor:"#ffffff",
        flex:2,
    },
    Active:{
        borderTopWidth:1,
        borderTopColor:"#f2f2f2",
        borderRightColor:"#f2f2f2",
        borderRightWidth:1,
    },
    click:{
        paddingTop:20,
        paddingBottom:20,
        overflow:"hidden",
        color:"#333333",
        textAlign:"center",
        fontSize:16,
    },
    clickes:{
        paddingTop:20,
        paddingBottom:20,
        overflow:"hidden",
        color:"#333333",
        textAlign:"center",
        fontSize:16,
        backgroundColor:"#f2f2f2"
    },
    RightList:{
        paddingLeft:15,
        paddingRight:15,
        flex:4,
        backgroundColor:"#ffffff",
    },
    RightList1:{
        flex:4,
    },
    ScrollView1:{
        flex:1,
        backgroundColor:"#ffffff",
        marginLeft:5,
    },
    ContList:{
        flex:22,
        flexDirection:"row",
    },
    Image:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:20,
    },
    Text:{
        textAlign:"center",
        marginTop:10,
        height:20,
        fontSize:14,
        color:"#333333"
    },
    AddNumber:{
        height:35,
    },
    addnumber:{
        height:20,
        position:'absolute',
        right:5,
        top:3,
    },
    Reduction1:{
        color:"red",
        position:'absolute',
        right:4,
        top:4,
        fontSize:14,
    },
    subtraction:{
        marginRight:10,
        marginTop:2
    },
    Subtraction:{
        position:'absolute',
        right:5,
        top:12,
        flexDirection:"row",
    },
    Reduction:{
        borderRadius:50,
        backgroundColor:"red",
        color:"#ffffff",
        textAlign:"center",
        lineHeight:11,
        width:15,
        height:15,
        lineHeight:12,
        fontSize:18
    },
    Number:{
        color:"red",
        marginRight:6,
    },
    Border:{
        borderRightWidth:1,
        borderRightColor:"#f2f2f2",
        flex:3,
        paddingBottom:35,
    },
    fontColorGray:{
        textAlign:"center"
    },
    nomore:{
        textAlign:"center",
        marginTop:20,
        marginBottom:10,
    },
    License:{
        flex:1,
        backgroundColor:"#333333",
        opacity:0.8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    LicenseConter:{
        width:280,
        backgroundColor:"#ffffff",
        borderRadius:5,
        paddingHorizontal:50,
        paddingVertical:20,
    },
    LicenseText:{
        fontSize:16,
        color:"#323232",
        marginLeft:40,
    },
    LicenseTextInput:{
        width:178,
        paddingTop:5,
        paddingBottom:5,
        marginTop:16,
        marginBottom:16,
        borderTopWidth:1,
        borderBottomWidth:1,
        borderRightWidth:1,
        borderLeftWidth:1,
        borderTopColor:"#cccccc",
        borderBottomColor:"#cccccc",
        borderLeftColor:"#cccccc",
        borderRightColor:"#cccccc",
    },
    Determine:{
        width:80,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:"#f47882",
        borderRadius:3,
        marginLeft:48
    },
    DetermineText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"center"
    },
    close:{
        width:40,
        height:40,
        position:"absolute",
        right:0,
        top:5
    },
    CloseText:{
        color:"#323232",
        fontSize:22
    },
    footer:{
        flex:3,
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
        paddingTop:7,
        backgroundColor:"#ffffff",
    },
    home1:{
        color:'#999999',
        fontSize:12,
        marginTop:5,
        flex:1,
    },
    home2:{
        color:'#ff4e4e',
        fontSize:12,
        marginTop:5,
        flex:1,
    },
    ShopCar:{
        color:"red",
        position:"absolute",
        right:-42,
    },
    modalStyle:{
        flex:1,
        backgroundColor:"#ffffff",
    },
    ModalTitle:{
        paddingTop:14,
        paddingBottom:14,
        paddingLeft:14,
        paddingRight:14,
        flexDirection:"row",
        backgroundColor:"#ff4e4f"
    },
    ModalLeft:{
        flex:1,
    },
    ModalLeft1:{
        width:2,
        marginTop:14,
    },
    ModalImage:{
        textAlign:"center"
    },
    ModalText:{
        marginTop:16,
        fontSize:20,
        color:"#ffffff",
        textAlign:"center"
    },
    ModalCont:{
        paddingTop:14,
        paddingBottom:14,
        paddingLeft:14,
        paddingRight:14,
    },
    ModalHead:{
        flexDirection:"row"
    },
    ModalHeadImage:{
        flex:1,
        paddingBottom:10,
    },
    ModalHeadImage1:{
        textAlign:"center",
        marginTop:10,
    },
    ModalHeadText:{
        textAlign:"center",
        fontSize:18,
        color:"#666666",
        marginTop:5,
    },
    ModalLine:{
        height:2,
    },
    ModalImageLine:{
        width:null,
    },
});