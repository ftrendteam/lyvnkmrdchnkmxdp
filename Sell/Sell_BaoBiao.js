/**
 * 销售报表
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Button,
    Modal,
    ListView,
    TextInput,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import styles from "../style/styles";//style样式引用
import DateUtil from "../utils/DateUtil";
import DBAdapter from "../adapter/DBAdapter";//接口页面
import Storage from "../utils/Storage";
import DatePicker from "react-native-dateandtime";

let dbAdapter = new DBAdapter();
let dateutil = new DateUtil();
let db;

export default class BaoBiao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Sdate: "",
            Edate: "",
            startime: "",
            endtime: "",
            Sell: "",
            TShop: "",
            sTotal: "",
            combined: "",
            SellShop: "",
            TotalPrice: "",
            CustomerNumber: "",
            price: "",
            YHamount: "",
            JYamount: "",
            Report: "",
            startDate: DateUtil.formatDateTime(new Date()),
            endDate: DateUtil.formatDateTime(new Date()),
            BBName: this.props.BBName ? this.props.BBName : "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        }
        this.dataRows = [];
    }

    componentDidMount() {
        var date = new Date();
        var getFullYear = date.getFullYear();
        var getMonth = date.getMonth() + 1;
        var getDate = date.getDate();
        if (getMonth >= 0 && getMonth <= 9) {
            var getMonth = "0" + getMonth;
        }
        if (getDate >= 0 && getDate <= 9) {
            var getDate = "0" + getDate;
        }
        var SfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + "00:00:00";
        var EfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + "23:59:59";
        this.setState({
            Sdate: SfullTime,
            Edate: EfullTime
        })

    }

    Return() {
        this.props.navigator.pop();
    }

    pressPop() {
        if (this.state.BBName == "总交易报表") {
            dbAdapter.SelectAllData(this.state.Sdate, this.state.Edate).then((rows) => {
                var Sell = 0;
                var SellShop = 0;
                var TShop = 0;
                var TotalPrice = 0;
                var CustomerNumber = 0;
                var price = 0;
                var sTotal = 0;
                var combined = 0;//合计
                var YHamount = 0;
                var JYamount = 0;
                if (rows.length == 0) {
                    this.setState({
                        Report: 0,
                    })
                } else {
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                        var total = row.Total;
                        var amount = row.Amount;
                        if (row.TradeFlag == "T") {
                            Sell += Number(total);//销售
                        }
                        if (row.TradeFlag == "R") {
                            TShop += Number(total);//退货
                        }
                        if (row.TradeFlag == "A") {
                            sTotal += Number(total);//收入总计
                        }
                        if (row.TradeFlag == "B") {
                            combined += Number(total);//支出合计
                        }
                        SellShop += Number(amount);//销售数量
                        TotalPrice = Sell + TShop;//合计
                        CustomerNumber = 0;//顾客数
                        price = TotalPrice / CustomerNumber;//客单价
                        YHamount = row.DscTotal;//优惠金额
                        JYamount = sTotal + combined + TotalPrice;//结余金额
                    }
                    this.setState({
                        Sell: Sell,
                        TShop: TShop,
                        sTotal: sTotal,
                        combined: combined,
                        SellShop: SellShop,
                        TotalPrice: TotalPrice,
                        CustomerNumber: CustomerNumber,
                        price: price,
                        YHamount: YHamount,
                        JYamount: JYamount,
                        Report: 1,
                    })
                }
            })
        }
        else if (this.state.BBName == "收款员报表") {
            Storage.get('username').then((tags) => {
                dbAdapter.selectCashier(tags, this.state.Sdate, this.state.Edate).then((rows) => {
                    var Sell = 0;
                    var TShop = 0;
                    var TotalPrice = 0;
                    var sTotal = 0;
                    var combined = 0;//合计
                    var YHamount = 0;
                    if (rows.length == 0) {
                        this.setState({
                            Report: 0,
                        })
                    } else {
                        for (let i = 0; i < rows.length; i++) {
                            var row = rows.item(i);
                            var total = row.Total;
                            if (row.TradeFlag == "T") {
                                Sell += Number(total);//销售
                            }
                            if (row.TradeFlag == "R") {
                                TShop += Number(total);//退货
                            }
                            if (row.TradeFlag == "A") {
                                sTotal += Number(total);//收入总计
                            }
                            if (row.TradeFlag == "B") {
                                combined += Number(total);//支出合计
                            }
                            TotalPrice = Sell + TShop;//合计
                            YHamount = row.DscTotal;//优惠金额
                        }
                        this.setState({
                            Sell: Sell,
                            TShop: TShop,
                            sTotal: sTotal,
                            combined: combined,
                            TotalPrice: TotalPrice,
                            YHamount: YHamount,
                            Report: 1,
                        })
                    }
                })
            });
        }
        else if (this.state.BBName == "品类报表") {
            let currentDepCode = [];
            dbAdapter.selectDep(this.state.Sdate, this.state.Edate).then((rows) => {
                if (rows.length == 0) {
                    this.setState({
                        Report: 0,
                    })
                } else {
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                        if (currentDepCode.indexOf(row.DepCode) < 0) {
                            currentDepCode.push(row.DepCode);
                        }
                    }
                    for (let j = 0; j < currentDepCode.length; j++) {
                        let curDep = currentDepCode[j];
                        let depCode = "";
                        let depName = "";
                        let scalNum = 0;
                        let scalTotal = 0;
                        let retTotal = 0;
                        let dscTotal = 0;
                        for (let k = 0; k < rows.length; k++) {
                            var row = rows.item(k);
                            if (curDep == row.DepCode) {
                                depCode = row.DepCode;
                                depName = row.DepName;
                                scalNum += row.Amount;
                                if (row.TradeFlag == "T") {
                                    scalTotal += row.Total;
                                }
                                if (row.TradeFlag == "R") {
                                    retTotal += row.Total;
                                }
                                dscTotal = row.DscTotal;
                                break;
                            }
                        }
                        let depObj = {
                            'depCode': depCode,
                            'depName': depName,
                            'scalNum': scalNum.toFixed(2),
                            'scalTotal': scalTotal.toFixed(2),
                            'retTotal': retTotal.toFixed(2),
                            'dscTotal': dscTotal,
                        }
                        this.dataRows.push(depObj);
                    }
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                        Report: 1,
                    })
                }
            })
        }
        else if (this.state.BBName == "单品报表") {
            dbAdapter.selectSingleProd(this.state.Sdate, this.state.Edate).then((rows) => {
                if (rows.length == 0) {
                    this.setState({
                        Report: 0,
                    })
                } else {
                    let ProdCode = "";
                    let ProdName = "";
                    let scalTotal = 0;
                    let retTotal = 0;
                    let DscTotal = 0;
                    let BarCode = 0;
                    for (let i = 0; i < rows.length; i++) {
                        var row = rows.item(i);
                        ProdCode = row.ProdCode;
                        ProdName = row.ProdName;
                        if (row.TradeFlag == "T") {
                            scalTotal = row.Total;
                        }
                        if (row.TradeFlag == "R") {
                            retTotal = row.Total;
                        }
                        DscTotal = row.DscTotal;
                        BarCode = row.BarCode;
                        let depObj = {
                            'ProdCode': ProdCode,
                            'ProdName': ProdName,
                            'scalTotal': scalTotal,
                            'retTotal': retTotal,
                            'DscTotal': DscTotal,
                            'BarCode': BarCode,
                        }
                        this.dataRows.push(depObj);
                    }
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                        Report: 1,
                    })
                }
            })
        }
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <View>
                {
                    (this.state.BBName == "品类报表")?
                        <View style={styles.Title}>
                            <View style={styles.Name}>
                                <Text style={[styles.RowName, {color: "#ff4e4e"}]}>{rowData.depCode}</Text>
                                <Text style={[styles.RowName, {color: "#ff4e4e"}]}>{rowData.depName}</Text>
                            </View>
                            <View style={styles.Name}>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>销售数量：</Text>
                                    <Text style={styles.RowName}>{rowData.scalNum}</Text>
                                </View>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>销售金额：</Text>
                                    <Text style={styles.RowName}>{rowData.scalTotal}</Text>
                                </View>
                            </View>
                            <View style={styles.Name}>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>退货金额：</Text>
                                    <Text style={styles.RowName}>{rowData.retTotal}</Text>
                                </View>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>优惠金额：</Text>
                                    <Text style={styles.RowName}>{rowData.dscTotal}</Text>
                                </View>
                            </View>
                        </View>
                        :
                        <View style={styles.Title}>
                            <View style={styles.Name}>
                                <Text style={[styles.RowName, {color: "#ff4e4e"}]}>{rowData.ProdCode}</Text>
                                <Text style={[styles.RowName, {color: "#ff4e4e"}]}>{rowData.ProdName}</Text>
                            </View>
                            <View style={styles.Name}>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>销售金额：</Text>
                                    <Text style={styles.RowName}>{rowData.scalTotal}</Text>
                                </View>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>退货金额：</Text>
                                    <Text style={styles.RowName}>{rowData.retTotal}</Text>
                                </View>
                            </View>
                            <View style={styles.Name}>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>优惠金额：</Text>
                                    <Text style={styles.RowName}>{rowData.DscTotal}</Text>
                                </View>
                                <View style={styles.XSNumber}>
                                    <Text style={styles.RowNumber}>条码：</Text>
                                    <Text style={styles.RowName}>{rowData.BarCode}</Text>
                                </View>
                            </View>
                        </View>
                }
            </View>
        )

    }

    // _renderRow(rowData, sectionID, rowID) {
    //     console.log(rowData.depCode)
    //     return (
    //         <View style={[styles.BB_Title,{backgroundColor:"#f2f2f2",borderBottomWidth: 1, borderBottomColor: "#e3e3e3",}]}>
    //             <View style={[styles.BB_Title,{backgroundColor:"#f2f2f2"}]}>
    //                 <Text style={styles.RowName}>{rowData.depCode}</Text>
    //                 <Text style={styles.RowName}>{rowData.depName}</Text>
    //             </View>
    //             <View style={[styles.BB_Title,{backgroundColor:"#f2f2f2"}]}>
    //                 <Text style={styles.RowName}>销售数量：</Text>
    //                 <Text style={styles.RowName}>{rowData.scalNum}</Text>
    //             </View>
    //             <View style={[styles.BB_Title,{backgroundColor:"#f2f2f2"}]}>
    //                 <Text style={styles.RowName}>销售金额：</Text>
    //                 <Text style={styles.RowName}>{rowData.scalTotal}</Text>
    //             </View>
    //             <View style={[styles.BB_Title,{backgroundColor:"#f2f2f2"}]}>
    //                 <Text style={styles.RowName}>退货金额：</Text>
    //                 <Text style={styles.RowName}>{rowData.retTotal}</Text>
    //             </View>
    //             <View style={[styles.BB_Title,{backgroundColor:"#f2f2f2"}]}>
    //                 <Text style={styles.RowName}>优惠金额：</Text>
    //                 <Text style={styles.RowName}>{rowData.dscTotal}</Text>
    //             </View>
    //         </View>
    //     )
    // }

    showStartTimePicker(data) {
        var date = new Date();
        this.picker.showTimePicker(date, (a) => {
            var getHours = a.getHours();
            var getMinutes = a.getMinutes();
            var getSeconds = a.getSeconds();
            if (getHours >= 0 && getHours <= 9) {
                var getHours = "0" + a.getHours();
            }
            if (getMinutes >= 0 && getMinutes <= 9) {
                var getMinutes = "0" + a.getMinutes();
            }
            if (getSeconds >= 0 && getSeconds <= 9) {
                var getSeconds = "0" + a.getSeconds();
            }
            var getdata = getHours + ":" + getMinutes + ":" + getSeconds;
            var STime = this.state.startDate + " " + getdata;
            this.setState({
                Sdate: STime,
                starttime: "",
            });
            if (this.state.endtime == "2") {
                var ETime = this.state.endDate + " " + getdata;
                alert(ETime)
                this.setState({
                    Edate: ETime
                });
            }
        });
    }

    showEndTimePicker(data) {
        var date = new Date();
        this.picker.showTimePicker(date, (a) => {
            var getHours = a.getHours();
            var getMinutes = a.getMinutes();
            var getSeconds = a.getSeconds();
            if (getHours >= 0 && getHours <= 9) {
                var getHours = "0" + a.getHours();
            }
            if (getMinutes >= 0 && getMinutes <= 9) {
                var getMinutes = "0" + a.getMinutes();
            }
            if (getSeconds >= 0 && getSeconds <= 9) {
                var getSeconds = "0" + a.getSeconds();
            }
            var getdata = getHours + ":" + getMinutes + ":" + getSeconds;
            var ETime = this.state.endDate + " " + getdata;
            this.setState({
                Edate: ETime
            });
        });
    }

    showDatePicker(data) {
        if (data) {
            var startDate = new Date();
            this.picker.showDatePicker(startDate, (d) => {
                this.setState({
                    startDate: DateUtil.formatDateTime(d),
                });
                this.showStartTimePicker();
            });
        } else {
            var endDate = new Date();
            this.picker.showDatePicker(endDate, (d) => {
                this.setState({
                    endDate: DateUtil.formatDateTime(d),
                });
                this.showEndTimePicker();
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.Return.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>{this.state.BBName}</Text>
                    </View>
                </View>
                <View style={styles.Content}>
                    <TouchableOpacity style={styles.ContList} onPress={(data) => {
                        this.showDatePicker(true)
                    }}>
                        <Text style={styles.ContLeft}>开始日期</Text>
                        <Text style={styles.ContRight}>{this.state.Sdate.toString()}</Text>
                        <DatePicker
                            theme='2'
                            ref={(picker) => {
                                this.picker = picker
                            }}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.ContList} onPress={(data) => {
                        this.showDatePicker(false)
                    }}>
                        <Text style={styles.ContLeft}>结束日期</Text>
                        <Text style={styles.ContRight}>{this.state.Edate.toString()}</Text>
                        <DatePicker theme="3" ref={(picker) => {
                            this.picker = picker
                        }}/>
                    </TouchableOpacity>
                    <View style={[styles.Row, {marginLeft: 15, marginRight: 15}]}>
                        <TouchableOpacity style={[styles.button, {marginRight: 15,}]}
                                          onPress={this.pressPop.bind(this)}>
                            <Text style={styles.ButtonText}>查询</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this.pressPop.bind(this)}>
                            <Text style={styles.ButtonText}>打印</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.BB_Title}>
                        <Text style={styles.RowName}>项目</Text>
                        <Text style={styles.RowName}>金额</Text>
                    </View>
                    {
                        (this.state.Report == 0) ?
                            <View style={styles.Null}>
                                <Text style={styles.NullText}>
                                    没有搜索到相关内容~~~
                                </Text>

                            </View>
                            :
                            <ScrollView style={styles.list}>
                                {
                                    (this.state.BBName == "品类报表" || this.state.BBName == "单品报表") ?
                                        <ListView
                                            style={styles.ListView}
                                            dataSource={this.state.dataSource}
                                            showsVerticalScrollIndicator={true}
                                            renderRow={this._renderRow.bind(this)}
                                        />
                                        :
                                        <View>
                                            <View style={[styles.BB_Title, {
                                                backgroundColor: "#f2f2f2",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#e3e3e3",
                                            }]}>
                                                <Text style={styles.RowName}>销售</Text>
                                                <Text style={styles.RowName}>{this.state.Sell}</Text>
                                            </View>
                                            {
                                                (this.state.BBName == "收款员报表") ?
                                                    null
                                                    :
                                                    <View style={[styles.BB_Title, {
                                                        backgroundColor: "#f2f2f2",
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#e3e3e3",
                                                    }]}>
                                                        <Text style={styles.RowName}>商品销售数量</Text>
                                                        <Text style={styles.RowName}>{this.state.SellShop}</Text>
                                                    </View>
                                            }
                                            <View style={[styles.BB_Title, {
                                                backgroundColor: "#f2f2f2",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#e3e3e3",
                                            }]}>
                                                <Text style={styles.RowName}>退货</Text>
                                                <Text style={styles.RowName}>{this.state.TShop}</Text>
                                            </View>
                                            <View style={[styles.BB_Title, {
                                                backgroundColor: "#f2f2f2",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#e3e3e3",
                                            }]}>
                                                <Text style={styles.RowName}>合计</Text>
                                                <Text style={styles.RowName}>{this.state.TotalPrice}</Text>
                                            </View>
                                            {
                                                (this.state.BBName == "收款员报表") ?
                                                    null
                                                    :
                                                    <View style={[styles.BB_Title, {
                                                        backgroundColor: "#f2f2f2",
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#e3e3e3",
                                                    }]}>
                                                        <Text style={styles.RowName}>顾客数</Text>
                                                        <Text style={styles.RowName}>{this.state.CustomerNumber}</Text>
                                                    </View>
                                            }
                                            {
                                                (this.state.BBName == "收款员报表") ?
                                                    null
                                                    :
                                                    <View style={[styles.BB_Title, {
                                                        backgroundColor: "#f2f2f2",
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#e3e3e3",
                                                    }]}>
                                                        <Text style={styles.RowName}>客单价</Text>
                                                        <Text style={styles.RowName}>{this.state.price}</Text>
                                                    </View>
                                            }
                                            <View style={[styles.BB_Title, {
                                                backgroundColor: "#f2f2f2",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#e3e3e3",
                                            }]}>
                                                <Text style={styles.RowName}>收入总价</Text>
                                                <Text style={styles.RowName}>{this.state.sTotal}</Text>
                                            </View>
                                            <View style={[styles.BB_Title, {
                                                backgroundColor: "#f2f2f2",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#e3e3e3",
                                            }]}>
                                                <Text style={styles.RowName}>支出合计</Text>
                                                <Text style={styles.RowName}>{this.state.combined}</Text>
                                            </View>
                                            <View style={[styles.BB_Title, {
                                                backgroundColor: "#f2f2f2",
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#e3e3e3",
                                            }]}>
                                                <Text style={styles.RowName}>优惠金额</Text>
                                                <Text style={styles.RowName}>{this.state.YHamount}</Text>
                                            </View>
                                            {
                                                (this.state.BBName == "收款员报表") ?
                                                    null
                                                    :
                                                    <View style={[styles.BB_Title, {
                                                        backgroundColor: "#f2f2f2",
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: "#e3e3e3",
                                                    }]}>
                                                        <Text style={styles.RowName}>结余金额</Text>
                                                        <Text style={styles.RowName}>{this.state.JYamount}</Text>
                                                    </View>
                                            }
                                        </View>

                                }
                            </ScrollView>
                    }
                </View>
            </View>
        );
    }
}