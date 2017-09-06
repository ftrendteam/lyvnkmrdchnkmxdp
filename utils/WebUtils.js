/**
 * Created by liuyandong on 2017/1/4.
 */
import {
    NativeModules
} from "react-native";

export default class WebUtils {


static Post(url,params,callback){
        //fetch请求
        fetch("http://192.168.0.47:8018/WebService/FTrendWs.asmx/FMJsonInterfaceByDownToPos",{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body:"jsonStr="+JSON.stringify(params)
        })
           .then((response)=>{
               response.json().then((data)=>{
                   callback(data);
               });
           }).catch((error)=>{
               console.log(error);
           });
    }
}