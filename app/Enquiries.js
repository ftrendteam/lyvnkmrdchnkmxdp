/**
 * 历史单据根据时间查询搜索历史单据商品
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import HistoricalDocument from "./HistoricalDocument";
import DateUtil from "../utils/DateUtil";
import Storage from "../utils/Storage";
import DateTimePicker from "react-native-datetime";
import DatePicker from "react-native-dateandtime";

let dateutil = new DateUtil();
let db;

export default class Enquiries extends Component {
  constructor(props){
      super(props);
      this.state={
          startDate:DateUtil.formatDateTime(new Date()),
          endDate:DateUtil.formatDateTime(new Date()),
          formno:"",
          prodcode:"",
          name:"",
      }
  }

  componentDidMount(){

     this._get();
  }

  _get(){

     Storage.get('code').then((tags) => {
        this.setState({
            reqDetailCode: tags
        });
     });

     Storage.get('Name').then((tags) => {
         this.setState({
             name:tags
         })
     });

  }

  Return(){
    this.props.navigator.pop();
  }

  //接受从上一个页面传过来的值and修改后并返回上一个页面
  pressPop(){
    if(this.props.reloadView){
       this.props.reloadView(this.state.startDate,this.state.endDate,this.state.formno,this.state.prodcode)
    }
    this.props.navigator.pop();
  }

  //日期时间，以下是三种不同方式
  showDatePicker() {
        var date = new Date();
        this.picker.showDatePicker(date, (d)=>{
            this.setState({date:d});
        });
  }

  showTimePicker() {
        var date = new Date();
        this.picker.showTimePicker(date, (d)=>{
            this.setState({date:d});
        });
  }

  showDateTimePicker(data) {
    if(data){
        var startDate = new Date();
        this.picker.showDateTimePicker(startDate, (d)=>{
            this.setState({startDate:DateUtil.formatDateTime(d)});
        });
    }else{
        var endDate = new Date();
        this.picker.showDateTimePicker(endDate, (d)=>{
            this.setState({endDate:DateUtil.formatDateTime(d)});
        });
    }
  }

  emptying(){
    var nextRoute={
        name:"主页",
        component:HistoricalDocument
    };
    this.props.navigator.push(nextRoute)
  }

  render() {
    return (
      <ScrollView style={styles.container}>
          <ScrollView style={styles.ScrollView} scrollEnabled={false}>
              <View style={styles.header}>
                  <View style={styles.cont}>
                      <TouchableOpacity onPress={this.Return.bind(this)}>
                          <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                      </TouchableOpacity>
                      <Text style={styles.HeaderList}>{this.state.name}查询</Text>
                  </View>
              </View>
            <View style={styles.Content}>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>开始日期</Text>
                    <Text style={styles.Contright} onPress={(data)=>{this.showDateTimePicker(true)}}>{this.state.startDate.toString()}</Text>
                    <DatePicker ref={(picker)=>{this.picker=picker}}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>结束日期</Text>
                    <Text style={styles.Contright} onPress={(data)=>{this.showDateTimePicker(false)}}>{this.state.endDate.toString()}</Text>
                    <DatePicker ref={(picker)=>{this.picker=picker}}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>门店</Text>
                    <Text style={styles.ContLeft1}>{this.state.reqDetailCode}</Text>
                </View>
                {
                    (this.state.name=="商品采购"||this.state.name=="商品验收"||this.state.name=="协配采购"||this.state.name=="协配收货")?
                    <View style={styles.ContList}>
                        <Text style={[styles.ContLeft,{marginTop:7,}]}>供应商编码</Text>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder="请输入供应商编码"
                            placeholderTextColor="#999999"
                            style={styles.ContRight}
                            onChangeText={(value)=>{
                                this.setState({
                                    suppcode:value
                                })
                        }}/>
                    </View>:null
                }
                <View style={styles.ContList}>
                    <Text style={[styles.ContLeft,{marginTop:7,}]}>单据号</Text>
                    <TextInput
                    underlineColorAndroid='transparent'
                    placeholder="请输入单据号"
                    placeholderTextColor="#999999"
                    style={styles.ContRight}
                    onChangeText={(value)=>{
                        this.setState({
                            formno:value
                        })
                    }}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={[styles.ContLeft,{marginTop:7,}]}>商品编码</Text>
                    <TextInput
                    underlineColorAndroid='transparent'
                    placeholder="请输入商品编码"
                    placeholderTextColor="#999999"
                    style={styles.ContRight}
                    onChangeText={(value)=>{
                        this.setState({
                            prodcode:value
                        })
                    }}/>
                </View>
                <View style={styles.button}>
                    <Text style={styles.ButtonText} onPress={this.pressPop.bind(this)}>搜索</Text>
                </View>
            </View>
            <View style={styles.Emptying}>
                <TouchableOpacity onPress={this.emptying.bind(this)}>
                    <Text style={styles.EmptyingTxt}>清空历史查询</Text>
                </TouchableOpacity>
            </View>
          </ScrollView>
      </ScrollView>
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
        marginTop:3,
    },
    Content:{
        marginBottom:30,
    },
    ContList:{
        borderBottomWidth:1,
        borderBottomColor:"#f5f5f5",
        flexDirection:"row",
        height:55,
        paddingTop:15,
        paddingLeft:10,
        backgroundColor:"#ffffff",
        borderBottomColor:"#f2f2f2",
        borderBottomWidth:1,
    },
    ContLeft:{
        color:"#666666",
        fontSize:16,
        width:100,
        textAlign:"right",
    },
    Contright:{
        color:"#333333",
        marginLeft:15,
        flex:1,
    },
    ContLeft1:{
        flex:8,
        color:"#333333",
        fontSize:16,
        marginLeft:15,
    },
    ContRight:{
        flex:8,
        color:"#333333",
        fontSize:16,
    },
    Emptying:{
        borderWidth:1,
        borderColor:"#ff4e4e",
        borderRadius:5,
        marginLeft:25,
        marginRight:25,
        paddingTop:13,
        paddingBottom:13,
        backgroundColor:"#ffffff"
    },
    EmptyingTxt:{
        color:"#ff4e4e",
        textAlign:"center",
        fontSize:18,
    },
    button:{
        marginTop:30,
        marginLeft:25,
        marginRight:25,
        backgroundColor:"#ff4e4e",
        borderRadius:5,
        paddingTop:13,
        paddingBottom:13,
    },
    ButtonText:{
        color:"#ffffff",
        textAlign:"center",
        fontSize:18,
    }
});