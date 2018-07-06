/**
 * 历史单据 每比单据详情列表
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    ListView,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';

import HistoricalDocument from "./HistoricalDocument";
import FetchUtils from "../utils/FetchUtils";
import NetUtils from "../utils/NetUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
export default class GoodsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqDetailCode: "",
            ShopCountm: "",
            Number: "",
            storecode: "",
            numbershop: "",
            name: "",
            checktype: "",
            prototal: "",
            ClientCode: "",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
            Formno: this.props.Formno ? this.props.Formno : "",
            FormDate: this.props.FormDate ? this.props.FormDate : "",
            promemo: this.props.promemo ? this.props.promemo : "无",
            depname: this.props.depname ? this.props.depname : "",
        };
        this.dataRows = [];
        this.DataShop = [];
    }

    componentDidMount() {
        var date = new Date();
        var getFullYear = date.getFullYear();
        var getMonth = date.getMonth() + 1;
        var getDate = date.getDate();
        var getHours = date.getHours();
        var getMinutes = date.getMinutes();
        var getSeconds = date.getSeconds();
        if (getMonth >= 0 && getMonth <= 9) {
            var getMonth = "0" + getMonth;
        }
        if (getDate >= 0 && getDate <= 9) {
            var getDate = "0" + getDate;
        }
        if (getHours >= 0 && getHours <= 9) {
            var getHours = "0" + getHours;
        }
        if (getMinutes >= 0 && getMinutes <= 9) {
            var getMinutes = "0" + getMinutes;
        }
        if (getSeconds >= 0 && getSeconds <= 9) {
            var getSeconds = "0" + getSeconds;
        }
        var SfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
        //获取本地数据库url
        Storage.get('LinkUrl').then((tags) => {
            this.setState({
                linkurl: tags
            })
        });

        //reqDetailCode
        Storage.get('historyClass').then((tags) => {
            this.setState({
                reqDetailCode: tags
            });
        });

        Storage.get('Name').then((tags) => {
            this.setState({
                name: tags
            })
        });

        //username
        Storage.get('userName').then((tags) => {
            this.setState({
                Username: tags
            });
        });

        //usercode
        Storage.get('usercode').then((tags) => {
            this.setState({
                usercode: tags
            });
        });

        Storage.get('ClientCode').then((tags) => {
            this.setState({
                ClientCode: tags
            });
        });

        Storage.get('code').then((tags) => {
            Storage.get("usercode").then((usercode) => {
                Storage.get("userName").then((username) => {
                    let params = {
                        ClientCode: this.state.ClientCode,
                        username: this.state.Username,
                        usercode: usercode,
                    };
                });
                let params = {
                    reqCode: 'App_PosReq',
                    reqDetailCode: this.state.reqDetailCode,
                    ClientCode: this.state.ClientCode,
                    sDateTime: SfullTime,
                    Sign: NetUtils.MD5("App_PosReq" + "##" + this.state.reqDetailCode + "##" + SfullTime + "##" + "PosControlCs") + '',
                    username: this.state.Username,
                    usercode: usercode,
                    BeginDate: "",
                    EndDate: "",
                    shopcode: tags,
                    formno: this.state.Formno,
                    prodcode: "",
                };
                FetchUtils.post(this.state.linkurl, JSON.stringify(params)).then((data) => {
                    if (data.retcode == 1) {
                        var numbercode = data.DetailInfo1.storecode;
                        var depname = data.DetailInfo1.depname;
                        var numbershop = data.DetailInfo1.childshop;
                        var checktype = data.DetailInfo1.checktype;
                        var prototal = data.DetailInfo1.prototal;
                        var DetailInfo2 = data.DetailInfo2;
                        var shopnumber = 0;
                        for (let i = 0; i < DetailInfo2.length; i++) {
                            var row = DetailInfo2[i];
                            var number = row.countm;
                            shopnumber += Number(row.countm);
                        }
                        this.dataRows = this.dataRows.concat(DetailInfo2);
                        this.DataShop = this.DataShop.concat(DetailInfo2);
                        var num = shopnumber.toFixed(2);//四舍五入保留两位
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                            Number: num,
                            storecode: numbercode,
                            numbershop: numbershop,
                            checktype: checktype,
                            prototal: prototal,
                        })
                    } else {
                        alert(JSON.stringify(data))
                    }
                }, (err) => {
                    alert("网络请求失败");
                })
            });
        })
    }

    GoodsDetails() {
        var nextRoute = {
            name: "HistoricalDocument",
            component: HistoricalDocument
        };
        this.props.navigator.push(nextRoute)
    }

    ShenHeButton() {
        var date = new Date();
        var getFullYear = date.getFullYear();
        var getMonth = date.getMonth() + 1;
        var getDate = date.getDate();
        var getHours = date.getHours();
        var getMinutes = date.getMinutes();
        var getSeconds = date.getSeconds();
        if (getMonth >= 0 && getMonth <= 9) {
            var getMonth = "0" + getMonth;
        }
        if (getDate >= 0 && getDate <= 9) {
            var getDate = "0" + getDate;
        }
        if (getHours >= 0 && getHours <= 9) {
            var getHours = "0" + getHours;
        }
        if (getMinutes >= 0 && getMinutes <= 9) {
            var getMinutes = "0" + getMinutes;
        }
        if (getSeconds >= 0 && getSeconds <= 9) {
            var getSeconds = "0" + getSeconds;
        }
        var SfullTime = getFullYear + "-" + getMonth + "-" + getDate + " " + getHours + ":" + getMinutes + ":" + getSeconds;
        Storage.get('code').then((ShopCode) => {
            Storage.get('LinkUrl').then((LinkUrl) => {
                Storage.get("usercode").then((usercode) => {
                    Storage.get("userName").then((username) => {
                        Storage.get("FormCheck").then((FormCheck) => {
                            Storage.get('OrgFormno').then((OrgFormno) => {
                                let params = {
                                    reqCode: "App_PosReq",
                                    reqDetailCode: "App_Client_FormCheck",
                                    ClientCode: this.state.ClientCode,
                                    sDateTime: SfullTime,
                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_FormCheck" + "##" + SfullTime + "##" + "PosControlCs") + '',
                                    ShopCode: ShopCode,
                                    ChildShopCode: "",
                                    Formno: this.state.Formno,
                                    OrgFormno: "",
                                    Usercode: usercode,
                                    Username: username,
                                    FormType: FormCheck,

                                };
                                FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
                                    if (data.retcode == 1) {
                                        if (this.state.checktype == "未审核") {
                                            this.setState({
                                                checktype: "已审核",
                                            })
                                        }
                                    } else {
                                        var msg = data.msg;
                                        if (msg == "判断用户的权限出错") {
                                            alert("用户没有权限")
                                        } else {
                                            alert(JSON.stringify(data));
                                        }
                                    }
                                }, (err) => {
                                    alert("网络请求失败");
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    DaYin() {
        Storage.get('Pid').then((Pid) => {
            Storage.get('code').then((ShopName) => {
                Storage.get('MenDianName').then((MenDianName) => {
                    Storage.get('usercode').then((usercode) => {
                        Storage.get('userName').then((userName) => {
                            Storage.get('Name').then((Name) => {
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
                                NativeModules.AndroidPrintInterface.initPrint();
                                NativeModules.AndroidPrintInterface.setFontSize(30, 26, 0x26,);
                                NativeModules.AndroidPrintInterface.print(" " + " " + " " + " " + " " + " " + " " + " " + MenDianName + "\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.setFontSize(20, 20, 0x22);
                                NativeModules.AndroidPrintInterface.print("服务员：" + userName + "\n");
                                NativeModules.AndroidPrintInterface.print("当前单据：" + Name + "\n");
                                if (hh < 12) {
                                    var hours = "上午"
                                } else if (hh >= 12) {
                                    var hours = "下午"
                                }
                                NativeModules.AndroidPrintInterface.print(year + "年" + month + "月" + day + "日" + " " + hours + hh + ":" + mm + ":" + ss + "\n");
                                NativeModules.AndroidPrintInterface.print("------------------------------------------------------------" + "\n");
                                NativeModules.AndroidPrintInterface.print("名称" + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + "数量" + " " + " " + " " + " " + "单价" + " " + " " + " " + " " + "小计" + "\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                console.log(this.DataShop.length)
                                for (let i = 0; i < this.DataShop.length; i++) {
                                    var DataRows = this.DataShop[i];
                                    var num = DataRows.prototal / DataRows.countm;
                                    var ProPrice = num.toFixed(2)
                                    NativeModules.AndroidPrintInterface.print(DataRows.prodname + " " + " " + " " + " " + "\n");
                                    NativeModules.AndroidPrintInterface.print(" " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + " " + DataRows.countm + " " + " " + " " + " " + " " + " " + " " + ProPrice + " " + " " + " " + " " + DataRows.prototal + "\n");
                                    NativeModules.AndroidPrintInterface.print("\n");
                                }
                                NativeModules.AndroidPrintInterface.print("总价：" + this.state.prototal + "\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.print("\n");
                                NativeModules.AndroidPrintInterface.startPrint();
                            })
                        })
                    })
                })
            })
        })
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <ScrollView style={styles.shoprow} horizontal={true}>
                <View style={styles.Direction}>
                    <View style={[{width: 80, marginRight: 5}]}>
                        <Text style={styles.Name1}>{rowData.prodname}</Text>
                    </View>
                    <View style={[{width: 80, marginRight: 5}]}>
                        <Text style={styles.Name1}>{rowData.countm}</Text>
                    </View>
                    <View style={[{width: 80, marginRight: 5}]}>
                        <Text style={styles.Name1}>{rowData.prototal}</Text>
                    </View>
                    <View style={styles.ShopList1}>
                        <Text style={styles.Name1}>{rowData.promemo}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <TouchableOpacity onPress={this.GoodsDetails.bind(this)}>
                            <Image source={require("../images/2_01.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                        <Text style={styles.HeaderList}>{this.state.Formno}</Text>
                    </View>
                </View>
                <View style={styles.Cont}>
                    <View style={styles.List}>
                        {
                            (this.state.name == "门店要货") ?
                                null
                                :
                                <View>
                                    {
                                        (this.state.name == "批发销售"||this.state.name == "批发报价")?
                                            <View style={[styles.ListLeft, {marginRight: 10, backgroundColor: "#fffbe7"}]}>
                                                <Text style={styles.ListText}>批发客户：</Text>
                                                <Text style={styles.ListText}>{this.state.storecode}</Text>
                                            </View>
                                            :
                                            <View style={[styles.ListLeft, {marginRight: 10, backgroundColor: "#fffbe7"}]}>
                                                {
                                                    (this.state.reqDetailCode == "App_Client_ProCGDetailQ" || this.state.reqDetailCode == "App_Client_ProYSDetailQ" || this.state.reqDetailCode == "App_Client_ProXPDetailCGQ" || this.state.reqDetailCode == "App_Client_ProXPDetailYSQ") ?
                                                        <Text style={styles.ListText}>供应商：</Text>
                                                        :
                                                        <Text style={styles.ListText}>仓库：</Text>
                                                }
                                                <Text style={styles.ListText}>{this.state.storecode}</Text>
                                            </View>
                                    }
                                </View>
                        }
                        <View style={styles.ListRight}>
                            <Text style={styles.ListText}>货品数：</Text>
                            <Text style={styles.ListText}>{this.state.Number}</Text>
                        </View>
                    </View>
                    <View style={styles.List}>
                        <View style={[styles.ListLeft, {flex: 1}]}>
                            <Text style={styles.ListText}>单据备注：</Text>
                            <Text style={styles.ListText}>{this.state.promemo}</Text>
                        </View>
                    </View>
                    <View style={styles.List}>
                        <View style={[styles.ListLeft, {flex: 2}]}>
                            <Text style={styles.ListText}>单据状态：</Text>
                            <Text style={[styles.ListText, {color: "#ff4e4e"}]}>{this.state.checktype}</Text>
                        </View>
                        {
                            (this.state.checktype == "已审核") ?
                                <TouchableOpacity style={styles.ShenHe} onPress={this.DaYin.bind(this)}>
                                    <Text style={styles.ShenHe_text}>打印</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={styles.ShenHe} onPress={this.ShenHeButton.bind(this)}>
                                    <Text style={styles.ShenHe_text}>审核</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.List}>
                        <View style={styles.ListLeft}>
                            <Text style={styles.ListText}>制单日期：</Text>
                            <Text style={styles.ListText}>{this.state.FormDate}</Text>
                        </View>
                    </View>
                    <View style={styles.List}>
                        <View style={styles.ListLeft}>
                            <Text style={styles.ListText}>商品品类：</Text>
                            <Text style={styles.ListText}>{this.state.depname}</Text>
                        </View>
                    </View>
                    {
                        (this.state.reqDetailCode == "App_Client_ProXPDetailCGQ" || this.state.reqDetailCode == "App_Client_ProXPDetailYSQ") ?
                            <View style={styles.List}>
                                <View style={styles.ListLeft}>
                                    <Text style={styles.ListText}>机构号：</Text>
                                    <Text style={styles.ListText}>{this.state.numbershop}</Text>
                                </View>
                            </View> : null
                    }
                </View>
                <View style={styles.ShopCont}>
                    <View style={styles.ShopList}>
                        <View style={[{width: 80,}]}>
                            <Text style={styles.Name}>名称</Text>
                        </View>
                        <View style={[{width: 80,}]}>
                            <Text style={styles.Name}>数量</Text>
                        </View>
                        <View style={[{width: 80,}]}>
                            <Text style={styles.Name}>金额</Text>
                        </View>
                        <View style={styles.ShopList1}>
                            <Text style={styles.Name}></Text>
                        </View>
                    </View>
                    <ListView
                        style={styles.listViewStyle}
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={true}
                        renderRow={this._renderRow.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        height: 60,
        backgroundColor: "#ff4e4e",
        paddingTop: 10,
    },
    cont: {
        flexDirection: "row",
        paddingLeft: 16,
        paddingRight: 16,
    },
    HeaderList: {
        flex: 6,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 22,
        marginTop: 3,
    },
    Cont: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 15,
        backgroundColor: "#fffbe7"
    },
    List: {
        height: 28,
        marginBottom: 10,
        flexDirection: "row",
    },
    ListText: {
        fontSize: 16,
        color: "#333333"
    },
    ListLeft: {
        flexDirection: "row",
        flex: 2,
    },
    ListRight: {
        flexDirection: "row",
        flex: 1,
    },
    Listright: {
        flexDirection: "row",
        flex: 1
    },
    ShopList: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 15,
        paddingBottom: 15,
        height: 55,
        flexDirection: "row",
    },
    ShopCont: {
        marginBottom: 30,
    },
    Name: {
        flex: 1,
        color: "#666666",
        fontSize: 16,
        textAlign: "center"
    },
    shoprow: {
        flex: 1,
    },
    Direction: {
        paddingLeft: 25,
        paddingTop: 20,
        paddingBottom: 20,
        height: 61,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
    },
    ShopList1: {
        flex: 1
    },
    Name1: {
        flex: 1,
        color: "#333333",
        fontSize: 16,
        textAlign: "center"
    },
    ContList: {
        paddingBottom: 50,
    },
    listViewStyle: {
        marginBottom: 300,
        backgroundColor: "#ffffff"
    },
    ShenHe: {
        flex: 1,
        height: 30,
        paddingTop: 4,
        paddingBottom: 5,
        borderRadius: 5,
        backgroundColor: "#ffba00"
    },
    ShenHe_text: {
        textAlign: "center",
        color: "#ffffff",
        fontSize: 16,
    },
});