/**
 * Created by 日期格式化 on 2017/9/20.
 */
export default class DateUtil{
    static formatDate(date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
    }
    static formatDateTime(date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return date.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
    }

    static parseDate(dateString) {
        return new Date(Date.parse(dateString));
    }

    static parseDateTime(dateTimeString) {
        var dateTimeArray = dateTimeString.split(" ");
        var date = new Date(Date.parse(dateTimeArray[0]));
        var timeArray = dateTimeArray[1].split(":");
        date.setHours(parseInt(timeArray[0]));
        date.setMinutes(parseInt(timeArray[1]));
        return date;
    }

}