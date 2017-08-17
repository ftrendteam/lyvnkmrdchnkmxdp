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
    componentWillUpdate(nextProps) {
         // 接收通知
         this.notice = DeviceEventEmitter.addListener('refreshList', ()=>{
             // 1. 购买数量清零
             const tempWine = this.state.wine;
             tempWine.buyNum = 0;

             this.setState({
                 wine: tempWine
             })
         });
    }
    componentDidUnMount() {
        // 移除通知
        this.notice.remove();
    }
    /**
     * 移除商品
     */
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
                          <TouchableHighlight onPress={this.OrderDetails.bind(this)} style={styles.Image}>
                              <Image source={require("../images/image.png")}></Image>
                          </TouchableHighlight>
                          <TouchableOpacity style={styles.Name} onPress={()=>this._addWine(wine)}>
                            <Text style={styles.Text}>{wine.name}</Text>
                            <Text>¥{wine.money}</Text>
                          </TouchableOpacity>
                          <View style={styles.rightView}>
                             <Text style={{fontSize:16, margin: 10}}>{wine.buyNum}</Text>
                             <TouchableOpacity onPress={()=>this._removeWine(wine)}>
                                  <Text style={[{fontSize:20}, styles.circleStyle]}>-</Text>
                             </TouchableOpacity>
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
        paddingTop:10,
        paddingBottom:10,
    },
    ListView:{
        flexDirection:'row',
    },
    Image:{
        width:80,
        height:80,
        backgroundColor:"#cccc",
        marginRight:10,
    },
    Name:{
        flex:6,
    },
    Text:{

    },
    money:{

    },
    rightView: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        position:"absolute",
        bottom:5,
        right:0,
    },
    circleStyle:{
        width: 18,
        height: 18,
        borderRadius: 15,
        backgroundColor:'red',
        textAlign:'center',
        lineHeight:14,
        color:'#ffffff',
        fontWeight:'900'
    }
});
module.exports = XZHWineCell;