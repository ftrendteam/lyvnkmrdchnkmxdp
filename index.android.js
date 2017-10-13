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
  AsyncStorage
} from 'react-native';
/*引入*/
import login from "./app/login";
import admin from "./app/admin";
import Storage from "./utils/Storage";
import Navigator from "react-native-deprecated-custom-components";
export default class MainView extends Component{
    constructor(props){
        super(props);
        this.state = {
            First:""
        };
    }
    componentDidMount(){
        Storage.get('ytt').then((tags) => {
            this.setState({
                First: tags
            });

        });
    }
    render() {
            var rootRoute={
                name:"测试",
                component:login
            };
//        if(this.state.First = 1){
//            var rootRoute={
//                name:"测试",
//                component:admin
//            };
//        }else{
//            var rootRoute={
//                name:"测试",
//                component:login
//            };
//        }
        return (
            <Navigator.Navigator
                initialRoute={rootRoute}
                configureScene={(route)=>{
                    return Navigator.Navigator.SceneConfigs.PushFromRight;
                }}
                renderScene={(route,navigator)=>{
                    var Component=route.component;
                    return(
                        <Component
                            {...route.params}
                            navigator={navigator}
                            route={route}/>
                    );
                }}
            />
        );
    }
}
AppRegistry.registerComponent('myproject', () => MainView);
