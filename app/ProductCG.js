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
     TouchableOpacity,
     Image
 } from 'react-native';
 import Index from "./Index";
 import Home from "./Home";
 import Search from "./Search";
 import ProductCG_list from "./ProductCG_list";
 import NetUtils from "../utils/NetUtils";
 import DataUtils from '../utils/DataUtils';
 import FetchUtils from "../utils/FetchUtils";
 import Storage from '../utils/Storage';
 import ModalDropdown from 'native';
 export default class ProductCG extends Component {
     constructor(props){
         super(props);
         this.state = {
             show:false,
             Number:"",
         };
     }
     Return(){
         this.props.navigator.pop();
     }
     onclick(){
         var nextRoute={
             name:"ProductCG_list",
             component:ProductCG_list
         };
         this.props.navigator.push(nextRoute)
     }
     render() {
         return (
             <View style={styles.container}>
                 <View style={styles.Head}>
                     <View style={styles.cont}>
                         <TouchableOpacity style={styles.images} onPress={this.Return.bind(this)}>
                             <Image source={require("../images/left.png")} style={styles.HeaderImage}></Image>
                         </TouchableOpacity>
                         <View style={styles.HeadList}>
                             <Text style={styles.HeadText}>商品采购</Text>
                         </View>
                     </View>
                 </View>
                 <View style={styles.ContList}>
                     <View style={styles.listleft}>
                         <Text style={styles.listLeftText}>供应商编码:</Text>
                     </View>
                     <TouchableOpacity style={styles.listcont} onPress={this.onclick.bind(this)}>
                         <Text style={styles.listContText}>111</Text>
                     </TouchableOpacity>
                     <View style={styles.listimages}>
                         <Image source={require("../images/right.png")} style={styles.Image}></Image>
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
     Head:{
         height:50,
         backgroundColor:"#f47882",
         paddingTop:10,
         borderBottomWidth:1,
         borderBottomColor:"#cacccb",
     },
     cont:{
         flexDirection:"row",
         marginLeft:25,
     },
     images:{
         width:60,
     },
     HeadList:{
         flex:6,
         marginTop:2,
     },
     HeadText:{
         color:"#ffffff",
         fontSize:18,
         textAlign:"center",
     },
     ContList:{
         height:50,
         marginTop:20,
         paddingTop:10,
         paddingLeft:25,
         flexDirection:"row",
         borderBottomWidth:1,
         borderBottomColor:"#cacccb",
     },
     listleft:{
         flex:2,
     },
     listLeftText:{
         color:"#323232",
         fontSize:17,
     },
     listcont:{
         flex:7,
     },
     listContText:{
         color:"#323232",
         fontSize:17,
     },
     listimages:{
         flex:1,
     },
     Image:{
     },
 });



