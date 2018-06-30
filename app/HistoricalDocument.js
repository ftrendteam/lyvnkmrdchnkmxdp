/**
 * 历史单据
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Modal,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ListView,
    InteractionManager,
    ActivityIndicator
} from 'react-native';
import Index from "./Index";
import Sell from "../Sell/Sell";
import ShoppingCart from "./ShoppingCart";
import GoodsDetails from "./GoodsDetails";
import Enquiries from "./Enquiries";
import NetUtils from "../utils/NetUtils";
import FetchUtils from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from "../utils/Storage";

let dbAdapter = new DBAdapter();
let db;
export default class HistoricalDocument extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopcod: "",
            name: "",
            endDate: "",
            startDate: "",
            formno: "",
            prodcode: "",
            kaishi1: "",
            jieshu1: "",
            danzi1: "",
            codesw1: "",
            shopcar: "",
            scode: "",
            show: false,
            animating: true,
            nomore: false,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => true,}),
        };
        this.dataRows = [];
    }

    Shop() {
        var nextRoute = {
            name: "主页",
            component: Index
        };
        this.props.navigator.push(nextRoute)
    }

    ShopList() {
        var nextRoute = {
            name: "主页",
            component: ShoppingCart
        };
        this.props.navigator.push(nextRoute);
    }

    pressPush() {
        var nextRoute = {
            name: "主页",
            component: Enquiries,
            params: {
                reloadView: (startDate, endDate, formno, prodcode) => this._reloadView(startDate, endDate, formno, prodcode)
            }
        };
        this.props.navigator.push(nextRoute)
    }

    //不同页面传值
    _reloadView(startDate, endDate, formno, prodcode) {
        this._setModalVisible();
        kaishi = String(startDate);
        jieshu = String(endDate);
        danzi = String(formno);
        codesw = String(prodcode);
        this.setState({
            kaishi1: kaishi,
            jieshu1: jieshu,
            danzi1: danzi,
            codesw1: codesw,
        });
        this.dataRows = [];
        this._dpSearch()
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._setModalVisible();
            this._get();
            this._dpSearch();
            this._fetch();
        });
    }

    _setModalVisible() {
        let isShow = this.state.show;
        this.setState({
            show: !isShow,
        });
    }

    _get() {
        Storage.get('StateMent').then((tags) => {
            if (tags == 0) {
                Storage.get('name').then((tags) => {
                    this.setState({
                        name: tags
                    })
                });
            } else {
                Storage.get('Name').then((tags) => {
                    this.setState({
                        name: tags
                    })
                });
            }
        });

        //username获取
        Storage.get('username').then((tags) => {
            this.setState({
                Username: tags
            });
        });

        //usercode获取
        Storage.get('userpwd').then((tags) => {
            this.setState({
                Userpwd: tags
            });
        });

        Storage.get('ClientCode').then((tags) => {
            this.setState({
                ClientCode: tags
            })
        })
    }

    _dpSearch() {
        Storage.get('code').then((tags) => {
            Storage.get('history').then((reqDetailCode) => {
                Storage.get('LinkUrl').then((LinkUrl) => {
                    Storage.get("usercode", "").then((usercode) => {
                        Storage.get("username", "").then((username) => {
                            let params = {
                                ClientCode: this.state.ClientCode,
                                username: this.state.Username,
                                usercode: this.state.Userpwd,
                            };
                        });
                    });

                    let params = {
                        reqCode: "App_PosReq",
                        reqDetailCode: reqDetailCode,
                        ClientCode: this.state.ClientCode,
                        sDateTime: Date.parse(new Date()),
                        username: this.state.Username,
                        usercode: this.state.Userpwd,
                        BeginDate: this.state.kaishi1,
                        EndDate: this.state.jieshu1,
                        shopcode: tags,
                        childshopcode: "",
                        formno: this.state.danzi1,
                        prodcode: this.state.codesw1,
                        Sign: NetUtils.MD5("App_PosReq" + "##" + reqDetailCode + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',
                    };
                    FetchUtils.post(LinkUrl, JSON.stringify(params)).then((data) => {
                        var DetailInfo1 = JSON.stringify(data.DetailInfo1);
                        this._setModalVisible();
                        if (data.retcode == 1) {
                            var DetailInfo1 = data.DetailInfo1;
                            this.dataRows = this.dataRows.concat(DetailInfo1);
                            if (this.dataRows == 0) {
                                return;
                            } else {
                                console.log("datarows=",JSON.stringify(this.dataRows));
                                this.setState({
                                    dataSource: this.state.dataSource.cloneWithRows(this.dataRows)
                                })
                            }
                        } else if (this.state.name == null) {
                            return;
                        } else {
                            alert(JSON.stringify(data))
                        }
                    }, (err) => {
                        alert("网络请求失败");
                        this._setModalVisible();
                    })
                })
            });

        });
    }

    _fetch() {
        dbAdapter.selectShopInfoAllCountm().then((rows) => {
            var ShopCar = rows.item(0).countm;
            this.setState({
                shopcar: ShopCar
            });
        });
    }

    GoodsDetails(rowData) {
        this.props.navigator.push({
            component: GoodsDetails,
            params: {
                Formno: rowData.Formno,
                FormDate: rowData.FormDate,
                promemo: rowData.promemo,
                depname: rowData.depname,
            }
        })
    }

    ShenHeButton(rowData){
        this._setModalVisible();
        Storage.get('code').then((ShopCode) => {
            Storage.get('LinkUrl').then((LinkUrl) => {
                Storage.get("usercode").then((usercode) => {
                    Storage.get("username").then((username) => {
                        Storage.get("FormCheck").then((FormCheck) => {
                            Storage.get('OrgFormno').then((OrgFormno)=>{
                                let params = {
                                    reqCode: "App_PosReq",
                                    reqDetailCode: "App_Client_FormCheck",
                                    ClientCode: this.state.ClientCode,
                                    sDateTime: Date.parse(new Date()),
                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_FormCheck" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',
                                    ShopCode: ShopCode,
                                    ChildShopCode: "",
                                    Formno: rowData.Formno,
                                    OrgFormno: OrgFormno,
                                    Usercode: usercode,
                                    Username: username,
                                    FormType: FormCheck,

                                };
                                console.log(JSON.stringify(params))
                                FetchUtils.post(LinkUrl,JSON.stringify(params)).then((data) => {
                                    this.DataShop=[];
                                    this._setModalVisible();
                                    if (data.retcode == 1) {
                                        rowData.checktype = "已审核";
                                        console.log("datarowssssssss=",JSON.stringify(this.dataRows))
                                        this.setState({
                                            dataSource: this.state.dataSource.cloneWithRows(this.dataRows)
                                        })
                                    } else {
                                        var msg=data.msg;
                                        if(msg=="判断用户的权限出错"){
                                            alert("用户没有权限")
                                        }else{
                                            alert(JSON.stringify(data));
                                        }
                                    }
                                }, (err) => {
                                    this._setModalVisible();
                                    alert("网络请求失败");
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <View style={styles.Cont}>
                <TouchableOpacity onPress={() => this.GoodsDetails(rowData)}>
                    <View style={styles.ContList}>
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>单号：</Text>
                            <Text style={styles.ListRight}>{rowData.Formno}</Text>
                        </Text>
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>单据状态：</Text>
                            <Text style={[styles.ListRight, {color: "#ff4e4e"}]}>{rowData.checktype}</Text>
                        </Text>
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>单据品类：</Text>
                            <Text style={styles.ListRight}>{rowData.depname}</Text>
                        </Text>
                        {
                            (this.state.name == "商品采购" || this.state.name == "商品验收" || this.state.name == "协配采购" || this.state.name == "协配收货") ?
                                <Text style={styles.List}>
                                    <Text style={styles.ListLeft}>供应商码：</Text>
                                    <Text style={styles.ListRight}>{rowData.storecode}</Text>
                                </Text> : null
                        }
                        {
                            (this.state.name == "协配采购") ?
                                <Text style={styles.List}>
                                    <Text style={styles.ListLeft}>机构信息：</Text>
                                    <Text style={styles.ListRight}>{rowData.childshop}</Text>
                                </Text> : null
                        }
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>制单日期：</Text>
                            <Text style={styles.ListRight}>{rowData.FormDate}</Text>
                        </Text>
                        {
                            (this.state.name == "售价调整") ?
                                null
                                :
                                <Text style={styles.List}>
                                    <Text style={styles.ListLeft}>单据数量：</Text>
                                    <Text style={styles.ListRight}>{rowData.countm}</Text>
                                </Text>
                        }
                        {
                            (this.state.name == "售价调整") ?
                                null
                                :
                                <Text style={styles.List}>
                                    <Text style={styles.ListLeft}>单据金额：</Text>
                                    <Text style={styles.ListRight}>{rowData.prototal}</Text>
                                </Text>
                        }
                        <Text style={styles.List}>
                            <Text style={styles.ListLeft}>单据备注：</Text>
                            <Text style={styles.ListRight}>{rowData.promemo}</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
                {
                    (rowData.checktype=="已审核")?
                        null
                        :
                        <View style={styles.SHDan}>
                            <View style={styles.SHLeft}></View>
                            <TouchableOpacity style={styles.ShenHe} onPress={() => this.ShenHeButton(rowData)}>
                                <Text style={styles.ShenHe_text}>审核</Text>
                            </TouchableOpacity>
                        </View>
                }
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.cont}>
                        <Text style={styles.HeaderList}>{this.state.name}</Text>
                        <TouchableOpacity onPress={this.pressPush.bind(this)} style={styles.onclick}>
                            <Image source={require("../images/1_08.png")} style={styles.HeaderImage}></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.Rolling}>
                    <ListView
                        dataSource={this.state.dataSource}
                        showsVerticalScrollIndicator={true}
                        renderRow={this._renderRow.bind(this)}
                    />
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.Home}><Image source={require("../images/1_30.png")}></Image><Text
                        style={styles.home2}>历史单据查询</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.Shop.bind(this)}><Image
                        source={require("../images/1_311.png")}></Image><Text
                        style={styles.home1}>商品</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.Home} onPress={this.ShopList.bind(this)}>
                        <View>
                            <Image source={require("../images/1_322.png")}>
                                {
                                    (this.state.shopcar == 0) ?
                                        null :
                                        <Text style={[{position: "absolute", right: -200,}]}>{this.state.shopcar}</Text>
                                }
                                {
                                    (this.state.shopcar > 0) ?
                                        <Text
                                            style={[styles.ShopCar, {paddingTop: 3,}]}>{this.state.shopcar}</Text> : null
                                }
                                {
                                    (this.state.shopcar < 999) ?
                                        null :
                                        <Text style={[styles.ShopCar, {
                                            width: 30,
                                            height: 30,
                                            top: 11,
                                            lineHeight: 21,
                                        }]}>{this.state.shopcar}</Text>
                                }
                                {
                                    (this.state.shopcar > 999) ?
                                        <View>
                                            <Text style={[styles.ShopCar, {
                                                width: 30,
                                                height: 30,
                                                top: 11,
                                                lineHeight: 23
                                            }]}>{this.state.shopcar}</Text>
                                            <Text style={styles.Add}>
                                                +
                                            </Text>
                                        </View> : null
                                }
                            </Image>
                        </View>
                        <Text style={styles.home1}>清单</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.show}
                    onShow={() => {
                    }}
                    onRequestClose={() => {
                    }}>
                    <View style={styles.LoadCenter}>
                        <View style={styles.loading}>
                            <ActivityIndicator key="1" color="#ffffff" size="large"
                                               style={styles.activity}></ActivityIndicator>
                            <Text style={styles.TextLoading}>加载中</Text>
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
        backgroundColor: "#f2f2f2",
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
    HeaderImage1: {
        marginRight: 25,
        marginTop: 5
    },
    HeaderList: {
        flex: 6,
        textAlign: "center",
        color: "#ffffff",
        fontSize: 22,
        marginTop: 3,
    },
    Cont: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#ffffff",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 5,
    },
    List: {
        flexDirection: "row",
        fontSize: 16,
    },
    ListLeft: {
        fontSize: 16,
        color: "#666666",
    },
    ListRight: {
        fontSize: 14,
        color: "#333333",
        lineHeight: 28,
    },
    Rolling: {
        flex: 15,
        paddingTop: 10,
    },
    centering: {
        position: "absolute",
        top: 50,
    },
    fontColorGray: {
        textAlign: "center"
    },
    footer: {
        height: 80,
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#f2f2f2"
    },
    source: {
        flexDirection: "row",
        flex: 1,
    },
    Home: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 10,
        backgroundColor: "#ffffff",
    },
    home1: {
        color: '#999999',
        fontSize: 16,
        marginTop: 5,
        flex: 1,
    },
    home2: {
        color: '#ff4e4e',
        fontSize: 16,
        marginTop: 5,
        flex: 1,
    },
    ShopCar: {
        width: 25,
        height: 25,
        backgroundColor: "#ffba00",
        color: "#ffffff",
        textAlign: "center",
        borderRadius: 50,
        position: "absolute",
        top: 10,
        right: -42,
    },
    Add: {
        position: "absolute",
        right: -50,
        top: 5,
        color: "#ff4e4e",
        fontWeight: "bold"
    },
    LoadCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: "#000000",
        opacity: 0.8,
        borderRadius: 5,
    },
    TextLoading: {
        fontSize: 17,
        color: "#ffffff"
    },
    activity: {
        marginBottom: 5,
    },
    SHDan:{
        flexDirection: "row",
    },
    SHLeft:{
        flex:2,
    },
    ShenHe: {
        flex:1,
        height:30,
        paddingTop:6,
        paddingBottom:6,
        borderRadius:5,
        backgroundColor:"#ffba00"
    },
    ShenHe_text:{
        textAlign:"center",
        color:"#ffffff",
        fontSize:16,
    },
});