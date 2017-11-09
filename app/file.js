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
  View
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
      };
  }
  componentWillMount(){
       Storage.get('FirstTime').then((tags) => {
            if(tags == 1 ){
                var nextRoute={
                    name:"主页",
                    component:Index
                };
                this.props.navigator.push(nextRoute)
            }else {
                var nextRoute={
                    name:"主页",
                    component:login
                };
                this.props.navigator.push(nextRoute)
            }
       });

       Storage.get('username').then((tags) => {
          if(tags==null){
              var nextRoute={
                  name:"主页",
                  component:admin
              };
              this.props.navigator.push(nextRoute)
          }
       })
  }
  render() {
    return (
      <View style={styles.container}></View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
