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
  TextInput,
    TouchableOpacity,
    ListView,
  Image
} from 'react-native';
/*fetch(参数)
    .then(完成的回调函数)
    .catch(失败的回调函数)

fetch(url,opts)
.then((response)->{
//网络请求成功执行该回调函数，得到相应对象，通过response可以获取请求的数据
//例如：json、text等等
return response.text();
//return response.json();
})

.then((resonseData)=>{
//处理请求得到的数据
})
.catch((error)=>{
//网络请求失败执行该回调函数，得到错误信息
})


//电影列表
未获得数据时 显示等待页面 获得数据时 显示电影列表
给state添加一个属性，用于记录下载状态
*/
/*function getRequest(url) {
  var opts={
    method:"GET"
  }
  fetch(url,opts)
      .then((response)=>{
        return response.text();
    })
    .then((responseText)=>{
    alert(responseText);
    })
    .catch((error)=>{
     alert(error);
    })
}*/

var request_url="http://localhost:8018/SVipCard/WebService/FTrendWs.asmx?wsdl"

export default class myproject extends Component {
  getInitialState(){
    var ds=new ListView.DataSource({
       rowHasChanged:(oldRow,NewRow)=>lodRow!==newRow
    });
    return{
        loaded:false,
        dataSource:ds
    };
  }
  getDate(){
    fetch(request_url)
        .then((response)=>{
      return response.json();
    })
        ,then((responseData)=>{
          this.setStata({
            loaded:true,
            dataSource:this.state.dataSource.cloneWithRows(responseData.movies)
        });
        })
        .catch((error)=>{
          alert(error);
        })
    }
  render() {
    if(!this.state.loaded){
      return this.renderLoadingView();
    }


  return(
    <ListView
      dataSource={this.state.dataSource}
      initialListSize={10}
      renderHeader={this._renderHeader}
      renderRow={this._renderRow}
      />
  )
  }

  componentDidMount(){
    this.getData();
    }
  //等待加载
  renderLoadingView(){
    return(
        <View style={styles.loadingcontainer}>
          <Text style={styles.loadingtext}>等待加载......</Text>
        </View>
    )
  }

  _renderRow(movie){
    return(
        <View style={styles.rowcontainer}>
          <Image style={styles.thumbnail} source={{url:movie.posters.thumbnail}}/>
          <View style={styles.textcontainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.title}>{movie.year}</Text>
          </View>
        </View>
    )
  }
  _renderHeader(){
    return(
        <View style={styles.listheader}>
          <Text style={styles.headertext}></Text>
          <View style={styles.headerline}></View>
        </View>
    )
  }

}

const styles = StyleSheet.create({
    listheader:{
      height:50,
        backgroundColor:"#cccccc"
    },
    headertext:{
      flex:1,
        fontSize:16,
    },
    headerline:{
      height:1,
        backgroundColor:"#333333",
    },
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
      marginTop:25,
  },
    loadingtext:{
    fontSize:18,
        fontWeight:"bold",
        textAlign:"center",
        marginLeft:10,
        marginRight:10,
    },
    rowcontainer:{
    flexDirection:"row",
        padding:5,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    thumbnail:{
    width:53,
        height:81,
        backgroundColor:"gray"
    },
    textcontainer:{
    flex:1,
        marginLeft:10,
    },
    title:{
    marginTop:3,
        fontSize:16,
    }
});


