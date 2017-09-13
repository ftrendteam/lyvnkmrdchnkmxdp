/**
 * Created by admin on 2017/9/1.
 */
import SQLiteOpenHelper from '../sqLiteOpenHelper/SQLiteOpenHelper';
import MD5Utils from '../utils/MD5Utils';
import DataUtils from '../utils/DataUtils';
import FetchUtils from '../utils/FetchUtils';
import RequestBodyUtils from '../utils/RequestBodyUtils';
let db;
let sqLiteOpenHelper
export default class DBAdapter extends SQLiteOpenHelper {
  constructor() {
    if (sqLiteOpenHelper === undefined) {
      sqLiteOpenHelper = new SQLiteOpenHelper();
    }
    super();
  }
  
  open() {
    db = sqLiteOpenHelper.open();
    return db;
  }
  
  /**
   * 删除所有表数据
   */
  deleteData(dbName) {
    if (!db) {
      this.open();
    }
    db.transaction((tx) => {
      tx.executeSql('delete from ' + dbName + '', [], () => {
      
      });
    });
  }
  
  /**
   * 删除表
   */
  dropTable(dbName) {
    db.transaction((tx) => {
      tx.executeSql('drop table ' + dbName + '', [], () => {
      
      });
    }, (err) => {
      this._errorCB('transaction', err);
    }, () => {
      this._successCB('transaction');
    });
  }
  
  /***
   * 插入数据机构信息
   * @param TShopItemData 插入数据的数组
   */
  insertTShopItemData(tShopItemData) {
    let len = tShopItemData.length;
    if (!db) {
      this.open();
    }
    //this.createTable();
    this.deleteData('tshopitem');
    db.transaction((tx) => {
      for (let i = 0; i < len; i++) {
        let tShopItem = tShopItemData[i];
        let pid = tShopItem.pid;
        let shopcode = tShopItem.shopcode;
        let shopname = tShopItem.shopname;
        let UniqueCode = tShopItem.UniqueCode;
        let shoplevel = tShopItem.shoplevel;
        let subcode = tShopItem.subcode;
        let FNeedPS = tShopItem.FNeedPS;
        let FCanPH = tShopItem.FCanPH;
        let sql = "INSERT INTO tshopitem(pid,shopcode,shopname,UniqueCode,shoplevel,subcode,FNeedPS,FCanPH)" +
          "values(?,?,?,?,?,?,?,?)";
        tx.executeSql(sql, [pid, shopcode, shopname, UniqueCode, shoplevel, subcode, FNeedPS, FCanPH], () => {
          
          }, (err) => {
            console.log(err);
          }
        );
      }
    }, (error) => {
      this._errorCB('transaction', error);
    }, () => {
      this._successCB('transaction insert data');
    });
  }
  
  /***
   * 插入数据 tusershop表  用户管理机构
   * @param tusershopData 插入数据的数组
   */
  insertTUsershopData(tusershopData) {
    let len = tusershopData.length;
    if (!db) {
      this.open();
    }
    //this.createTable();
    this.deleteData('tusershop');
    db.transaction((tx) => {
      for (let i = 0; i < len; i++) {
        let tusershop = tusershopData[i];
        let usercode = tusershop.usercode;
        let shopcode = tusershop.shopcode;
        let sql = "INSERT INTO tusershop(usercode,shopcode)" +
          "values(?,?)";
        tx.executeSql(sql, [usercode, shopcode], () => {
          
          }, (err) => {
            console.log(err);
          }
        );
      }
    }, (error) => {
      this._errorCB('transaction', error);
    }, () => {
      this._successCB('transaction insert data');
    });
  }
  
  
  /***
   * 插入数据 tuserright 权限表
   * @param tuserright 插入数据的数组
   */
  insertTUserRrightData(tuserRirghtData) {
    let len = tuserRirghtData.length;
    if (!db) {
      this.open();
    }
    this.deleteData('tuserright');
    db.transaction((tx) => {
      for (let i = 0; i < len; i++) {
        let tuserRirght = tuserRirghtData[i];
        let usercode = tuserRirght.Usercode;
        let Funccode = tuserRirght.Funccode;
        let isEnter = tuserRirght.isEnter;
        let IsAdd = tuserRirght.IsAdd;
        let IsEdit = tuserRirght.IsEdit;
        let IsDel = tuserRirght.IsDel;
        let IsQuery = tuserRirght.IsQuery;
        let IsPrint = tuserRirght.IsPrint;
        let IsPrnSet = tuserRirght.IsPrnSet;
        let IsExPort = tuserRirght.IsExPort;
        let IsCheck = tuserRirght.IsCheck;
        let IsWrite = tuserRirght.IsWrite;
        let IsSpec = tuserRirght.IsSpec;
        let sql = "INSERT INTO tuserright(usercode,Funccode,isEnter,IsAdd,IsEdit,IsDel,IsQuery,IsPrint,IsPrnSet,IsExPort,IsCheck,IsWrite,IsSpec)" +
          "values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
        tx.executeSql(sql, [usercode, Funccode, isEnter, IsAdd, IsEdit, IsDel, IsQuery, IsPrint, IsPrnSet, IsExPort, IsCheck, IsWrite, IsSpec], () => {
          
          }, (err) => {
            console.log(err);
          }
        );
      }
    }, (error) => {
      this._errorCB('transaction', error);
    }, () => {
      this._successCB('transaction insert data');
    });
  }
  
  
  /***
   * 插入数据 品级表
   * @param tdepset 插入数据的数组
   */
  insertTDepSetData(tdepSetData) {
    return new Promise((resolve, reject) => {
      let len = tdepSetData.length;
      if (!db) {
        this.open();
      }
      //this.createTable();
      this.deleteData('tdepset');
      db.transaction((tx) => {
        for (let i = 0; i < len; i++) {
          let tdepSet = tdepSetData[i];
          let pid = tdepSet.Pid;
          let DepCode = tdepSet.DepCode;
          let DepName = tdepSet.DepName;
          let AidCode = tdepSet.AidCode;
          let SubCode = tdepSet.SubCode;
          let DepMemo = tdepSet.DepMemo;
          let SpecTag = tdepSet.SpecTag;
          let IsLeaf = tdepSet.IsLeaf;
          let ProfitRate = tdepSet.ProfitRate;
          let GatherRate = tdepSet.GatherRate;
          let DepLevel = tdepSet.DepLevel;
          let IsDel = tdepSet.IsDel;
          
          let sql = "INSERT INTO tdepset(pid,DepCode,DepName,AidCode,SubCode,DepMemo,SpecTag,IsLeaf,ProfitRate,GatherRate,DepLevel,IsDel)" +
            "values(?,?,?,?,?,?,?,?,?,?,?,?)";
          tx.executeSql(sql, [pid, DepCode, DepName, AidCode, SubCode, DepMemo, SpecTag, IsLeaf, ProfitRate, GatherRate, DepLevel, IsDel], () => {
            
            }, (err) => {
              console.log(err);
            }
          );
        }
      }, (error) => {
        reject(false);
        //this._errorCB('transaction', error);
      }, () => {
        //this._successCB('transaction insert data');
        resolve(true);
      });
    });
    
  }
  
  
  /***
   * 插入数据 tuserset 用户信息列表
   * @param tuserset 插入数据的数组
   */
  insertTUserSetData(tuserSetData) {
    let len = tuserSetData.length;
    if (!db) {
      this.open();
    }
    //this.createTable();
    this.deleteData('tuserset');
    db.transaction((tx) => {
      for (let i = 0; i < len; i++) {
        let tuserset = tuserSetData[i];
        let pid = tuserset.PID;
        let Usercode = tuserset.Usercode;
        let Barcode = tuserset.Barcode;
        let UserName = tuserset.UserName;
        let UserPwd = tuserset.UserPwd;
        let OpriceRight = tuserset.OpriceRight;
        let PriceRight = tuserset.PriceRight;
        let IsCashier = tuserset.IsCashier;
        let IsClerk = tuserset.IsClerk;
        let HDscRate = tuserset.HDscRate;
        
        let sql = "INSERT INTO tuserset(pid,Usercode,Barcode,UserName,UserPwd,OpriceRight,PriceRight,IsCashier,IsClerk,HDscRate)" +
          "values(?,?,?,?,?,?,?,?,?,?)";
        tx.executeSql(sql, [pid, Usercode, Barcode, UserName, UserPwd, OpriceRight, PriceRight, IsCashier, IsClerk, HDscRate], () => {
          
          }, (err) => {
            console.log(err);
          }
        );
      }
    }, (error) => {
      this._errorCB('transaction', error);
    }, () => {
      this._successCB('transaction insert data');
    });
  }
  
  /***
   * 插入数据 product 商品
   * @param product 插入数据的数组
   */
  insertProductData(productData) {
    return new Promise((resolve, reject) => {
      let len = productData.length;
      if (!db) {
        this.open();
      }
      //this.createTable();
      console.log("product-start");
      this.deleteData("product");
      db.transaction((tx) => {
        console.log("product-2");
        for (let i = 0; i < len; i++) {
          let product = productData[i];
          let Pid = product.Pid;
          let ProdCode = product.ProdCode;
          let BarCode = product.BarCode;
          let ProdName = product.ProdName;
          let ShortName = product.ShortName;
          let AidCode = product.AidCode;
          let OtherCode = product.OtherCode;
          let DepCode = product.DepCode;
          let SuppCode = product.SuppCode;
          let BrandCode = product.BrandCode;
          let Spec = product.Spec;
          let ProdAdr = product.ProdAdr;
          let Unit = product.Unit;
          let PUnitAmt = product.PUnitAmt;
          let PicInfo = product.PicInfo;
          let ProdMemo = product.ProdMemo;
          let StdOPrice = product.StdOPrice;
          let StdOutOPrice = product.StdOutOPrice;
          let StdPrice = product.StdPrice;
          let WPrice = product.WPrice;
          let LowPrice = product.LowPrice;
          let HighPrice = product.HighPrice;
          let OTax = product.OTax;
          let STax = product.STax;
          let VipPrice1 = product.VipPrice1;
          let VipPrice2 = product.VipPrice2;
          let VipPrice3 = product.VipPrice3;
          let BoxCode = product.BoxCode;
          let IsIntCount = product.IsIntCount;
          let SaleType = product.SaleType;
          let GatherType = product.GatherType;
          let GatherRate = product.GatherRate;
          let ProdType = product.ProdType;
          //let EditDate = product.EditDate;
          let SeasonCode = product.SeasonCode;
          let ProdMemo1 = product.ProdMemo1;
          let ProdMemo2 = product.ProdMemo2;
          let ProdMemo3 = product.ProdMemo3;
          let FNoCD = product.FNoCD;
          let IsDel = product.IsDel;
          let FNoSale = product.FNoSale;
          let FNoTH = product.FNoTH;
          let FNoPromotion = product.FNoPromotion;
          let FUseSalePrice = product.FUseSalePrice;
          let FNoYH = product.FNoYH;
          let hlimit = product.HLimit;
          let llimit = product.LLimit;
          let bestkc = product.BestKC;
          let FNoCG = product.FNoCG;
          
          let TakeType = product.TakeType;
          let TakeRate = product.TakeRate;
          let PriceFlag = product.PriceFlag;
          let OperRange = product.OperRange;
          
          let sql = 'INSERT INTO product(Pid,ProdCode,BarCode,ProdName,ShortName,AidCode,OtherCode,DepCode,SuppCode,BrandCode,' +
            'Spec,ProdAdr,Unit,PUnitAmt,PicInfo,ProdMemo,StdOPrice,StdOutOPrice,StdPrice,WPrice,LowPrice,HighPrice,OTax,' +
            'STax,VipPrice1,VipPrice2,VipPrice3,BoxCode,IsIntCount,SaleType,GatherType,GatherRate,ProdType,SeasonCode,' +
            'ProdMemo1,ProdMemo2,ProdMemo3,FNoCD,IsDel,FNoSale,FNoTH,FNoPromotion,FUseSalePrice,FNoYH,Hlimit,Llimit,Bestkc,FNoCG,TakeType,TakeRate,OperRange,PriceFlag)' +
            "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          tx.executeSql(sql, [Pid, ProdCode, BarCode, ProdName, ShortName, AidCode, OtherCode, DepCode, SuppCode, BrandCode,
              Spec, ProdAdr, Unit, PUnitAmt, PicInfo, ProdMemo, StdOPrice, StdOutOPrice, StdPrice, WPrice, LowPrice, HighPrice, OTax,
              STax, VipPrice1, VipPrice2, VipPrice3, BoxCode, IsIntCount, SaleType, GatherType, GatherRate, ProdType, SeasonCode,
              ProdMemo1, ProdMemo2, ProdMemo3, FNoCD, IsDel, FNoSale, FNoTH, FNoPromotion, FUseSalePrice, FNoYH, hlimit, llimit, bestkc, FNoCG, TakeType, TakeRate, PriceFlag, OperRange], () => {
            }, (err) => {
              console.log(err);
            }
          );
          
        }
        
      }, (error) => {
        reject(false);
        //this._errorCB('transaction', error);
      }, () => {
        resolve(true);
        //this._successCB('transaction insert data');
      });
    });
    
  }
  
  /***
   * 根据登录界面的用户编码，返回机构列表
   * @param  当前shopcode下管理的机构信息
   * @return 返回管理的机构信息
   */
  selectTUserShopData(Usercode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("select b.ShopCode,b.ShopName from tUserShop a inner join tshopitem b on b.SubCode+rtrim(b.shopcode)+';' like '%;'+rtrim(a.shopcode)+';%' or a.shopcode='0' where a.UserCode='" + Usercode + "'" + Usercode + "'", [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   *取目前登录的机构
   */
  
  /***
   *  根据用户编码，密码，校验是否正确，正确的话，保存当前登录的机构信息
   *  保存机构信息的时候，查询一下有没有机构信息，若是没有机构信息（下载基础信息），保存完机构信息
   * @param Usercode 改用户编码
   * @return md5加密的密码
   *
   */
  selectTUserSetData(Usercode, userpwd, shopcode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("select * from tuserset where Usercode = '" + Usercode + "'", [], (tx, results) => {
          resolve(results.rows);
          //验证用户是否成，若是成功，取 tcurrSysopt (optname,optvalue)  optshopcode,shopcode\
          //若是这个表中没有记录，下载基础信息，根据当前的 shopcode
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  isLogin(Usercode, userpwd, currShopCode) {
    let md5Pwd = MD5Utils.encryptMD5(userpwd);
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("select * from tuserset where Usercode = '" + Usercode + "'", [], (tx, results) => {
          let length = results.rows.length;//没有特殊情况 长度为1
          console.log('length=', length);
          //for (let i = 0; i < length; i++) {
          if (length === 1) {
            let item = results.rows.item(0);
            console.log("pwd=", item.UserPwd)
            console.log("md5Pwd=", md5Pwd + '')
            console.log("pwd=", md5Pwd == item.UserPwd)
            if ((md5Pwd + '') == item.UserPwd) {//密码正确
              console.log("pwd ok");
              let shopCode;
              DataUtils.get('shopCode', '').then((data) => {
                shopCode = data;
                console.log("shopCode",shopCode);
                if (shopCode == currShopCode) {//当前登录的机构号 和本地保存的相同
                  resolve(true);
                } else if (shopCode == '') {//本地没有保存机构号,根据当前的机构号下载商品和品类
                  let productBody = RequestBodyUtils.createProduct(currShopCode, '');
                  let categoryBody = RequestBodyUtils.createCategory(currShopCode);
                  this.downProductAndCategory(productBody, categoryBody).then((result) => {
                    if (result) {
                      resolve(true);
                    }
                  });
                  
                } else {//当前登录的机构号和本地保存的机构号不同.重新保存并下载新的品类和商品信息
                  DataUtils.save('shopCode', currShopCode);
                  /***
                   * prductBody 商品信息下载请求体
                   * categoryBody 品类信息下载请求体
                   */
                  let productBody = RequestBodyUtils.createProduct(currShopCode, '');
                  let categoryBody = RequestBodyUtils.createCategory(currShopCode);
                  this.downProductAndCategory(productBody, categoryBody).then((result) => {
                    if (result) {
                      resolve(true);
                    }
                  });
                  
                }
              });
              
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
          
          //}
          //验证用户是否成，若是成功，取 tcurrSysopt (optname,optvalue)  optshopcode,shopcode\
          //若是这个表中没有记录，下载基础信息，根据当前的 shopcode
        });
      }, (error) => {
        this._errorCB('transactiondsaf', error);
      });
    });
  }
  
  /**
   * url地址如何保存的如何去出来.
   * @param productBody
   * @param categoryBody
   */
  downProductAndCategory(productBody, categoryBody) {
    return new Promise((resolve, reject) => {
      DataUtils.get("LinkUrl", "").then((urldata) => {
        FetchUtils.post(urlData, productBody).then((data) => {
          if (data.retcode == 1) {
            this.insertProductData(data.TblRow).then((result) => {
              FetchUtils.post(urlData, categoryBody).then((data) => {
                if (data.retcode == 1) {
                  this.insertTDepSetData(data.TblRow).then((result) => {
                    resolve(true);
                  });
                }
              });
            });
          }
        });
      })
    });
    
  }
  
  /***
   * 登录后，商品属性页面口 查询某级品类名称
   * @param DepLevel 当前阶段穿默认值 1
   * DepLevel 默认取1
   *
   */
  selectTDepSet(DepLevel) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('select * from tdepset where IsDel=0 and DepLevel=' + DepLevel + '', [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('wtf', error);
      });
    })
  }
  
  /***
   * 根据指定品类中的depcode获取所有该品类的商品
   * @param DepCode 品级编码
   * @return 返回指定品类下所有商品信息
   */
  selectProduct(DepCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("select * from product where IsDel='0' and DepCode in (select DepCode from tdepset where IsDel='0'" +
          "and (DepCode=" + DepCode + " or SubCode like '%;" + DepCode + ";%'))", [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
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
}