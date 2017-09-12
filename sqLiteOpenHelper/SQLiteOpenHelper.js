/**
 * Created by admin on 2017/9/1.
 */
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(true);
let database_name = "PosBasicItem.db";//数据库文件
let database_version = "1.0";//版本号
let database_displayname = "MySQLite";
let database_size = -1;//-1应该是表示无限制
let db;
export default class SQLiteOpenHelper {
  constructor() {
    //if (db) {
    //  this._successCB('close');
    //  db.close();
    //} else {
    //  console.log("SQLiteStorage not open");
    //}
    this.createTable();
  }
  
  open() {
    db = SQLiteStorage.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size,
      () => {
        this._successCB('open');
      }, (err) => {
        this._errorCB('open', err);
      });
    return db;
  }
  
  createTable() {
    if (!db) {
      this.open();
    }
    
    db.transaction((tx) => {
      //创建机构信息
      tx.executeSql('CREATE TABLE IF NOT EXISTS tshopitem(pid int null,shopcode varchar(20) null,shopname varchar(200) null,' +
        'UniqueCode varchar(5) null,shoplevel int null,subcode varchar(200) null,FNeedPS char(1) null,FCanPH char(1) null)'
        , [], () => {
          this._successCB('executeSql');
        }, (err) => {
          this._errorCB('a', err);
        });
      //创建用户管理机构
      tx.executeSql('CREATE TABLE IF NOT EXISTS tusershop(usercode varchar(20) null,shopcode varchar(20) null)'
        , [], () => {
          this._successCB('executeSql');
        }, (err) => {
          this._errorCB('b', err);
        });
      //创建用户权限
      tx.executeSql('CREATE TABLE IF NOT EXISTS tuserright(usercode varchar(20) null,Funccode varchar(20) null,' +
        'isEnter int null,IsAdd int null,IsEdit int null,IsDel int null,IsQuery int null,IsPrint int null,IsPrnSet int null,' +
        'IsExPort int null,IsCheck int null,IsWrite int null,IsSpec int null)'
        , [], () => {
          this._successCB('executeSql');
        }, (err) => {
          this._errorCB('c', err);
        });
      //品级
      tx.executeSql('CREATE TABLE IF NOT EXISTS tdepset(pid int null,DepCode varchar(20) null,DepName varchar(100) null,' +
        'AidCode varchar(20) null,SubCode varchar(20) null,DepMemo varchar(50) null,SpecTag int(4) null,IsLeaf int(4) null,' +
        'ProfitRate float(8) null,GatherRate float(8) null,DepLevel int(4) null,IsDel varchar(1) null)'
        , [], () => {
          this._successCB('executeSql');
        }, (err) => {
          this._errorCB('d', err);
        });
      //用户信息列表
      tx.executeSql('CREATE TABLE IF NOT EXISTS tuserset(pid int null,Usercode varchar(20) null,Barcode varchar(20) null,' +
        'UserName varchar(20) null,UserPwd varchar(100) null,OpriceRight varchar(10) null,PriceRight varchar(10) null,IsCashier varchar(10) null,'
        + 'IsClerk varchar(10) null,HDscRate varchar(10) null)'
        , [], () => {
          this._successCB('executeSql');
        }, (err) => {
          this._errorCB('e', err);
        });
      //商品表EditDate char(19) null,
      tx.executeSql('CREATE TABLE IF NOT EXISTS product(Pid int null,ProdCode varchar(13) null,BarCode varchar(18) null,' +
        'ProdName varchar(40) null,ShortName varchar(20) null,AidCode varchar(20) null,OtherCode varchar(20)' +
        'null,DepCode varchar(12) null,SuppCode varchar(12) null,BrandCode varchar(12) null,Spec varchar(20) null,' +
        'ProdAdr varchar(20) null,Unit varchar(4) null,PUnitAmt float(8) null,PicInfo int(4) null,ProdMemo varchar(50) null,' +
        'StdOPrice float(8) null, StdPrice float(8) null,WPrice float(8) null,LowPrice float(8) null,' +
        'HighPrice float(8) null,OTax float(8) null,STax float(8) null,VipPrice1 float(8) null,VipPrice2 float(8) null,' +
        'VipPrice3 float(8) null,BoxCode varchar(13) null ,IsIntCount char(1) null,SaleType char(1) null,' +
        'GatherType char(1) null,GatherRate float(8) null,ProdType char(1) null,SeasonCode varchar(12) null,' +
        'ProdMemo1 varchar(20) null,ProdMemo2 varchar(20) null,ProdMemo3 varchar(20) null,FNoCD char(1) null,IsDel char(1) null,' +
        'FNoSale char(1) null,FNoTH char(1) null,FNoPromoton char(1) null,FUseSalePrice char(1) null,StdOutOPrice float(8) null,FNoYH char(1) null,' +
        'HLimit money(8) null,LLimit money(8) null,BestKC money(8) null,PriceFlag varchar(2) null,FNoPromotion varchar(10) null,FNoCG varchar(10) null,'+
      'OperRange varchar(10) null,TakeRate varchar(10) null,TakeType varchar(10) null)'
        , [], () => {
          this._successCB('executeSql');
        }, (err) => {
          this._errorCB('f', err);
        });
    }, (err) => {
      this._errorCB('transaction', err);
    }, () => {
      this._successCB('transaction');
    })
    
  }
  
  /***
   * 关闭表
   */
  close() {
    if (db) {
      this._successCB('close');
      db.close();
    } else {
      console.log("SQLiteStorage not open");
    }
    db = null;
  }
  
  _successCB(name) {
    console.log("SQLiteStorage=" + name + " success");
  }
  
  _errorCB(name, err) {
    console.log("SQLiteStorage " + name);
    console.log(err);
  }
  
};