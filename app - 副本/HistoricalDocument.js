/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow1
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ToastAndroid,
  ListView,
  InteractionManager,
  ActivityIndicator
} from 'react-native';
import Index from "./Index";
import ShoppingCart from "./ShoppingCart";
import GoodsDetails from "./GoodsDetails";
import Enquiries from "./Enquiries";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
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
            shopcar:"",
            scode:"",
            show:false,
            animating:true,
            nomore:false,
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

  //不同页面传值
  _reloadView(startDate,endDate,formno,prodcode) {
    this._setModalVisible();
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
    this.dataRows=[];
    this._dpSearch()
  }

  componentDidMount(){
     InteractionManager.runAfterInteractions(() => {
        this._setModalVisible();
        this._get();
        this._dpSearch();
        this._fetch();
     });
  }
  _setModalVisible() {
      let isShow = this.state.show;
      this.setState({
          show:!isShow,
      });
  }
  _get(){
        Storage.get('Name').then((tags) => {
             this.setState({
                 name:tags
             })
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
  }
  _dpSearch(){

      //url获取
      Storage.get('LinkUrl').then((tags) => {
          this.setState({
              linkurl:tags
          })
      })

      //reqDetailCode获取
      Storage.get('history').then((tags) => {
          //alert(tags)
          this.setState({
              reqDetailCode: tags
          });
      });

     Storage.get('code').then((tags) => {

         Storage.get("usercode","").then((usercode)=>{
             Storage.get("username","").then((username)=>{
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
             sDateTime:Date.parse(new Date()),
             username:this.state.Username,
             usercode:this.state.Userpwd,
             BeginDate:this.state.kaishi1,
             EndDate:this.state.jieshu1,
             shopcode:tags,
             childshopcode:"0",
             formno:this.state.danzi1,
             prodcode:this.state.codesw1,
             Sign:NetUtils.MD5("App_PosReq" + "##" +this.state.reqDetailCode + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',
         };

         FetchUtils.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
            var DetailInfo1 = JSON.stringify(data.DetailInfo1)
            if(Detailnfo1 = null){
                this._setModalVisible();
            }
            this._setModalVisible();

            if(data.retcode == 1){
                var DetailInfo1 = data.DetailInfo1;
                this.dataRows = this.dataRows.concat(DetailInfo1);
                if(this.dataRows==0){
                    return;
                }else{
                    this.setState({
                       dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
                    })
                }
            }
         })
     });
  }

  _fetch(){
      dbAdapter.selectShopInfoAllCountm().then((rows)=>{
          var ShopCar = rows.item(0).countm;
          this.setState({
              shopcar:ShopCar
          });
      });
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
                      {
                          (this.state.name == "商品采购"||this.state.name == "商品验收"||this.state.name == "协配采购"||this.state.name == "协配收货") ?
                              <Text style={styles.List}>
                                  <Text style={styles.ListLeft}>供应商码：</Text>
                                  <Text style={styles.ListRight}>{rowData.storecode}</Text>
                              </Text> : null
                      }
                      {
                          (this.state.name == "协配采购"||this.state.name == "协配收货") ?
                              <Text style={styles.List}>
                                  <Text style={styles.ListLeft}>机构信息：</Text>
                                  <Text style={styles.ListRight}>{rowData.childshop}</Text>
                              </Text> : null
                      }
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
                      <Text style={styles.List}>
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
                <TouchableOpacity onPress={this.pressPush.bind(this)} style={styles.onclick}>
                    <Image source={require("../images/search1.png")} style={styles.HeaderImage}></Image>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.Rolling}>
            <ListView
                dataSource={this.state.dataSource}
                showsVerticalScrollIndicator={true}
                renderRow={this._renderRow.bind(this)}
            />
        </View>
        <View style={styles.footer}>
            <TouchableOpacity style={styles.Home} onPress={this.HISTORY.bind(this)}><Image source={require("../images/documents1.png")}></Image><Text style={styles.home2}>历史单据</Text></TouchableOpacity>
            <TouchableOpacity style={styles.Home} onPress={this.HOME.bind(this)}><Image source={require("../images/home.png")}></Image><Text style={styles.home1}>首页</Text></TouchableOpacity>
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
        <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.show}
        onShow={() => {}}
        onRequestClose={() => {}} >
            <View style={styles.loading}>
                <View style={styles.LoadCenter}>
                    <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
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
    backgroundColor:"#ffffff",
 },
 header:{
    height:50,
    backgroundColor:"#f47882",
    paddingTop:10,
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
 onclick:{
    width:30,
 },
 HeaderImage:{
    marginTop:5,
 },
 HeaderList:{
    marginTop:4,
    flex:6,
    textAlign:"center",
    color:"#ffffff",
    fontSize:18,
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
    paddingTop:10,
    paddingBottom:10,
 },
 List:{
    flexDirection:"row",
    fontSize:16,
 },
 ListLeft:{
    color:"#636363",
 },
 ListRight:{
    color:"#323232",
    lineHeight:28,
 },
 Rolling:{
    flex:12,
 },
 centering:{
    position:"absolute",
    top:50,
 },
 fontColorGray:{
    textAlign:"center"
 },
 footer:{
    flex:2,
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
 loading:{
    flex:1,
    backgroundColor:"#000000",
    opacity:0.5,
    justifyContent: 'center',
    alignItems: 'center',
 },
});