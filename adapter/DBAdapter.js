/**
 * Created by admin on 2017/9/1.
 */
import SQLiteOpenHelper from '../sqLiteOpenHelper/SQLiteOpenHelper';
import MD5Utils from '../utils/MD5Utils';
import DataUtils from '../utils/DataUtils';
import Storage from '../utils/Storage';
import FetchUtils from '../utils/FetchUtils';
import DownLoadBasicData from '../utils/DownLoadBasicData';
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
        
        let PSShop = tShopItem.PSShop;
        let isdel = tShopItem.isdel;
        let FCanCG = tShopItem.FCanCG;
      
        let sql = "INSERT INTO tshopitem(pid,shopcode,shopname,UniqueCode,shoplevel,subcode,FNeedPS,FCanPH,PSShop,isdel,FCanCG)" +
          "values(?,?,?,?,?,?,?,?,?,?,?)";
        tx.executeSql(sql, [pid, shopcode, shopname, UniqueCode, shoplevel, subcode, FNeedPS, FCanPH,PSShop,isdel,FCanCG], () => {
          
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
   * 插入kgopt表数据
   * @param datas
   */
  insertKgopt(datas) {
    let len = datas.length;
    if (!db) {
      this.open();
    }
    this.deleteData("KgtOpt");
    db.transaction((tx) => {
      for (let i = 0; i < len; i++) {
        let data = datas[i];
        let optName = data.OptName;
        let optValue = data.OptValue;
        let sql = "INSERT INTO KgtOpt(OptName,OptValue) values(?,?)";
        tx.executeSql(sql, [optName, optValue], () => {
        }, (err) => {
          console.log(err)
        });
      }
    });
  }
  
  selectKgOpt(where) {
    if (!db) {
      this.open();
    }
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        try {
          let sql = "select * from KgtOpt where upper(OptName) = '" + (where + "").toUpperCase() + "'";
          console.log(sql)
          tx.executeSql(sql, [], (tx, result) => {
            resolve(result.rows);
          }, (err) => {
            reject("");
            console.log(err)
          });
        } catch (err) {
          console.log("kgop=", err)
        }
        
      });
    });
  }
  
  selectPosOpt(where) {
    if (!db) {
      this.open();
    }
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        try {
          let sql = "select * from PosOpt where upper(OptName) = '" + (where + "").toUpperCase() + "'";
          //console.log(sql)
          tx.executeSql(sql, [], (tx, result) => {
            resolve(result.rows);
          }, (err) => {
            reject("");
            //console.log("reject=", err)
          });
        } catch (err) {
          //console.log("zhixingdbb=", err);
        }
      });
    });
  }
  
  /***
   * 插入PosOpt表数据
   * @param datas
   */
  insertPosOpt(datas) {
    let len = datas.length;
    if (!db) {
      this.open();
    }
    this.deleteData("PosOpt");
    db.transaction((tx) => {
      for (let i = 0; i < len; i++) {
        let data = datas[i];
        let posCode = data.PosCode;
        let shopCode = data.ShopCode;
        let optName = data.OptName;
        let optValue = data.OptValue;
        let sql = "INSERT INTO PosOpt(PosCode,ShopCode,OptName,OptValue) values(?,?,?,?)";
        tx.executeSql(sql, [posCode, shopCode, optName, optValue], () => {
        }, (err) => {
          console.log(err)
        });
      }
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
          let depcode1 = tdepSet.depcode1;
          let depcode2 = tdepSet.depcode2;
          let depcode3 = tdepSet.depcode3;
          let depcode4 = tdepSet.depcode4;
          let depcode5 = tdepSet.depcode5;
          let depcode6 = tdepSet.depcode6;
          
          let sql = "INSERT INTO tdepset(pid,DepCode,DepName,AidCode,SubCode,DepMemo,SpecTag,IsLeaf,ProfitRate,GatherRate,DepLevel,IsDel,depcode1,depcode2,depcode3,depcode4,depcode5,depcode6)" +
            "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          tx.executeSql(sql, [pid, DepCode, DepName, AidCode, SubCode, DepMemo, SpecTag, IsLeaf, ProfitRate, GatherRate, DepLevel, IsDel, depcode1, depcode2, depcode3, depcode4, depcode5, depcode6], () => {
            }, (error) => {
              console.log(error);
            }
          );
        }
      }, (error) => {
        reject(false);
        this._errorCB('transaction', error);
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
  
  /****
   * 插入数据shopInfo表
   */
  insertShopInfo(shopInfoData) {
    return new Promise((resolve, reject) => {
      let lenght = shopInfoData.length;
      if (!db) {
        this.open();
      }
      db.transaction((tx) => {
        for (let i = 0; i < lenght; i++) {
          let shopInfo = shopInfoData[i];
          let shopName = shopInfo.prodname;
          let ShopNumber = shopInfo.countm;
          let ShopPrice = shopInfo.ShopPrice;
          let ShopAmount = shopInfo.prototal;
          let ShopRemark = shopInfo.promemo;
          let Pid = shopInfo.Pid;
          let ProdCode = shopInfo.ProdCode;
          let DepCode = shopInfo.DepCode;
          let ydcountm = shopInfo.ydcountm;
          let suppCode = shopInfo.SuppCode;
          //   "prodname":"海鲜菇","countm":1.0000,"kccount":0.0,"prototal":1.0000,"unit":"kg  ","promemo":""
          let sql = " replace INTO shopInfo(pid,ProdCode,prodname,countm,ShopPrice,prototal,promemo,DepCode,ydcountm,SuppCode)" +
            "values(?,?,?,?,?,?,?,?,?,?)";
          tx.executeSql(sql, [Pid, ProdCode, shopName, ShopNumber, ShopPrice, ShopAmount, ShopRemark, DepCode, ydcountm,suppCode], () => {
              resolve(true);
            }, (err) => {
              reject(false);
              
              console.log(err);
            }
          );
        }
      });
    });
  }
  
  /***
   * 查询shopInfo 所有信息
   * @return {Promise}
   */
  selectShopInfo() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("select * from shopInfo", [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 查询shopInfo表中所有商品的数量总和
   */
  selectShopInfoAllCountm() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('select sum(countm) countm from shopInfo', [], (tx, results) => {
          resolve(results.rows);
        })
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 查询shopInfo表中某品类的数量
   * @param ProdCode
   * @return {Promise}
   */
  selectShopInfoCountm(DepCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('select sum(countm) countm from shopInfo where DepCode =' + DepCode + '', [], (tx, results) => {
          try {
            resolve(results.rows);
          } catch (err) {
            reject(0);
          }
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 修改某个商品的数量-1
   */
  upDataShopInfoCountmSub(ProdCode) {
    console.log("a",ProdCode);
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("update shopInfo set countm=countm-1 where ProdCode='" + ProdCode + "'", [], (tx, results) => {
          try {
            resolve(true);
          } catch (err) {
            reject(false);
          }
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 修改某个商品的数量+1
   */
  upDataShopInfoCountmAdd(ProdCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('update shopInfo set countm=countm+1 where ProdCode=' + ProdCode + '', [], (tx, results) => {
          try {
            resolve(true);
          } catch (err) {
            reject(false);
          }
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 插入数据 product 商品
   * @param product 插入数据的数组
   */
  insertProductData(productData) {
    return new Promise((resolve, reject) => {
      let len = productData.length;
      db.transaction((tx) => {
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
          let sqlDet = "delete from product where pid =?";
          
          tx.executeSql(sqlDet, [Pid], () => {
            }, (error) => {
            
            }
          );
          let sql = 'INSERT INTO product(Pid,ProdCode,BarCode,ProdName,ShortName,AidCode,OtherCode,DepCode,SuppCode,BrandCode,' +
            'Spec,ProdAdr,Unit,PUnitAmt,PicInfo,ProdMemo,StdOPrice,StdOutOPrice,StdPrice,WPrice,LowPrice,HighPrice,OTax,' +
            'STax,VipPrice1,VipPrice2,VipPrice3,BoxCode,IsIntCount,SaleType,GatherType,GatherRate,ProdType,SeasonCode,' +
            'ProdMemo1,ProdMemo2,ProdMemo3,FNoCD,IsDel,FNoSale,FNoTH,FNoPromotion,FUseSalePrice,FNoYH,Hlimit,Llimit,Bestkc,FNoCG,TakeType,TakeRate,OperRange,PriceFlag)' +
            "values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          tx.executeSql(sql, [Pid, ProdCode, BarCode, ProdName, ShortName, AidCode, OtherCode, DepCode, SuppCode, BrandCode,
              Spec, ProdAdr, Unit, PUnitAmt, PicInfo, ProdMemo, StdOPrice, StdOutOPrice, StdPrice, WPrice, LowPrice, HighPrice, OTax,
              STax, VipPrice1, VipPrice2, VipPrice3, BoxCode, IsIntCount, SaleType, GatherType, GatherRate, ProdType, SeasonCode,
              ProdMemo1, ProdMemo2, ProdMemo3, FNoCD, IsDel, FNoSale, FNoTH, FNoPromotion, FUseSalePrice, FNoYH, hlimit, llimit, bestkc, FNoCG, TakeType, TakeRate, PriceFlag, OperRange], () => {
            }, (error) => {
              console.log(error);
            }
          );
        }
      }, (error) => {
        this._errorCB('transaction', error);
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
        tx.executeSql("select b.ShopCode,b.ShopName from tUserShop a inner join tshopitem b on b.SubCode+rtrim(b.shopcode)+';' like '%;'+rtrim(a.shopcode)+';%' or rtrim(a.shopcode)='0'  where a.UserCode='" + Usercode + "'" , [], (tx, results) => {
          resolve(results.rows);
        });

      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 根据解析出来的prodCode 查询商品
   * @param prodCode
   * @param DepLevel   当前默认传1
   * @returns {Promise}
   */
  selectProdCode(prodCode, DepLevel) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select a.*,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
          ",ifNull(b.promemo,'') as ShopRemark,c.depcode" + DepLevel + " as DepCode1 " +
          " from product a left join shopInfo b on a.Pid=b.Pid  ";
        ssql = ssql + " left join  tdepset c on c.IsDel='0' and a.depcode=c.depcode where a.IsDel='0' and prodtype<>'1'";
        ssql = ssql + "  and  a.prodcode ='" + prodCode + "'";
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
          
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 是否可以进行要货，配送收货，协配收货
   * 返回结果集不为空 表示可以进行单据 为空 提示  <没有配送机构,不能进行该业务>
   * @param shopCode  当前登录的机构号
   */
  isYHPSXP(shopCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select PSShop from tShopItem where FNeedPS='1' and ShopCode='" + shopCode + "' and isdel='0'";
        console.log(ssql);
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 是否可以协配采购
   * 表示可以进行单据 为空 提示  <配送中心，不能进行该业务>
   * @param shopCode
   */
  isXPCG(shopCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select PSShop from tShopItem where FNeedPS='1' and PSShop='" + shopCode + "' and isdel='0' and PSShop<>ShopCode";
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
          
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 是否可以采购和验收功能
   * 结果集为空 提示 本机构没有采购权,不能进行该业务
   * @param shopCode 当前登录的机构信息
   */
  isCGYS(shopCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select FCanCG  from tShopItem  where isdel='0' and ((ShopCode='" + shopCode + "'  and FCanCG='1') or '"+shopCode+"'='0')";
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
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
  
  isLogin(Usercode, userpwd, currShopCode, posCode) {
    let md5Pwd = MD5Utils.encryptMD5(userpwd);
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql("select * from tuserset where Usercode = '" + Usercode + "'", [], (tx, results) => {
          let length = results.rows.length;//没有特殊情况 长度为1
          //for (let i = 0; i < length; i++) {
          if (length === 1) {
            let item = results.rows.item(0);
            if ((md5Pwd + '') == item.UserPwd) {//密码正确
              let userName = item.UserName;
              Storage.save("userName", userName);
              // DataUtils.save("userCode", Usercode);
              let shopCode;
              DataUtils.get('code', '').then((data) => {
                shopCode = data;
                console.log("shopCode", shopCode);
                if (shopCode == currShopCode) {//当前登录的机构号 和本地保存的相同
                  // console.log("当前登录的机构号 和本地保存的相同");
                  let categoryBody = RequestBodyUtils.createCategory(currShopCode);
                  this.downProductAndCategory(categoryBody, currShopCode).then((result) => {
                    //if (result) {
                    //console.log("本地没有保存机构号,根据当前的机构号下载商品和品类");
                    resolve(true);
                    //}
                  });
                  resolve(true);
                } else if (shopCode == '') {//本地没有保存机构号,根据当前的机构号下载商品和品类
                  let categoryBody = RequestBodyUtils.createCategory(currShopCode);
                  this.downProductAndCategory(categoryBody, currShopCode).then((result) => {
                    //if (result) {
                    //console.log("本地没有保存机构号,根据当前的机构号下载商品和品类");
                    resolve(true);
                    //}
                  });
                } else {//当前登录的机构号和本地保存的机构号不同.重新保存并下载新的品类和商品信息
                  DataUtils.save('shopCode', currShopCode);
                  // console.log("cccc重新保存并下载新的品类和商品信息");
                  /***
                   * prductBody 商品信息下载请求体
                   * categoryBody 品类信息下载请求体
                   */
                  let categoryBody = RequestBodyUtils.createCategory(currShopCode);
                  this.downProductAndCategory(categoryBody, currShopCode).then((result) => {
                    //if (result) {
                    resolve(true);
                    //}
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
  downProductAndCategory(categoryBody, currShopCode) {
    return new Promise((resolve, reject) => {
      DataUtils.get("LinkUrl", '').then((urlData) => {
        RequestBodyUtils.requestProduct(urlData, currShopCode, this).then((prodResult) => {
          console.log("prodResult", prodResult);
          FetchUtils.post(urlData, categoryBody).then((datas) => {
            this.insertTDepSetData(datas.TblRow).then((result) => {
              let suppset = RequestBodyUtils.createSuppset(currShopCode);
              FetchUtils.post(urlData, suppset).then((suppData) => {
                this.insertSuppeset(suppData.TblRow).then((result) => {
                  DownLoadBasicData.downLoadKgtOpt(urlData, currShopCode, this)
                  resolve(true);
                });
              })
            });
          });
        });
      });
    });
  }
  
  /***
   * 登录后，商品属性页面口 查询某级品类名称
   * @param DepLevel 当前阶段穿默认值 1
   * DepLevel 默认取1
   */
  selectTDepSet(DepLevel) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('select a.*,ifNull(b.countm,0) as ShopNumber from tdepset a left join (select depcode,sum(countm)  as countm from shopInfo group by depcode) b on a.depcode=b.depcode where IsDel=0 and DepLevel=' + DepLevel + '', [], (tx, results) => {
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
  
  selectProduct1(DepCode, DepLevel) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select count(*) as countn " +
          "from product a left join shopInfo b on a.Pid=b.Pid where IsDel='0' and prodtype<>'1'";
        ssql = ssql + "and a.DepCode in (select depcode from tdepset where IsDel='0' and depcode" + DepLevel + "='" + DepCode + "')";
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    })
  }
  
  selectProduct(DepCode, currpage, DepLevel) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select a.*,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
          ",ifNull(b.promemo,'') as ShopRemark,'" + DepCode + "' as DepCode1 " +
          " from product a left join shopInfo b on a.Pid=b.Pid where IsDel='0' and prodtype<>'1' ";
        ssql = ssql + " and a.DepCode in (select depcode from tdepset where IsDel='0' and depcode" + DepLevel + "='" + DepCode + "')";
        ssql = ssql + " limit 15 offset " + (currpage - 1) * 9;
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    })
  }

    /***
     * 根据解析出来的prodCode 查询商品
     * @param prodCode
     * @param DepLevel   当前默认传1
     * @returns {Promise}
     */
    selectProdCode(prodCode, DepLevel) {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let ssql = "select a.*,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
                    ",ifNull(b.promemo,'') as ShopRemark,c.depcode" + DepLevel + " as DepCode1 " +
                    " from product a left join shopInfo b on a.Pid=b.Pid  ";
                ssql = ssql + " left join  tdepset c on c.IsDel='0' and a.depcode=c.depcode where a.IsDel='0' and prodtype<>'1'";
                ssql = ssql + "  and  a.prodcode ='" + prodCode + "'";
                tx.executeSql(ssql, [], (tx, results) => {
                    resolve(results.rows);

                });
            }, (error) => {
                this._errorCB('transaction', error);
            });
        })
    }

  /***
   * 助记码查询商品
   */
  selectAidCode(aidCode, DepLevel) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select a.*,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
          ",ifNull(b.promemo,'') as ShopRemark,c.depcode" + DepLevel + " as DepCode1 " +
          " from product a left join shopInfo b on a.Pid=b.Pid  ";
        ssql = ssql + " left join  tdepset c on c.IsDel='0' and a.depcode=c.depcode where a.IsDel='0' and prodtype<>'1'";
        ssql = ssql + "  and (a.prodname like '%" + aidCode + "%' or a.aidcode like '%" + aidCode + "%' or a.prodcode like '%" + aidCode + "%' or a.barcode like '%" + aidCode + "%')";
        console.log(ssql);
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /***
   * 扫描查询商品
   */
  scaningCode(scanCode, DepLevel) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let ssql = "select a.*,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
          ",ifNull(b.promemo,'') as ShopRemark,c.depcode" + DepLevel + " as DepCode1 " +
          " from product a left join shopInfo b on a.Pid=b.Pid  ";
        ssql = ssql + " left join  from tdepset c on c.IsDel='0' and a.depcode=c.depcode where a.IsDel='0' and prodtype<>'1'";
        ssql = ssql + "  and (a.barcode = '" + scanCode + "' or a.prodcode = '" + scanCode + "' )";
        
        tx.executeSql(ssql, [], (tx, results) => {
          resolve(results.rows);
        });
      }, (error) => {
        this._errorCB('transaction', error);
      });
    });
  }
  
  /****
   * 判断当前用户时候含有某个权限
   * @param userCode 当前登录账号
   * @param funcCode 需要查询的权限号
   * @return true 表示含有某个权限 false 没有权限
   */
  selectUserRight(userCode, funcCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let sql = "select * from tuserright where usercode = '" + userCode + "' and Funccode='" + funcCode + "'";
        tx.executeSql(sql, [], (tx, results) => {
          resolve(results.rows.length != 0);
        })
      }, (error) => {
        reject(false);
        this._errorCB('error', error);
      });
    });
  }
  
  /***
   *查询某个用户是否能够授权
   * @param userCode 当前登录账号
   * @return true 表示可以授权
   */
  selecUserRightA1012(userCode) {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let sql = "select * from tuserright where usercode='" + userCode + "' and Funccode='A1012'";
        console.log(sql);
        tx.executeSql(sql, [], (tx, results) => {
          resolve((results.rows.length != 0));
        })
      }, (error) => {
        reject(false);
        this._errorCB('error', error);
      });
    });
  }
  
  
  /***
   * 插入供应商信息表
   */
  insertSuppeset = (datas) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i];
          let pid = data.pid;
          let sCode = data.sCode;
          let sname = data.sname;
          let levelno = data.levelno;
          let aidcode = data.aidcode;
          let subcode = data.subcode;
          let suppType = data.SuppType;
          let sql = " replace INTO tsuppset(pid,sCode,sname,levelno,aidcode,subcode,SuppType)" +
            "values(?,?,?,?,?,?,?)";
          tx.executeSql(sql, [pid, sCode, sname, levelno, aidcode, subcode, suppType], () => {
            }, (err) => {
              console.log("err===", err);
            }
          );
        }
      }, (error) => {
        reject(false);
        this._errorCB('transaction', error);
      }, () => {
        //this._successCB('transaction insert data');
        resolve(true);
      });
      
    });
    
  }
  
  /***
   * 查询某个表中的所有数据
   * @param dbName 表明
   * @return {Promise}
   */
  selectAllData = (dbName) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        let sql = "select * from " + dbName;
        if (dbName=="tsuppset")
        {
            sql=sql+" where supptype<>'1'";
        }

        tx.executeSql(sql, [], (tx, results) => {
            resolve((results.rows));
          }, (error) => {
            console.log("err===", error);
          }
        );
      });
    });
    
  }

    /***
     * 查询协配采购单中的机构号
     * @param dbName 表明
     * @return {Promise}
     */
    selectXPShopCode = (shopCode) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from tshopitem where isdel='0' and PSShop='"+shopCode+"'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });

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