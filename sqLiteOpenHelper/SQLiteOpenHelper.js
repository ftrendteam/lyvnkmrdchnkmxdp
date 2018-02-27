/**
 * Created by admin on 2017/9/1.
 */
import SQLiteStorage from 'react-native-sqlite-storage';
SQLiteStorage.DEBUG(false);
let database_name = "PosBasicItem.db";//数据库文件
let database_version = "3.0";//版本号
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
        //this._successCB('open');
      }, (err) => {
        this._errorCB('open', err);
      });
    this.createTable();
    return db;
  }
  
  createTable() {
    if (!db) {
      this.open();
    }
    //db.onUpdateComponent()
    db.updater
    db.transaction((tx) => {
      //创建机构信息
      tx.executeSql('CREATE TABLE IF NOT EXISTS tshopitem(pid int not null Primary Key,shopcode varchar(20) null,shopname varchar(200) null,' +
        'UniqueCode varchar(5) null,shoplevel int null,subcode varchar(200) null,FNeedPS char(1) null,FCanPH char(1) null,PSShop varchar(20) null,isdel varchar(1) null,FCanCG varchar(1) null)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('a', err);
        });
      //创建用户管理机构
      tx.executeSql('CREATE TABLE IF NOT EXISTS tusershop(usercode varchar(20) null,shopcode varchar(20) null)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('b', err);
        });
      //创建用户权限
      tx.executeSql('CREATE TABLE IF NOT EXISTS tuserright(usercode varchar(20) null,Funccode varchar(20) null,' +
        'isEnter int null,IsAdd int null,IsEdit int null,IsDel int null,IsQuery int null,IsPrint int null,IsPrnSet int null,' +
        'IsExPort int null,IsCheck int null,IsWrite int null,IsSpec int null)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('c', err);
        });
      //品级
      tx.executeSql('CREATE TABLE IF NOT EXISTS tdepset(pid int not null Primary Key,DepCode varchar(20) null,DepName varchar(100) null,' +
        'AidCode varchar(20) null,SubCode varchar(20) null,DepMemo varchar(50) null,SpecTag int(4) null,IsLeaf int(4) null,' +
        'ProfitRate float(8) null,GatherRate float(8) null,DepLevel int(4) null,IsDel varchar(1) null,depcode1 varchar(12) null' +
        ',depcode2 varchar(12) null,depcode3 varchar(12) null,depcode4 varchar(12) null,depcode5 varchar(12) null,depcode6 varchar(12) null)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('d', err);
        });
      
      tx.executeSql('CREATE INDEX IF NOT EXISTS  [index_tdepset_depcode] ON [tdepset] ([DepCode] COLLATE NOCASE ASC)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('d', err);
        });
      
      tx.executeSql('CREATE INDEX IF NOT EXISTS  [index_tdepset_subcode] ON [tdepset] ([SubCode] COLLATE NOCASE ASC)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('d', err);
        });
      
      
      //用户信息列表
      tx.executeSql('CREATE TABLE IF NOT EXISTS tuserset(pid int not null Primary Key,Usercode varchar(20) null,Barcode varchar(20) null,' +
        'UserName varchar(20) null,UserPwd varchar(100) null,OpriceRight varchar(10) null,PriceRight varchar(10) null,IsCashier varchar(10) null,'
        + 'IsClerk varchar(10) null,HDscRate varchar(10) null)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('e', err);
        });
      //商品表EditDate char(19) null,
      tx.executeSql('CREATE TABLE IF NOT EXISTS product(Pid int not null Primary Key,ProdCode varchar(13) null,BarCode varchar(18) null,' +
        'ProdName varchar(40) null,ShortName varchar(20) null,AidCode varchar(20) null,OtherCode varchar(20)' +
        'null,DepCode varchar(12) null,SuppCode varchar(12) null,BrandCode varchar(12) null,Spec varchar(20) null,' +
        'ProdAdr varchar(20) null,Unit varchar(4) null,PUnitAmt float(8) null,PicInfo int(4) null,ProdMemo varchar(50) null,' +
        'StdOPrice float(8) null, StdPrice float(8) null,WPrice float(8) null,LowPrice float(8) null,' +
        'HighPrice float(8) null,OTax float(8) null,STax float(8) null,VipPrice1 float(8) null,VipPrice2 float(8) null,' +
        'VipPrice3 float(8) null,BoxCode varchar(13) null ,IsIntCount char(1) null,SaleType char(1) null,' +
        'GatherType char(1) null,GatherRate float(8) null,ProdType char(1) null,SeasonCode varchar(12) null,' +
        'ProdMemo1 varchar(20) null,ProdMemo2 varchar(20) null,ProdMemo3 varchar(20) null,FNoCD char(1) null,IsDel char(1) null,' +
        'FNoSale char(1) null,FNoTH char(1) null,FNoPromoton char(1) null,FUseSalePrice char(1) null,StdOutOPrice float(8) null,FNoYH char(1) null,' +
        'HLimit money(8) null,LLimit money(8) null,BestKC money(8) null,PriceFlag varchar(2) null,FNoPromotion varchar(10) null,FNoCG varchar(10) null,' +
        'OperRange varchar(10) null,TakeRate varchar(10) null,TakeType varchar(10) null)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('f', err);
        });
      
      tx.executeSql('CREATE INDEX IF NOT EXISTS  [index_product_myprodcode] ON [Product] ([ProdCode] COLLATE NOCASE ASC)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('f', err);
        });
      
      tx.executeSql('CREATE INDEX IF NOT EXISTS  [index_product_barcode] ON [Product] ([barcode] COLLATE NOCASE ASC)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('f', err);
        });
      
      tx.executeSql('CREATE INDEX IF NOT EXISTS  [index_product_depcode] ON [Product] ([depcode] COLLATE NOCASE ASC)'
        , [], () => {
          //this._successCB('executeSql');
        }, (err) => {
          this._errorCB('f', err);
        });
      //Pid,ProdCode,prodname,countm,ShopPrice,prototal,promemo,kccount
      tx.executeSql("CREATE TABLE IF NOT EXISTS shopInfo(pid int not null Primary Key,ProdCode varchar(20) null,prodname varchar(255) null,countm float(8) null," +
        "ShopPrice float(8) null,prototal float(8) null,promemo varchar(50) null,DepCode varchar(20) null,ydcountm int(255) null,SuppCode varchar(50) null" +
        ",BarCode varchar(20) null)", [],
        () => {
        
        }, (err) => {
          console.log(err);
        });
      tx.executeSql("CREATE TABLE IF NOT EXISTS tsuppset(pid int not null Primary Key,sCode varchar(20) null,sname varchar(255) null,levelno int(8) null," +
        "aidcode varchar(8) null,subcode varchar(8) null,SuppType varchar(50) null)", [],
        () => {
        
        }, (err) => {
          console.log(err);
        });
      tx.executeSql("CREATE TABLE IF NOT EXISTS KgtOpt(OptName varchar(12) null,OptValue varchar(100) null)", [],
        () => {
        }, (err) => {
          console.log(err);
        });
      tx.executeSql("CREATE TABLE IF NOT EXISTS PosOpt(PosCode varchar(12) null,ShopCode varchar(12) null,OptName varchar(20) null,OptValue varchar(100) null)", [],
        () => {
        
        }, (err) => {
          console.log(err);
        });
      tx.executeSql("CREATE TABLE IF NOT EXISTS Sum(LsNo varchar(12) not null,sDateTime varchar(19) not null,TradeFlag varchar(1) null default('')," +
        "CashierId int(4) null default(0),CashierCode varchar(12) null default(''),ino int(4) not null,CashierName varchar(20) null default(''),DscTotal float(8) null default(0),AutoDscTotal float(8) null default(0)," +
        "Total float(8) null default(0), TotalPay float(8) null default(0),Change float(8) null default(0),CustType varchar(1) null default(''), CustCode varchar(20) null default('')," +
        "InvCode varchar(12) null default(''),PayId int(4) null default(0),PayCode varchar(2) null default(''),Amount float(8) null default(0),OldAmount float(8) null default(0)," +
        "TendPayCode varchar(30) null default(''),VipTotal float(8) null default(0),TScore float(8) null default(0),VipSCore float(8) null default(0), InnerNo varchar(12) not null  ,TransFlag varchar(19) null default(''),TransDateTime varchar(19) null default(''),YWDate varchar(10) null default(''),Primary Key(LsNo,sDateTime,InnerNo,ino))",
        [], () => {//
        },
        (err) => {
          console.log(err);
        });
      tx.executeSql("CREATE TABLE IF NOT EXISTS Detail(LsNo varchar(12) not null,sDateTime varchar(19) not null,TradeFlag varchar(1) null default('')," +
        "CashierId int(4) null default(0),CashierCode varchar(12) null default(''),CashierName varchar(20) null default(''),ClerkId int(4) null default(0),ClerkCode varchar(12) null default(''),Pid int(4) not null,BarCode varchar(18) null default('')," +
        "ClerkName  varchar(20) null default(''),ProdCode varchar(13) null default(''),ProdName varchar(40) null default(''),DepCode varchar(12) null default(''),Price float(8) null default(0),Amount float(8) null default(0)," +
        "DscTotal float(8) null default(0),AutoDscTotal float(8) null default(0)," +
        "Total float(8) null default(0),HandDsc float(8) null default(0),CxDsc float(8) null default(0),EvenDsc float(8) null default(0),MljDsc float(8) null default(0), OverDsc float(8) null default(0),OtherDsc float(8) null default(0),TranDsc float(1) null default(0), VipDsc float(20) null default(0)," +
        "InnerNo varchar(12) not null,OrderNo varchar(3) not null,TransFlag varchar(1) null default(''),TransDateTime varchar(19) null default(''),BrandDsc float(8) null default(0)," +
        "isSubProd varchar(1) null default(''),isMinus varchar(1) null default(''),BuyPresentCode varchar(20) null default(''),BuyPresentGroupNo varchar(20) null default(''), BPUsedCountN float(8) null default(0),DscFormNo varchar(20) null default(''),DscMJFormNo varchar(20) null default(''),SSID varchar(32) null default('')," +
        "DscMZFormNo varchar(20) null default(''),DscGSFormNo varchar(20) null default(''),GSUsedCountN float(8) null default(0),YWDate varchar(10)  null default(''),Primary Key(LsNo,sDateTime,InnerNo,OrderNo))", [], () => {
      }, (err) => {//
        console.log(err);
      });
      //挂单表
      tx.executeSql("CREATE TABLE IF NOT EXISTS RDetail(LsNo varchar(12) not null,sDateTime varchar(19) not null,TradeFlag varchar(1) null," +
        "CashierId int(4) null,CashierCode varchar(12) null,CashierName varchar(20) null,ClerkId int(4) null,ClerkCode varchar(12) null,Pid int(4) not null,BarCode varchar(18) null," +
        "ClerkName  varchar(20) null,ProdCode varchar(13) null,ProdName varchar(40) null,DepCode varchar(12) null,Price float(8) null,Amount float(8) null," +
        "DscTotal float(8) null,AutoDscTotal float(8) null," +
        "Total float(8) null,HandDscTotal float(8) null,CxDsc float(8) null,EvenDsc float(8) null,MljDsc float(8) null, OverDsc float(8) null," +
        "OtherDsc float(8) null,TranDsc float(1) null, VipDsc float(20) null," +
        "InnerNo varchar(12) null,OrderNo varchar(3) null,TransFlag varchar(1) null,TransDateTime varchar(19) null,BrandDsc float(8) null," +
        "isSubProd varchar(1) null,isMinus varchar(1) null,BuyPresentCode varchar(20) null,BuyPresentGroupNo varchar(20) null, " +
        "BPUsedCountN float(8) null,DscFormNo varchar(20) null,DscMJFormNo varchar(20) null,SSID varchar(32) null," +
        "DscMZFormNo varchar(20) null,DscGSFormNo varchar(20) null,GSUsedCountN float(8) null,YWDate varchar(10))", [], () => {
      }, (err) => {
        console.log(err);
      });
      tx.executeSql("CREATE TABLE IF NOT EXISTS payInfo(Pid int(4) not null,PayCode varchar(12) null,payName varchar(50) null," +
        "ExchgRate double(8) null,IsChange varchar(8) null,IsGetCode varchar(2) null,ChangeCode varchar(2) null," +
        "GatherRate int(4) null,IsSystem varchar(1) null,ShortCut varchar(1) null,PayMemo varchar(50)null," +
        "IsDel varchar(1) null,NoDsc varchar(1) null)", [], () => {
        
      })
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscCust(FormNo varchar(20) not null,CustTypeCode varchar(20) null," +
        "CustTypeName varchar(40) null)", [], () => {
        
      })
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscPlan(FormNo varchar(20) not null,BeginDate varchar(10) null," +
        "EndDate varchar(10) null,BeginTime varchar(10) null,EndTime varchar(10) null,VldWeek varchar(7) null)", [], () => {
        
      })
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscProd(FormNo varchar(20) not null,Pid int(4) null,ProdCode varchar(18) null," +
        "ProdName varchar(40) null,BarCode varchar(18) null,ProdType varchar(1) null,DscType varchar(1) null,DscValue float(8) null," +
        "OTax int(4) null,STax int(4) null,DscPrice float(8) null,DscOPrice float(8) null,DscOutOPrice float(8) null," +
        "StdPrice float(8) null,Spec varchar(20) null,ProdAdr varchar(20) null,DepCode varchar(20) null,DepName varchar(40) null," +
        "SuppCode varchar(20) null,SuppName varvhar(40) null,BrandCode varvhar(20) null,BrandName varvhar(40) null," +
        "Remark varvhar(50) null,TimeMark int(4) null,Str1 varvhar(20) null,Str2 varvhar(20) null,Str3 varvhar(20) null," +
        "Curr1 float(8) null,Curr2 float(8) null,Curr3 float(8) null,Tag int(4) null)", [], () => {
      })
      
      tx.executeSql("CREATE TABLE IF NOT EXISTS KGtuser(Pid int(4) null,UserCode varchar(12) null,BarCode varchar(13) null,UserName varchar(20) null," +
        "UserPwd varchar(20) null,EditDateTime varchar(19) null,HDscRate float(8) null,IsCashier varchar(1) null," +
        "IsClerk varchar(1) null,Statues varchar(1) null,IsStationCtrl varchar(1) null,UserMemo varchar(20) null," +
        "OPriceRight varchar(1) null,PriceRight varchar(1) null,VPriceRight varchar(1) null,PSPriceRight varchar(1) null,IsDel varchar(1) null)",[],()=>{})
      
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscExcept(FormNo varchar(20) not null,ProdCode varchar(20) not null," +
        "ProdName varchar(40) null,  StdPrice float(8) null, Remark varchar(50) null)",[],()=>{})
      
      tx.executeSql("CREATE TABLE IF NOT EXISTS Tdschead(FormNo varchar(20) not null,FormName varchar(40)  null,FormType varchar(2) null,dtDep varchar(1) null," +
        "dtSupp varchar(1) null, dtBrand varchar(1) null, dtProd varchar(1) null, dtAll varchar(1) null, dtCust varchar(1) null," +
        "FormMaker varchar(30) null, FormDate varchar(10) null, CheckCode varchar(12) null, CheckName varchar(30) null, " +
        "WriteDate varchar(19) null, UserCode varchar(12) null, UserName varchar(30) null, sDateTime varchar(19) null," +
        "CheckType varchar(1) null,Tag int(4) null, PrnTimes int(4) null, Remark varchar(200) null, MakeShop varchar(4) null, " +
        "MakeShopTblCode varchar(5) null, ywRange varchar(1) null, allPF varchar(1) null, AutoMulti varchar(1) null, " +
        "ConditionType varchar(1) null, Con1 float(8) null, Con2 float(8) null, StopCode varchar(12) null, StopDate varchar(10) null," +
        " DscType varchar(1) null, DscValue float(8) null, str1 varchar(20) null, str2 varchar(20) null, str3 varchar(20) null," +
        " str4 varchar(20) null, str5 varchar(20) null,PricMode varchar(2) null)",[],()=>{})
  
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscDep(FormNo varchar(20) not null,DepCode varchar(20) not null, " +
        "DepName varchar(40) null, DscType varchar(1) null, DscValue float(8) null, Remark varchar(50) null,PriceMode varchar(2) null)",[],()=>{})
      
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscSupp(FormNo varchar(20) not null,SuppCode varchar(20) not null, " +
        "SuppName varchar(40) null, DscType varchar(1) null, DscValue float(8) null, Remark varchar(50) null,PriceMode varchar(2) null)",[],()=>{})
  
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscBrand(FormNo varchar(20) not null,BrandCode varchar(20) not null, " +
        "BrandName varchar(40) null, DscType varchar(1) null, DscValue float(8) null, Remark varchar(50) null,PriceMode varchar(2) null)",[],()=>{})
  
      tx.executeSql("CREATE TABLE IF NOT EXISTS TDscCondition(FormNo varchar(20) not null,ConType varchar(10) null," +
        "Con1 float(8) null, Con2 float(8) null, Remark varchar(50) null,cxConType varchar(5) null)",[],()=>{})
  
      tx.executeSql("CREATE TABLE IF NOT EXISTS tDscPresent(FormNo varchar(20) not null,ProdCode varchar(20) null," +
        "ProdName varchar(40) null, PlanNo varchar(20) null, GroupNo varchar(20) null, CountN float(8) null, " +
        "StdPrice float(8) null, Remark varchar(50) null)",[],()=>{})
      tx.executeSql("CREATE TABLE IF NOT EXISTS tDscGroupPrice(FormNo varchar(20) not null,GroupNo varchar(2) null," +
        "GroupCountN float(8) null, GroupTotal float(8) null)",[],()=>{})
    }, (err) => {
      this._errorCB('transaction', err);
    }, () => {
      //this._successCB('transaction');
    })
  }
  
  /***
   * 关闭表
   */
  close() {
    if (db) {
      //this._successCB('close');
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