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
  ScrollView,
  Modal,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import Code from "./Code";
import Search from "./Search";
import Succeed from "./Succeed";
import OrderDetails from "./OrderDetails";
import XZHBottomView from './XZHBottomView';
import XZHWineCell from  './XZHWineCell';
import WebUtils from "../utils/WebUtils";
import SideMenu from 'react-native-side-menu';
//第二页面
export default class ShoppingCart extends Component {
constructor(props){
        super(props);
        this.state = {
            show:false,
            Text1:59875888,
            Text2:254,
            totalPrice:"",
            goods:"",
            Number1:25564654988,
            Number2:22,
        };
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
    OrderDetails(){
        var nextRoute={
            name:"主页",
            component:OrderDetails
        };
        this.props.navigator.push(nextRoute)
    }
//自动跑接口
    componentDidMount(){
       var Text1=this.state.Text1;
       this.state.totalPrice =Text1+Text1+Text1+Text1+Text1+Text1;
       this.setState({
           totalPrice: this.state.totalPrice
       });

       var Number1=this.state.Number1;
       this.state.goods =Number1+Number1+Number1+Number1+Number1+Number1;
       this.setState({
          goods: this.state.goods
       })
    }
    pressPop(){
          this._setModalVisible()
          this.props.navigator.pop();
    }
//提交
    submit(){
        let Params= {
            "reqCode":"App_PosReq",
            "reqDetailCode":"App_Client_ProYH",
            "ClientCode":"810001",
            "sDateTime":"2017-08-09 12:12:12",
            "Sign":"C4CB5D0FB1C34B6D18086937E077D00C",
            "username":"收银员1",
            "usercode":"001",
             "DetailInfo1":{"ShopCode":"0001","OrgFormno":"","ProMemo":"表单备注"},
             "DetailInfo2":[
                               {
                                   "prodcode":"10000001",
                                   "countm":10,
                                   "ProPrice":12,
                                   "promemo":"",
                                   "kccount":10
                               },
                               {
                                    "prodcode":"10000002",
                                    "countm":10,
                                    "ProPrice":12,
                                    "promemo":"",
                                    "kccount":10
                                },
                                {
                                   "prodcode":"10000003",
                                   "countm":10,
                                   "ProPrice":12,
                                   "promemo":"",
                                   "kccount":10
                               },
                               {
                                    "prodcode":"10000005",
                                    "countm":10,
                                    "ProPrice":12,
                                    "promemo":"",
                                    "kccount":10
                                },
                               {
                                     "prodcode":"10000006",
                                     "countm":10,
                                     "ProPrice":12,
                                     "promemo":"",
                                     "kccount":10
                               },
                               {
                                      "prodcode":"10000007",
                                      "countm":10,
                                      "ProPrice":12,
                                      "promemo":"",
                                      "kccount":10
                               }
                           ]
        };
        WebUtils.Post('http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos',params, (data)=>{
            if(data.retcode == 1){
    //          alert(JSON.stringify(data))
                 alert("提交成功")
              }else{
                   alert("提交失败")
              }
        })
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
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
            <View style={styles.cont}>
                <Text style={styles.HeaderList}>商品清单</Text>
                <TouchableOpacity onPress={this.Code.bind(this)}>
                    <Image source={require("../images/sm.png")} style={styles.HeaderImage1}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pressPush.bind(this)}>
                    <Image source={require("../images/search.png")} style={styles.HeaderImage}></Image>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.ContList1}>
            <View style={styles.Line}></View>
            <View style={styles.NameList}>
                <Text style={styles.Name}>名字</Text>
                <Text style={styles.Number}>数量</Text>
                <Text style={styles.Price}>单价</Text>
                <Text style={styles.SmallScale}>小计</Text>
            </View>
            <View style={styles.ContList}>
                <ScrollView>
                    <View style={styles.ShopList}>
                        <TouchableOpacity style={styles.ShopContList} onPress={this.OrderDetails.bind(this)}>
                            <View style={styles.ShopTop}>
                                <Text style={styles.ShopLeft}>10000001</Text>
                                <Text style={styles.ShopRight}>单位：件</Text>
                            </View>
                            <View style={styles.ShopTop}>
                                <Text style={[styles.Name,styles.Name1]}></Text>
                                <Text style={[styles.Number,styles.Name1]}>{this.state.Number1}</Text>
                                <Text style={[styles.Price,styles.Name1]}>25.00</Text>
                                <Text style={[styles.SmallScale,styles.Name2]}>{this.state.Text1}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ShopList}>
                        <TouchableOpacity style={styles.ShopContList} onPress={this.OrderDetails.bind(this)}>
                            <View style={styles.ShopTop}>
                                <Text style={styles.ShopLeft}>10000002</Text>
                                <Text style={styles.ShopRight}>单位：件</Text>
                            </View>
                            <View style={styles.ShopTop}>
                                <Text style={[styles.Name,styles.Name1]}></Text>
                                <Text style={[styles.Number,styles.Name1]} numberOfLines={1}>{this.state.Number1}</Text>
                                <Text style={[styles.Price,styles.Name1]}>25.00</Text>
                                <Text style={[styles.SmallScale,styles.Name2]}>{this.state.Text1}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ShopList}>
                        <TouchableOpacity style={styles.ShopContList} onPress={this.OrderDetails.bind(this)}>
                            <View style={styles.ShopTop}>
                                <Text style={styles.ShopLeft}>10000003</Text>
                                <Text style={styles.ShopRight}>单位：件</Text>
                            </View>
                            <View style={styles.ShopTop}>
                                <Text style={[styles.Name,styles.Name1]}></Text>
                                <Text style={[styles.Number,styles.Name1]}>{this.state.Number1}</Text>
                                <Text style={[styles.Price,styles.Name1]}>25.00</Text>
                                <Text style={[styles.SmallScale,styles.Name2]}>{this.state.Text1}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ShopList}>
                        <TouchableOpacity style={styles.ShopContList} onPress={this.OrderDetails.bind(this)}>
                            <View style={styles.ShopTop}>
                                <Text style={styles.ShopLeft}>10000005</Text>
                                <Text style={styles.ShopRight}>单位：件</Text>
                            </View>
                            <View style={styles.ShopTop}>
                                <Text style={[styles.Name,styles.Name1]}></Text>
                                <Text style={[styles.Number,styles.Name1]}>{this.state.Number1}</Text>
                                <Text style={[styles.Price,styles.Name1]}>25.00</Text>
                                <Text style={[styles.SmallScale,styles.Name2]}>{this.state.Text1}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ShopList}>
                        <TouchableOpacity style={styles.ShopContList} onPress={this.OrderDetails.bind(this)}>
                            <View style={styles.ShopTop}>
                                <Text style={styles.ShopLeft}>10000006</Text>
                                <Text style={styles.ShopRight}>单位：件</Text>
                            </View>
                            <View style={styles.ShopTop}>
                                <Text style={[styles.Name,styles.Name1]}></Text>
                                <Text style={[styles.Number,styles.Name1]}>{this.state.Number1}</Text>
                                <Text style={[styles.Price,styles.Name1]}>25.00</Text>
                                <Text style={[styles.SmallScale,styles.Name2]}>{this.state.Text1}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.ShopList}>
                        <TouchableOpacity style={styles.ShopContList} onPress={this.OrderDetails.bind(this)}>
                            <View style={styles.ShopTop}>
                                <Text style={styles.ShopLeft}>10000007</Text>
                                <Text style={styles.ShopRight}>单位：件</Text>
                            </View>
                            <View style={styles.ShopTop}>
                                <Text style={[styles.Name,styles.Name1]}></Text>
                                <Text style={[styles.Number,styles.Name1]}>{this.state.Number1}</Text>
                                <Text style={[styles.Price,styles.Name1]}>25.00</Text>
                                <Text style={[styles.SmallScale,styles.Name2]}>{this.state.Text1}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
            <View style={styles.viewStyle}>
                <View style={styles.Combined}>
                    <Text style={styles.CombinedText}>合计：</Text>
                </View>
                <View style={styles.Client}>
                    <Text style={styles.ClientText}>
                        <Text style={styles.client}>客户：</Text>
                        <Text style={styles.ClientType}>散户</Text>
                    </Text>
                    <Text style={styles.goodSNumber}>
                        <Text style={styles.goods}>货品：</Text>
                        <Text style={styles.GoodsNumber}
                            onPress={()=>{
                               this.setState({goods:this.state.goods});
                            }}
                            numberOfLines={1}
                        >
                        {this.state.goods}
                        </Text>
                     </Text>
                        <Text style={styles.Price1}
                            onPress={() => {
                                this.setState({totalPrice:this.state.totalPrice});
                            }}
                            numberOfLines={1}
                        >
                        ￥{this.state.totalPrice}
                        </Text>

                </View>
                <View style={styles.Note}>
                    <TouchableOpacity onPress={this._rightButtonClick.bind(this)}>
                        <Text style={styles.DocumentsNote}>单据备注</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Submit} onPress={this.submit.bind(this)}>
                        <Text style={{fontSize:16,color:"#ffffff",}}>提交</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                transparent={true}
                visible={this.state.show}
                onShow={() => {}}
                onRequestClose={() => {}} >
                     <View style={styles.modalStyle}>
                          <View style={styles.LayerThickness}></View>
                               <View style={styles.ModalView}>
                                    <View style={styles.DanJu}><Text style={styles.DanText}>单据备注</Text></View>
                                          <TextInput
                                          multiline={true}
                                          placeholder="请填写单据备注信息"
                                          underlineColorAndroid='transparent'
                                          placeholderTextColor="#bcbdc1"
                                          style={styles.TextInput} />
                                          <View style={styles.ModalLeft} >
                                               <Text style={styles.buttonText1} onPress={this._setModalVisible.bind(this)}>×</Text>
                                    </View>
                               </View>
                          </View>
                </Modal>
            </View>
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
        Line:{
            height:10,
            backgroundColor:"#f1f5f6"
        },
        NameList:{
            paddingLeft:25,
            paddingRight:25,
            flexDirection:"row",
            height:60,
            alignItems:"center",
            backgroundColor:"#fafafa",
            borderTopWidth:1,
            borderTopColor:"#f1f1f1"
        },
        Name:{
            flex:2,
            fontSize:16,
            color:"#333333",
        },
        Number:{
            flex:1,
            textAlign:"right",
            fontSize:16,
            color:"#333333",
        },
        Price:{
            flex:1,
            textAlign:"right",
            fontSize:16,
            color:"#333333",
        },
        SmallScale:{
            flex:1,
            textAlign:"right",
            fontSize:16,
            color:"#333333",
        },
        ShopList:{
            marginLeft:25,
            marginRight:25,
        },
        ShopContList:{
            borderBottomWidth:1,
            borderBottomColor:"#f5f5f5",
            paddingTop:20,
        },
        ShopTop:{
            marginBottom:20,
            flexDirection:"row",
        },
        ShopLeft:{
            flex:6,
            color:"#666666",
            fontSize:16,
        },
        ShopRight:{
            flex:1,
            textAlign:"right",
            color:"#666666",
            fontSize:16,
        },
        Name1:{
            color:"#333333",
            fontSize:16,
        },
        Name2:{
            color:"#f63e4d"
        },
        ContList1:{
            marginBottom:60,
            flex:1,
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
            marginTop:15,
            marginBottom:15,
        },
        Goods:{
            flexDirection:"row",
        },
        Note:{
            flexDirection:"row",
        },
        CombinedText:{
            fontSize:16,
            color:"#555555",
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
            color:"#555555",
            marginRight:3,
            width:45,
        },
        GoodsNumber:{
            fontSize:16,
            color:"#555555",
            flex:2
        },
        Price1:{
            fontSize:16,
            color:"#f47882",
            flex:2,
        },
        DocumentsNote:{
            fontSize:16,
            color:"#f47882"
        },
        Submit:{
            fontSize:16,
            color:"#ffffff",
            backgroundColor:"#f47882",
            paddingTop:15,
            paddingBottom:15,
            paddingLeft:50,
            paddingRight:50,
            position:"absolute",
            right:0,
        },
        goodSNumber:{
            position:"absolute",
            right:120,
        },
        modalStyle: {
         flex:1,
       },
       LayerThickness:{
            backgroundColor:"#000000",
            opacity:0.5,
            flex:1,
       },
       ModalView:{
            position:"absolute",
            width:400,
            height:260,
            backgroundColor:"#ffffff",
            borderRadius:5,
            top:250,
            marginLeft:100,
       },
       DanJu:{
        height:45,
        backgroundColor:"#fbced2",
        borderRadius:5,
       },
       DanText:{
        color:"#f47882",
        lineHeight:30,
        textAlign:"center",
        fontSize:16,
       },
       TextInput:{
        width:350,
        marginLeft:25,
        marginRight:25,
        height:180,
        marginTop:15,
        borderWidth:1,
        borderColor:"#fbced2",
       },
       ModalLeft:{
        position:"absolute",
        right:15,
        top:3,
       },
       buttonText1:{
        color:"#f47882",
        fontSize:24,
       },
    viewStyle:{
            backgroundColor:"#ffffff",
            borderTopWidth:1,
            borderTopColor:"#f5f5f5",
            paddingLeft:25,
            paddingRight:25,
            paddingTop:15,
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
            CombinedText:{
                fontSize:16,
                color:"#555555",
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
            goodSNumber:{
                flex:2
            },
            GoodsNumber:{
                fontSize:16,
                color:"#555555"
            },
            Price1:{
                fontSize:16,
                color:"#f47882",
                flex:2,
                textAlign:"right"
            },
            DocumentsNote:{
                fontSize:16,
                color:"#f47882",
                marginTop:15,
            },
            Submit:{
                backgroundColor:"#f47882",
                paddingTop:15,
                paddingBottom:15,
                paddingLeft:50,
                paddingRight:50,
                position:"absolute",
                right:0,
            },
           modalStyle: {
             flex:1,
           },
           LayerThickness:{
                backgroundColor:"#000000",
                opacity:0.5,
                flex:1,
           },
           ModalView:{
                position:"absolute",
                height:260,
                backgroundColor:"#ffffff",
                borderRadius:5,
                marginLeft:100,
                top:200,
           },
           DanJu:{
            height:45,
            backgroundColor:"#fbced2",
            borderRadius:5,
           },
           DanText:{
            color:"#f47882",
            lineHeight:30,
            textAlign:"center",
            fontSize:16,
           },
           TextInput:{
            width:350,
            marginLeft:25,
            marginRight:25,
            height:180,
            marginTop:15,
            borderWidth:1,
            borderColor:"#fbced2",
            textAlignVertical: 'top'
           },
           ModalLeft:{
            position:"absolute",
            right:15,
            top:3,
           },
           buttonText1:{
            color:"#f47882",
            fontSize:24,
           }



});