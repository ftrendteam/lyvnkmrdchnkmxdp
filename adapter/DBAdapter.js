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
            tx.executeSql("delete from '" + dbName + "'", [], () => {

            }, (err) => {
                console.log("detele=", err);
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
                tx.executeSql(sql, [pid, shopcode, shopname, UniqueCode, shoplevel, subcode, FNeedPS, FCanPH, PSShop, isdel, FCanCG], () => {

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
        try {
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
        } catch (err) {
            console.log("err", err);
        }

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
                console.log(i)
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
                    let BarCode = shopInfo.BarCode;
                    //   "prodname":"海鲜菇","countm":1.0000,"kccount":0.0,"prototal":1.0000,"unit":"kg  ","promemo":""
                    let sql = " replace INTO shopInfo(pid,ProdCode,prodname,countm,ShopPrice,prototal,promemo,DepCode,ydcountm,SuppCode,BarCode)" +
                        "values(?,?,?,?,?,?,?,?,?,?,?)";
                    tx.executeSql(sql, [Pid, ProdCode, shopName, ShopNumber, ShopPrice, ShopAmount, ShopRemark, DepCode, ydcountm, suppCode, BarCode], () => {
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
                let ssql = "select a.*,b.*,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ProPrice,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
                    ",ifNull(b.promemo,'') as ShopRemark,b.depcode as  DepCode1 " +
                    " from product a join shopInfo b on a.Pid=b.Pid";

                //let ssql = "select a.*,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
                //  ",ifNull(b.promemo,'') as ShopRemark,c.depcode" + DepLevel + " as DepCode1 " +
                //  " from product a left join shopInfo b on a.Pid=b.Pid  ";
                //ssql = ssql + " left join  tdepset c on c.IsDel='0' and a.depcode=c.depcode where a.IsDel='0' and prodtype<>'1'";
                //ssql = ssql + "  and  a.prodcode ='" + prodCode + "'";
                //
                tx.executeSql(ssql, [], (tx, results) => {
                    resolve(results.rows);
                });
            }, (error) => {
                this._errorCB('transaction', error);
            });
        });
    }

    /***
     * 单据提交查询接口
     */
    selectShopInfoSub=()=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let ssql = "select b.ProdCode,b.countm,b.promemo,b.ydcountm,ifNull(b.countm,0) as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ProPrice,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
                    ",ifNull(b.promemo,'') as ShopRemark,b.depcode as  DepCode1 " +
                    " from product a join shopInfo b on a.Pid=b.Pid";
                tx.executeSql(ssql, [], (tx, results) => {
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
    //PosPaySet 当前支付方式
    SelectPosOpt=(shopCode,posCode,optName)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql("select * from posopt where shopcode='"+shopCode+"' and poscode='"+posCode+"' and optname='"+optName+"'", [], (tx, results) => {
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
     * 删除shopInfo 表中某一条数据
     * @param prodCode
     * @returns {Promise}
     */
    deteleShopInfo(ProdCode) {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql("delete from shopInfo where prodCode ='" + ProdCode + "'", [], (tx, results) => {
                    try {
                        resolve(true);
                    } catch (err) {
                        reject(false);
                    }
                }, (err) => {
                    alert(JSON.stringify(err));
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
                tx.executeSql("select b.ShopCode,b.ShopName from tUserShop a inner join tshopitem b on b.SubCode||rtrim(b.shopcode)||';' " +
                    "like '%;'||rtrim(a.shopcode)||';%' or rtrim(a.shopcode)='0'  where a.UserCode='" + Usercode + "'", [], (tx, results) => {
                    //alert(results.rows);
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
                let ssql = "select FCanCG  from tShopItem  where isdel='0' and ((ShopCode='" + shopCode + "'  and FCanCG='1') or '" + shopCode + "'='0')";
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
                            let pid = (JSON.stringify(item.pid));
                            let Usercode = item.Usercode;
                            Storage.save("userName", userName);
                            Storage.save("Pid", pid);
                            Storage.save("usercode", Usercode);
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
                                        console.log("本地没有保存机构号,根据当前的机构号下载商品和品类");
                                        resolve(result);
                                        //}
                                    }, (err) => {
                                        reject(false);
                                    });
                                    resolve(true);
                                } else if (shopCode == '') {//本地没有保存机构号,根据当前的机构号下载商品和品类
                                    let categoryBody = RequestBodyUtils.createCategory(currShopCode);
                                    this.downProductAndCategory(categoryBody, currShopCode).then((result) => {
                                        //if (result) {
                                        console.log("本地没有保存机构号,根据当前的机构号下载商品和品类");
                                        resolve(result);
                                        //}
                                    }, (err) => {
                                        reject(false);
                                    });
                                } else {//当前登录的机构号和本地保存的机构号不同.重新保存并下载新的品类和商品信息
                                    DataUtils.save('shopCode', currShopCode);
                                    console.log("cccc重新保存并下载新的品类和商品信息");
                                    /***
                                     * prductBody 商品信息下载请求体
                                     * categoryBody 品类信息下载请求体
                                     */
                                    let categoryBody = RequestBodyUtils.createCategory(currShopCode);
                                    this.downProductAndCategory(categoryBody, currShopCode).then((result) => {
                                        //if (result) {
                                        resolve(result);
                                        //}
                                    }, (err) => {
                                        reject(false);
                                    });
                                }
                            });

                        } else {
                            reject(false);
                        }
                    } else {
                        reject(false);
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
                    FetchUtils.post(urlData, categoryBody).then((datas) => {
                        this.insertTDepSetData(datas.TblRow).then((result) => {
                            let suppset = RequestBodyUtils.createSuppset(currShopCode);
                            FetchUtils.post(urlData, suppset).then((suppData) => {
                                this.insertSuppeset(suppData.TblRow).then((result) => {
                                    DownLoadBasicData.downLoadKgtOpt(urlData, currShopCode, this)
                                    resolve(true);
                                });
                            }, (err) => {
                                reject(false);
                            })
                        });
                    }, (err) => {
                        reject(false);
                    });
                }, (err) => {
                    reject(false);
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
                let ssql = "select a.*,ifNull(b.countm,'') as ShopNumber,ifNull(b.ShopPrice,a.StdPrice) as ShopPrice ,ifNull(b.prototal,0) as ShopAmount   " +
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
                ssql=ssql+" limit 20 ";
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
                if (dbName == "tsuppset") {
                    sql = sql + " where supptype<>'1'";
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

    selectPayInfo=(payCode)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql("select * from payInfo where PayCode='"+payCode+"'", [], (tx, results) => {
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
                let sql = "select * from tshopitem where isdel='0' and PSShop='" + shopCode + "'";
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
     *保存流水表Sum
     */
    insertSum(sumDatas) {
        console.log("wtfsadfas");
        db.transaction((tx) => {
            for (let i = 0; i < sumDatas.length; i++) {
                try {
                    let sum = sumDatas[i];
                    let lsNo = sum.LsNo;
                    let sDateTime = sum.sDateTime;
                    let tradeFlag = sum.TradeFlag;
                    let cashierId = sum.CashierId;
                    let cashierCode = sum.CashierCode;
                    let ino = sum.ino;
                    let cashierName = sum.CashierName;
                    let dscTotal = sum.DscTotal;
                    //let autoDscTotal = sum.AutoDscTotal;
                    let total = sum.Total;
                    let totalPay = sum.TotalPay;
                    let change = sum.Change;
                    let custType = sum.CustType;
                    let custCode = sum.CustCode;
                    //let invCode = sum.InvCode;
                    let payId = sum.PayId;
                    let payCode = sum.PayCode;
                    let amount = sum.Amount;
                    let oldAmount = sum.OldAmount;
                    let tendPayCode = sum.TendPayCode;
                    //let vipTotal = sum.VipTotal;
                    //let tScore = sum.TScore;
                    //let vipSCore = sum.VipSCore;
                    let innerNo = sum.InnerNo;
                    //let transFlag = sum.TransFlag;
                    //let transDateTime = sum.TransDateTime;
                    //let ywDate = sum.YWDate;

                    let sql = "insert into Sum(LsNo,sDateTime,TradeFlag,CashierId,CashierCode,ino,CashierName,DscTotal,Total,TotalPay,Change,CustType,CustCode," +
                        "PayId,PayCode,Amount,OldAmount,TendPayCode,InnerNo) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    try {
                        tx.executeSql(sql, [lsNo, sDateTime, tradeFlag, cashierId, cashierCode, ino, cashierName, dscTotal, total, totalPay, change, custType, custCode,
                                payId, payCode, amount, oldAmount, tendPayCode, innerNo,], (tx, results) => {
                                //resolve((results.rows));
                            }, (err) => {
                                console.log("err===", err);
                            }
                        );
                    } catch (err) {
                        console.log(err);
                    }

                } catch (err) {
                    console.log("err2==", err);
                }

            }

        });

    }

    /***
     * 保存流水表Deatil
     */
    insertDetail(detailDatas) {
        db.transaction((tx) => {
            for (let i = 0; i < detailDatas.length; i++) {
                try {
                    let detail = detailDatas[i];
                    let lsNo = detail.LsNo;
                    let sDateTime = detail.sDateTime;
                    let tradeFlag = detail.TradeFlag;
                    let cashierId = detail.CashierId;
                    let cashierCode = detail.CashierCode;
                    let cashierName = detail.CashierName;
                    let clerkId = detail.ClerkId;
                    let clerkCode = detail.ClerkCode;
                    let pid = detail.Pid;
                    let barCode = detail.BarCode;
                    let clerkName = detail.ClerkName;
                    let prodCode = detail.ProdCode;
                    let prodName = detail.ProdName;
                    let depCode = detail.DepCode;
                    let price = detail.Price;
                    let amount = detail.Amount;
                    let dscTotal = detail.DscTotal;
                    let total = detail.Total;
                    let autoDscTotal = detail.AutoDscTotal;
                    let handDsc = detail.HandDsc;
                    //let cxDsc = detail.CxDsc;
                    //let evenDsc = detail.EvenDsc;
                    //let mljDsc = detail.MljDsc;
                    //let overDsc = detail.OverDsc;
                    //let otherDsc = detail.OtherDsc;
                    //let tranDsc = detail.TranDsc;
                    //let vipDsc = detail.VipDsc;
                    let innerNo = detail.InnerNo;
                    let orderNo = detail.OrderNo;
                    //let transFlag = detail.TransFlag;
                    //let transDateTime = detail.TransDateTime;
                    //let brandDsc = detail.BrandDsc;
                    //let subProd = detail.isSubProd;
                    //let minus = detail.isMinus;
                    //let buyPresentCode = detail.BuyPresentCode;
                    //let buyPresentGroupNo = detail.BuyPresentGroupNo;
                    //let bpUsedCountN = detail.BPUsedCountN;
                    //let dscFormNo = detail.DscFormNo;
                    //let dscMJFormNo = detail.DscMJFormNo;
                    //let ssid = detail.SSID;
                    //let dscMZFormNo = detail.DscMZFormNo;
                    //let dscGSFormNo = detail.DscGSFormNo;
                    //let gsUsedCountN = detail.GSUsedCountN;
                    //let ywDate = detail.YWDate;
                    let sql = "insert into Detail(LsNo,sDateTime,TradeFlag,CashierId,CashierCode,CashierName,ClerkId,ClerkCode,Pid," +
                        "BarCode,ClerkName,ProdCode,ProdName,DepCode,Price,Amount,DscTotal,Total,AutoDscTotal,HandDsc,InnerNo,OrderNo) values(" +
                        "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    tx.executeSql(sql, [lsNo, sDateTime, tradeFlag, cashierId, cashierCode, cashierName, clerkId, clerkCode,
                            pid, barCode, clerkName, prodCode, prodName, depCode, price, amount, dscTotal, total, autoDscTotal,
                            handDsc, innerNo, orderNo], (tx, results) => {
                            //resolve((results.rows));
                            console.log("resultDeta=", results.rows);
                        }, (error) => {
                            console.log("err===", error);

                        }
                    );
                } catch (error) {
                    console.log("err2==", error);
                }
            }

        });
    }


    /***
     * 保存挂单数据
     */
    insertRDetail(rdetailDatas) {
        db.transaction((tx) => {
            for (let i = 0; i < rdetailDatas.length; i++) {
                let detail = rdetailDatas[i];
                let lsNo = detail.LsNo;
                let sDateTime = detail.sDateTime;
                let tradeFlag = detail.TradeFlag;
                let cashierId = detail.CashierId;
                let cashierCode = detail.CashierCode;
                let cashierName = detail.CashierName;
                let clerkId = detail.ClerkId;
                let clerkCode = detail.ClerkCode;
                let pid = detail.Pid;
                let barCode = detail.BarCode;
                let clerkName = detail.ClerkName;
                let prodCode = detail.ProdCode;
                let prodName = detail.ProdName;
                let depCode = detail.DepCode;
                let price = detail.Price;
                let amount = detail.Amount;
                let dscTotal = detail.DscTotal;
                let total = detail.Total;
                let autoDscTotal = detail.AutoDscTotal;
                let handDsc = detail.HandDsc;
                let cxDsc = detail.CxDsc;
                let evenDsc = detail.EvenDsc;
                let mljDsc = detail.MljDsc;
                let overDsc = detail.OverDsc;
                let otherDsc = detail.OtherDsc;
                let tranDsc = detail.TranDsc;
                let vipDsc = detail.VipDsc;
                let innerNo = detail.InnerNo;
                let orderNo = detail.OrderNo;
                let transFlag = detail.TransFlag;
                let transDateTime = detail.TransDateTime;
                let brandDsc = detail.BrandDsc;
                let subProd = detail.isSubProd;
                let minus = detail.isMinus;
                let buyPresentCode = detail.BuyPresentCode;
                let buyPresentGroupNo = detail.BuyPresentGroupNo;
                let bpUsedCountN = detail.BPUsedCountN;
                let dscFormNo = detail.DscFormNo;
                let dscMJFormNo = detail.DscMJFormNo;
                let ssid = detail.SSID;
                let dscMZFormNo = detail.DscMZFormNo;
                let dscGSFormNo = detail.DscGSFormNo;
                let gsUsedCountN = detail.GSUsedCountN;
                let ywDate = detail.YWDate;
                let sql = "insert into Detail(LsNo,sDateTime,TradeFlag,CashierId,CashierCode,CashierName,ClerkId,ClerkCode,Pid," +
                    "BarCode,ClerkName,ProdCode,ProdName,DepCode,Price,Amount,DscTotal,Total,AutoDscTotal,HandDsc,CxDsc,EvenDsc,MljDsc," +
                    "OverDsc,OtherDsc,TranDsc,VipDsc,InnerNo,OrderNo,TransFlag,TransDateTime,BrandDsc,isSubProd,isMinus,BuyPresentCode," +
                    "BuyPresentGroupNo,BPUsedCountN,DscFormNo,DscMJFormNo,SSID,DscMZFormNo,DscGSFormNo,GSUsedCountN,YWDate) values(" +
                    "?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql, [lsNo, sDateTime, tradeFlag, cashierId, cashierCode, cashierName, clerkId, clerkCode,
                        pid, barCode, clerkName, prodCode, prodName, depCode, price, amount, dscTotal, total, autoDscTotal,
                        handDsc, cxDsc, evenDsc, mljDsc, overDsc, otherDsc, tranDsc, vipDsc, innerNo, orderNo, transFlag,
                        transDateTime, brandDsc, subProd, minus, buyPresentCode, buyPresentGroupNo, bpUsedCountN, dscFormNo,
                        dscMJFormNo, ssid, dscMZFormNo, dscGSFormNo, gsUsedCountN, ywDate], (tx, results) => {
                        //resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            }

        });
    }

    /***
     * 支付方式表插入
     * @param infos
     */
    insertPayInfo = (infos) => {
        this.deleteData('payInfo');
        db.transaction((tx) => {
            for (let i = 0; i < infos.length; i++) {
                let info = infos[i];
                let pid = info.pid;
                let payCode = info.PayCode;
                let payName = info.PayName;
                let exchgRate = info.ExchgRate;
                let isChange = info.IsChange;
                let isGetCode = info.IsGetCode;
                let changeCode = info.ChangeCode;
                let gatherRate = info.GatherRate;
                let isSystem = info.IsSystem;
                let shortCut = info.ShortCut;
                let payMemo = info.PayMemo;
                let isDel = info.IsDel;
                let noDsc = info.NoDsc;
                let sql = "insert into payInfo(Pid,PayCode,payName,ExchgRate,IsChange,IsGetCode,ChangeCode,GatherRate,IsSystem,ShortCut,PayMemo,IsDel,NoDsc) values(" +
                    "?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql, [pid, payCode, payName, exchgRate, isChange, isGetCode, changeCode, gatherRate, isSystem, shortCut, payMemo, isDel, noDsc], (tx, results) => {

                }, (err) => {
                    console.log("payinfo=", err)
                })
            }
        })

    }
    //------------------促销表---------------------------
    insertTDscCust = (datas) => {
        this.deleteData('TDscCust');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let custTypeCode = data.CustTypeCode;
                let custTypeName = data.CustTypeName;
                let sql = "insert into TDscCust(FormNo,CustTypeCode,CustTypeName) values(?,?,?)";
                tx.executeSql(sql, [formNo, custTypeCode, custTypeName], (tx, results) => {

                }, (error) => {
                    console.log("TDscCust=", error)
                })
            }
        })
    }

    insertTDscPlan = (datas) => {
        this.deleteData('TDscPlan');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let beginDate = data.BeginDate;
                let endDate = data.EndDate;
                let beginTime = data.BeginTime;
                let endTime = data.EndTime;
                let vldWeek = data.VldWeek;
                let sql = "insert into TDscPlan(FormNo,BeginDate,EndDate,BeginTime,EndTime,VldWeek) values(?,?,?,?,?,?)";
                tx.executeSql(sql, [formNo, beginDate, endDate, beginTime, endTime, vldWeek], (tx, results) => {

                }, (error) => {
                    console.log("TDscPlan=", error)
                })
            }
        })
    }
    insertTDscProd = (datas) => {
        this.deleteData('TDscProd');
        try {
            db.transaction((tx) => {
                for (let i = 0; i < datas.length; i++) {
                    let data = datas[i];
                    let formNo = data.FormNo;
                    let pid = data.Pid;
                    let prodCode = data.ProdCode;
                    let prodName = data.ProdName;
                    let barCode = data.BarCode;
                    let prodType = data.ProdType;
                    let dscType = data.DscType;
                    let dscValue = data.DscValue;
                    let oTax = data.OTax;
                    let sTax = data.STax;
                    let dscPrice = data.DscPrice;
                    let dscOPrice = data.DscOPrice;
                    let dscOutOPrice = data.DscOutOPrice;
                    let stdPrice = data.StdPrice;
                    let spec = data.Spec;
                    let prodAdr = data.ProdAdr;
                    let depCode = data.DepCode;
                    let depName = data.DepName;
                    let suppCode = data.SuppCode;
                    let suppName = data.SuppName;
                    let brandCode = data.BrandCode;
                    let brandName = data.BrandName;
                    let remark = data.Remark;
                    let timeMark = data.TimeMark;
                    let str1 = data.Str1;
                    let str2 = data.Str2;
                    let str3 = data.Str3;
                    let curr1 = data.Curr1;
                    let curr2 = data.Curr2;
                    let curr3 = data.Curr3;
                    let tag = data.Tag;
                    let sql = "insert into TDscProd(FormNo,Pid, ProdCode, ProdName, BarCode, ProdType, DscType, DscValue, OTax, STax, " +
                        "DscPrice, DscOPrice, DscOutOPrice, StdPrice, Spec, ProdAdr, DepCode, DepName, SuppCode, SuppName, BrandCode, " +
                        "BrandName, Remark, TimeMark, Str1, Str2, Str3, Curr1, Curr2, Curr3, Tag) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    tx.executeSql(sql, [formNo, pid, prodCode, prodName, barCode, prodType, dscType, dscValue, oTax, sTax, dscPrice, dscOPrice,
                        dscOutOPrice, stdPrice, spec, prodAdr, depCode, depName, suppCode, suppName, brandCode, brandName, remark, timeMark, str1,
                        str2, str3, curr1, curr2, curr3, tag], (tx, results) => {

                    }, (error) => {
                        console.log("TDscProd=", error)
                    })
                }
            })
        } catch (error) {
            console.log("sadf=", error)
        }
    }
    insertTDscExcept = (datas) => {
        this.deleteData('TDscExcept');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let ProdCode = data.ProdCode;
                let ProdName = data.ProdName;
                let StdPrice = data.StdPrice;
                let Remark = data.Remark;
                let sql = "insert into TDscExcept(FormNo,ProdCode,ProdName,StdPrice,Remark) values(?,?,?,?,?)";
                tx.executeSql(sql, [formNo, ProdCode, ProdName, StdPrice, Remark], (tx, results) => {

                }, (error) => {
                    console.log("TDscExcept=", error)
                })
            }
        })
    }
    insertTdschead = (datas) => {
        this.deleteData('Tdschead');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let formName = data.FormName;
                let formType = data.FormType;
                let dtDep = data.dtDep;
                let dtSupp = data.dtSupp;
                let dtBrand = data.dtBrand;
                let dtProd = data.dtProd;
                let dtAll = data.dtAll;
                let dtCust = data.dtCust;
                let formMaker = data.FormMaker;
                let formDate = data.FormDate;
                let checkCode = data.CheckCode;
                let checkName = data.CheckName;
                let writeDate = data.WriteDate;
                let userCode = data.UserCode;
                let userName = data.UserName;
                let sDateTime = data.sDateTime;
                let checkType = data.CheckType;
                let tag = data.Tag;
                let prnTimes = data.PrnTimes;
                let remark = data.Remark;
                let makeShop = data.MakeShop;
                let makeShopTblCode = data.MakeShopTblCode;
                let ywRange = data.ywRange;
                let allPF = data.allPF;
                let autoMulti = data.AutoMulti;
                let conditionType = data.ConditionType;
                let con1 = data.Con1;
                let con2 = data.Con2;
                let stopCode = data.StopCode;
                let stopDate = data.StopDate;
                let dscType = data.DscType;
                let dscValue = data.DscValue;
                let str1 = data.str1;
                let str2 = data.str2;
                let str3 = data.str3;
                let str4 = data.str4;
                let str5 = data.str5;
                let pricMode = data.PricMode;
                let sql = "insert into Tdschead(FormNo,FormName, FormType, dtDep, dtSupp, dtBrand, dtProd, dtAll, dtCust, FormMaker," +
                    " FormDate, CheckCode, CheckName, WriteDate, UserCode, UserName, sDateTime, CheckType, Tag, PrnTimes, Remark, " +
                    "MakeShop, MakeShopTblCode, ywRange, allPF, AutoMulti, ConditionType, Con1, Con2, StopCode, StopDate, DscType," +
                    " DscValue, str1, str2, str3, str4, str5,PricMode)values(?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?)";
                tx.executeSql(sql, [formNo, formName, formType, dtDep, dtSupp, dtBrand, dtProd, dtAll, dtCust, formMaker, formDate,
                    checkCode, checkName, writeDate, userCode, userName, sDateTime, checkType, tag, prnTimes, remark, makeShop,
                    makeShopTblCode, ywRange, allPF, autoMulti, conditionType, con1, con2, stopCode, stopDate, dscType, dscValue,
                    str1, str2, str3, str4, str5,pricMode], (tx, results) => {

                }, (error) => {
                    console.log("Tdschead=", error)
                })
            }
        })
    }
    insertTDscDep = (datas) => {
        this.deleteData('TDscDep');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let depCode = data.DepCode;
                let depName = data.DepName;
                let dscType = data.DscType;
                let dscValue = data.DscValue;
                let remark = data.Remark;
                let priceMode = data.PriceMode;
                let sql = "insert into TDscDep(FormNo,DepCode,DepName, DscType, DscValue, Remark,PriceMode) values(?,?,?,?,?,?,?)";
                tx.executeSql(sql, [formNo, depCode, depName, dscType, dscValue, remark,priceMode], (tx, results) => {

                }, (error) => {
                    console.log("TDscDep=", error)
                })
            }
        })
    }
    insertTDscSupp = (datas) => {
        this.deleteData('TDscSupp');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = datas.FormNo;
                let suppCode = datas.SuppCode;
                let suppName = datas.SuppName;
                let dscType = datas.DscType;
                let dscValue = datas.DscValue;
                let remark = datas.Remark;
                let priceMode = data.PriceMode;
                let sql = "insert into TDscSupp(FormNo,SuppCode,SuppName, DscType, DscValue, Remark,PriceMode) values(?,?,?,?,?,?,?)";
                tx.executeSql(sql, [formNo, suppCode, suppName, dscType, dscValue, remark,priceMode], (tx, results) => {

                }, (error) => {
                    console.log("TDscSupp=", error)
                })
            }
        })
    }
    insertTDscBrand = () => {
        this.deleteData('TDscBrand');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let brandCode = data.BrandCode;
                let brandName = data.BrandName;
                let dscType = data.DscType;
                let dscValue = data.DscValue;
                let remark = data.Remark;
                let priceMode = data.PriceMode;
                let sql = "insert into TDscBrand(FormNo,BrandCode,BrandName, DscType, DscValue, Remark,PriceMode) values(?,?,?,?,?,?,?)";
                tx.executeSql(sql, [formNo, brandCode, brandName, dscType, dscValue, remark,priceMode], (tx, results) => {

                }, (error) => {
                    console.log("TDscBrand=", error)
                })
            }
        })
    }

    insertTDscCondition=(datas)=>{
        this.deleteData('TDscCondition');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let ConType = data.ConType;
                let con1 = data.Con1;
                let con2 = data.Con2;
                let Remark = data.Remark;
                let cxConType = data.cxConType;

                let sql = "insert into TDscCondition(FormNo,ConType,Con1,Con2,Remark,cxConType) values(?,?,?,?,?,?)";
                tx.executeSql(sql, [formNo, ConType, con1, con2, Remark,cxConType], (tx, results) => {

                }, (error) => {
                    console.log("TDscCondition=", error)
                })
            }
        })
    }

    inserttDscPresent=(datas)=>{
        this.deleteData('tDscPresent');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let prodCode = data.ProdCode;
                let prodName = data.ProdName;
                let planNo = data.PlanNo;
                let groupNo = data.GroupNo;
                let countN = data.CountN;
                let stdPrice = data.StdPrice;
                let remark = data.Remark;
                let sql = "insert into tDscPresent(FormNo,ProdCode,ProdName,PlanNo,GroupNo,CountN,StdPrice,Remark) values(?,?,?,?,?,?,?,?)";
                tx.executeSql(sql, [formNo, prodCode, prodName, planNo, groupNo,countN,stdPrice,remark], (tx, results) => {

                }, (error) => {
                    console.log("tDscPresent=", error)
                })
            }
        })
    }

    inserttDscGroupPrice=(datas)=>{
        this.deleteData('tDscGroupPrice');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let formNo = data.FormNo;
                let groupNo = data.GroupNo;
                let groupCountN = data.GroupCountN;
                let groupTotal = data.GroupTotal;
                let sql = "insert into tDscGroupPrice(FormNo,GroupNo,GroupCountN,GroupTotal) values(?,?,?,?)";
                tx.executeSql(sql, [formNo, groupNo, groupCountN, groupTotal], (tx, results) => {

                }, (error) => {
                    console.log("tDscPresent=", error)
                })
            }
        })
    }
    selectTDscGroupPrice=(FormNo)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from tDscGroupPrice where FormNo='"+FormNo+"'";
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
     * 查询满赠促销中赠送商品
     */
    selectTdscPresent=(FormNo)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from tDscPresent where FormNo='"+FormNo+"'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }
    selectTDscCondition=(FormNo)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscCondition where FormNo='" + FormNo + "'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }
    selectTDscSupp=(SuppCode)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscSupp where SuppCode='" + SuppCode + "'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscDep=(DepCode)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscDep where DepCode='" + DepCode + "'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }
    updateShopInfoFormType=(pid)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "update shopinfo set FormType='DP' where pid='"+pid+"'";
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
     * 获取当前符合指定
     * @param FormNo
     * @return {Promise}
     */
    selectTDscDepAll=(FormNo)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from shopinfo  a join product c on a.pid=c.pid join tdscdep b on c.depcode=b.depcode where " +
                    "b.FormNo='"+FormNo+"' and (FormType<>'DP' or FormType is null) and a.prodcode not in (select prodcode from tdscExcept where FormNo='"+FormNo+"') order by prototal DESC";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscSuppAll=(FormNo)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from shopinfo  a join product c on a.pid=c.pid join TDscSupp b on c.SuppCode=b.SuppCode " +
                    "where b.formno='"+FormNo+"' and (FormType<>'DP' or FormType is null) and a.prodcode not in (select prodcode from tdscExcept where FormNo='"+FormNo+"')"
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscBrandAll=(FormNo)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from shopinfo  a join product c on a.pid=c.pid join TDscBrand b on c.BrandCode=b.BrandCode " +
                    "where b.formno='"+FormNo+"' and (FormType<>'DP' or FormType is null) and a.prodcode not in (select prodcode from tdscExcept where FormNo='"+FormNo+"')"
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscProdAll=(FormNo)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql ="select * from shopinfo  a join product c on a.pid=c.pid join TDscProd b on c.ProdCode=b.ProdCode " +
                    "where b.formno='"+FormNo+"' and (FormType<>'DP' or FormType is null) and a.prodcode not in (select prodcode from tdscExcept where FormNo='"+FormNo+"')"
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscBrand=(BrandCode)=>{
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscBrand where BrandCode='" + BrandCode + "'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTdscHead = (FormType) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from Tdschead where FormType='" + FormType + "'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscExcept = (ProdCode) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscExcept where ProdCode='" + ProdCode + "'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscCust = (custTypeCode,FormNo) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscCust where  CustTypeCode='" + custTypeCode + "' and FormNo='"+FormNo+"'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }
    selectTDscProd = (prodCode) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscProd where  ProdCode='" + prodCode + "'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscProd2 = (prodCode,formNo) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscProd where  ProdCode='" + prodCode + "' and FormNo='"+formNo+"'";
                tx.executeSql(sql, [], (tx, results) => {
                        resolve((results.rows));
                    }, (error) => {
                        console.log("err===", error);
                    }
                );
            });
        });
    }

    selectTDscPlan = (formNo) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select * from TDscPlan where  FormNo='" + formNo + "'";
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
     * 查询sum表前100条为上传的数据
     */
    selectSum() {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "select distinct lsno,innerno,sdatetime,transflag from Sum " +
                    "where transflag is null or  transflag='' order by sdatetime,lsno,innerno limit 100";
                tx.executeSql(sql, [], (tx, results) => {
                    resolve(results.rows);
                }, (error) => {
                    reject("");
                });
            }, (err) => {
                console.log("err=", err);
            });
        });
    }

    selectSumAllData(lsNo, innerno, sdatetime) {
        return new Promise((resolve, reject) => {
                db.transaction((tx) => {
                    let sql = "select * from Sum where lsno='" + lsNo + "' AND (TransFlag is null or TransFlag='' ) and innerno='" + innerno + "' and sdatetime = '" + sdatetime + "'";
                    tx.executeSql(sql, [], (tx, results) => {
                        resolve(results.rows);
                    }, (error) => {
                        reject("");
                    });
                }, (err) => {
                    console.log("err=", err);
                });
            }
        );

    }

    /***
     * 根据流水号查询detail表数据
     * @param lsNo
     * @return {Promise}
     */
    selectDetailAllData(lsNo, sdatetime) {
        return new Promise((resolve, reject) => {
                db.transaction((tx) => {
                    let sql = "select * from Detail where lsno='" + lsNo + "' AND (TransFlag is null or TransFlag='') and sdatetime = '" + sdatetime + "'";
                    tx.executeSql(sql, [], (tx, results) => {
                        resolve(results.rows);
                    }, (error) => {
                        reject("");
                    });
                });
            }
        )

    }

    /***
     * 修改流水上传标识
     * @param TransDateTime
     * @param lsNo
     * @return {Promise}
     */
    upDateSum = (TransDateTime, lsNo) => {//update product set ProdName='1' where ProdCode='102000001'
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "update Sum set TransFlag='1' ,TransDateTime='" + TransDateTime + "' where lsno='" + lsNo + "'";
                tx.executeSql(sql, [], (tx, results) => {
                    resolve(true);
                }, (error) => {
                    reject(false);
                });
                // tx.executeSql(sql, [], (tx, results) => {
                //     resolve(results.rows);
                // }, (error) => {
                //     reject("");
                // });
            });
        })
    }
    upDateDetail = (TransDateTime, lsNo) => {//update product set ProdName='1' where ProdCode='102000001'
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                let sql = "update Detail set TransFlag='1' ,TransDateTime='" + TransDateTime + "' where lsno='" + lsNo + "'";
                tx.executeSql(sql, [], (tx, results) => {
                    resolve(true);
                }, (error) => {
                    reject(false);
                });
            });
        })
    }
    insertKgtuser = (datas) => {
        this.deleteData('KGtuser');
        db.transaction((tx) => {
            for (let i = 0; i < datas.length; i++) {
                let data = datas[i];
                let pid = data.pid;
                let userCode = data.UserCode;
                let barCode = data.BarCode;
                let userName = data.UserName;
                let userPwd = data.UserPwd;
                let editDateTime = data.EditDateTime;
                let hDscRate = data.HDscRate;
                let isCashier = data.IsCashier;
                let isClerk = data.IsClerk;
                let statues = data.Statues;
                let isStationCtrl = data.IsStationCtrl;
                let userMemo = data.UserMemo;
                let oPriceRight = data.OPriceRight;
                let priceRight = data.PriceRight;
                let vPriceRight = data.VPriceRight;
                let psPriceRight = data.PSPriceRight;
                let isDel = data.IsDel;
                let sql = "insert into KGtuser(Pid,UserCode,BarCode,UserName,UserPwd,EditDateTime,HDscRate,IsCashier,IsClerk," +
                    "Statues,IsStationCtrl, UserMemo, OPriceRight,PriceRight,VPriceRight,PSPriceRight,IsDel) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                tx.executeSql(sql, [pid, userCode, barCode, userName, userPwd, editDateTime, hDscRate, isCashier, isClerk, statues,
                    isStationCtrl, userMemo, oPriceRight, priceRight, vPriceRight, psPriceRight, isDel], (tx, results) => {

                }, (err) => {
                    console.log("TDscPlan=", err)
                })
            }
        })
    }

    selectKgtuser = (UserCode) => {
        return new Promise((resolve, reject) => {
                db.transaction((tx) => {
                    let sql = "select * from KGtuser where UserCode='" + UserCode + "'";
                    tx.executeSql(sql, [], (tx, results) => {
                        if(results.rows.length==1){
                            resolve(results.rows.item(0));
                        }else{
                            resolve(results.rows);
                        }
                    }, (error) => {
                        reject("");
                    });
                });
            }
        )
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