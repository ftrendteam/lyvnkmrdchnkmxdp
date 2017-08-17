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
  TouchableOpacity,
  Image,
  ScrollView,
  ListView
} from 'react-native';
export default class GoodsDetails extends Component {
    constructor(props){
          super(props);
          const ds = new ListView.DataSource({//ListView组件
              rowHasChanged: (r1, r2) => r1 !== r2 //
          });
          this.state = {
             dataSource: ds.cloneWithRows(['1', '2', '3', '4', '5', '6', '7', '8','9', '10', '11', '12', '13', '14', '15','16', '17', '18', '19', '20', '21', '22', ])
          };
      }
    GoodsDetails(){
          this.props.navigator.pop();
    }
        renderRow(rowData, sectionID, rowID) {
        console.log(rowData, sectionID, rowID)
                return (
                    <TouchableOpacity >
                        <View style={styles.ShopList1}>
                            <Text style={styles.Name1}>青柠</Text>
                            <Text style={styles.ShopPrice1}>200.00</Text>
                            <Text style={styles.ShopNumber1}>5.0件</Text>
                        </View>
                    </TouchableOpacity>
                );
            }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.Title}>
            <TouchableOpacity onPress={this.GoodsDetails.bind(this)} style={styles.HeaderImage}>
                 <Image source={require("../images/left.png")}></Image>
            </TouchableOpacity>
            <Text style={styles.Text}>CR100001456567854774</Text>
        </View>
        <View style={styles.Cont}>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>盘点仓库</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>系统默认仓库</Text>
                </View>
                <View style={styles.ListRight}>
                    <Text style={styles.ListText}>货品数：</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>3</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>单据备注</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>大富科技高考了机构价格很快两个</Text>
                </View>
            </View>
            <View style={styles.List}>
                <View style={styles.ListLeft}>
                    <Text style={styles.ListText}>制单日期</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>2017-08-03 15:31:25</Text>
                </View>
                <View style={styles.ListRight}>
                    <Text style={styles.ListText}>货品数：</Text>
                    <Text style={styles.write}></Text>
                    <Text style={styles.ListText}>3</Text>
                </View>
            </View>
        </View>
        <View style={styles.ShopCont}>
            <View style={styles.ShopList}>
                <Text style={styles.Name}>名称</Text>
                <Text style={styles.ShopPrice}>金额</Text>
                <Text style={styles.ShopNumber}>数量</Text>
            </View>
            <ListView contentContainerStyle={styles.listViewStyle}
            showsVerticalScrollIndicator={true}
            dataSource={this.state.dataSource}
            renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
            />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
   Title:{
      height:60,
      backgroundColor:"#f47882",
      paddingLeft:25,
      paddingRight:25,
      paddingTop:13,
      flexDirection:"row",
      borderBottomWidth:2,
      borderBottomColor:"#e36871",
    },
    HeaderImage:{
      width:15,
      height:22,
      marginTop:5,
    },
    Text:{
      flex:8,
      textAlign:"center",
      fontSize:18,
      color:"#ffffff"
      },
   Cont:{
    paddingLeft:25,
    paddingRight:25,
    paddingTop:15,
    backgroundColor:"#f47882"
   },
   List:{
    marginBottom:15,
    flexDirection:"row",
   },
   ListText:{
    fontSize:14,
    color:"#ffffff"
   },
   ListLeft:{
    flexDirection:"row",
   },
   write:{
    width:10,
   },
   ListRight:{
    position:"absolute",
    right:0,
    flexDirection:"row",
   },
   ShopList:{
    paddingLeft:25,
    paddingRight:25,
    height:60,
    backgroundColor:"#fafafa",
    flexDirection:"row",
   },
   Name:{
    flex:1,
    color:"#333333",
    fontSize:16,
    lineHeight:36,
   },
   ShopPrice:{
    flex:1,
    color:"#333333",
    fontSize:16,
    lineHeight:36,
    textAlign:"center"
   },
   ShopNumber:{
    flex:1,
    color:"#333333",
    fontSize:16,
    lineHeight:36,
    textAlign:"right"
   },
   ShopList1:{
    paddingLeft:25,
    paddingRight:25,
    height:50,
    backgroundColor:"#ffffff",
    flexDirection:"row",
    borderBottomWidth:1,
    borderBottomColor:"#fafafa"
   },
   Name1:{
    flex:1,
    color:"#333333",
    fontSize:14,
    lineHeight:30,
   },
   ShopPrice1:{
    flex:1,
    color:"#333333",
    fontSize:14,
    lineHeight:30,
    textAlign:"center"
   },
   ShopNumber1:{
    flex:1,
    color:"#333333",
    fontSize:14,
    lineHeight:30,
    textAlign:"right"
   },
   ContList:{
   paddingBottom:50,
   },
});