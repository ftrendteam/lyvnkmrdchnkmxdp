/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Modal,
    ScrollView,
    ListView,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    DeviceEventEmitter,
    InteractionManager
} from 'react-native';

import Index from "./Index";
import ShoppingCart from "./ShoppingCart";
import Code from "./Code";
import OrderDetails from "./OrderDetails2";
import NetUtils from "../utils/NetUtils";
import NumberUtils from "../utils/NumberUtils";
import FetchUtil from "../utils/FetchUtils";
import DBAdapter from "../adapter/DBAdapter";
import Storage from '../utils/Storage';
import DeCodePrePrint18 from "../utils/DeCodePrePrint18";

var {NativeModules} = require('react-native');
var RNScannerAndroid = NativeModules.RNScannerAndroid;
let dbAdapter = new DBAdapter();
let db;
let decodepreprint = new DeCodePrePrint18();

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Search: "",
            Price: "",
            totalPrice: "",
            name: "",
            YdCountm: "",
            shuliang: "",
            numberFormat2: "",
            ProdName: "",
            ShopPrice: "",
            Pid: "",
            countm: "",
            prototal: "",
            ProdCode: "",
            DepCode: "",
            SuppCode: "",
            ydcountm: "",
            Number1: "",
            Remark: "",
            Show: false,
            emptydata:false,
            dataRows: "1",
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2,}),
        };
        this.dataRows = [];
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.Storage();
            DeviceEventEmitter.removeAllListeners();
            this.Device();
        });
    }

    Device() {
        DeviceEventEmitter.addListener("code", (reminder) => {
            var title = this.state.head;
            decodepreprint.init(reminder, dbAdapter);
            if (title == null) {
                this._Emptydata();
            } else {
                if (reminder.length == 18 && decodepreprint.deCodePreFlag()) {
                    decodepreprint.deCodeProdCode().then((datas) => {
                        dbAdapter.selectProdCode(datas, 1).then((rows) => {
                            Storage.get('FormType').then((tags) => {
                                this.setState({
                                    FormType: tags
                                })
                            })

                            Storage.get('LinkUrl').then((tags) => {
                                this.setState({
                                    LinkUrl: tags
                                })
                            })
                            //商品查询
                            Storage.get('userName').then((tags) => {
                                let params = {
                                    reqCode: "App_PosReq",
                                    reqDetailCode: "App_Client_CurrProdQry",
                                    ClientCode: this.state.ClientCode,
                                    sDateTime: Date.parse(new Date()),
                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                    username: tags,
                                    usercode: this.state.Usercode,
                                    SuppCode: rows.item(0).SuppCode,
                                    ShopCode: this.state.ShopCode,
                                    ChildShopCode: this.state.ChildShopCode,
                                    ProdCode: datas,
                                    OrgFormno: this.state.OrgFormno,
                                    FormType: this.state.FormType,
                                };
                                FetchUtil.post(this.state.LinkUrl, JSON.stringify(params)).then((data) => {
                                    var countm = JSON.stringify(data.countm);
                                    var ShopPrice = JSON.stringify(data.ShopPrice);
                                    if (data.retcode == 1) {
                                        var ShopCar = rows.item(0).ProdName;
                                        this.setState({
                                            ProdName: rows.item(0).ProdName,
                                            ShopPrice: rows.item(0).ShopPrice,
                                            Pid: rows.item(0).Pid,
                                            countm: rows.item(0).ShopNumber,
                                            Remark: rows.item(0).promemo,
                                            prototal: rows.item(0).prototal,
                                            ProdCode: rows.item(0).ProdCode,
                                            DepCode: rows.item(0).DepCode1,
                                            SuppCode: rows.item(0).SuppCode,
                                            ydcountm: countm,
                                            Number1: rows.item(0).countm,
                                        })
                                        // DeviceEventEmitter.removeAllListeners();
                                    } else {
                                        alert(JSON.stringify(data))
                                    }
                                }, (err) => {
                                    alert("网络请求失败");
                                })
                            })
                        })
                    });
                } else {
                    dbAdapter.selectAidCode(reminder, 1).then((rows) => {
                        if (rows.length == 0) {
                            alert("该商品不存在")
                        } else {
                            Storage.get('FormType').then((tags) => {
                                this.setState({
                                    FormType: tags
                                })
                            })

                            Storage.get('LinkUrl').then((tags) => {
                                this.setState({
                                    LinkUrl: tags
                                })
                            })
                            //商品查询
                            Storage.get('userName').then((tags) => {
                                let params = {
                                    reqCode: "App_PosReq",
                                    reqDetailCode: "App_Client_CurrProdQry",
                                    ClientCode: this.state.ClientCode,
                                    sDateTime: Date.parse(new Date()),
                                    Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                                    username: tags,
                                    usercode: this.state.Usercode,
                                    SuppCode: rows.item(0).SuppCode,
                                    ShopCode: this.state.ShopCode,
                                    ChildShopCode: this.state.ChildShopCode,
                                    ProdCode: rows.item(0).ProdCode,
                                    OrgFormno: this.state.OrgFormno,
                                    FormType: this.state.FormType,
                                };
                                FetchUtil.post(this.state.LinkUrl, JSON.stringify(params)).then((data) => {
                                    var countm = JSON.stringify(data.countm);
                                    var ShopPrice = JSON.stringify(data.ShopPrice);
                                    if (data.retcode == 1) {
                                        var ShopCar = rows.item(0).ProdName;
                                        this.setState({
                                            ProdName: rows.item(0).ProdName,
                                            ShopPrice: rows.item(0).ShopPrice,
                                            Pid: rows.item(0).Pid,
                                            Number1: rows.item(0).ShopNumber,
                                            Remark: rows.item(0).ShopRemark,
                                            prototal: rows.item(0).prototal,
                                            ProdCode: rows.item(0).ProdCode,
                                            DepCode: rows.item(0).DepCode1,
                                            SuppCode: rows.item(0).SuppCode,
                                            ydcountm: countm,
                                            focus:true
                                        })
                                        Storage.get('YdCountm').then((ydcountm) => {
                                            if (ydcountm == 2 && countm != 0) {//原单数量
                                                if (this.state.Number1 == 0) {
                                                    this.setState({
                                                        Number1:countm
                                                    })
                                                }
                                            }else if(this.state.Number1 == 0){
                                                this.setState({
                                                    Number1:1
                                                })
                                            }
                                            this.setState({
                                                YdCountm: ydcountm
                                            })
                                        });

                                        Storage.get('YuanDan').then((tags) => {
                                            if (tags == "1") {
                                                if (this.state.Number == "1" && !this.state.isFrist) {
                                                    this.setState({
                                                        Number: this.state.ydcountm
                                                    })
                                                }
                                            }
                                            let numberFormat1 = NumberUtils.numberFormat2(this.state.ShopPrice);
                                            let numberFormat2 = NumberUtils.numberFormat2((this.state.Number1) * (this.state.ShopPrice));
                                            this.setState({
                                                ShopPrice: numberFormat1,
                                                numberFormat2: numberFormat2,
                                            })
                                        })

                                    } else {
                                        alert(JSON.stringify(data))
                                    }
                                }, (err) => {
                                    alert("网络请求失败");
                                })
                            })
                        }
                    })
                }
            }
        })
    }

    Storage() {
        Storage.get('Name').then((tags) => {
            this.setState({
                head: tags
            })
        });

        Storage.get('username').then((tags) => {
            this.setState({
                username: tags
            })
        });

        Storage.get('ClientCode').then((tags) => {
            this.setState({
                ClientCode: tags
            })
        })

        Storage.get('Usercode').then((tags) => {
            this.setState({
                Usercode: tags
            })
        })

        Storage.get('code').then((tags) => {
            this.setState({
                ShopCode: tags
            })
        })

        Storage.get('shildshop').then((tags) => {
            this.setState({
                ChildShopCode: tags
            })
        })

        Storage.get('OrgFormno').then((tags) => {
            this.setState({
                OrgFormno: tags
            })
        })

    }

    Close() {
        DeviceEventEmitter.removeAllListeners();
        var nextRoute={
            name:"主页",
            component:ShoppingCart,
        };
        this.props.navigator.push(nextRoute);

    }

    inputOnBlur(value) {
        this.Modal();
        dbAdapter.selectAidCode(value, 1).then((rows) => {
            this.dataRows = [];
            for (let i = 0; i < rows.length; i++) {
                var row = rows.item(i);
                this.dataRows.push(row);
            }
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.dataRows),
                dataRows: this.dataRows
            })
        });
    }

    _renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={() => this.OrderDetails(rowData)} underlayColor={'red'} style={styles.Block}>
                <Text style={styles.BlockText}>{rowData.ProdName}</Text>
            </TouchableOpacity>
        );
    }

    OrderDetails(rowData) {
        Storage.get('FormType').then((tags) => {
            this.setState({
                FormType: tags
            })
        })

        Storage.get('LinkUrl').then((tags) => {
            this.setState({
                LinkUrl: tags
            })
        })
        //商品查询
        Storage.get('userName').then((tags) => {
            let params = {
                reqCode: "App_PosReq",
                reqDetailCode: "App_Client_CurrProdQry",
                ClientCode: this.state.ClientCode,
                sDateTime: Date.parse(new Date()),
                Sign: NetUtils.MD5("App_PosReq" + "##" + "App_Client_CurrProdQry" + "##" + Date.parse(new Date()) + "##" + "PosControlCs") + '',//reqCode + "##" + reqDetailCode + "##" + sDateTime + "##" + "PosControlCs"
                username: tags,
                usercode: this.state.Usercode,
                SuppCode: rowData.SuppCode,
                ShopCode: this.state.ShopCode,
                ChildShopCode: this.state.ChildShopCode,
                ProdCode: rowData.ProdCode,
                OrgFormno: this.state.OrgFormno,
                FormType: this.state.FormType,
            };
            FetchUtil.post(this.state.LinkUrl, JSON.stringify(params)).then((data) => {
                var countm = JSON.stringify(data.countm);
                var ShopPrice = JSON.stringify(data.ShopPrice);
                if (data.retcode == 1) {
                    // if(data.isFond==1){

                    this.setState({
                        ProdName: rowData.ProdName,
                        ShopPrice: rowData.StdPrice,
                        Pid: rowData.Pid,
                        Number1: rowData.ShopNumber,
                        Remark: rowData.ShopRemark,
                        prototal: rowData.prototal,
                        ProdCode: rowData.ProdCode,
                        DepCode: rowData.DepCode1,
                        SuppCode: rowData.SuppCode,
                        ydcountm: countm,
                    })
                    this.Modal();
                    // }else{
                    //     // alert('该商品暂时无法购买')
                    // }
                } else {
                    alert(JSON.stringify(data))
                }
            }, (err) => {
                alert("网络请求失败");
            })
        })
    }

    Modal() {
        let isShow = this.state.Show;
        this.setState({
            Show: !isShow,
        });
    }

    inputOnBlur1() {
        var Number = this.state.Number1;
        var ShopPrice = this.state.ShopPrice;
        this.state.totalPrice = Number * ShopPrice;
        this.setState({
            totalPrice: this.state.totalPrice
        });
    }

    add() {
        var Number1 = this.state.Number1;
        this.setState({
            Number1: parseInt(Number1) + 1,
        });
        let numberFormat2 = NumberUtils.numberFormat2((parseInt(Number1) + 1) * (this.state.ShopPrice));
        this.setState({
            numberFormat2: numberFormat2,
        });
    }

    subtraction() {
        if (this.state.Number1 > 0) {
            var Number1 = this.state.Number1;
            this.setState({
                Number1: parseInt(Number1) - 1,
            });
            let numberFormat2 = NumberUtils.numberFormat2((parseInt(Number1) - 1) * (this.state.ShopPrice));
            this.setState({
                numberFormat2: numberFormat2,
            });
        }
        if (this.state.Number1 == 0) {
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
            this.setState({
                Number1: 0
            });
        }
    }

    clear() {
        let numberFormat2 = NumberUtils.numberFormat2((0) * (this.state.ShopPrice));
        this.setState({
            Number1: 0,
            numberFormat2: numberFormat2,
        })
    }

    pressPop() {
        if (this.state.name == null) {
            alert("请选择单据")
        } else if (this.state.Number1 == 0) {
            ToastAndroid.show('商品数量不能为0', ToastAndroid.SHORT);
        } else {
            // alert(this.state.Remark);
            var shopInfoData = [];
            var shopInfo = {};
            shopInfo.Pid = this.state.Pid;
            shopInfo.ProdCode = this.state.ProdCode;
            shopInfo.prodname = this.state.ProdName;
            shopInfo.countm = this.state.Number1;
            shopInfo.ShopPrice = this.state.ShopPrice;
            shopInfo.prototal = (this.state.Number1) * (this.state.ShopPrice);
            shopInfo.promemo = this.state.Remark;
            shopInfo.DepCode = this.state.DepCode;
            shopInfo.ydcountm = this.state.ydcountm;
            shopInfo.SuppCode = this.state.SuppCode;
            shopInfoData.push(shopInfo);
            //调用插入表方法
            dbAdapter.insertShopInfo(shopInfoData);
            this.setState({
                Number1: "",
                ydcountm: "",
                ShopPrice: "",
                numberFormat2: "",
                Remark: "",
                ProdName: "",
            })
        }
    }

    _Emptydata(){
        let isShow = this.state.emptydata;
        this.setState({
            emptydata:!isShow,
        });
    }

    Emptydata(){
        this._Emptydata();
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.Title}>
                    <TextInput
                        autofocus={true}
                        style={styles.Search}
                        value={this.state.Number}
                        returnKeyType="search"
                        placeholder="请输入搜索商品名称"
                        placeholderColor="#999999"
                        underlineColorAndroid='transparent'
                        onChangeText={(value) => {
                            this.setState({
                                Search: value
                            })
                            this.inputOnBlur(value)
                        }}
                    />
                    <Image source={require("../images/2.png")} style={styles.SearchImage}></Image>
                    <TouchableOpacity onPress={this.Close.bind(this)} style={styles.Right1}>
                        <View style={styles.Text1}><Text style={styles.Text}>取消</Text></View>
                    </TouchableOpacity>
                </View>

                {
                    (this.state.Search=="")?
                        <ScrollView style={styles.ScrollView} scrollEnabled={false}>
                            <View style={styles.Cont}>
                                <View style={styles.List}>
                                    <Text style={styles.left}>名称</Text>
                                    <Text style={styles.right}>{this.state.ProdName}</Text>
                                </View>
                                <View style={[styles.List, {paddingTop: 12}]}>
                                    <View style={styles.left1}>
                                        <Text style={[styles.left, {marginTop: 4}]}>数量</Text>
                                        <TextInput
                                            style={styles.Number}
                                            underlineColorAndroid='transparent'
                                            keyboardType="numeric"
                                            placeholderTextColor="#333333"
                                            value={this.state.Number1.toString()}
                                            onBlur={this.inputOnBlur1.bind(this)}
                                            onChangeText={(value) => {
                                                this.setState({Number1: value})
                                            }}/>
                                    </View>
                                    <View style={styles.right1}>
                                        <TouchableOpacity style={styles.sublime} onPress={this.clear.bind(this)}><Image
                                            source={require("../images/1_09.png")}/></TouchableOpacity>
                                        <TouchableOpacity style={styles.sublime} onPress={this.add.bind(this)}><Image
                                            source={require("../images/1_15.png")}/></TouchableOpacity>
                                        <TouchableOpacity style={styles.sublime} onPress={this.subtraction.bind(this)}><Image
                                            source={require("../images/1_13.png")}/></TouchableOpacity>
                                    </View>
                                </View>
                                {
                                    (this.state.YdCountm == 1) ?
                                        <View style={styles.List}>
                                            <View style={styles.left2}>
                                                <Text style={styles.left}>现在库存</Text>
                                                <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                                            </View>
                                        </View> : null
                                }
                                {
                                    (this.state.YdCountm == 2) ?
                                        <View style={styles.List}>
                                            <View style={styles.left2}>
                                                <Text style={styles.left}>原单数量</Text>
                                                <Text style={styles.Price1}>{this.state.ydcountm}</Text>
                                            </View>
                                        </View> : null
                                }
                                <View style={styles.List}>
                                    <View style={styles.left2}>
                                        <Text style={styles.left}>单价</Text>
                                        <Text style={styles.Price1}>{this.state.ShopPrice}</Text>
                                    </View>
                                    <View style={styles.right2}>
                                        <Text style={styles.price}>元/件</Text>
                                    </View>
                                </View>
                                <View style={styles.List}>
                                    <View style={styles.left2}>
                                        <Text style={styles.left}>金额</Text>
                                        <Text style={styles.Price1}>
                                            {this.state.numberFormat2}
                                        </Text>
                                    </View>
                                    <View style={styles.right2}>
                                        <Text style={styles.price}>元</Text>
                                    </View>
                                </View>
                                <View style={[styles.List, {paddingTop: 10,}]}>
                                    <View style={styles.left2}>
                                        <Text style={[styles.left, {marginTop: 9,}]}>备注</Text>
                                        <TextInput
                                            style={styles.Number1}
                                            autofocus={true}
                                            underlineColorAndroid='transparent'
                                            value={this.state.Remark.toString()}
                                            onChangeText={(value) => {
                                                this.setState({Remark: value})
                                            }}/>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.button} onPress={this.pressPop.bind(this)}>
                                    <Text style={styles.ButtonText}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        :
                        <View style={styles.BlockList}>
                            {
                                (this.state.dataRows == "") ?
                                    <View style={styles.Null}>
                                        <Text style={styles.NullText}>
                                            没有搜索到相关商品~~~
                                        </Text>
                                    </View> :
                                    <ListView
                                        dataSource={this.state.dataSource}
                                        showsVerticalScrollIndicator={true}
                                        renderRow={this._renderRow.bind(this)}
                                        ref="myInput"
                                    />
                            }
                        </View>
                }
                <Modal
                    transparent={true}
                    visible={this.state.emptydata}
                    onShow={() => {}}
                    onRequestClose={() => {}} >
                    <Image source={require("../images/background.png")} style={[styles.ModalStyle,{justifyContent: 'center',alignItems: 'center',}]}>
                        <View style={styles.ModalStyleCont}>
                            <View style={styles.ModalStyleTitle}>
                                <Text style={styles.ModalTitleText}>
                                    请选择单据
                                </Text>
                            </View>
                            <TouchableOpacity onPress={this.Emptydata.bind(this)} style={styles.Button}>
                                <Text style={styles.ModalTitleText}>
                                    好的
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Image>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    Title: {
        backgroundColor: "#ff4e4e",
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 15,
        paddingBottom: 15,
        flexDirection: "row",
    },
    SearchImage: {
        position: "absolute",
        top: 22,
        left: 24,
    },
    Search: {
        borderRadius: 30,
        backgroundColor: "#ffffff",
        color: "#333333",
        paddingLeft: 46,
        paddingBottom: 15,
        paddingTop: 6,
        paddingBottom: 6,
        fontSize: 14,
        flex: 1,
    },
    Right1: {
        width: 60,
        flexDirection: "row",
        paddingTop: 3,
        paddingLeft: 6
    },
    HeaderImage1: {
        flex: 1,
        marginLeft: 20,
    },
    Text1: {
        flex: 1
    },
    Text: {
        fontSize: 18,
        color: "#ffffff",
        paddingTop: 5,
        paddingLeft: 10,
    },
    modal:{
        marginTop:70,
    },
    BlockList: {
        flex:1,
        flexDirection: "column",
        backgroundColor: "#ffffff"
    },
    Row: {
        flexDirection: "row",
    },
    Block: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 25,
        paddingRight: 25,
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2",
        backgroundColor: "#ffffff"
    },
    BlockText: {
        fontSize: 14,
        color: "#333333"
    },
    Null: {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 120,
    },
    NullText: {
        color: "#cccccc",
        fontSize: 20,
        textAlign: "center"
    },
    ScrollView: {
        backgroundColor: "#f2f2f2",
        flex: 1,
    },
    List: {
        height: 54,
        paddingTop: 15,
        backgroundColor: "#ffffff",
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2"
    },
    left: {
        fontSize: 16,
        color: "#666666",
        width: 75,
        textAlign: "right"
    },
    right: {
        fontSize: 16,
        color: "#333333",
        flexDirection: "row",
        marginLeft: 15,
        fontWeight: "200"
    },
    Right: {
        fontSize: 16,
        color: "#666666",
        flexDirection: "row",
    },
    left1: {
        flexDirection: "row",
        flex: 1,
        marginRight: 160,
    },
    right1: {
        flexDirection: "row",
        position: "absolute",
        right: 15,
        top: 5,
    },
    left2: {
        flexDirection: "row",
        flex: 6,
    },
    right2: {
        position: "absolute",
        right: 25,
        top: 12,
        flexDirection: "row",
    },
    Price1: {
        fontSize: 16,
        color: "#333333",
        marginLeft: 15,
        fontWeight: "200",
    },
    Number: {
        fontSize: 16,
        color: "#333333",
        fontWeight: "200",
        width: 50,
        marginLeft: 5,
        marginBottom: 4,
    },
    Number1: {
        fontSize: 16,
        color: "#333333",
        flex: 6,
        marginBottom: 1,
        fontWeight: "200"
    },
    Delete: {
        fontSize: 20,
        color: "#f63e4d",
        flex: 1,
        textAlign: "center"
    },
    Reduce: {
        fontSize: 20,
        color: "#f63e4d",
        flex: 1,
        textAlign: "center"
    },
    Increase: {
        fontSize: 20,
        color: "#f63e4d",
        flex: 1,
        textAlign: "center"
    },
    sublime: {
        marginLeft: 8,
    },
    button: {
        marginTop: 30,
        flex: 1,
        marginLeft: 25,
        marginRight: 25,
        backgroundColor: "#ff4e4e",
        borderRadius: 5,
        paddingTop: 13,
        paddingBottom: 13,
    },
    ButtonText: {
        color: "#ffffff",
        textAlign: "center",
        fontSize: 18,
    },
    ModalStyle:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        width:null,
        height:null,
    },
    ModalStyleCont:{
        height:130,
        paddingTop:30,
        paddingLeft:10,
        paddingRight:10,
        borderRadius:5,
        backgroundColor:"#ffffff",
    },
    ModalStyleTitle:{
        height:40,
        paddingLeft:100,
        paddingRight:100,
        borderBottomWidth:1,
        borderBottomColor:"#f5f5f5",
    },
    ModalTitleText:{
        fontSize:16,
        color:"#333333",
        textAlign:"center",
    },
    Button:{
        paddingTop:20,
    },
});
