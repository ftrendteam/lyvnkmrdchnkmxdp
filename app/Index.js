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
import Code from "./Code";
import Home from "./Home";
import admin from "./admin";
import OrderDetails from "./OrderDetails";
import Search from "./Search";
import list from "./HomeLeftList";
import Query from "./Query";
import NetUtils from "../utils/NetUtils";
import WebUtils from "../utils/WebUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from 'react-native-storage';
import XZHBottomView from './XZHBottomView';
import XZHWineCell from  './XZHWineCell';
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
        };
        this.dataRows = [];
    }
    pressPush(){
        var nextRoute={
            name:"主页",
            component:Search
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
    Code(){
        var nextRoute={
            name:"主页",
            component:Code
        };
        this.props.navigator.push(nextRoute)
    }
    Home(){
        this._setModalVisible()
        var nextRoute={
            name:"主页",
            component:Home
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
    Query(){
        this._setModalVisible()
        var nextRoute={
            name:"主页",
            component:Query
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
//                alert(JSON.stringify(row))
            }
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(this.dataRows)
            })
        });
    }
    _renderRow(renderRow){
         return (
            <TouchableOpacity style={styles.Active}>
                <Text style={styles.Active1}>{renderRow.DepName}</Text>
            </TouchableOpacity>
         );
    }
    render() {
        return (
              <View style={styles.container}>
                  <View style={styles.header}>
                      <View style={styles.cont}>
                          <TouchableHighlight onPress={this._rightButtonClick.bind(this)}>
                                <Image source={require("../images/list.png")} style={styles.HeaderImage}></Image>
                           </TouchableHighlight>
                          <Text style={styles.HeaderList}>要货单</Text>
                          <TouchableHighlight onPress={this.Code.bind(this)}>
                            <Image source={require("../images/sm.png")} style={styles.HeaderImage1}></Image>
                          </TouchableHighlight>
                          <TouchableHighlight onPress={this.pressPush.bind(this)}>
                            <Image source={require("../images/search.png")} style={styles.HeaderImage}></Image>
                          </TouchableHighlight>
                      </View>
                  </View>
                  <View style={styles.ContList}>
                      <ScrollView style={styles.scrollview}>
                          <View style={styles.addnumber}>
                              <Text style={styles.Reduction1}>14</Text>
                          </View>
                          <ListView
                            style={styles.listViewStyle}
                            dataSource={this.state.dataSource}
                            showsVerticalScrollIndicator={true}
                            renderRow={this._renderRow.bind(this)}
                          />
                      </ScrollView>
                      <View style={styles.RightList1}>
                          <ScrollView style={styles.ScrollView1}>
                              <View style={styles.Border}>
                                   <TouchableOpacity onPress={this.OrderDetails.bind(this)}>
                                       <View style={styles.Image}>
                                           <Image source={require("../images/image.png")}></Image>
                                        </View>
                                       <Text style={styles.Text}>哈密瓜</Text>
                                   </TouchableOpacity>
                               </View>
                               <View style={styles.Border}>
                                    <TouchableOpacity onPress={this.OrderDetails.bind(this)}>
                                        <View style={styles.Image}>
                                            <Image source={require("../images/image.png")}></Image>
                                         </View>
                                        <Text style={styles.Text}>哈密瓜</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.Border}>
                                     <TouchableOpacity onPress={this.OrderDetails.bind(this)}>
                                         <View style={styles.Image}>
                                             <Image source={require("../images/image.png")}></Image>
                                          </View>
                                         <Text style={styles.Text}>哈密瓜</Text>
                                     </TouchableOpacity>
                                 </View>
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
                                <TouchableHighlight style={styles.subView} onPress={this.Home.bind(this)}>
                                    <Text style={styles.titleText}>要货</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.subView} onPress={this.Home.bind(this)}>
                                    <Text style={styles.titleText}>损益</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.ModalViewList}>
                                <TouchableHighlight style={styles.subView} onPress={this.Query.bind(this)}>
                                    <Text style={styles.titleText}>实时盘点</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.subView} onPress={this.Query.bind(this)}>
                                    <Text style={styles.titleText}>商品盘点</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.ModalViewList}>
                                <TouchableHighlight style={styles.subView} onPress={this.Home.bind(this)}>
                                    <Text style={styles.titleText}>配送收货</Text>
                                </TouchableHighlight>
                                <TouchableHighlight style={styles.subView} onPress={this.Home.bind(this)}>
                                    <Text style={styles.titleText}>数据更新</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.ModalViewList1}>
                                <TouchableHighlight  style={styles.subView1} onPress={this.pullOut.bind(this)}>
                                    <Text style={styles.titleText1}>退出账号</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                            <TouchableHighlight
                                style={styles.ModalLeft}
                                onPress={this._setModalVisible.bind(this)}>
                                <Text style={styles.buttonText1}> 取消</Text>
                            </TouchableHighlight>
                    </View>
                  </Modal>
              </View>
    );
  }
}
const styles = StyleSheet.create({
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
        marginBottom:61,
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
        height:20,
        position:'absolute',
        right:6,
      },
      addnumber:{
        height:20,
        position:'absolute',
        right:10,
        top:6,
      },
      Reduction1:{
        borderRadius:50,
        backgroundColor:"red",
        color:"#ffffff",
        width:18,
        height:18,
        textAlign:"center",
        lineHeight:15,
        position:'absolute',
        right:4,
        top:4,
        fontSize:10,
      },
      Reduction:{
        borderRadius:50,
        backgroundColor:"red",
        color:"#ffffff",
        width:15,
        height:15,
        textAlign:"center",
        lineHeight:11,
        position:'absolute',
        right:4,
        top:4,
        fontSize:16
      },
      Number:{
        position:'absolute',
        right:30,
        color:"red"
      },
      Border:{
        borderRightWidth:1,
        borderRightColor:"#f5f5f5",
        flex:3,
        paddingBottom:10,
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