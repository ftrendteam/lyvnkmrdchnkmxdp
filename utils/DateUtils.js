/**
 * Created by admin on 2017/8/25.  2017-1-1 12:00:00
 */

export default class DateUtils {
  static getCurrentDate = (date) => {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  };

    /**
     * 获取当前时间 2017-10-10
     * @return {string}
     */
    static getDate = () => {
        let date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    };

    /***
     * 比较两个时间
     * @param d1
     * @param d2
     * @return {boolean}
     * @constructor
     */
    static compareDate = (d1, d2) => {
        try {
            let b = ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
            return b;
        } catch (err) {
            return false;
        }
    }

    static getWeek = () => {
        let day = new Date().getDay();
        if (day = "" || day == undefined) {
            day = 0;
        }
        return day;
    }

}