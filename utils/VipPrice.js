/**
 * 计算会员价格2018年1月24日
 */
import BigDecimalUtils from '../utils/BigDecimalUtils';
import DateUtils from '../utils/DateUtils';

export default class VipPrice {
    static vipPrice = (memberInfo, products) => {
        let vipDisPrice = 0;
        if (memberInfo == null || memberInfo == undefined) {
            return;
        }
        // let custTypeCode = memberInfo.CardTypeCode;
        let isDsc = memberInfo.IsDsc;
        let basePrice = memberInfo.BasePrice;
        let validDate = memberInfo.ValidDate;
        let date = DateUtils.getDate();
        let dscRate = memberInfo.DscRate;
        if (DateUtils.compareDate(date, validDate)) {
            alert("会员卡已过期");
            return;
        }
        //if (productBean.isDicount()) {
        //  return;进行优惠之后不能进行会员优惠
        //}
        for (let i = 0; i < products.length; i++) {
            let memberTotalPrice = 0;
            let productBean = products[i];
            let size = productBean.ShopNumber;
            if ("1" == productBean.SaleType) {//获取称重商品的重量
                //            size = DoubleUtils.string2Double(textScale2.getText()
                //                    .toString());
                //  size = productBean.getWeight();
            }
            if ("0" == isDsc && "1" == memberInfo.IsJf) {//积分操作
                let gatherType = productBean.GatherType;
                let gatherRate = productBean.GatherRate;
                if ("0" == gatherType) {
                    //productBean.setmJF(BigDecimalUtils.multiply(gatherRate,
                    //productBean.getStdPrice()));计算积分
                } else if ("1" == gatherType) {
                    //productBean.setmJF(BigDecimalUtils.multiply(gatherRate, size));
                }
                //if ("1" != productBean.SaleType) {
                //  memberTotalPrice = BigDecimalUtils.multiply(size, productBean.getStdPrice());
                //} else if ("1".equals(productBean.getSaleType())) {
                //  memberTotalPrice = BigDecimalUtils.scaleMultiply(productBean.getWeight(),
                //    productBean.getStdPrice());
                //}
            } else if ("1" == isDsc) {//会员价
                if ("0" == basePrice) {//取售价
                } else if ("1" == basePrice) {
                    let vipPrice = productBean.VipPrice1;
                    if (vipPrice != 0) {
                        if (productBean.StdPrice >= vipPrice) {
                            memberTotalPrice = BigDecimalUtils.multiply(vipPrice,
                                size, 2);
                        }
                    }
                } else if ("2" == basePrice) {
                    let vipPrice = productBean.VipPrice2;
                    if (vipPrice != 0) {
                        if (productBean.StdPrice >= vipPrice) {
                            memberTotalPrice = BigDecimalUtils.multiply(vipPrice,
                                size, 2);
                        }
                    }
                } else if ("3" == basePrice) {
                    let vipPrice = productBean.VipPrice3;
                    if (vipPrice != 0) {
                        if (productBean.StdPrice >= vipPrice) {
                            memberTotalPrice = BigDecimalUtils.multiply(vipPrice,
                                size, 2);
                        }
                    }
                }
            } else if ("2" == isDsc) {//会员折扣
                if ("0" == basePrice) {
                    memberTotalPrice = BigDecimalUtils.multiply(BigDecimalUtils.multiply(productBean.StdPrice, BigDecimalUtils.subtract(1,
                        BigDecimalUtils.divide(dscRate, 100, 2), 2), 2), size, 2);
                } else if ("1" == basePrice) {
                    let vipPrice1 = productBean.VipPrice1;
                    if (vipPrice1 != 0) {
                        memberTotalPrice = BigDecimalUtils.multiply(size, BigDecimalUtils.multiply(vipPrice1, BigDecimalUtils.subtract(1,
                            BigDecimalUtils.divide(dscRate, 100, 2), 2), 2), 2);
                    }
                } else if ("2" == basePrice) {
                    let vipPrice2 = productBean.VipPrice2;
                    if (vipPrice2 != 0) {
                        memberTotalPrice = BigDecimalUtils.multiply(size, BigDecimalUtils.multiply(vipPrice2, BigDecimalUtils.subtract(1,
                            BigDecimalUtils.divide(dscRate, 100, 2), 2), 2), 2);
                    }
                } else if ("3" == basePrice) {
                    let vipPrice3 = productBean.VipPrice3;
                    if (vipPrice3 != 0) {
                        memberTotalPrice = BigDecimalUtils.multiply(size, BigDecimalUtils.multiply(vipPrice3, BigDecimalUtils.subtract(1,
                            BigDecimalUtils.divide(dscRate, 100, 2), 2), 2), 2);
                    }
                }
            }
            if (memberTotalPrice == 0) {//价格为0重新计算
                //if ("1"==productBean.SaleType) {
                //  memberTotalPrice = BigDecimalUtils.scaleMultiply(productBean.getStdPrice(),
                //    productBean.getWeight());
                //} else {
                //  memberTotalPrice = BigDecimalUtils.multiply(productBean.getStdPrice(), productBean.getList().size());
                //}
            }
            if (typeof memberTotalPrice == "number" && memberTotalPrice != 0) {
                productBean.ShopAmount = memberTotalPrice;
                // productBean.ShopPrice = memberTotalPrice;
                let vipNum = productBean.ShopNumber;

                //if ("1" == productBean.SaleType) {
                //  vipNum = productBean.getWeight();
                //} else {
                //  vipNum = productBean.countm;
                //}
                //计算优惠价格
                let oldPrices = BigDecimalUtils.multiply(productBean.StdPrice, vipNum, 2);
                let vipDis = BigDecimalUtils.subtract(oldPrices, memberTotalPrice, 2);
                vipDisPrice = BigDecimalUtils.add(vipDisPrice, vipDis, 2);
            }

        }
        return vipDisPrice;
    }
    /**
     * 单品促销
     *
     * @param cardTypeCode
     * @param productBean 某个商品
     * @return
     */
    static dp = (cardTypeCode, productBean) => {
        let prodCode = productBean.ProdCode;
        let shopNum = productBean.countm;
        let saleType = productBean.SaleType;
        let barCode = productBean.BarCode;

        let isContainCustTypeCode;//是否符合条件
        //= XDbUtils.shopDiscount(getActivity(),
        //  prodCode, cardTypeCode);
        //new Promise.all([dbAdapter.selectTDscCust(custTypeCode),dbAdapter.selectTDscPlan()]).then(()=>{
        //
        //});
        dbAdapter.selectTDscCust(custTypeCode).then((tDscCustBeans) => {
            if (tDscCustBeans != null && tDscCustBeans.length != 0) {
                for (let i = 0; i < tDscCustBeans.length; i++) {
                    dbAdapter.selectTDscPlan(tDscCustBeans[i].FormNo).then((tDscPlanBeans) => {
                        if (tDscPlanBeans != null && tDscPlanBeans.length != 0) {
                            for (let index = 0; index < tDscPlanBeans.length; index++) {
                                let tDscPlanBean = tDscPlanBeans[index];
                                let beginDate = tDscPlanBean.BeginDate;
                                let beginTime = tDscPlanBean.BeginTime;
                                let endDate = tDscPlanBean.EndDate;
                                let endTime = tDscPlanBean.EndTime;
                                let vldWeek = tDscPlanBean.VldWeek.toCharArray();
                                let week = DateUtils.getWeek();
                                let c;
                                if (week != 0) {
                                    c = vldWeek[week - 1];
                                } else {
                                    c = vldWeek[vldWeek.length - 1];
                                }
                                if (DateUtils.before(endDate) && DateUtils.after
                                    (beginDate) && c == '1') {
                                    if (DateUtils.compare2HMSBefore(endTime) &&
                                        DateUtils.compare2HMSAfter(beginTime)) {
                                        dbAdapter.selectTDscProd(barCode).then((tDscProdBeans) => {
                                            if (tDscProdBeans != null &&
                                                tDscProdBeans.length != 0) {
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });

                }
            }
        });

        if (isContainCustTypeCode) {
            if ("1" == saleType) {
                shopNum = productBean.countm;
            }
            dbAdapter.selectTDscProd(prodCode).then((tDscProdBean) => {
                if (tDscProdBean != null) {
                    let curr1 = tDscProdBean.Curr1;
                    let str1 = tDscProdBean.Str1;
                    let dscPrice = tDscProdBean.DscPrice;
                    if ("0" == str1) {
                        shopNewTotal = BigDecimalUtils.multiply(shopNum,
                            dscPrice, 2);
                    } else if ("1" == str1) {
                        if (shopNum <= curr1) {
                            shopNewTotal = BigDecimalUtils.multiply(shopNum,
                                dscPrice, 2);
                        } else {
                            shopNewTotal = BigDecimalUtils.multiply(curr1,
                                dscPrice, 2);
                            shopNewTotal += BigDecimalUtils.multiply(shopNum
                                - curr1, productBean.StdPrice, 2);
                        }
                    } else if ("2" == str1) {
                        if (shopNum > curr1) {
                            shopNewTotal = BigDecimalUtils.multiply(curr1,
                                productBean.StdPrice, 2);
                            shopNewTotal += BigDecimalUtils.multiply(shopNum
                                - curr1, dscPrice, 2);
                        } else if (shopNum < curr1) {
                            shopNewTotal = BigDecimalUtils.multiply(shopNum,
                                productBean.StdPrice, 2);
                        }
                    } else if ("3" == str1) {
                        if (shopNum > curr1) {
                            shopNewTotal = BigDecimalUtils.multiply(shopNum,
                                dscPrice, 2);
                        }
                    }
                }
            });
        }
        //if (shopNewTotal != 0) {
        //
        //}
        return shopNewTotal;
    }

    /***
     * 整单优惠
     * @param products 商品数组
     * @param allPrice 商品总价
     * @param disPrice disPrice 整单优惠价格
     */
    static a = (products, allPrice, disPrice) => {
        for (let i = 0; i < products.length; i++) {
            let product = products[i];
            let multiply = BigDecimalUtils.multiply(BigDecimalUtils.divide
            (products.ShopPrice
                , allPrice, 2), disPrice, 2);
            let itemTotal = products.ShopPrice;
            products.ShopPrice = BigDecimalUtils.subtract(itemTotal, multiply, 2);
        }
    }
}