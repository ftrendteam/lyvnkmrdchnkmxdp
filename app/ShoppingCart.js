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
    Modal,
    ListView,
    TextInput,
    Navigator,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    TouchableHighlight,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';

import Index from "./Index";
import HistoricalDocument from "./HistoricalDocument";
import Code from "./Code";
import Search from "./Search1";
import OrderDetails from "./OrderDetails3";
import Query from "./Query";
import Distrition from "./Distrition";
import ProductCG from "./ProductCG";
import ProductYS from "./ProductYS";
import ProductXP from "./ProductXP";
import ProductSH from "./ProductSH";
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";
import SideMenu from 'react-native-side-menu';

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
            BeiZhu:"暂无备注",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        };
        this.dataRows = [];
    }

    //自动跑接口
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            //this._ModalVisible();
            this._dpSearch();
            this._fetch();
            this.Storage();
        });
    }

    _dpSearch(){
        //取出保存本地的数据  'valueOf'是保存的时候自己定义的参数   tags就是保存的那个值
        //在一进来页面就取出来，就不会出现第一次点击为 空值
        Storage.get('valueOf').then((tags) => {
            this.setState({
                reqDetailCode: tags
            })
        });

        Storage.get('procode').then((tags) => {
            this.setState({
                procode: tags
            });
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
        dbAdapter.selectShopInfo().then((rows)=>{
            //this._ModalVisible();
            var shopnumber = 0;
            var shopAmount = 0;
            this.dataRows=[];
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                var number = row.countm;
                shopAmount += parseInt(row.prototal);
                shopnumber += parseInt(row.countm);
                if(number!==0){
                    this.dataRows.push(row);
                }
            }
            if(this.dataRows==0){
                this.modal();
                return;
            }else{
                this.setState({
                    number1:number,
                    ShopNumber:shopnumber,//数量
                    ShopAmount:shopAmount,//总金额
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                })
                this.modal();
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

    _fetch(){
        //查询shopInfo表中所有商品的数量总和
        dbAdapter.selectShopInfoAllCountm().then((rows)=>{
            var ShopCar = rows.item(0).countm;
            this.setState({
                shopcar:ShopCar
            });
        });
    }

    _renderRow(rowData, sectionID, rowID){
        return (
            <TouchableOpacity style={styles.ShopList} onPress={()=>this.OrderDetails(rowData)}>
                <View style={styles.ShopTop}>
                    <Text style={[styles.Name,styles.Name1]}>{rowData.prodname}</Text>
                    <Text style={[styles.Number,styles.Name1]}>{rowData.countm}.00 (件)</Text>
                    <Text style={[styles.Price,styles.Name1]}>{rowData.ShopPrice}</Text>
                    <Text style={[styles.SmallScale,styles.Name1]}>{rowData.prototal}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    History(){
        var nextRoute={
            name:"主页",
            component:HistoricalDocument
        };
        this.props.navigator.push(nextRoute)
    }

    Shop(){
        var nextRoute={
            name:"主页",
            component:Index
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

    //扫描商品
    Code(){
        RNScannerAndroid.openScanner();
        DeviceEventEmitter.addListener("code", (reminder) => {
            var number = "279001501234012341";
            decodepreprint.init(reminder,dbAdapter);

            if(reminder.length==18&&decodepreprint.deCodePreFlag()){
                decodepreprint.deCodeProdCode().then((datas)=>{
                    dbAdapter.selectProdCode(datas,1).then((rows)=>{
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
                        alert(this.state.LinkUrl)
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
                                ProdCode:datas,
                                OrgFormno:this.state.OrgFormno,
                                FormType:this.state.FormType,
                            };
                            FetchUtil.post(this.state.LinkUrl,JSON.stringify(params)).then((data)=>{
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
                    })
                });

            }else{
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
                            FetchUtils.post(this.state.LinkUrl,JSON.stringify(params)).then((data)=>{
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
            }

        })
    }

    //点击商品列表跳转到修改商品数量页面
    OrderDetails(rowData, sectionID, rowID){
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
        Storage.get('userName').then((tags)=>{
            let params = {
                reqCode:"App_PosReq",
                reqDetailCode:"App_Client_CurrProdQry",
                ClientCode:this.state.ClientCode,
                sDateTime:Date.parse(new Date()),
                Sign:NetUtils.MD5("App_PosReq" + "##" +"App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                username:tags,
                usercode:this.state.Usercode,
                SuppCode:rowData.SuppCode,
                ShopCode:this.state.ShopCode,
                ChildShopCode:this.state.ChildShopCode,
                ProdCode:rowData.ProdCode,
                OrgFormno:this.state.OrgFormno,
                FormType:this.state.FormType,
            };
            FetchUtils.post(this.state.LinkUrl,JSON.stringify(params)).then((data)=>{
                var countm=JSON.stringify(data.countm);
                var ShopPrice=JSON.stringify(data.ShopPrice);
                if(data.retcode == 1){
                    // if(data.isFond==1){
                    this.props.navigator.push({
                        component:OrderDetails,
                        params:{
                            ProdName:rowData.prodname,
                            ShopPrice:rowData.ShopPrice,
                            countm:rowData.countm,
                            Pid:rowData.pid,
                            ProdCode:rowData.ProdCode,
                            DepCode:rowData.DepCode,
                            ydcountm:countm,
                        }
                    })
                }
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

    //提交
    submit(){
        this.screen = [];

        this.Wait();

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

        if(this.dataRows==0){
            alert("请添加商品")
        }else{
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
                    let params = {
                        reqCode: "App_PosReq",
                        reqDetailCode: this.state.reqDetailCode,
                        ClientCode: this.state.ClientCode,
                        sDateTime: "2017-08-09 12:12:12",
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
                            "pdgFormno":this.state.ProYH+this.state.Date
                        },
                        DetailInfo2: this.dataRows,
                    };
                    FetchUtils.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                        if(data.retcode == 1){
                            if(this.state.Screen=="1"||this.state.Screen=="2"){
                                var DetailInfo2=params.DetailInfo2;
                                for(let i =0;i<DetailInfo2.length;i++){
                                    let detail = DetailInfo2[i];
                                    let ydcountm = detail.ydcountm;
                                    let countm = detail.countm;
                                    if(ydcountm!==countm){
                                        this.screen.push(detail);
                                    }
                                };
                                this.setState({
                                    dataSource:this.state.dataSource.cloneWithRows(this.screen),
                                })
                                if(scode==null){
                                    this.Wait();
                                    this.Succeed();
                                }else if(this.screen==""){
                                    this.Wait();
                                    this.Succeed();

                                }else{
                                    this.Wait();
                                    this.ScreenBod();
                                }
                            }else{
                                this.Wait();
                                this.Succeed();
                            }
                        }else{
                            // alert(JSON.stringify(data))
                        }
                    })
                })
            })
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

        if (this.dataRows == 0) {
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
                            "pdgFormno": this.state.ProYH + this.state.Date
                        },
                        DetailInfo2: this.dataRows,
                    };
                    FetchUtils.post(this.state.linkurl, JSON.stringify(params)).then((data) => {
                        if (data.retcode == 1) {
                            this.ScreenBod();
                            this.Succeed();
                        } else {
                            // alert("提交失败");
                            alert(JSON.stringify(data))
                        }
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
        if(this.dataRows==0){
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
        this.Succeed();
        this.DataSource();
    }

    //提交时各单据判断
    DeterMine(){
        Storage.get('Document').then((tags)=>{
            if(tags=="商品盘点"){
                this.Succeed();
                var nextRoute={
                    name:"Query",
                    component:Query
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="配送收货"){
                this.Succeed();
                var nextRoute={
                    name:"Distrition",
                    component:Distrition
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="商品采购"){
                this.Succeed();
                var nextRoute={
                    name:"ProductCG",
                    component:ProductCG
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="商品验收"){
                this.Succeed();
                var nextRoute={
                    name:"ProductYS",
                    component:ProductYS
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="协配采购"){
                this.Succeed();
                var nextRoute={
                    name:"ProductXP",
                    component:ProductXP
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="协配收货"){
                this.Succeed();
                var nextRoute={
                    name:"ProductSH",
                    component:ProductSH
                };
                this.props.navigator.push(nextRoute);
                this.DataSource();
            }
            if(tags=="要货单"||tags=="损溢单"||tags=="实时盘点单"){
                this.DataSource();
                this.Succeed();
            }

        })
    }

    //提交时清空数据及更新setState
    DataSource(){
        dbAdapter.deleteData("shopInfo");
        this.dataRows=[];
        var price="";
        var date = new Date();
        var data=JSON.stringify(date.getTime());
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
            ShopNumber:price,
            ShopAmount:price,
            shopcar:"",
            active:data,
            // BeiZhu:"暂无备注",
        })
        Storage.save('Date',this.state.active);
    }

    //提交商品等待框
    Wait(){
        let isShow = this.state.Wait;
        this.setState({
            Wait:!isShow,
        });
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
                        <Text style={styles.Number}>数量</Text>
                        <Text style={styles.Price}>单价</Text>
                        <Text style={styles.SmallScale}>小计</Text>
                    </View>
                    <View>
                        <ListView
                            dataSource={this.state.dataSource}
                            showsVerticalScrollIndicator={true}
                            renderRow={this._renderRow.bind(this)}
                        />
                    </View>
                </View>
                <View style={styles.viewStyle}>
                    <View style={styles.Combined}>
                        <Text style={styles.CombinedText}>合计：</Text>
                    </View>
                    <View style={styles.Client}>
                        <Text style={styles.ClientText}>
                            <Text style={[styles.ClientText,styles.ClientType]}>货品：</Text>
                            <Text style={styles.ClientType}>{this.state.ShopNumber}</Text>
                        </Text>
                        <Text style={styles.ClientText}>
                            <Text style={[styles.ClientText,styles.ClientType]}>总价：</Text>
                            <Text style={styles.Price1}>{this.state.ShopAmount}</Text>
                        </Text>

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
                                placeholder="暂无备注"
                                placeholderTextColor="#333333"
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
                    <TouchableOpacity style={styles.Home} onPress={this.History.bind(this)}><Image source={require("../images/1_300.png")}></Image><Text style={styles.home3}>历史单据查询</Text></TouchableOpacity>
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
                            />
                        </View>
                        <View style={styles.Determine}>
                            <TouchableOpacity style={styles.Cancel} onPress={this.ScreenBod.bind(this)}>
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
    Name:{
        flex:2,
        fontSize:18,
        color:"#333333",
    },
    Number:{
        flex:1,
        textAlign:"right",
        fontSize:18,
        color:"#333333",
    },
    Price:{
        flex:1,
        textAlign:"right",
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
        paddingLeft:25,
        paddingRight:25,
        height:65,
        paddingTop:18,
        paddingBottom:18,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2"
    },
    ShopTop:{
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
        height:48,
        paddingTop:15,
    },
    Goods:{
        flexDirection:"row",
    },
    Note:{
        flexDirection:"row",
    },
    Combined:{
        height:48,
        paddingTop:15
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
    DanJU:{
        flex:5,
        flexDirection:"row",
    },
    DocumentsNote:{
        width:95,
        marginTop:14,
    },
    Documentsnote:{
        fontSize:16,
        color:"#666666"
    },
    DocumentsNote1:{
        flex:4,
        color:"#666666"
    },
    Submit:{
        backgroundColor:"#ff4e4e",
        paddingTop:15,
        paddingBottom:15,
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
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
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
        height:150,
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
        height:53,
        overflow:"hidden",
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
        height:30,
        overflow:"hidden"
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
        bottom:40,
        paddingTop:15,
        paddingBottom:15,
        borderRadius:25,
        width:400,
        backgroundColor:"#ff4e4e",
    },
    DeterMineText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"center"
    },
});