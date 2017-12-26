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
    Modal,
    ListView,
    TextInput,
    ScrollView,
    ToastAndroid,
    TouchableOpacity
} from 'react-native';
import Sell from "../Sell/Sell";
import NetUtils from "../utils/NetUtils";
import FetchUtil from "../utils/FetchUtils";
import Storage from "../utils/Storage";
import Swiper from 'react-native-swiper';
import DBAdapter from "../adapter/DBAdapter";

let dbAdapter = new DBAdapter();
export default class Pay extends Component {
    constructor(props){
        super(props);
        this.state = {
            total:false,
            CardFaceNo:"",
            CardPwd:"",
            name:"",
            amount:"",
            retcurrJF:"",
            retZjf:"",
            ReferenceNo:"",
            retTxt:"",
            payname:"",
            Total:"",
            PayretcurrJF:"",
            JfBal:this.props.JfBal ? this.props.JfBal : "",
            BalanceTotal:this.props.BalanceTotal ? this.props.BalanceTotal : "",
            ShopAmount:this.props.ShopAmount ? this.props.ShopAmount : "",
            numform:this.props.numform ? this.props.numform : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        }
        this.dataRows = [];
    }

    Total() {
        let isShow = this.state.total;
        this.setState({
            total: !isShow,
        });
    }
    //物理键
    // componentWillMount(){
    //     if (Platform.OS === 'android') {
    //         BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    //     if (Platform.OS === 'android') {
    //         BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    //     }
    //     onBackAndroid = () => {
    //         const nav = this.navigator;
    //         const routers = nav.getCurrentRoutes();
    //         if (routers.length > 1) {
    //             nav.pop();
    //             return true;
    //         }
    //         return false;
    //     };
    // }

    componentDidMount(){
        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
            });
        });
    }

    Return(){
        if(this.state.CardFaceNo==""){
            this.props.navigator.pop();
        }else{
            ToastAndroid.show('订单未完成', ToastAndroid.SHORT)
        }
    }

    //继续交易
    JiaoYi(){
        if(this.state.ShopAmount==this.state.retcurrJF){
            var nextRoute = {
                name: "Sell",
                component: Sell,
            };
            this.props.navigator.push(nextRoute);
            dbAdapter.deleteData("shopInfo");
            Storage.delete("")
        }else{
            ToastAndroid.show('订单未完成', ToastAndroid.SHORT)
        }
    }

    _renderRow(rowData, sectionID, rowID){
        return (
            <View style={styles.ShopList1} onPress={()=>this.OrderDetails(rowData)}>
                <View style={styles.Row}><Text style={styles.Name}>{this.state.payname}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{this.state.CardFaceNo}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.PayretcurrJF}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.retZjf}</Text></View>
                <View style={styles.Row}><Text style={styles.Name}>{rowData.ReferenceNo}</Text></View>
            </View>
        );
    }
    //储值卡
    Card(){
        if(this.state.amount==""){
            alert("请输入付款额")
        }else{
            this.Total();
            this.setState({
                payname:"储值卡",
            })
        }
    }
    //储值卡网络请求
    Button(){
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hh = now.getHours();
        var mm = now.getMinutes();
        var ss = now.getSeconds();
        if(month >= 1 && month <= 9){
            month = "0" + month;
        }
        if(day >= 1 && day <= 9){
            day = "0" + day;
        }
        if(hh >= 1 && hh <= 9){
            hh = "0" + hh;
        }
        if(mm >= 1 && mm <= 9){
            mm = "0" + mm;
        }
        if(ss >= 1 && ss <= 9){
            ss = "0" + ss;
        }
        var sum=year+"-"+month+"-"+day+" "+hh+":"+mm+":"+ss;
        return new Promise((resolve, reject) => {
            Storage.get('ShopCode').then((ShopCode) => {
                Storage.get('PosCode').then((PosCode) => {
                    let params={
                        TblName:"VipCardPay",
                        PayOrderNo:this.state.numform,
                        CardPwd:NetUtils.MD5(this.state.CardPwd)+'',
                        shopcode:ShopCode,
                        poscode:PosCode,
                        CardFaceNo:this.state.CardFaceNo,
                        OrderTotal:this.state.amount,
                        SaleTotal:this.state.ShopAmount,
                        JfValue:0,
                        TransFlag:sum,
                    }
                    // alert(JSON.stringify(params));
                    Storage.get('LinkUrl').then((tags) => {
                        FetchUtil.post(tags, JSON.stringify(params)).then((data) => {
                            if(data.retcode==1){
                                var TblRow = data.TblRow;
                                var retcurrJF;
                                var retZjf;
                                var ReferenceNo;
                                var retTxt;
                                var PayretcurrJF;
                                for (let i = 0; i < TblRow.length; i++) {
                                    var row = TblRow[i];
                                    retcurrJF = row.retcurrJF;
                                    retZjf = row.retZjf;
                                    ReferenceNo = row.ReferenceNo;
                                    retTxt = row.retTxt;
                                }
                                this.dataRows = this.dataRows.concat(TblRow);
                                var Total = this.state.ShopAmount-retcurrJF;
                                this.setState({
                                    retcurrJF:retcurrJF,
                                    retZjf:retZjf,
                                    ReferenceNo:ReferenceNo,
                                    retTxt:retTxt,
                                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                                    CardFaceNo:this.state.CardFaceNo,
                                    Total:Total,
                                    amount:"",
                                });
                                //插入Sum表
                                var sumDatas = [];
                                var sum = {};
                                sum.LsNo = this.state.numform;
                                sum.sDateTime = "2017-10-10";
                                sumDatas.push(sum);
                                dbAdapter.insertSum(sumDatas);
                                this.Total();
                                dbAdapter.deleteData("shopInfo");

                            }else{
                                alert(JSON.stringify(data))
                            }
                        })
                    })
                })
            })
        })
    }

    Sum(){
        var insertSum = [];
        var sumDatas = {};
        sumDatas.LsNo = this.state.numform;
        insertSum.push(sumDatas);
        //调用插入表方法
        dbAdapter.insertSum(sumDatas);
    }

    CloseButton() {
        this.Total();
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
                            <Text style={styles.HeaderList}>付款</Text>
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
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>{this.state.retcurrJF}</Text>
                                </View>
                            </View>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>{this.state.Total}</Text>
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
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>卡号</Text>
                                </View>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>金额</Text>
                                </View>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>余额</Text>
                                </View>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>凭证</Text>
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
                                  onChangeText={(value)=>{
                                      this.setState({
                                          amount:value
                                      })
                                  }}
                              />
                            </View>
                        </View>
                        <TouchableOpacity style={styles.FirstMent1}>
                            <Text style={styles.FirstMentText}>整单优惠</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.JiaoYi.bind(this)} style={styles.FirstMent1}>
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
                                    <TouchableOpacity onPress={this.Card.bind(this)} style={[styles.PageRowButton,{marginRight:5}]}>
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
                <Modal
                    transparent={true}
                    visible={this.state.total}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.MemberBounces}>
                        <View style={styles.Cont}>
                            <View style={styles.BouncesTitle}>
                                <Text style={[styles.TitleText, {fontSize: 18}]}>储值卡</Text>
                            </View>
                            <View style={styles.MemberCont}>
                                <View style={styles.MemberView}>
                                    <View style={styles.Card}>
                                        <Text style={styles.CardText}>卡号：</Text>
                                    </View>
                                    <View style={styles.CardNumber}>
                                        <TextInput
                                            returnKeyType='search'
                                            autofocus={true}
                                            keyboardType="numeric"
                                            textalign="center"
                                            underlineColorAndroid='transparent'
                                            placeholderTextColor="#bcbdc1"
                                            style={styles.CardTextInput}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    CardFaceNo: value
                                                })
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.MemberView}>
                                    <View style={styles.Card}>
                                        <Text style={styles.CardText}>密码：</Text>
                                    </View>
                                    <View style={styles.CardNumber}>
                                        <TextInput
                                            returnKeyType='search'
                                            autofocus={true}
                                            keyboardType="numeric"
                                            textalign="center"
                                            underlineColorAndroid='transparent'
                                            placeholderTextColor="#bcbdc1"
                                            style={styles.CardTextInput}
                                            onChangeText={(value) => {
                                                this.setState({
                                                    CardPwd: value
                                                })
                                            }}
                                        />
                                    </View>
                                </View>
                                <View style={styles.MemberButton}>
                                    <TouchableOpacity onPress={this.CloseButton.bind(this)}
                                                      style={[styles.MemberClose, {marginRight: 15,}]}>
                                        <Text style={styles.TitleText}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.Button.bind(this)} style={styles.MemberClose}>
                                        <Text style={styles.TitleText}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        flex:1
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
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:"#ffffff",
        borderBottomWidth:1,
        borderBottomColor:"#f2f2f2",
        flexDirection:"row",
    },
    Row:{
        flex:1,
        height:22,
    },
    Name:{
        fontSize:16,
        color:"#333333",
        overflow:"hidden",
        textAlign:"center"
    },
    MemberBounces: {
        backgroundColor: "#3e3d3d",
        opacity: 0.9,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Cont: {
        width: 280,
        borderRadius: 5,
        paddingBottom: 20,
        backgroundColor: "#f2f2f2",
    },
    BouncesTitle: {
        paddingTop: 13,
        paddingBottom: 13,
        backgroundColor: "#ff4e4e",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        flexDirection: 'row',
    },
    TitleText: {
        flex: 1,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 16,
    },
    MemberCont: {
        height: 200,
        paddingLeft: 15,
        paddingRight: 15,
    },
    MemberView: {
        flexDirection: "row",
        marginTop: 20,
    },
    Card: {
        width: 50,
        marginTop: 11,
    },
    CardText: {
        fontSize: 16,
        color: "#333333",
    },
    CardNumber: {
        flex: 1,
    },
    CardTextInput: {
        borderRadius: 5,
        backgroundColor: "#ffffff",
        color: "#333333",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        fontSize: 16,
    },
    MemberButton: {
        marginTop: 20,
        flexDirection: "row"
    },
    MemberClose: {
        flex: 1,
        backgroundColor: "#ff4e4e",
        height: 34,
        paddingTop: 6,
        paddingBottom: 6,
        borderRadius: 5,
    },
});
