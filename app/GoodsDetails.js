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
  ListView,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';

import HistoricalDocument from "./HistoricalDocument";
import FetchUtils from "../utils/FetchUtils";
import NetUtils from "../utils/NetUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";

export default class GoodsDetails extends Component {
    constructor(props){
          super(props);
          this.state = {
             reqDetailCode:"",
             ShopCountm:"",
             Number:"",
             storecode:"",
             numbershop:"",
             dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
             Formno:this.props.Formno ? this.props.Formno : "",
             FormDate:this.props.FormDate ? this.props.FormDate : "",
             promemo:this.props.promemo ? this.props.promemo : "无",
          };
          this.dataRows = [];
    }

    componentDidMount(){

         //获取本地数据库url
         Storage.get('LinkUrl').then((tags) => {
            this.setState({
                linkurl:tags
            })
         });

         //reqDetailCode
          Storage.get('historyClass').then((tags) => {
              this.setState({
                  reqDetailCode: tags
              });
          });

         //username
         Storage.get('username').then((tags) => {
           this.setState({
               Username: tags
           });
         });

         //usercode
         Storage.get('userpwd').then((tags) => {
           this.setState({
               Userpwd: tags
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
             FetchUtils.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                 if(data.retcode == 1){
                    var numbercode = data.DetailInfo1.storecode;
                    var numbershop = data.DetailInfo1.childshop;

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
                       Number:shopnumber,
                       storecode:numbercode,
                       numbershop:numbershop
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
                <Text style={styles.Name1}>{rowData.prototal}</Text>
                <Text style={styles.Name1}>{rowData.countm}</Text>
            </View>
        );
   }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.cont}>
                <TouchableOpacity onPress={this.GoodsDetails.bind(this)}>
                    <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                </TouchableOpacity>
                <Text style={styles.HeaderList}>{this.state.Formno}</Text>
            </View>
        </View>
        <View style={styles.Cont}>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>盘点仓库：</Text>
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
                    <Text style={styles.ListText}>单据备注：</Text>
                    <Text style={styles.ListText}>{this.state.promemo}</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>制单日期：</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>{this.state.FormDate}</Text>
                </View>
            </View>
            {
                (this.state.reqDetailCode=="App_Client_ProCGDetailQ"||this.state.reqDetailCode=="App_Client_ProYSDetailQ"||this.state.reqDetailCode=="App_Client_ProXPDetailCGQ"||this.state.reqDetailCode=="App_Client_ProXPDetailYSQ")?
                    <View style={styles.List}>
                        <View style={styles.ListLeft}>
                            <Text style={styles.ListText}>供应商编码：</Text>
                            <Text style={styles.write}></Text>
                            <Text style={styles.ListText}>{this.state.storecode}</Text>
                        </View>
                    </View>:null
            }
            {
                (this.state.reqDetailCode == "App_Client_ProXPDetailCGQ" || this.state.reqDetailCode == "App_Client_ProXPDetailYSQ") ?
                    <View style={styles.List}>
                        <View style={styles.ListLeft}>
                            <Text style={styles.ListText}>机构号：</Text>
                            <Text style={styles.write}></Text>
                            <Text style={styles.ListText}>{this.state.numbershop}</Text>
                        </View>
                    </View>:null
            }
        </View>
        <View style={styles.ShopCont}>
            <View style={styles.ShopList}>
                <Text style={styles.Name}>名称</Text>
                <Text style={styles.Name}>金额</Text>
                <Text style={styles.Name}>数量</Text>
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
        backgroundColor: '#f2f2f2',
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
    HeaderList:{
        flex:6,
        textAlign:"center",
        color:"#ffffff",
        fontSize:22,
        marginTop:2,
    },
    Cont:{
        paddingLeft:25,
        paddingRight:25,
        paddingTop:15,
        backgroundColor:"#fffbe7"
   },
   List:{
        marginBottom:15,
        flexDirection:"row",
   },
   ListText:{
        fontSize:14,
        color:"#333333"
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
        paddingTop:20,
        paddingBottom:20,
        alignItems:"center",
        flexDirection:"row",
   },
   Name:{
       flex:1,
       color:"#666666",
       fontSize:16,
       textAlign:"center"
   },
   ShopList1:{
    paddingLeft:25,
    paddingRight:25,
    paddingTop:20,
    paddingBottom:20,
    backgroundColor:"#ffffff",
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor:"#f2f2f2",
    overflow:"hidden"
   },
   Name1:{
    flex:1,
    color:"#333333",
    fontSize:16,
    textAlign:"center",
    overflow:"hidden"
   },
   ContList:{
   paddingBottom:50,
   },
   listViewStyle:{
    marginBottom:280,
   }
});