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
                    <TouchableOpacity style={styles.ShopContList} onPress={()=>this._addWine(wine)}>
                        <View style={styles.ShopTop}>
                            <Text style={styles.ShopLeft}>10000001</Text>
                            <Text style={styles.ShopRight}>单位：件</Text>
                        </View>
                        <View style={styles.ShopTop}>
                            <Text style={[styles.Name,styles.Name1]}></Text>
                            <Text style={[styles.Number,styles.Name1]}>{wine.buyNum}</Text>
                            <Text style={[styles.Price,styles.Name1]}>¥{wine.money}</Text>
                            <Text style={[styles.SmallScale,styles.Name2]}>{this.state.totalPrice}</Text>
                        </View>
                    </TouchableOpacity>
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
    },
    viewStyle:{
        backgroundColor:"#ffffff",
        borderTopWidth:1,
        borderTopColor:"#f5f5f5",

        paddingTop:15,
        height:150,
    },
    ShopContList:{
       paddingLeft:25,
       paddingRight:25,
       paddingTop:20,
    },
    ShopTop:{
        marginBottom:20,
        flexDirection:"row",
    },
    ShopLeft:{
        flex:6,
        color:"#666666",
        fontSize:16,
    },
    ShopRight:{
        flex:2,
        textAlign:"right",
        color:"#666666",
        fontSize:16,
    },
    Name1:{
        color:"#333333",
        fontSize:16,
    },
    Name2:{
        color:"#f63e4d"
    },
    Name:{
        flex:2,
        fontSize:16,
        color:"#333333",
    },
    Number:{
        flex:1,
        textAlign:"right",
        fontSize:16,
        color:"#333333",
    },
    Price:{
        flex:1,
        textAlign:"right",
        fontSize:16,
        color:"#333333",
    },
    SmallScale:{
        flex:1,
        textAlign:"right",
        fontSize:16,
        color:"#333333",
    },
});
module.exports = XZHWineCell;