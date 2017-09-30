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
      }
  }
  componentDidMount(){
    Storage.get('code').then((tags) => {
        this.setState({
            reqDetailCode: tags
        });
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
  showDateTimePicker() {
        var startDate = new Date();
        this.picker.showDateTimePicker(startDate, (d)=>{
            this.setState({startDate:DateUtil.formatDateTime(d)});
        });
        var endDate = new Date();
        this.picker.showDateTimePicker(endDate, (d)=>{
            this.setState({endDate:DateUtil.formatDateTime(d)});
        });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Title}>
            <TouchableOpacity onPress={this.Return.bind(this)} style={styles.HeaderImage}>
                 <Image source={require("../images/left.png")}></Image>
            </TouchableOpacity>
            <Text style={styles.Text}>要货单查询</Text>
        </View>
        <View style={styles.Cont}>
            <View style={styles.Content}>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>开始日期：</Text>
                    <Text style={styles.ContLeft} onPress={this.showDateTimePicker.bind(this)}>{this.state.startDate.toString()}</Text>
                    <DateTimePicker ref={(picker)=>{this.picker=picker}}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>结束日期：</Text>
                    <Text style={styles.ContLeft} onPress={this.showDateTimePicker.bind(this)}>{this.state.endDate.toString()}</Text>
                    <DateTimePicker ref={(picker)=>{this.picker=picker}}/>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>门店：</Text>
                    <Text style={styles.ContLeft1}>{this.state.reqDetailCode}</Text>
                </View>
                <View style={styles.ContList}>
                    <Text style={styles.ContLeft}>单据号：</Text>
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
                    <Text style={styles.ContLeft}>商品编码：</Text>
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
        </View>
        <View style={styles.empty}>
            <View style={styles.Emptying}>
                  <Text style={styles.EmptyingTxt}>清空历史查询</Text>
            </View>
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
    fontSize:20,
    color:"#ffffff"
    },
    Cont:{
        flex:1
    },
    Content:{
        marginLeft:25,
        marginRight:25,
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
        fontSize:16,
    },
    ContLeft1:{
        flex:8,
        lineHeight:35,
        color:"#636363",
        fontSize:16,
    },
    ContRight:{
        flex:8
    },
    empty:{
        height:45,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Emptying:{
        borderWidth:1,
        borderColor:"#cccccc",
        borderRadius:5,
        marginLeft:30,
        marginRight:30,
        paddingLeft:100,
        paddingRight:100,
    },
    EmptyingTxt:{
        height:40,
        color:"#cccccc",
        lineHeight:26,
    },
    button:{
        marginTop:50,
        flex:1,
    },
    ButtonText:{
        color:"#ffffff",
        backgroundColor:"#f47882",
        height:45,
        lineHeight:30,
        borderRadius:5,
        textAlign:"center",
        fontSize:18,
    }
});