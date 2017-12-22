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
    ListView,
    TextInput,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import Storage from "../utils/Storage";
import Swiper from 'react-native-swiper'
export default class Pay extends Component {

    constructor(props){
        super(props);
        this.state = {
            name:"",
            JfBal:this.props.JfBal ? this.props.JfBal : "",
            BalanceTotal:this.props.BalanceTotal ? this.props.BalanceTotal : "",
            ShopAmount:this.props.ShopAmount ? this.props.ShopAmount : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        }
    }

    componentDidMount(){
        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
            });
        });

    }

    Return(){
        this.props.navigator.pop();
    }

    _renderRow(rowData, sectionID, rowID){
        return (
            <TouchableOpacity style={styles.ShopList1} onPress={()=>this.OrderDetails(rowData)}>
                <View style={styles.ShopTop}>
                    <Text style={[styles.Name,styles.Name1]}>1</Text>
                    <Text style={[styles.Number,styles.Name1]}>.00 (件)</Text>
                    <Text style={[styles.Price,styles.Name1]}>3</Text>
                    <Text style={[styles.SmallScale,styles.Name1]}>4</Text>
                </View>
            </TouchableOpacity>
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.ScrollView}>
                    <View style={styles.header}>
                        <View style={styles.cont}>
                            <TouchableOpacity onPress={this.Return.bind(this)}>
                                <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                            </TouchableOpacity>
                            <Text style={styles.HeaderList}>{this.state.name}</Text>
                        </View>
                    </View>
                    <View style={styles.TitleCont}>
                        <View style={styles.FristList}>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>应付金额</Text>
                                </View>
                            </View>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>支付金额</Text>
                                </View>
                            </View>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>剩余金额</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.FristList}>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>{this.state.ShopAmount}</Text>
                                </View>
                            </View>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>0.00</Text>
                                </View>
                            </View>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>5987.00</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.ShopCont}>
                        <View style={[{backgroundColor:"#ff4e4e",width:10,height:60,position:"absolute",left:0,}]}></View>
                        <View style={[{backgroundColor:"#ff4e4e",width:10,height:60,position:"absolute",right:0,}]}></View>
                        <View style={styles.ShopList}>
                            <View style={styles.ListTitle}>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>付款方式</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>卡号</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>金额</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>余额</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>折扣</Text>
                                </View>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>交易号</Text>
                                </View>
                            </View>
                            <ListView
                                style={styles.scrollview}
                                dataSource={this.state.dataSource}
                                showsVerticalScrollIndicator={true}
                                renderRow={this._renderRow.bind(this)}
                            />
                        </View>
                    </View>
                    <View style={styles.MemberMent}>
                        <View style={styles.Member}>
                            <View style={styles.MemberLeft}>
                                <Text style={styles.MemberText}>积分：</Text>
                            </View>
                            <View style={styles.MemberRight}>
                                <Text style={styles.MemberText}>{this.state.JfBal}</Text>
                            </View>
                        </View>
                        <View style={styles.Member}>
                            <View style={styles.MemberLeft}>
                                <Text style={styles.MemberText}>余额：</Text>
                            </View>
                            <View style={styles.MemberRight}>
                                <Text style={styles.MemberText}>{this.state.BalanceTotal}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.PayMent}>
                        <View style={styles.FirstMent}>
                            <View style={styles.paymentleft}>
                                <Text style={styles.InpuTingText}>付款额：</Text>
                            </View>
                            <View style={styles.paymentright}>
                              <TextInput
                                  autofocus={true}
                                  numberoflines={1}
                                  keyboardType="numeric"
                                  textalign="center"
                                  underlineColorAndroid='transparent'
                                  style={styles.paymentinput}
                              />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.FirstMent1}>
                            <Text style={styles.FirstMentText}>整单销售</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.FirstMent1}>
                            <Text style={styles.FirstMentText}>继续交易</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.Swiper}>
                        <Swiper
                            style={styles.swiper}          //样式
                            height={200}                   //组件高度
                            loop={true}                    //如果设置为false，那么滑动到最后一张时，再次滑动将不会滑到第一张图片。
                            autoplayTimeout={4}                //每隔4秒切换
                            horizontal={true}              //水平方向，为false可设置为竖直方向
                            paginationStyle={{bottom: 10}} //小圆点的位置：距离底部10px
                            showsButtons={true}           //为false时不显示控制按钮
                            showsPagination={false}       //为false不显示下方圆点
                            dot={<View style={{           //未选中的圆点样式
                                backgroundColor: 'rgba(0,0,0,.2)',
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                marginLeft: 10,
                                marginRight: 9,
                                marginTop: 9,
                                marginBottom: 9,
                            }}/>}
                            activeDot={<View style={{    //选中的圆点样式
                                backgroundColor: '#007aff',
                                width: 18,
                                height: 18,
                                borderRadius: 4,
                                marginLeft: 10,
                                marginRight: 9,
                                marginTop: 9,
                                marginBottom: 9,
                            }}/>}
                        >
                            <View style={styles.FristPage}>
                                <View style={styles.PageRow}>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            代金券
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            储值卡
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            活动券
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.FristPage}>
                                <View style={styles.PageRow}>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            1
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            2
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            3
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.FristPage}>
                                <View style={styles.PageRow}>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            1
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            2
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            3
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Swiper>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        paddingBottom:10,
    },
    header:{
        height:60,
        backgroundColor:"#ff4e4e",
        paddingTop:10,
    },
    cont:{
        flexDirection:"row",
        paddingLeft:16,
        paddingRight:16,
    },
    HeaderList:{
        flex:6,
        textAlign:"center",
        paddingRight:56,
        color:"#ffffff",
        fontSize:22,
        marginTop:3,
    },
    TitleCont:{
        height:74,
        backgroundColor:"#ff4e4e",
        paddingLeft:10,
        paddingRight:10,
    },
    FristList:{
        height:30,
        paddingTop:5,
        flexDirection:"row",
    },
    List:{
        flex:1,
        flexDirection:"row",
    },
    ListView:{
        flex:1,
        height:20,
        overflow:"hidden",
        backgroundColor:"#ff4e4e"
    },
    ListView1:{
        flex:1
    },
    ListText:{
        color:"#ffffff",
        fontSize:16,
    },
    ShopCont:{
        paddingLeft:10,
        paddingRight:10,
    },
    ShopList:{
        height:180,
        borderRadius:5,
        backgroundColor:"#ffffff",
    },
    ListTitle:{
        height:54,
        paddingTop:16,
        flexDirection:"row",
        backgroundColor:"#f2f2f2",
        borderTopLeftRadius:5,
        borderTopRightRadius:5,
    },
    ListClass:{
        flex:3
    },
    ListClass1:{
        flex:2
    },
    ListClassText:{
        color:"#666666",
        fontSize:16,
        textAlign:"center"
    },
    Prece:{
        height:54,
        marginTop:10,
        marginLeft:20,
        marginRight:20,
        flexDirection:"row"
    },
    InputingLeft:{
        width:80,
        marginTop:15
    },
    InpuTingText:{
        color:"#333333",
        fontSize:16,
    },
    InputingRight:{
        flex:1,
        height:54,
        paddingTop:6,
        backgroundColor:"#ffffff",
        borderRadius:5,
    },
    Inputing:{
        flex:2,
        flexDirection:"row"
    },
    Inputing1:{
        flex:3,
        flexDirection:"row"
    },
    Inputingleft:{
        width:65,
        height:20,
    },
    Inputingright:{
        flex:1,
        height:20,
        overflow:"hidden",
    },
    InputingText:{
        fontSize:18,
        color:"#333333",
    },
    Inputing1Left:{
        flexDirection:"row"
    },
    Swiper:{
        height:50,
        marginTop:16,
    },
    FristPage:{
        marginLeft:44,
        marginRight:44,
    },
    PageRow:{
        height:50,
        flexDirection:"row"
    },
    PageRowButton:{
        flex:1,
        backgroundColor:"#ff4e4e",
        borderRadius:5,
        paddingTop:14,
    },
    PageRowText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"center"
    },
    MemberMent:{
        height:35,
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        flexDirection:"row"
    },
    MemberText:{
    color:"#333333",
        fontSize:16,
    },
    Member:{
        flex:1,
        flexDirection:"row",
    },
    MemberLeft:{
        width:50,
    },
    MemberRight:{
        flex:1
    },
    PayMent:{
        height:45,
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        flexDirection:"row"
    },
    FirstMent:{
        flex:1,
        flexDirection:"row"
    },
    FirstMent1:{
        width:70,
        marginLeft:3,
        marginRight:3,
        backgroundColor:"#ff4e4e",
        borderRadius:5,
        paddingTop:6,
        height:35
    },
    FirstMentText:{
        color:"#ffffff",
        fontSize:16,
        textAlign:"center",
    },
    paymentleft:{
        width:65,
        paddingTop:7,
    },
    paymentright:{
        flex:1,
        height:35,
        backgroundColor:"#ffffff",
        borderRadius:5,
    },
    paymentinput:{
        flex:1,
    },
    ShopList1:{
        paddingLeft:25,
        paddingRight:25,
        height:40,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2"
    },
    ShopTop:{
        flexDirection:"row",
    },
    Name:{
        flex:2,
        fontSize:18,
        color:"#333333",
    },
    Number:{
        flex:1,
        textAlign:"right",
        fontSize:18,
        color:"#333333",
    },
    Name1:{
        color:"#333333",
        fontSize:16,
        height:22,
        overflow:"hidden",
    },
    Price:{
        flex:1,
        textAlign:"right",
        fontSize:18,
        color:"#333333",
    },
    SmallScale:{
        flex:1,
        textAlign:"right",
        fontSize:18,
        color:"#333333",
    },
});
