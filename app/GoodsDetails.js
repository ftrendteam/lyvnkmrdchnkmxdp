/**
 * 历史单据 每比单据详情列表
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
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
             name:"",
             checktype:"",
             dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
             Formno:this.props.Formno ? this.props.Formno : "",
             FormDate:this.props.FormDate ? this.props.FormDate : "",
             promemo:this.props.promemo ? this.props.promemo : "无",
             depname:this.props.depname ? this.props.depname : "",
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

            Storage.get('Name').then((tags) => {
                this.setState({
                    name:tags
                })
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
                 sDateTime:Date.parse(new Date()),
                 Sign:NetUtils.MD5("App_PosReq" + "##" +this.state.reqDetailCode + "##" + Date.parse(new Date()) + "##" + "PosControlCs")+'',
                 username:this.state.Username,
                 usercode:this.state.Userpwd,
                 BeginDate:"",
                 EndDate:"",
                 shopcode:tags,
                 formno:this.state.Formno,
                 prodcode:"",
             };
             FetchUtils.post(this.state.linkurl,JSON.stringify(params)).then((data)=>{
                 console.log(JSON.stringify(data))
                 if(data.retcode == 1){
                    var numbercode = data.DetailInfo1.storecode;
                    var numbershop = data.DetailInfo1.childshop;
                    var checktype = data.DetailInfo1.checktype;
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
                       numbershop:numbershop,
                       checktype:checktype
                    })
                 }else{
                     alert(JSON.stringify(data))
                 }
             },(err)=>{
                 alert("网络请求失败");
             })
         })
    }

    GoodsDetails(){
          this.props.navigator.pop();
    }

   _renderRow(rowData, sectionID, rowID){
        return (
            <ScrollView style={styles.shoprow} horizontal={true}>
                <View style={styles.Direction}>
                    <View style={[styles.ShopList1,{width:70,}]}>
                        <Text style={styles.Name1}>{rowData.prodname}</Text>
                    </View>
                    <View style={[styles.ShopList1,{width:70,}]}>
                        <Text style={styles.Name1}>{rowData.prototal}</Text>
                    </View>
                    <View style={[styles.ShopList1,{width:70,}]}>
                        <Text style={styles.Name1}>{rowData.countm}</Text>
                    </View>
                    <View style={styles.ShopList1}>
                        <Text style={styles.Name1}>{rowData.promemo}</Text>
                    </View>
                </View>
            </ScrollView>
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
                    <Text style={styles.ListText}>仓库：</Text>
                    <Text style={styles.ListText}>系统默认仓库</Text>
                </View>
                <View style={styles.ListRight}>
                    <Text style={styles.ListText}>货品数：</Text>
                    <Text style={styles.ListText}>{this.state.Number}</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={[styles.ListLeft,{flex:1}]}>
                    <Text style={styles.ListText}>单据备注：</Text>
                    <Text style={styles.ListText}>{this.state.promemo}</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={[styles.ListLeft,{flex:1}]}>
                    <Text style={styles.ListText}>单据状态：</Text>
                    <Text style={[styles.ListText,{color:"#ff4e4e"}]}>{this.state.checktype}</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>制单日期：</Text>
                    <Text style={styles.ListText}>{this.state.FormDate}</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>商品品类：</Text>
                    <Text style={styles.ListText}>{this.state.depname}</Text>
                </View>
            </View>
            {
                (this.state.reqDetailCode=="App_Client_ProCGDetailQ"||this.state.reqDetailCode=="App_Client_ProYSDetailQ"||this.state.reqDetailCode=="App_Client_ProXPDetailCGQ"||this.state.reqDetailCode=="App_Client_ProXPDetailYSQ")?
                    <View style={styles.List}>
                        <View style={styles.ListLeft}>
                            <Text style={styles.ListText}>供应商编码：</Text>
                            <Text style={styles.ListText}>{this.state.storecode}</Text>
                        </View>
                    </View>:null
            }
            {
                (this.state.reqDetailCode == "App_Client_ProXPDetailCGQ" || this.state.reqDetailCode == "App_Client_ProXPDetailYSQ") ?
                    <View style={styles.List}>
                        <View style={styles.ListLeft}>
                            <Text style={styles.ListText}>机构号：</Text>
                            <Text style={styles.ListText}>{this.state.numbershop}</Text>
                        </View>
                    </View>:null
            }
        </View>
        <View style={styles.ShopCont}>
            <View style={styles.ShopList}>
                <Text style={[styles.Name,{width:70,}]}>名称</Text>
                <Text style={[styles.Name,{width:70,}]}>金额</Text>
                <Text style={[styles.Name,{width:705,}]}>数量</Text>
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
        backgroundColor:"#ff4e4e",
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
        marginTop:3,
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
        fontSize:16,
        color:"#333333"
   },
   ListLeft:{
        flexDirection:"row",
   },
   ListRight:{
        position:"absolute",
        right:0,
        flexDirection:"row",
   },
    Listright:{
        flexDirection:"row",
        flex:1
    },
   ShopList:{
        paddingLeft:25,
        paddingRight:25,
        paddingTop:20,
        paddingBottom:20,
        alignItems:"center",
        flexDirection:"row",
   },
   ShopCont:{
        marginBottom:30,
   },
   Name:{
       flex:1,
       color:"#666666",
       fontSize:16,
       textAlign:"center"
   },
    shoprow:{
        flex:1,
    },
    Direction:{
        paddingLeft:25,
        paddingTop:20,
        paddingBottom:20,
        height:61,
        flexDirection:"row",
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
    },
   ShopList1:{
        marginRight:25,
        overflow:"hidden",
        flex:1
   },
   Name1:{
        flex:1,
        color:"#333333",
        fontSize:16,
        textAlign:"center"
   },
   ContList:{
        paddingBottom:50,
   },
   listViewStyle:{
        marginBottom:280,
   }
});