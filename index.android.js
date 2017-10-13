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
import File from "./app/file";
import Storage from "./utils/Storage";
import Navigator from "react-native-deprecated-custom-components";
export default class MainView extends Component{
    constructor(props){
        super(props);
        this.state = {
            first:""
        };
    }
    //render之前执行的方法
//    componentWillMount(){
//         Storage.get('FirstTime').then((tags) => {
////            alert(this.state.first);
//            this.setState({
//                first: tags
//            });
//         });
//    }
    render() {
        var rootRoute={
            name:"login",
            component:File
        };
//        if(this.state.first == 1 ){
//            var rootRoute={
//                name:"admin",
//                component:admin
//            };
//        }else {
//            var rootRoute={
//                name:"login",
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
