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
  Modal,
  ActivityIndicator
} from 'react-native';
import admin from "./admin";
import login from "./login";
import Index from "./Index";
import Storage from "../utils/Storage";
import Navigator from "react-native-deprecated-custom-components";
export default class file extends Component {
  constructor(props){
      super(props);
      this.state = {
          first:"",
          show:false
      };
  }
  _setModalVisible() {
    let isShow = this.state.show;
    this.setState({
        show:!isShow,
    });
  }

  componentWillMount(){
       Storage.get('FirstTime').then((tags) => {
            if(tags == 1 ){
                this._setModalVisible();
                var nextRoute={
                    name:"主页",
                    component:Index
                };
                this.props.navigator.push(nextRoute);
                this._setModalVisible();
            }else{
                var nextRoute={
                    name:"主页",
                    component:login
                };
                this.props.navigator.push(nextRoute);
            }
       });

       // Storage.get('username').then((tags) => {
       //    if(tags==null){
       //        var nextRoute={
       //            name:"主页",
       //            component:admin
       //        };
       //        this.props.navigator.push(nextRoute)
       //    }
       // })
  }
  render() {
    return (
      <View style={styles.container}>
          <Modal
              animationType='fade'
              transparent={true}
              visible={this.state.show}
              onShow={() => {}}
              onRequestClose={() => {}} >
              <View style={styles.LoadCenter}>
                  <View style={styles.loading}>
                      <ActivityIndicator key="1" color="#ffffff" size="large" style={styles.activity}></ActivityIndicator>
                      <Text style={styles.TextLoading}>登录中</Text>
                  </View>
              </View>
          </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    opacity:0.5
  },
    LoadCenter:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading:{
        paddingLeft:15,
        paddingRight:15,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:"#000000",
        opacity:0.8,
        borderRadius:5,
    },
    TextLoading:{
        fontSize:17,
        color:"#ffffff"
    },
    activity:{
        marginBottom:5,
    },
});
