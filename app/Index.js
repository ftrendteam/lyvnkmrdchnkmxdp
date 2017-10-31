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
    ActivityIndicator,
    InteractionManager
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
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
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
            show:false,
            Show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
            Number:"",
            pickedDate:"",
            pid:"",
            DepCode:"",
            head:"",
            shopcar:"",
            Counmnmber:"",
            Page:"",
            data:"",
            ShopNumber:"",
            depcode:this.props.DepCode ? this.props.DepCode : "",
            usercode:"",
            License:"",
            nomore: true,
            isloading:true,
        };
        this.dataRows = [];
        this.productData = [];
        this.moreTime = 0;
        var timer1 = null;
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
                var ShopCar = rows.item.ShopPrice
                alert(ShopCar);
                if(reminder==object){
                    alert("没有此商品");
                    return;
                }

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
                    }
                })
            })
        })
    }

    pullOut(){
        this._setModalVisible()
        var nextRoute={
            name:"主页",
            component:admin
        };
        this.props.navigator.push(nextRoute)
    }

    pressPop(){
        this._setModalVisible()
        this.props.navigator.pop();
    }

    _rightButtonClick() {
        console.log('右侧按钮点击了');
        this._setModalVisible();
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show:!isShow,
        });
    }

    Modal(){
        let isshow = this.state.Show;
        this.setState({
            Show:!isshow,
        });
    }

    //进入页面执行方法
    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
            Storage.get('Name').then((tags) => {
                this.setState({
                    head:tags
                })
            });
            this._fetch();
            this.function();
            // alert(lastDepCode)
            if(lastDepCode ==1){
                page= 1;
            }
        });
    }

    //获取左侧商品品类信息、商品总数、触发第一个列表
    _fetch(){
        dbAdapter.selectTDepSet('1').then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                this.dataRows.push(row);
                var ShopCar = rows.item(0).DepCode;
            }
            if (this.state.depcode == "") {
                this.setState({
                    depcode :ShopCar,
                })
                lastDepCode = this.state.depcode;
            }
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                isloading:true
            })
            //触发点击第一个列表
            let priductData=[];
            dbAdapter.selectProduct(this.state.depcode,page,1).then((rows)=>{
                // alert(lastDepCode);
                if(lastDepCode !==""){
                    page= 1;
                }
                for(let i =0;i<rows.length;i++){
                    var row = rows.item(i);
                    priductData.push(row);
                }
                total = this.state.Page;
                totalPage = total % 20 == 0 ? total / 20 : Math.floor(total / 20) + 1;
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
        return (
            <TouchableOpacity style={styles.Active} onPress={()=>this._pressRow(rowData)}>
                {
                    (rowData.ShopNumber==0)?
                        null:
                        <View style={styles.addnumber}>
                            <Text style={styles.Reduction1}>{rowData.ShopNumber}</Text>
                        </View>
                }
                <Text style={styles.Active1}>{rowData.DepName}</Text>
            </TouchableOpacity>
        );
    }

    //点击商品品类获取商品信息
    _pressRow(rowData){
        if(lastDepCode ==""){
            lastDepCode = rowData.DepCode;
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
            if(lastDepCode ==1){
                page= 1;
            }
            total = this.state.Page;
            totalPage = total % 20 == 0 ? total / 20 : Math.floor(total / 20) + 1;
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
        if(title ==null){
            alert("请选择单据");
        }else{
            this.props.navigator.push({
                component:OrderDetails,
                params:{
                    ProdName:item.item.ProdName,
                    ShopPrice:item.item.ShopPrice,
                    Pid:item.item.Pid,
                    countm:item.item.ShopNumber,
                    promemo:item.item.promemo,
                    prototal:item.item.prototal,
                    ProdCode:item.item.ProdCode,
                    DepCode:item.item.DepCode1,
                }
            })
        }
    }

    //功能授权
    function(){
        DataUtils.get('username').then((tags) => {
            this.setState({
                usercode:tags
            })

        });
    }

    //弹层关闭按钮
    Close(){
        this.Modal();
    }
    //授权号查询判断
    Determine(){
        dbAdapter.selectUserRight(this.state.License,"K0801").then((rows)=>{
            if(rows==true){
                this.Modal();
                this._setModalVisible();
                Storage.get('Name').then((tags) => {
                    if(tags=="要货单"){
                        this.setState({
                            head:tags
                        })
                    }else if(tags=="损益单"){
                        this.setState({
                            head:tags
                        })
                    }else if(tags=="实时盘点单"){
                        this.setState({
                            head:tags
                        })
                    }else{
                        this.save();
                    }
                });
            }else if(rows==false){
                alert("请输入正确的授权号")
            }
        })
    }

    //获取本地保存名字并跳转
    save(){
        Storage.get('invoice').then((tags) => {
            if(tags=="商品盘点"){
                var nextRoute={
                    name:"主页",
                    component:Query
                };
                this.props.navigator.push(nextRoute);
            }
            if(tags=="配送收货"){
                var nextRoute={
                    name:"主页",
                    component:Distrition
                };
                this.props.navigator.push(nextRoute);
            }
            if(tags=="商品采购"){
                var nextRoute={
                    name:"主页",
                    component:ProductCG
                };
                this.props.navigator.push(nextRoute);
            }
            if(tags=="商品验收"){
                var nextRoute={
                    name:"主页",
                    component:ProductYS
                };
                this.props.navigator.push(nextRoute);
            }
            if(tags=="协配采购"){
                var nextRoute={
                    name:"主页",
                    component:ProductXP
                };
                this.props.navigator.push(nextRoute);
            }
            if(tags=="协配收货"){
                var nextRoute={
                    name:"主页",
                    component:ProductSH
                };
                this.props.navigator.push(nextRoute);
            }
        });
    }
    //  功能分类
    Home(){
        dbAdapter.selectUserRight(this.state.usercode,"K0801").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save('Name','要货单');
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })

        //保存需要本地存储的值  第一个参数是自己定义的  第二个参数是要传的参数
        //下面那几个地方也是这种形式，把第二个参数改一些就行，点击的时候会自己覆盖以前的值
        Storage.save('valueOf','App_Client_ProYH');
        Storage.save('history','App_Client_ProYHQ');
        Storage.save('historyClass','App_Client_ProYHDetailQ');
    }
    Home1(){
        dbAdapter.selectUserRight(this.state.usercode,"K0604").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("Name","损益单");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })
        Storage.save('valueOf','App_Client_ProSY');
        Storage.save('history','App_Client_ProSYQ');
        Storage.save('historyClass','App_Client_ProSYDetailQ');
    }
    Query(){
        dbAdapter.selectUserRight(this.state.usercode,"K0611").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("Name","实时盘点单");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })
        Storage.save('valueOf','App_Client_ProCurrPC');
        Storage.save('history','App_Client_ProCurrPCQ');
        Storage.save('historyClass','App_Client_ProCurrPCDetailQ');
    }
    Query1(){
        Storage.delete("Name");
        dbAdapter.selectUserRight(this.state.usercode,"K0607").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("invoice","商品盘点");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })

    }
    Home2(){
        Storage.delete("Name");
        dbAdapter.selectUserRight(this.state.usercode,"K0802").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("invoice","配送收货");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })

    }
    Shopp(){
        Storage.delete("Name");
        dbAdapter.selectUserRight(this.state.usercode,"K0504").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("invoice","商品采购");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })
    }
    Shopp1(){
        Storage.delete("Name");
        dbAdapter.selectUserRight(this.state.usercode,"K0505").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("invoice","商品验收");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })
    }
    Shopp2(){
        Storage.delete("Name");
        dbAdapter.selectUserRight(this.state.usercode,"K0707").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("invoice","协配采购");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })
    }
    Shopp3(){
        Storage.delete("Name");
        dbAdapter.selectUserRight(this.state.usercode,"K0803").then((rows)=>{
            if(rows==true){
                dbAdapter.selecUserRightA1012(this.state.usercode).then((rows)=>{
                    if(rows==true){
                        Storage.save("invoice","协配收货");
                        this.Modal();
                    }
                })
            }else if(rows==false){
                alert("该店铺没有此权限");
                this._setModalVisible();
            }
        })
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
                            <Image source={require("../images/list.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>{this.state.head}</Text>
                        <TouchableOpacity onPress={this.Code.bind(this)} style={styles.onclick}>
                            <Image source={require("../images/sm.png")} style={styles.HeaderImage1}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.pressPush.bind(this)} style={styles.onclick}>
                            <Image source={require("../images/search.png")} style={styles.HeaderImage}></Image>
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
                        <View style={styles.ModalView}>
                            <View style={styles.ModalViewList}>
                                <TouchableOpacity style={styles.subView} onPress={this.Home.bind(this)}>
                                    <Text style={styles.titleText}>要货</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.subView} onPress={this.Home1.bind(this)}>
                                    <Text style={styles.titleText}>损益</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalViewList}>
                                <TouchableOpacity style={styles.subView} onPress={this.Query.bind(this)}>
                                    <Text style={styles.titleText}>实时盘点</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.subView} onPress={this.Query1.bind(this)}>
                                    <Text style={styles.titleText}>商品盘点</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalViewList}>
                                <TouchableOpacity style={styles.subView} onPress={this.Home2.bind(this)}>
                                    <Text style={styles.titleText}>配送收货</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.subView} onPress={this.Home3.bind(this)}>
                                    <Text style={styles.titleText}>数据更新</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalViewList}>
                                <TouchableOpacity style={styles.subView} onPress={this.Shopp.bind(this)}>
                                    <Text style={styles.titleText}>商品采购</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.subView} onPress={this.Shopp1.bind(this)}>
                                    <Text style={styles.titleText}>商品验收</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalViewList}>
                                <TouchableOpacity style={styles.subView} onPress={this.Shopp2.bind(this)}>
                                    <Text style={styles.titleText}>协配采购</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.subView} onPress={this.Shopp3.bind(this)}>
                                    <Text style={styles.titleText}>协配收货</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.ModalViewList1}>
                                <TouchableOpacity  style={styles.subView1} onPress={this.pullOut.bind(this)}>
                                    <Text style={styles.titleText1}>退出账号</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.ModalLeft}
                            onPress={this._setModalVisible.bind(this)}>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.Show}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <View style={styles.License}>
                        <View style={styles.LicenseConter}>
                            <TouchableOpacity style={styles.close} onPress={this.Close.bind(this)}>
                                <Text style={styles.CloseText}>×</Text>
                            </TouchableOpacity>
                            <Text style={styles.LicenseText}>请输入授权号</Text>
                            <TextInput
                                style={styles.LicenseTextInput}
                                autofocus="{true}"
                                numberoflines="{1}"
                                keyboardType="numeric"
                                placeholder="请输入授权号"
                                underlineColorAndroid='transparent'
                                placeholderTextColor="#bcbdc1"
                                onChangeText={(value)=>{
                                    this.setState({
                                        License:value
                                    })
                                }}
                            />
                            <TouchableOpacity style={styles.Determine} onPress={this.Determine.bind(this)}>
                                <Text style={styles.DetermineText}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.Home} onPress={this.HISTORY.bind(this)}><Image source={require("../images/documents.png")}></Image><Text style={styles.home1}>历史单据</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.HOME.bind(this)}><Image source={require("../images/home1.png")}></Image><Text style={styles.home2}>首页</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.SHOP.bind(this)}>
                        <View>
                            <Image source={require("../images/shop.png")}>
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
    }
}
const styles = StyleSheet.create({
    footer:{
        flex:3,
        flexDirection:"row",
        borderTopWidth:1,
        borderTopColor:"#cacccb"
    },
    source:{
        flexDirection:"row",
        flex:1,
    },
    Home:{
        flex:1,
        alignItems: 'center',
        paddingTop:15,
        backgroundColor:"#ffffff",
    },
    home1:{
        color:'black',
        fontSize:18,
        marginTop:5,
        flex:1,
    },
    home2:{
        color:'#f47882',
        fontSize:18,
        marginTop:5,
        flex:1,
    },
    ShopCar:{
        color:"red",
        position:"absolute",
        right:-42,
    },
    container:{
        flex:1,
        backgroundColor:"#f1f5f6",
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
        height:50,
        backgroundColor:"#ffffff",
        paddingTop:10,
        borderBottomWidth:1,
        borderBottomColor:"#cacccb"
    },
    cont:{
        flexDirection:"row",
        marginLeft:25,
    },
    onclick:{
        width:50,
    },
    HeaderImage1:{
        marginRight:25,
        marginTop:5,
    },
    HeaderImage:{
        marginTop:5,
    },
    HeaderList:{
        flex:6,
        textAlign:"center",
        color:"#323232",
        fontSize:18,
        marginTop:3,
    },
    scrollview:{
        width:130,
        backgroundColor:"#ffffff",
        flex:2,
    },
    Active:{
        borderTopWidth:1,
        borderTopColor:"#e5e5e5",
    },
    Active1:{
        paddingTop:20,
        paddingBottom:20,
        height:62,
        color:"#323232",
        textAlign:"center",
        fontSize:16,
        overflow:"hidden"
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
        marginLeft:10,
        marginRight:10,
    },
    ContList:{
        flex:17,
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
        height:23,
        fontSize:16,
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
        borderRightColor:"#f5f5f5",
        flex:3,
        paddingBottom:35,
    },
    modalStyle: {
        flex:1,
        flexDirection:"row",
    },
    ModalLeft:{
        backgroundColor:"#000000",
        flex:2,
        opacity:0.6,
        marginTop:50,
    },
    buttonText1:{
        opacity:0.1
    },
    ModalView:{
        flex:6,
        backgroundColor:'#f1f5f6',
        marginTop:50,
    },
    subView:{
        flex:2,
        height:100,
        borderRightWidth:1,
        borderRightColor:"#e5e5e5",
    },
    ModalViewList:{
        height:100,
        flexDirection:"row",
        borderBottomWidth:1,
        borderBottomColor:"#cccccc",
    },
    ModalViewList1:{
        flexDirection:"row",
        marginTop:20,
    },
    subView1:{
        flex:1,
        marginLeft:35,
        marginRight:35,
        backgroundColor:"#f47882",
        paddingTop:8,
        paddingBottom:8,
        borderRadius:3,
    },
    titleText:{
        flex:1,
        textAlign:"center",
        paddingTop:40,
        fontSize:18,
    },
    titleText1:{
        color:"#ffffff",
        textAlign:"center",
        fontSize:16,
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
        marginLeft:44,
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
    }
});