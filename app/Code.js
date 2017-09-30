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
  TouchableOpacity,
} from 'react-native';
import { QRScannerView } from 'ac-qrcode';
export default class Code extends Component {
    constructor(props){
          super(props);
      }
    pressPop(){
        this.props.navigator.pop();
    }
  render() {
    return (
      <QRScannerView
           onScanResultReceived={this.barcodeReceived.bind(this)}
           renderTopBarView={() => this._renderTitleBar()}
           renderBottomMenuView={() => this._renderMenu()}
       />
    );
  }
  _renderTitleBar(){
      return(
          <View style={styles.Title}>
            <TouchableOpacity onPress={this.pressPop.bind(this)} style={styles.HeaderImage}>
                <Image source={require("../images/left.png")}></Image>
             </TouchableOpacity>
            <Text style={styles.Text1}>扫描商品</Text>
          </View>

      );
  }
  _renderMenu() {
      return (
          <Text style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}>Here is bottom menu</Text>
      )
  }
  barcodeReceived(e) {
      Toast.show('Type: ' + e.type + '\nData: ' + e.data);
      //console.log(e)
  }
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  Title:{
    height:60,
    paddingLeft:25,
    paddingRight:25,
    paddingTop:13,
    flexDirection:"row",
  },
  HeaderImage:{
    width:15,
    height:22,
    marginTop:5,
  },
    Text1:{
    fontSize:18,
    color:"#ffffff",
    flex:8,
    textAlign:"center"
    },
});
