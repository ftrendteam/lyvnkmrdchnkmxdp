/**
 * Created by admin on 2017/12/22.
 */
import React from 'react';
import Storage from "../utils/Storage";

export default class NumFormatUtils {
    /**
     * 账单流水号 用户名+数字(0000)
     */
    static createLsNo() {
        return new Promise((resolve, reject) => {
            try {
                Storage.get('PosCode').then((posCode) => {
                    Storage.get('Num').then((num) => {
                        let LsNo;
                        num = parseInt(num);
                        let strNum = this.PrefixInteger(num);
                        if (num > 99999999) {
                            num = 1;
                        } else {
                            num= (JSON.stringify(num+1));
                            Storage.save("Num", num);
                        }
                        LsNo = posCode + strNum;

                        resolve(LsNo);
                    })
                })
            } catch (err) {
                reject(err);
            }

        });

    }

    /***
     * 数字前面补零
     * @param num 需要补零的数字
     * @return {string}
     * @constructor
     */
    static PrefixInteger(num) {
        return (Array(8).join('0') + num).slice(-8);
    }

    //流水表内部号
    static inoNum = 1;

    static createInnerNo = (inner) => {
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

        var sum=year+""+month+day+hh+mm+ss+NumFormatUtils.inoNum;
        NumFormatUtils.inoNum=NumFormatUtils.inoNum+1;
        if (NumFormatUtils.inoNum == 9) {
            NumFormatUtils.inoNum = 1;
        }
        return sum;
    }

    //deatil表内部号
    static InoNum = 1;
    static CreateInnerNo = (inner) => {
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

        var sum=year+""+month+day+hh+mm+ss+NumFormatUtils.InoNum;
        alert(sum)
        NumFormatUtils.InoNum=NumFormatUtils.InoNum+1;
        if (NumFormatUtils.InoNum == 9) {
            NumFormatUtils.InoNum = 1;
        }
        return sum;
    }
}