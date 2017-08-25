/**
 * Created by a123 on 2017/3/20.
 */
import React, { Component, PropTypes } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    InteractionManager,
    DeviceEventEmitter,
    TouchableHighlight
} from 'react-native';
import OrderDetails from "./OrderDetails";
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
class XZHWineCell extends Component{
    // 构造
      constructor(props) {
        super(props);

        // 初始状态
        this.state = {
            wine: this.props.wine
        };
      }
      OrderDetails(){
         var nextRoute={
             name:"主页",
             component:OrderDetails
         };
         this.props.navigator.push(nextRoute)
      }
    _removeWine(wine){
        // 1.判断
        if(wine.buyNum == 0){
            alert('商品数量不能小于0');
            return;
        }
        // 2. 改变数量
        wine.buyNum --;
        this.setState({
            wine: wine
        });
        // 3. 发出通知
        this._changeTotalPrice(wine);
    }
    /**
     * 添加商品
     */
    _addWine(wine){
        // 1. 改变数量
        wine.buyNum ++;
        this.setState({
            wine: wine
        });
        // 2. 发出通知
        this._changeTotalPrice(wine);
    }
    /**
     * 发出通知
     * @param wine 购买的商品
     * @private
     */
    _changeTotalPrice(wine){
        DeviceEventEmitter.emit('changeTotalPrice', wine);
    }
    render(){
        var wine = this.state.wine;
        return(
                    <View style={styles.viewStyle}>
                        <View style={styles.ListMenu}>
                              <TouchableHighlight onPress={this.OrderDetails.bind(this)} style={styles.Image}>
                                  <Image source={require("../images/image.png")}></Image>
                              </TouchableHighlight>
                              <TouchableOpacity style={styles.Name} onPress={()=>this._addWine(wine)}>
                                <Text style={styles.Text}>{wine.name}</Text>
                              </TouchableOpacity>
                              <View style={styles.rightView}>
                                 <Text style={{fontSize:16, margin: 5}}>{wine.buyNum}</Text>
                                 <TouchableOpacity onPress={()=>this._removeWine(wine)}>
                                      <Text style={[{fontSize:20}, styles.circleStyle]}>-</Text>
                                 </TouchableOpacity>
                              </View>
                        </View>
                        <View style={styles.ListMenu1}>
                              <TouchableHighlight onPress={this.OrderDetails.bind(this)} style={styles.Image}>
                                  <Image source={require("../images/image.png")}></Image>
                              </TouchableHighlight>
                              <TouchableOpacity style={styles.Name} onPress={()=>this._addWine(wine)}>
                                <Text style={styles.Text}>{wine.name}</Text>
                              </TouchableOpacity>
                              <View style={styles.rightView}>
                                 <Text style={{fontSize:16, margin: 5}}>{wine.buyNum}</Text>
                                 <TouchableOpacity onPress={()=>this._removeWine(wine)}>
                                      <Text style={[{fontSize:20}, styles.circleStyle]}>-</Text>
                                 </TouchableOpacity>
                              </View>
                         </View>
                        <View style={styles.ListMenu}>
                              <TouchableHighlight onPress={this.OrderDetails.bind(this)} style={styles.Image}>
                                  <Image source={require("../images/image.png")}></Image>
                              </TouchableHighlight>
                              <TouchableOpacity style={styles.Name} onPress={()=>this._addWine(wine)}>
                                <Text style={styles.Text}>{wine.name}</Text>
                              </TouchableOpacity>
                              <View style={styles.rightView}>
                                 <Text style={{fontSize:16, margin: 5}}>{wine.buyNum}</Text>
                                 <TouchableOpacity onPress={()=>this._removeWine(wine)}>
                                      <Text style={[{fontSize:20}, styles.circleStyle]}>-</Text>
                                 </TouchableOpacity>
                              </View>
                        </View>
                    </View>

        )
    }
}
const styles = StyleSheet.create({
    viewStyle:{
        flexDirection:'row',
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderBottomColor: '#ccc',

    },
    ListMenu:{
        flex:1,
         paddingTop:10,
         paddingBottom:10,
         paddingLeft:5,
    },
    ListMenu1:{
        flex:1,
        borderLeftWidth:1,
        borderLeftColor: '#ccc',
        borderRightWidth:1,
        borderRightColor: '#ccc',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:5,
        paddingRight:5,
    },
    Image:{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:8
    },
    Name:{
        flex:6,
    },
    Text:{
    height:22,
    textAlign:"center",
    },
    money:{
    height:22,
    },
    rightView: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        position:"absolute",
        top:2,
        right:5,
        position:"absolute"
    },
    circleStyle:{
        width: 15,
        height: 15,
        borderRadius: 15,
        backgroundColor:'red',
        textAlign:'center',
        lineHeight:13,
        color:'#ffffff',
        fontWeight:'900'
    }
});
module.exports = XZHWineCell;