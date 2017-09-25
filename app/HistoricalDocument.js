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
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
  ListView
} from 'react-native';
import Index from "./Index";
import ShoppingCart from "./ShoppingCart";
import GoodsDetails from "./GoodsDetails";
import Enquiries from "./Enquiries";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
import Storage from "../utils/Storage";
let dbAdapter = new DBAdapter();
let db;
export default class HistoricalDocument extends Component {
  constructor(props){
        super(props);
        this.state = {
            shopcod:"",
            reqDetailCode:"",
            name:"",
            endDate:"",
            startDate:"",
            formno:"",
            prodcode:"",
            kaishi1:"",
            jieshu1:"",
            danzi1:"",
            codesw1:"",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
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
      this.props.navigator.push(nextRoute);
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
        component:Enquiries,
        params: {
          reloadView:(startDate,endDate,formno,prodcode)=>this._reloadView(startDate,endDate,formno,prodcode)
        }
    };
    this.props.navigator.push(nextRoute)
  }
  _reloadView(startDate,endDate,formno,prodcode) {
    kaishi = String(startDate);
    jieshu = String(endDate);
    danzi = String(formno);
    codesw = String(prodcode);
    this.setState({
        kaishi1:kaishi,
        jieshu1:jieshu,
        danzi1:danzi,
        codesw1:codesw,
    });
    this.removeHandler = (function() {
        _dpSearch()
    })
//    document.removeEventListener("mousedown",this._dpSearch(),true);
    Storage.get('code').then((tags) => {
         DataUtils.get("usercode","").then((usercode)=>{
              DataUtils.get("username","").then((username)=>{
                  let params = {
                      ClientCode: this.state.ClientCode,
                      username: this.state.Username,
                      usercode: this.state.Userpwd,
                  };
              });
         });
         let params = {
             reqCode:"App_PosReq",
             reqDetailCode:this.state.reqDetailCode,
             ClientCode:this.state.ClientCode,
             sDateTime:"2017-08-09 12:12:12",
             username:this.state.Username,
             usercode:this.state.Userpwd,
             BeginDate:this.state.kaishi1,
             EndDate:this.state.jieshu1,
             shopcode:tags,
             formno:this.state.danzi1,
             prodcode:this.state.codesw1,
             Sign:NetUtils.MD5("App_PosReq" + "##" +this.state.reqDetailCode + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',
         };
         FetchUtils.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
             if(data.retcode == 1){
                 var  DetailInfo1 = data.DetailInfo1;
                 this.dataRows = this.dataRows.concat(DetailInfo1);
                 this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                 })
             }else{
                ToastAndroid.show('网络请求失败', ToastAndroid.SHORT);
                alert(JSON.stringify(data))
             }
         })
    });
  }
  componentDidMount(){
     //获取功能名字
     Storage.get('Name').then((tags) => {
         this.setState({
             name: tags
         });
     });
     //reqDetailCode获取
     Storage.get('history').then((tags) => {
         this.setState({
             reqDetailCode: tags
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
     this._dpSearch();
  }
  GoodsDetails(rowData){
    this.props.navigator.push({
        component:GoodsDetails,
        params:{
            Formno:rowData.Formno,
            FormDate:rowData.FormDate,
            promemo:rowData.promemo,
        }
    })
//       alert(JSON.stringify(rowData.Formno))
  }
  _dpSearch(){
     Storage.get('code').then((tags) => {
         DataUtils.get("usercode","").then((usercode)=>{
              DataUtils.get("username","").then((username)=>{
                  let params = {
                      ClientCode: this.state.ClientCode,
                      username: this.state.Username,
                      usercode: this.state.Userpwd,
                  };
              });
         });
         let params = {
             reqCode:"App_PosReq",
             reqDetailCode:this.state.reqDetailCode,
             ClientCode:this.state.ClientCode,
             sDateTime:"2017-08-09 12:12:12",
             username:this.state.Username,
             usercode:this.state.Userpwd,
             BeginDate:this.state.startDate,
             EndDate:this.state.endDate,
             shopcode:tags,
             formno:this.state.formno,
             prodcode:this.state.prodcode,
             Sign:NetUtils.MD5("App_PosReq" + "##" +this.state.reqDetailCode + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',
         };
         FetchUtils.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
             if(data.retcode == 1){
                var  DetailInfo1 = data.DetailInfo1;
                this.dataRows = this.dataRows.concat(DetailInfo1);
                this.setState({
                   dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                })
             }else{
               ToastAndroid.show('网络请求失败', ToastAndroid.SHORT);
               alert(JSON.stringify(data))
             }
         })
     });
  }

 _renderRow(rowData, sectionID, rowID){
      return(
          <View style={styles.Cont}>
              <TouchableHighlight  onPress={()=>this.GoodsDetails(rowData)}>
                  <View style={styles.ContList}>
                      <Text style={styles.List}>
                          <Text style={styles.ListLeft}>要货单号：</Text>
                          <Text style={styles.ListRight}>{rowData.Formno}</Text>
                      </Text>
                      <Text style={styles.List}>
                          <Text style={styles.ListLeft}>制单日期：</Text>
                          <Text style={styles.ListRight}>{rowData.FormDate}</Text>
                      </Text>
                      <Text style={styles.List}>
                          <Text style={styles.ListLeft}>单据数量：</Text>
                          <Text style={styles.ListRight}>{rowData.countm}</Text>
                      </Text>
                      <Text style={styles.List}>
                           <Text style={styles.ListLeft}>单据金额：</Text>
                           <Text style={styles.ListRight}>{rowData.prototal}</Text>
                      </Text>
                      <Text style={styles.List} style={{marginBottom:15,}}>
                            <Text style={styles.ListLeft}>单据备注：</Text>
                            <Text style={styles.ListRight}>{rowData.promemo}</Text>
                       </Text>
                  </View>
              </TouchableHighlight>
          </View>
      )
 }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.cont}>
                <Text style={styles.HeaderList}>{this.state.name}</Text>
                <TouchableOpacity onPress={this.pressPush.bind(this)}>
                    <Image source={require("../images/search1.png")} style={styles.HeaderImage}></Image>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.Rolling}>
            <ScrollView>
                <ListView
                    dataSource={this.state.dataSource}
                    showsVerticalScrollIndicator={true}
                    renderRow={this._renderRow.bind(this)}
                />
            </ScrollView>
        </View>
        <View style={styles.footer}>
            <TouchableOpacity style={styles.Home} onPress={this.HISTORY.bind(this)}><Image source={require("../images/documents1.png")}></Image><Text style={styles.home2}>历史单据</Text></TouchableOpacity>
            <TouchableOpacity style={styles.Home} onPress={this.HOME.bind(this)}><Image source={require("../images/home.png")}></Image><Text style={styles.home1}>首页</Text></TouchableOpacity>
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
     borderTopColor:"#cacccb",
     backgroundColor:"#ffffff"
 },
 Home:{
    flex:1,
    alignItems: 'center',
    paddingTop:10,
    paddingBottom:10,
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
    backgroundColor:"#ffffff",
 },
 header:{
    height:60,
    backgroundColor:"#f47882",
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
    color:"#ffffff",
    fontSize:20,
 },
 Cont:{
    marginLeft:25,
    marginRight:25,
    paddingLeft:35,
    paddingRight:35,
    borderBottomWidth:1,
    borderBottomColor:"#e5e5e5"
 },
 ContList:{
    paddingTop:15,
 },
 List:{
    flexDirection:"row",
    fontSize:14,
 },
 ListLeft:{
    color:"#636363",
 },
 ListRight:{
    color:"#323232",
    lineHeight:28,
 },
 Rolling:{
    flex:1,
    marginBottom:55,
 }
});