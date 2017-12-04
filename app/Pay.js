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
            <View style={styles.BankList}>
                <View style={styles.FirstBankList}>
                    <Text style={styles.FirstBankText}></Text>
                </View>
            </View>
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
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>店号：</Text>
                                </View>
                                <View style={styles.ListView}>
                                    <Text style={styles.ListText}>0001</Text>
                                </View>
                            </View>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>收款员：</Text>
                                </View>
                                <View style={styles.ListView}>
                                    <Text style={styles.ListText}>0001</Text>
                                </View>
                            </View>
                            <View style={styles.List}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>pos号：</Text>
                                </View>
                                <View style={styles.ListView}>
                                    <Text style={styles.ListText}>0001</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.FristList}>
                            <View style={[styles.List,{flex:2}]}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>流水号：</Text>
                                </View>
                                <View style={styles.ListView}>
                                    <Text style={styles.ListText}>0001</Text>
                                </View>
                            </View>
                            <View style={[styles.List,{flex:1}]}>
                                <TouchableOpacity style={[{backgroundColor:"#ffffff",paddingTop:2,
                                    paddingBottom:2,paddingLeft:5,paddingRight:5,borderRadius:5,paddingTop:5,}]}>
                                    <Text style={[{color:"#9a0000",fontSize:16,textAlign:"center"}]}>收款员</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.List,{flex:2}]}>
                                <View style={styles.ListView1}>
                                    <Text style={[styles.ListText,{textAlign:"center"}]}>版本：</Text>
                                </View>
                                <View style={styles.ListView}>
                                    <Text style={styles.ListText}>0001</Text>
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
                                    <Text style={styles.ListClassText}>商品编码</Text>
                                </View>
                                <View style={styles.ListClass}>
                                    <Text style={styles.ListClassText}>商品名称</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>零售价</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>数量</Text>
                                </View>
                                <View style={styles.ListClass1}>
                                    <Text style={styles.ListClassText}>小计</Text>
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
                                           键盘
                                       </Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                       <Text style={styles.PageRowText}>
                                           A会员
                                       </Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                       <Text style={styles.PageRowText}>
                                           C付款
                                       </Text>
                                   </TouchableOpacity>
                               </View>
                                <View style={[styles.PageRow,{marginTop:10,}]}>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            D交易重打
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            E取消交易
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.PageRowButton,{marginRight:5}]}>
                                        <Text style={styles.PageRowText}>
                                            F删除末品
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
                                <View style={[styles.PageRow,{marginTop:10,}]}>
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
                                <View style={[styles.PageRow,{marginTop:10,}]}>
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
                    <View style={styles.ShopCont}>
                        <View style={[styles.Prece,{marginTop:20,}]}>
                            <View style={styles.InputingLeft}>
                                <Text style={styles.InpuTingText}>卡号：</Text>
                            </View>
                            <View style={styles.InputingRight}>
                                <TextInput
                                    autofocus={true}
                                    numberoflines={1}
                                    keyboardType="numeric"
                                    textalign="center"
                                    underlineColorAndroid='transparent'
                                    style={styles.TextInput}
                                />
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
                        <View style={styles.FirstMent}>
                            <View style={styles.paymentleft}>
                                <Text style={styles.InpuTingText}>折扣率：</Text>
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
                        <View style={styles.FirstMent}>
                            <View style={styles.paymentleft}>
                                <Text style={styles.InpuTingText}>抵用额：</Text>
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
        height:90,
        backgroundColor:"#ff4e4e",
        paddingLeft:20,
        paddingRight:20,
    },
    FristList:{
        height:38,
        paddingTop:10,
        flexDirection:"row",
    },
    List:{
        flex:1,
        flexDirection:"row",
    },
    ListView1:{
        width:70,
    },
    ListView:{
        flex:1,
        height:20,
        overflow:"hidden",
        backgroundColor:"#ff4e4e"
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
        height:150,
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
        height:110,
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
    PayMent:{
        height:54,
        marginTop:16,
        marginLeft:10,
        marginRight:10,
        flexDirection:"row"
    },
    FirstMent:{
        flex:1,
        flexDirection:"row"
    },
    paymentleft:{
        width:65,
        paddingTop:14,
    },
    paymentright:{
        flex:1,
        height:54,
        paddingTop:6,
        backgroundColor:"#ffffff",
        borderRadius:5,
    },
    paymentinput:{
        flex:1,
    }
});
