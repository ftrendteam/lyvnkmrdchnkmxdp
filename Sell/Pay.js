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
    FlatList,
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
            Amount:"",
            payments:"",
            Payname:"",
            retZjf:"",
            ReferenceNo:"",
            retTxt:"",
            payname:"",
            Total:"",
            PayretcurrJF:"",
            data:"",
            innerNo:"",
            custType:"",
            VipCardNo:"",
            cardfaceno:"",
            JfBal:this.props.JfBal ? this.props.JfBal : "",
            BalanceTotal:this.props.BalanceTotal ? this.props.BalanceTotal : "",
            ShopAmount:this.props.ShopAmount ? this.props.ShopAmount : "",
            numform:this.props.numform ? this.props.numform : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        }
        this.dataRows = [];
        this.productData = [];
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

        Storage.get('VipCardNo').then((tags) => {
            if(tags==null){
                alert(tags)
                this.setState({
                    custType:0,
                    custCode:"",
                })
            }else{
                alert(tags)
                this.setState({
                    custType:2,
                    custCode:this.state.VipCardNo,
                })
            }
        });

        var total=0;
        this.setState({
            payments:total,
        })
        this.dbadapter();
    }

    dbadapter(){
        dbAdapter.selectAllData("payInfo").then((rows)=>{
            let priductData=[];
            for(let i =0;i<rows.length;i++){
                var row = rows.item(i);
                // var Payname = rows.item(0).payName;
                priductData.push(row);
            };
            this.productData=priductData;
            this.setState({
                data:priductData,
            })
        })
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
        if(this.state.ShopAmount==this.state.payments){
            var nextRoute = {
                name: "Sell",
                component: Sell,
            };
            this.props.navigator.push(nextRoute);
            dbAdapter.deleteData("shopInfo");
            Storage.delete("VipCardNo")
        }else{
            ToastAndroid.show('订单未完成', ToastAndroid.SHORT)
        }
    }

    _renderRow(rowData, sectionID, rowID){
        if(this.state.payname=="现金"){
            return (
                <View style={styles.ShopList1} onPress={()=>this.OrderDetails(rowData)}>
                    <View style={styles.Row}><Text style={styles.Name}>{this.state.payname}</Text></View>
                    <View style={styles.Row}><Text style={styles.Name}></Text></View>
                    <View style={styles.Row}><Text style={styles.Name}>{this.state.Amount}</Text></View>
                    <View style={styles.Row}><Text style={styles.Name}>{rowData.retZjf}</Text></View>
                    <View style={styles.Row}><Text style={styles.Name}>{rowData.ReferenceNo}</Text></View>
                </View>
            );
        }else if(this.state.payname=="储值卡"){
            return (
                <View style={styles.ShopList1} onPress={()=>this.OrderDetails(rowData)}>
                    <View style={styles.Row}><Text style={styles.Name}>{this.state.payname}</Text></View>
                    <View style={styles.Row}><Text style={styles.Name}>{this.state.CardFaceNo}</Text></View>
                    <View style={styles.Row}><Text style={styles.Name}>{rowData.retcurrJF}</Text></View>
                    <View style={styles.Row}><Text style={styles.Name}>{rowData.retZjf}</Text></View>
                    <View style={styles.Row}><Text style={styles.Name}>{rowData.ReferenceNo}</Text></View>
                </View>
            );
        }
    }

    HorButton(item){
        if(item.item.PayCode=="01"){
            if(this.state.amount==""){
                alert("请输入付款额")
            }else if(this.state.payments>this.state.ShopAmount){
                alert("付款额不能大于应付金额");
            }else{
                this.Total();
                // this.setState({
                //     payname:"储值卡",
                // })
            }
        }else if(item.item.PayCode=="00"){
            if(this.state.amount==""){
                alert("请输入付款额")
            }else if(this.state.payments>this.state.ShopAmount){
                alert("付款额不能大于应付金额");
            }else{
                var Amount={'payName': '', 'payTotal': '', 'payRT': ''};
                this.dataRows = this.dataRows.concat(Amount);
                this.state.payments+=parseInt(this.state.amount);
                this.setState({
                    Amount:this.state.amount,
                    payments:this.state.payments,
                    payname:"现金",
                    cardfaceno:"",
                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                })
            }
        }
    }

    _renderItem(item,index){
        return(
            <TouchableOpacity onPress={()=>this.HorButton(item)} style={[styles.PageRowButton,{marginRight:5}]}>
                <Text style={styles.PageRowText}>
                    {item.item.payName}
                </Text>
            </TouchableOpacity>
        )
    }
    //FlatList加入kay值
    keyExtractor(item: Object, index: number) {
        return item.payName//FlatList使用json中的ProdName动态绑定key
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

                                };
                                this.state.payments +=retcurrJF;
                                this.dataRows = this.dataRows.concat(TblRow);
                                var Total = this.state.ShopAmount-retcurrJF;
                                this.setState({
                                    payments:this.state.payments,
                                    Amount:retcurrJF,
                                    retZjf:retZjf,
                                    ReferenceNo:ReferenceNo,
                                    retTxt:retTxt,
                                    CardFaceNo:this.state.CardFaceNo,
                                    Total:Total,
                                    payname:"储值卡",
                                    dataSource:this.state.dataSource.cloneWithRows(this.dataRows),
                                });
                                Storage.get('innerNo').then((innerNo) => {
                                    Storage.get('VipCardNo').then((VipCardNo) => {
                                        Storage.get('Pid').then((Pid) => {
                                            Storage.get('usercode').then((usercode) => {
                                                Storage.get('userName').then((userName) => {
                                                    Storage.get('ino').then((ino) => {
                                                        if (this.state.ShopAmount > this.state.payments) {
                                                            var now = new Date();
                                                            var year = now.getFullYear();
                                                            var month = now.getMonth() + 1;
                                                            var day = now.getDate();
                                                            var hh = now.getHours();
                                                            var mm = now.getMinutes();
                                                            var ss = now.getSeconds();
                                                            if (month >= 1 && month <= 9) {
                                                                month = "0" + month;
                                                            }
                                                            if (day >= 1 && day <= 9) {
                                                                day = "0" + day;
                                                            }
                                                            if (hh >= 1 && hh <= 9) {
                                                                hh = "0" + hh;
                                                            }
                                                            if (mm >= 1 && mm <= 9) {
                                                                mm = "0" + mm;
                                                            }
                                                            if (ss >= 1 && ss <= 9) {
                                                                ss = "0" + ss;
                                                            }
                                                            var SumData = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
                                                            //插入Sum表
                                                            var sumDatas = [];
                                                            var sum = {};
                                                            ino = parseInt(ino);
                                                            sum.LsNo = this.state.numform;
                                                            sum.sDateTime = SumData;
                                                            sum.CashierId = Pid;
                                                            sum.CashierCode = usercode;
                                                            sum.CashierName = userName;
                                                            sum.ino = ino+1;
                                                            sum.DscTotal = "";
                                                            sum.Total = this.state.ShopAmount;
                                                            sum.TotalPay = this.state.payments;
                                                            sum.Change = "";
                                                            sum.TradeFlag = "";
                                                            sum.CustType = this.state.custType;
                                                            sum.CustCode = VipCardNo;
                                                            sum.PayId = "";
                                                            sum.PayCode = "";
                                                            sum.Amount = "";
                                                            sum.OldAmount = "";
                                                            sum.TendPayCode = "";
                                                            sum.InnerNo = innerNo;
                                                            // alert(this.state.numform + "+" + SumData + "+" +Pid + "+" +usercode + "+" +userName + "+" + this.state.ShopAmount + "+" + this.state.payments + "+" + this.state.custType + "+" + VipCardNo + "+" + innerNo);
                                                            sumDatas.push(sum);
                                                            dbAdapter.insertSum(sumDatas);
                                                            var abc=JSON.stringify(ino+1);
                                                            Storage.save("ino", abc);
                                                            // dbAdapter.deleteData("shopInfo");
                                                        };
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                                this.Total();

                            }else{
                                alert(JSON.stringify(data))
                            }
                        })
                    })
                })
            })
        })
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
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>{this.state.payments}</Text>
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
                    <FlatList
                        horizontal = {true}
                        key={item => item.Pid}
                        style={styles.horizontal}
                        renderItem={this._renderItem.bind(this)}
                        data={this.state.data}
                        keyExtractor={this.keyExtractor}
                        getItemLayout={(data, index) => (
                            {length: 50, offset: 50 * index, index}
                        )}
                    />
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
    horizontal:{
        marginLeft:10,
        marginRight:10,
        marginTop:20,
        paddingBottom:15,
    },
    PageRowButton:{
        backgroundColor:"#ff4e4e",
        borderRadius:5,
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
        height:46,
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