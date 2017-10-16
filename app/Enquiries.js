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
  TextInput,
  Image,
  TouchableOpacity,
  Button
} from 'react-native';
import HistoricalDocument from "./HistoricalDocument";
import DateUtil from "../utils/DateUtil";
import Storage from "../utils/Storage";
import DateTimePicker from "react-native-datetime";
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
  pressPop(){
        if(this.props.reloadView){
           this.props.reloadView(this.state.startDate,this.state.endDate,this.state.formno,this.state.prodcode)
        }
        this.props.navigator.pop();
  }
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
      <View style={styles.container}>
            <View style={styles.Title}>
                <TouchableOpacity onPress={this.Return.bind(this)} style={styles.HeaderImage}>
                     <Image source={require("../images/left.png")}></Image>
                </TouchableOpacity>
                <Text style={styles.Text}>{this.state.name}查询</Text>
            </View>
            <View style={styles.Content}>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>开始日期：</Text>
                    <Text style={styles.ContLeft} onPress={(data)=>{this.showDateTimePicker(true)}}>{this.state.startDate.toString()}</Text>
                    <DateTimePicker ref={(picker)=>{this.picker=picker}}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>结束日期：</Text>
                    <Text style={styles.ContLeft} onPress={this.showDateTimePicker.bind(false)}>{this.state.endDate.toString()}</Text>
                    <DateTimePicker ref={(picker)=>{this.picker=picker}}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft3}>门店：</Text>
                    <Text style={styles.ContLeft1}>{this.state.reqDetailCode}</Text>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft2}>单据号：</Text>
                    <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.ContRight}
                    onChangeText={(value)=>{
                        this.setState({
                            formno:value
                        })
                    }}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft2}>商品编码：</Text>
                    <TextInput
                    underlineColorAndroid='transparent'
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
    height:50,
    backgroundColor:"#f47882",
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor:"#cacccb"
  },
  HeaderImage:{
    width:15,
    height:22,
    marginTop:5,
  },
  Text:{
    flex:8,
    textAlign:"center",
    fontSize:18,
    color:"#ffffff"
    },
    Content:{
        marginLeft:15,
        marginRight:15,
        marginBottom:30,
    },
    ContList:{
        borderBottomWidth:1,
        borderBottomColor:"#f5f5f5",
        flexDirection:"row",
        height:55,
        paddingLeft:25,
    },
    ContLeft:{
        flex:2,
        lineHeight:35,
        color:"#636363",
        fontSize:14,
    },
    ContLeft2:{
        flex:3,
        lineHeight:35,
        color:"#636363",
        fontSize:14,
    },
    ContLeft1:{
        flex:8,
        lineHeight:35,
        color:"#636363",
        fontSize:14,
    },
    ContLeft3:{
        flex:3,
        lineHeight:35,
        color:"#636363",
        fontSize:14,
    },
    ContRight:{
        flex:8
    },
    Emptying:{
        borderWidth:1,
        borderColor:"#cccccc",
        borderRadius:5,
        marginLeft:15,
        marginRight:15,
    },
    EmptyingTxt:{
        height:40,
        color:"#cccccc",
        lineHeight:27,
        textAlign:"center"
    },
    button:{
        marginTop:50,
    },
    ButtonText:{
        color:"#ffffff",
        backgroundColor:"#f47882",
        height:40,
        lineHeight:30,
        borderRadius:5,
        textAlign:"center",
        fontSize:16,
    }
});