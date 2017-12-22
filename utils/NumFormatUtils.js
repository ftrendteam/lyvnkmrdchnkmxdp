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
                        let strNum = this.PrefixInteger(num);
                        console.log("1", num);
                        console.log("2", strNum);
                        if (num > 99999999) {
                            num = 1;
                            console.log("3");
                        } else {
                            console.log("4");
                            num = num++;

                            console.log("wtf", num);
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

    static inoNum = 1;

    static createInnerNo = () => {
        let trim = DateUtils.getSystemTimeHSM().replace(":", "").replace("-", "").replace(" ",
            "");
        let innerNo = trim.substring(2, trim.length() - 1) + inoNum;
        this.inoNum++;
        if (inoNum == 9) {
            inoNum = 1;
        }
        return innerNo;
    }
}