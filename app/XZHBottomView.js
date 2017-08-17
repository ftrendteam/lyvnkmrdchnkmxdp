/**
 * Created by a123 on 2017/3/20.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    DeviceEventEmitter,
    Modal,
    TextInput
} from 'react-native';
import Succeed from "./Succeed";
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
class XZHBottomView extends Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
        show:false,
            // 购买商品总金额
            totalPrice: 0,
            // 购买的酒数组
            buyWineArr: []
        };
    }
    Succeed(){
          var nextRoute={
              name:"主页",
              component:Succeed
          };
          this.props.navigator.push(nextRoute)
    }
      _rightButtonClick() {
          console.log('右侧按钮点击了');
          this._setModalVisible();
      }
      _setModalVisible() {
          let isShow = this.state.show;
          this.setState({
            show:!isShow,
          });
      }
    
    render(){
        return(
            <View style={styles.viewStyle}>
                <View style={styles.Combined}>
                    <Text style={styles.CombinedText}>合计：</Text>
                </View>
                <View style={styles.Client}>
                    <Text style={styles.ClientText}>
                        <Text style={styles.client}>客户：</Text>
                        <Text style={styles.ClientType}>散户</Text>
                    </Text>
                    <Text style={styles.goodSNumber}>
                        <Text style={styles.goods}>货品：</Text>
                        <Text style={styles.GoodsNumber }>2</Text>
                     </Text>
                     <Text style={styles.Price1}>¥{this.state.totalPrice}</Text>
                </View>
                <View style={styles.Note}>
                    <TouchableOpacity onPress={this._rightButtonClick.bind(this)}>
                        <Text style={styles.DocumentsNote}>单据备注</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Submit} onPress={()=>this._buy()}>
                        <Text style={{fontSize:16,color:"#ffffff",}}>提交</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.rightView}>
                  <TouchableOpacity onPress={()=>this._clearGoods()}>
                    <Text style={{fontSize:16, color:'red'}}>清空购物车</Text>
                  </TouchableOpacity>
                </View>
                <Modal
                transparent={true}
                visible={this.state.show}
                onShow={() => {}}
                onRequestClose={() => {}} >
                     <View style={styles.modalStyle}>
                          <View style={styles.LayerThickness}></View>
                               <View style={styles.ModalView}>
                                    <View style={styles.DanJu}><Text style={styles.DanText}>单据备注</Text></View>
                                          <TextInput
                                          multiline={true}
                                          placeholder="请填写单据备注信息"
                                          underlineColorAndroid='transparent'
                                          placeholderTextColor="#bcbdc1"
                                          style={styles.TextInput} />
                                          <View style={styles.ModalLeft} >
                                               <Text style={styles.buttonText1} onPress={this._setModalVisible.bind(this)}>×</Text>
                                    </View>
                               </View>
                          </View>
                </Modal>
            </View>
        )
    }


    /**
     * 点击购买
     * @private
     */
    _buy() {
        var buyString = '您购买的商品清单: \n';
        this.state.buyWineArr.forEach((value, index)=>{
            buyString += '(' + (index+1) + ') 商品ID:' + value.id + ', 单价:' + value.money + ', 购买数量' + value.buyNum + '\n';
        });
        alert(buyString + '\n' + '总价:' + this.state.totalPrice + '元');
    }
    /**
     * 清空购物车
     * @private
     */
    _clearGoods() {
        // 1. 删除购物车中所有商品
        const buyWineArr = this.state.buyWineArr;
        buyWineArr.splice(0, buyWineArr.length);

        // 2. 更新状态,刷新UI
        this.setState({
            buyWineArr: buyWineArr,
            totalPrice: 0
        })
        // 3. 通知界面刷新
        DeviceEventEmitter.emit('refreshList', null);
    }
    componentDidMount() {
        this.notice = DeviceEventEmitter.addListener('changeTotalPrice', (wine)=>{
            // 1. 深拷贝一个新对象
            var tempWine = JSON.parse(JSON.stringify(wine));
            // 2. 判断
            var tempWineArr = this.state.buyWineArr;
            tempWineArr.forEach((value, index)=>{
                if(value.id == tempWine.id){
                    tempWineArr.splice(index, 1);
                }
            });

            if(tempWine.buyNum > 0){
                tempWineArr.push(tempWine);
            }

            // 3. 计算总价
            var totalPrice = 0;
            tempWineArr.forEach((value, index)=>{
                totalPrice += value.buyNum * value.money
            });

            // 4. 更新状态,刷新UI
            this.setState({
                totalPrice: totalPrice,
                buyWineArr: tempWineArr
            })
        });
    }

    componentWillUnMount() {
        this.notice.remove();
    }
}


const styles = StyleSheet.create({
    viewStyle:{
        backgroundColor:"#ffffff",
        borderTopWidth:1,
        borderTopColor:"#f5f5f5",
        paddingLeft:25,
        paddingRight:25,
        paddingTop:15,
        height:150,
    },

    leftView:{
        flexDirection:'row',
        marginLeft: 8
    },

    rightView:{
        flexDirection:'row',
        marginRight: 8
    },
        CombinedText:{
            fontSize:16,
            color:"#555555",
        },
        Client:{
            marginTop:10,
            marginBottom:10,
            flexDirection:'row',
        },
        client:{
            fontSize:16,
            color:"#555555",
        },
        ClientType:{
            fontSize:16,
            color:"#555555",
        },
        goods:{
            fontSize:16,
            color:"#555555"
        },
        ClientText:{
            flex:4
        },
        goodSNumber:{
            flex:2
        },
        GoodsNumber:{
            fontSize:16,
            color:"#555555"
        },
        Price1:{
            fontSize:16,
            color:"#f47882",
            flex:2,
            textAlign:"right"
        },
        DocumentsNote:{
            fontSize:16,
            color:"#f47882"
        },
        Submit:{

            backgroundColor:"#f47882",
            paddingTop:15,
            paddingBottom:15,
            paddingLeft:50,
            paddingRight:50,
            position:"absolute",
            right:0,
        },
       modalStyle: {
         flex:1,
       },
       LayerThickness:{
            backgroundColor:"#000000",
            opacity:0.5,
            flex:1,
       },
       ModalView:{
            position:"absolute",
            width:400,
            height:260,
            backgroundColor:"#ffffff",
            borderRadius:5,
            top:250,
            marginLeft:100,
       },
       DanJu:{
        height:45,
        backgroundColor:"#fbced2",
        borderRadius:5,
       },
       DanText:{
        color:"#f47882",
        lineHeight:30,
        textAlign:"center",
        fontSize:16,
       },
       TextInput:{
        width:350,
        marginLeft:25,
        marginRight:25,
        height:180,
        marginTop:15,
        borderWidth:1,
        borderColor:"#fbced2",
       },
       ModalLeft:{
        position:"absolute",
        right:15,
        top:3,
       },
       buttonText1:{
        color:"#f47882",
        fontSize:24,
       }
});


module.exports = XZHBottomView;