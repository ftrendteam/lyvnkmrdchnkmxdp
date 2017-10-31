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
  TouchableOpacity,
  Image,
  ScrollView,
  ListView,
  ToastAndroid
} from 'react-native';
import HistoricalDocument from "./HistoricalDocument";
import FetchUtils from "../utils/FetchUtils";
import NetUtils from "../utils/NetUtils";
import DBAdapter from "../adapter/DBAdapter";
import DataUtils from '../utils/DataUtils';
import Storage from "../utils/Storage";
export default class GoodsDetails extends Component {
    constructor(props){
          super(props);
          this.state = {
             reqDetailCode:"",
             ShopCountm:"",
             Number:"",
             dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
             Formno:this.props.Formno ? this.props.Formno : "",
             FormDate:this.props.FormDate ? this.props.FormDate : "",
             promemo:this.props.promemo ? this.props.promemo : "",
          };
          this.dataRows = [];
    }

    componentDidMount(){
         //reqDetailCode获取
          Storage.get('historyClass').then((tags) => {
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
                 reqCode:'App_PosReq',
                 reqDetailCode:this.state.reqDetailCode,
                 ClientCode:this.state.ClientCode,
                 sDateTime:"2017-08-09 12:12:12",
                 Sign:NetUtils.MD5("App_PosReq" + "##" +this.state.reqDetailCode + "##" + "2017-08-09 12:12:12" + "##" + "PosControlCs")+'',
                 username:this.state.Username,
                 usercode:this.state.Userpwd,
                 BeginDate:"",
                 EndDate:"",
                 shopcode:tags,
                 formno:this.state.Formno,
                 prodcode:"",
             };
             FetchUtils.post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',JSON.stringify(params)).then((data)=>{
                 if(data.retcode == 1){
                    var DetailInfo2 = data.DetailInfo2;
                      var shopnumber = 0;
                    for(let i =0;i<DetailInfo2.length;i++){
                       var row = DetailInfo2[i];
                       var number = row.countm;
                       shopnumber += parseInt(row.countm);
                    }
                    this.dataRows = this.dataRows.concat(DetailInfo2);
                    this.setState({
                       dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                       Number:shopnumber
                   })
                 }else{
                   ToastAndroid.show('网络请求失败', ToastAndroid.SHORT);
                 }
             })
         })
    }

    GoodsDetails(){
          this.props.navigator.pop();
    }

   _renderRow(rowData, sectionID, rowID){
        return (
            <View style={styles.ShopList1}>
                <Text style={styles.Name1}>{rowData.prodname}</Text>
                <Text style={styles.ShopPrice1}>{rowData.prototal}</Text>
                <Text style={styles.ShopNumber1}>{rowData.countm}件</Text>
            </View>
        );
   }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Title}>
            <TouchableOpacity onPress={this.GoodsDetails.bind(this)} style={styles.HeaderImage}>
                 <Image source={require("../images/left.png")}></Image>
            </TouchableOpacity>
            <Text style={styles.Text}>{this.state.Formno}</Text>
        </View>
        <View style={styles.Cont}>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>盘点仓库</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>系统默认仓库</Text>
                </View>
                <View style={styles.ListRight}>
                    <Text style={styles.ListText}>货品数：</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>{this.state.Number}</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>单据备注</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>{this.state.promemo}</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>制单日期</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>{this.state.FormDate}</Text>
                </View>
            </View>
        </View>
        <View style={styles.ShopCont}>
            <View style={styles.ShopList}>
                <Text style={styles.Name}>名称</Text>
                <Text style={styles.ShopPrice}>金额</Text>
                <Text style={styles.ShopNumber}>数量</Text>
            </View>
            <ListView
            style={styles.listViewStyle}
            dataSource={this.state.dataSource}
            showsVerticalScrollIndicator={true}
            renderRow={this._renderRow.bind(this)}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
   Title:{
      height:60,
      backgroundColor:"#f47882",
      paddingLeft:25,
      paddingRight:25,
      paddingTop:13,
      flexDirection:"row",
      borderBottomWidth:2,
      borderBottomColor:"#e36871",
   },
   HeaderImage:{
      width:30,
      height:26,
      marginTop:5,
   },
   Text:{
      flex:8,
      textAlign:"center",
      fontSize:18,
      color:"#ffffff"
   },
   Cont:{
    paddingLeft:25,
    paddingRight:25,
    paddingTop:15,
    backgroundColor:"#f47882"
   },
   List:{
    marginBottom:15,
    flexDirection:"row",
   },
   ListText:{
    fontSize:16,
    color:"#ffffff"
   },
   ListLeft:{
    flexDirection:"row",
   },
   write:{
    width:10,
   },
   ListRight:{
    position:"absolute",
    right:0,
    flexDirection:"row",
   },
   ShopList:{
    paddingLeft:25,
    paddingRight:25,
    height:60,
    backgroundColor:"#fafafa",
    flexDirection:"row",
   },
   Name:{
    flex:1,
    color:"#333333",
    fontSize:18,
    lineHeight:36,
   },
   ShopPrice:{
    flex:1,
    color:"#333333",
    fontSize:18,
    lineHeight:36,
    textAlign:"center"
   },
   ShopNumber:{
    flex:1,
    color:"#333333",
    fontSize:18,
    lineHeight:36,
    textAlign:"right"
   },
   ShopList1:{
    paddingLeft:25,
    paddingRight:25,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:"#ffffff",
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor:"#fafafa",
    overflow:"hidden"
   },
   Name1:{
    flex:1,
    color:"#333333",
    fontSize:16,
    overflow:"hidden"
   },
   ShopPrice1:{
    flex:1,
    color:"#333333",
    fontSize:16,
    textAlign:"center"
   },
   ShopNumber1:{
    flex:1,
    color:"#333333",
    fontSize:16,
    textAlign:"right"
   },
   ContList:{
   paddingBottom:50,
   },
   listViewStyle:{
    marginBottom:260,
   }
});