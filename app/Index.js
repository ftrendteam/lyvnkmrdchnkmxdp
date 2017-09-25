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
  FlatList
} from 'react-native';
import HistoricalDocument from "./HistoricalDocument";
import ShoppingCart from "./ShoppingCart";
import Code from "./Code";
import admin from "./admin";
import OrderDetails from "./OrderDetails";
import Search from "./Search";
import list from "./HomeLeftList";
import Query from "./Query";
import Distrition from "./Distrition";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
import Storage from '../utils/Storage';
import SideMenu from 'react-native-side-menu';
//第二页面
let dbAdapter = new DBAdapter();
let db;
export default class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            show:false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
            Number:"",
            pickedDate:"",
            pid:"",
            head:"",
        };
        this.dataRows = [];
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
        var nextRoute={
            name:"主页",
            component:Code
        };
        this.props.navigator.push(nextRoute)
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
    //左侧品级
    componentDidMount(){
        dbAdapter.selectTDepSet('1').then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                this.dataRows.push(row);
            }
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
            })
        });
        //触发点击第一个列表
        let priductData=[];
        dbAdapter.selectProduct('1').then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                priductData.push(row);
            }
            this.setState({
                data:priductData,
            })
        });
        //获取商品信息
        dbAdapter.selectShopInfo("1").then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                var value = row.ShopNumber;
            }
            this.setState({
                Number:value,
            })
        });
//        var head=this.state.head;
//        if(head == ""){
//            alert(123)
//            }else{
//            this.OrderDetails();
//         }
    }
    _renderRow(rowData, sectionID, rowID){
         return (
            <TouchableOpacity style={styles.Active} onPress={()=>this._pressRow(rowData)}>
                <View style={styles.addnumber}>
                    <Text style={styles.Reduction1}>{rowData.ShopNumber}</Text>
                </View>
                <Text style={styles.Active1}>{rowData.DepName}</Text>
            </TouchableOpacity>
         );
    }
 //右侧商品信息
    _pressRow(rowData){
        let priductData=[];
        dbAdapter.selectProduct(rowData.DepCode).then((rows)=>{
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                priductData.push(row);
            }
             this.setState({
                 data:priductData,
             })
        });
    }
    _renderItem(item,index){
        return(
            <View style={styles.Border}>
                <View style={styles.AddNumber}>
                    <TouchableOpacity style={styles.Subtraction} >
                        <Text style={styles.Number}>{item.item.ShopNumber}</Text>
                        <View style={styles.subtraction}><Text style={styles.Reduction}>-</Text></View>
                    </TouchableOpacity>
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
    _separator = () => {
        return <View style={{height:1,backgroundColor:'#f5f5f5'}}/>;
    }
    _createEmptyView() {
        return (
            <Text style={{fontSize: 16, alignSelf: 'center',marginTop:10}}>商品更新中...</Text>
        );
    }
    OrderDetails(item){
        this.props.navigator.push({
            component:OrderDetails,
            params:{
                ProdCode:item.item.ProdCode,
                ProdName:item.item.ProdName,
                StdPrice:item.item.StdPrice,
                Pid:item.item.Pid,
                ShopNumber:item.item.ShopNumber,
                ShopRemark:item.item.ShopRemark,
                ShopAmount:item.item.ShopAmount
            }
        })
//        alert(JSON.stringify(item.item.ShopNumber))
    }

//  分类
    Home(){
        var abc = "要货单";
        this.setState({
            head:abc,
        });
        this._setModalVisible();
        //保存需要本地存储的值  第一个参数是自己定义的  第二个参数是要传的参数
        //下面那几个地方也是这种形式，把第二个参数改一些就行，点击的时候会自己覆盖以前的值
        Storage.save('Name','要货单');
        Storage.save('valueOf','App_Client_ProYH');
        Storage.save('history','App_Client_ProYHQ');
        Storage.save('historyClass','App_Client_ProYHDetailQ');
    }
    Home1(){
        var abc="损益单";
        this.setState({
            head:abc,
        });
        this._setModalVisible();
        Storage.save('Name','损益单');
        Storage.save('valueOf','App_Client_ProSY');
        Storage.save('history','App_Client_ProSYQ');
        Storage.save('historyClass','App_Client_ProSYDetailQ');
    }
    Query(){
        var abc="实时盘点单";
        this.setState({
            head:abc,
        });
        this._setModalVisible();
        Storage.save('Name','实时盘点单');
        Storage.save('valueOf','App_Client_ProCurrPC');
        Storage.save('history','App_Client_ProCurrPCQ');
        Storage.save('historyClass','App_Client_ProCurrPCDetailQ');
    }
    Query1(){
        var abc="商品盘点单";
        this.setState({
            head:abc,
        });
        this._setModalVisible();

        var nextRoute={
            name:"主页",
            component:Query
        };
        this.props.navigator.push(nextRoute);
    }
    Home2(){
        var abc="配送收货单";
        this.setState({
            head:abc,
        });
        this._setModalVisible();

        var nextRoute={
            name:"主页",
            component:Distrition
        };
        this.props.navigator.push(nextRoute);
    }
    Home3(){
        this._setModalVisible();
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
                          <TouchableOpacity onPress={this.Code.bind(this)}>
                            <Image source={require("../images/sm.png")} style={styles.HeaderImage1}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={this.pressPush.bind(this)}>
                            <Image source={require("../images/search.png")} style={styles.HeaderImage}></Image>
                          </TouchableOpacity>
                      </View>
                  </View>
                  <View style={styles.ContList}>
                      <ScrollView style={styles.scrollview}>
                          <ListView
                            style={styles.listViewStyle}
                            dataSource={this.state.dataSource}
                            showsVerticalScrollIndicator={true}
                            renderRow={this._renderRow.bind(this)}
                          />
                      </ScrollView>
                      <View style={styles.RightList1}>
                          <ScrollView style={styles.ScrollView1}>
                               <FlatList
                                    numColumns={3}
                                    key={item => item.Pid}
                                    renderItem={this._renderItem.bind(this)}
                                    ItemSeparatorComponent={this._separator.bind(this)}
                                    ListEmptyComponent={this._createEmptyView()}
                                    data={data}
                               />
                          </ScrollView>
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
                  <View style={styles.footer}>
                      <TouchableOpacity style={styles.Home} onPress={this.HISTORY.bind(this)}><Image source={require("../images/documents.png")}></Image><Text style={styles.home1}>历史单据</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.Home} onPress={this.HOME.bind(this)}><Image source={require("../images/home1.png")}></Image><Text style={styles.home2}>首页</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.Home} onPress={this.SHOP.bind(this)}><Image source={require("../images/shop.png")}></Image><Text style={styles.home1}>清单</Text></TouchableOpacity>
                  </View>
              </View>

        );
    }
}
const styles = StyleSheet.create({
  footer:{
      position:"absolute",
      bottom:0,
      flex:1,
      flexDirection:"row",
      borderTopWidth:1,
      borderTopColor:"#cacccb"
  },
  Home:{
      flex:1,
      alignItems: 'center',
      paddingTop:10,
      paddingBottom:14,
  },
  home1:{
      color:'black',
      fontSize:16,
      marginTop:5,
  },
  home2:{
      color:'#f47882',
      fontSize:16,
      marginTop:5,
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
      fontSize:18,
  },
  header:{
    height:60,
    backgroundColor:"#ffffff",
    paddingTop:15,
    paddingBottom:20,
    borderBottomWidth:1,
    borderBottomColor:"#cacccb"
  },
  cont:{
    flexDirection:"row",
    marginLeft:25,
    marginRight:25,
  },
  HeaderImage1:{
    marginRight:25,
    marginTop:5
  },
  HeaderImage:{
    marginTop:5
  },
  HeaderList:{
    flex:6,
    textAlign:"center",
    color:"#323232",
    fontSize:20,
  },
  scrollview:{
    width:130,
    backgroundColor:"#ffffff",
    flex:2,
  },
  scrollText:{
    borderBottomWidth:1,
    borderBottomColor:"#e5e5e5",
    height:80,
    color:"#323232",
    textAlign:"center",
    lineHeight:45,
    fontSize:16,
  },
  Active:{
      borderBottomWidth:1,
      borderBottomColor:"#e5e5e5",
  },
  Active1:{
    height:80,
    color:"#323232",
    textAlign:"center",
    lineHeight:45,
    fontSize:16,
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
    flexDirection:"row",
    marginBottom:55,
  },
  RightCont:{
    height:125,
    borderBottomWidth:1,
    borderBottomColor:"#e5e5e5",
    flex:3,
  },
  RightCont1:{
    height:125,
    borderBottomWidth:1,
    borderBottomColor:"#e5e5e5",
    flex:1,
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
  },
  AddNumber:{
    height:15,
  },
  addnumber:{
    height:20,
    position:'absolute',
    right:10,
    top:6,
  },
  Reduction1:{
    color:"red",
    position:'absolute',
    right:4,
    top:4,
    fontSize:10,
  },
  subtraction:{
    marginRight:10,
    marginTop:2
  },
  Subtraction:{
    position:'absolute',
    right:0,
    top:4,
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
    fontSize:16
  },
  Number:{
    color:"red",
    marginRight:6,
  },
  Border:{
    borderRightWidth:1,
    borderRightColor:"#f5f5f5",
    flex:3,
    paddingBottom:10,
    paddingTop:5,
  },
  modalStyle: {
     flex:1,
     flexDirection:"row",
  },
  ModalLeft:{
    backgroundColor:"#000000",
    flex:2,
    opacity:0.6,
    marginTop:60,
  },
  buttonText1:{
    opacity:0.1
  },
  ModalView:{
    flex:6,
    backgroundColor:'#f1f5f6',
    marginTop:60,
  },
  subView:{
    flex:2,
    height:150,
    borderRightWidth:1,
    borderRightColor:"#e5e5e5",
  },
  ModalViewList:{
    height:150,
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor:"#cccccc",
  },
  ModalViewList1:{
    flexDirection:"row",
    height:50,
    marginTop:15,
  },
  subView1:{
    flex:1,
    marginLeft:35,
    marginRight:35,
    backgroundColor:"#f47882",
    paddingTop:6,
    paddingBottom:6,
    borderRadius:3,
  },
  titleText:{
    flex:1,
    textAlign:"center",
    paddingTop:52,
    fontSize:16,
  },
  titleText1:{
    color:"#ffffff",
    lineHeight:26,
    textAlign:"center"
  }
});