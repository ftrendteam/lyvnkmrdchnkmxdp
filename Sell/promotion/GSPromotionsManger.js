package com.pos.promotion;

import android.content.Context;

import com.pos.bean.ProductBean;
import com.pos.bean.TDscBrandBean;
import com.pos.bean.TDscDepBean;
import com.pos.bean.TDscGroupPriceBean;
import com.pos.bean.TDscPlanBean;
import com.pos.bean.TDscProdBean;
import com.pos.bean.TDscSuppBean;
import com.pos.bean.TdscheadBean;
import com.pos.utils.BigDecimalUtils;
import com.pos.utils.DateUtils;
import com.pos.utils.XDbUtils;
import com.lidroid.xutils.db.sqlite.Selector;
import com.lidroid.xutils.exception.DbException;
import com.pos.bean.TDscCustBean;
import com.pos.utils.PromotionUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by admin on 2016/9/29.
 */
public class GSPromotionsManger {
    private static List<TDscPlanBean> planList;
    private static GSPromotionsManger gsPromotionsManger;
    private static List<ProductBean> shopList;
    private static String autoMulti;

    private GSPromotionsManger() {

    }

    public static synchronized GSPromotionsManger getInstance() {
        if (gsPromotionsManger == null) {
            gsPromotionsManger = new GSPromotionsManger();
        }
        return gsPromotionsManger;
    }

    public synchronized static void gsPromotionsManger(Context context, List<ProductBean> productBeans, String custTypeCode) throws DbException {
        if (planList == null) {
            planList = new ArrayList<TDscPlanBean>();
        }
        if (shopList == null) {
            shopList = new ArrayList<ProductBean>();
        }
        System.out.println("0-1");
        //按价格由大到小排序
        Collections.sort(productBeans);
        List<TdscheadBean> tdscheadBeans = XDbUtils.getBasicDB(context).
                findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "GS"));
        if (tdscheadBeans != null) {
            for (int i = 0; i < tdscheadBeans.size(); i++) {
                String dtCust = tdscheadBeans.get(i).getDtCust();
                String dtAll = tdscheadBeans.get(i).getDtAll();
                if ("1".equals(dtCust)) {
                    System.out.println("所有顾客aaaaa");

                } else {
                    System.out.println("按顾客表计算,判断时间和当前客户");
                    //获取符合当前客户的促销单号
                    List<TDscCustBean> tDscCustBeans = XDbUtils.getBasicDB(context)
                            .findAll(Selector.from(TDscCustBean.class).where("CustTypeCode", "=", custTypeCode)
                                    .and("FormNo", "=", tdscheadBeans.get(i).getFormNo()));
                    if (tDscCustBeans == null && tDscCustBeans.size() != 0) {
                        break;
                    }
                    for (int j = 0; j < tDscCustBeans.size(); j++) {
                        //根据符合的促销单号获取，判断时间
                        List<TDscPlanBean> tDscPlanBeans = XDbUtils.getBasicDB(context)
                                .findAll(Selector.from(TDscPlanBean.class).where("FormNo", "=", tDscCustBeans.get(j).getFormNo()));
                        if (tDscPlanBeans != null && tDscPlanBeans.size() != 0) {
                            for (int index = 0; index < tDscPlanBeans.size(); index++) {
                                TDscPlanBean tDscPlanBean = tDscPlanBeans.get(index);
                                String beginDate = tDscPlanBean.getBeginDate();
                                String beginTime = tDscPlanBean.getBeginTime();
                                String endDate = tDscPlanBean.getEndDate();
                                String endTime = tDscPlanBean.getEndTime();
                                char[] vldWeek = tDscPlanBean.getVldWeek().toCharArray();
                                int week = DateUtils.getWeek();
                                char c;
                                if (week != 0) {
                                    c = vldWeek[week - 1];
                                } else {
                                    c = vldWeek[vldWeek.length - 1];
                                }
                                if (DateUtils.before(endDate) && DateUtils.after(beginDate) && c == '1') {
                                    if (DateUtils.compare2HMSBefore(endTime) && DateUtils.compare2HMSAfter(beginTime)) {
                                        planList.add(tDscPlanBeans.get(index));
                                    } else {
                                        System.out.println("日期不符合");
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (int planIndex = 0; planIndex < planList.size(); planIndex++) {
                String formNo = planList.get(planIndex).getFormNo();
                List<TdscheadBean> tdscheads = XDbUtils.getBasicDB(context).
                        findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "GS").
                                and("FormNo", "=", formNo));
                if (tdscheadBeans != null) {
                    for (int i = 0; i < productBeans.size(); i++) {//遍历所有商品
                        ProductBean productBean = productBeans.get(i);
                        boolean tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
                        if (!tDscExceptShop) {
                            System.out.println("非促销商品!");
                        }
                        for (int indext = 0; indext < tdscheads.size(); indext++) {
                            System.out.println(tdscheads.get(indext).getFormNo());
                            String dtAll = tdscheads.get(indext).getDtAll();
                            if ("1".equals(dtAll)) {
                                System.out.println("全场");
                            } else if ("0".equals(dtAll)) {
                                String dtDep = tdscheads.get(indext).getDtDep();
                                String dtSupp = tdscheads.get(indext).getDtSupp();
                                String dtBrand = tdscheads.get(indext).getDtBrand();
                                String dtProd = tdscheads.get(indext).getDtProd();
                                autoMulti = tdscheads.get(indext).getAutoMulti();
                                if ("1".equals(dtDep)) {
                                    System.out.println("rile-1");
                                    TDscDepBean tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class)
                                            .where("DepCode ", "=", productBean.getDepCode()));
                                    if (tDscDepBean != null) {
                                        System.out.println("zhixing-1");
//                                    initData13(context, autoMulti, formNo);
                                        shopList.add(productBeans.get(i));
                                    }
                                } else if ("1".equals(dtSupp)) {
                                    TDscSuppBean tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class)
                                            .where("CuppCode ", "=", productBean.getSuppCode()));
                                    if (tDscSuppBean != null) {
                                        System.out.println("zhixing-2");
                                        shopList.add(productBeans.get(i));
                                    }
                                } else if ("1".equals(dtBrand)) {
                                    TDscBrandBean tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class)
                                            .where("BrandCode ", "=", productBean.getBrandCode()));
                                    if (tDscBrandBean != null) {
                                        System.out.println("zhixing-3");
                                        shopList.add(productBeans.get(i));
                                    }
                                } else if ("1".equals(dtProd)) {
                                    TDscProdBean tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class)
                                            .where("ProdCode  ", "=", productBean.getProdCode()));
                                    if (tDscProdBean != null) {
                                        System.out.println("zhixing-4");
                                    }
                                }
                            }
                        }
                    }
                }
//            return "";
                initData(context, autoMulti, formNo);
            }
        }
//        return "";
    }

    private static void initData(Context context, String autoMulti, String formNo) throws DbException {
        List<TDscGroupPriceBean> tDscGroupPrices = XDbUtils.getBasicDB(context).
                findAll(Selector.from(TDscGroupPriceBean.class).where("FormNo", "=", formNo));
        if (tDscGroupPrices == null) {
            return;
        }
        if ("1".equals(autoMulti)) {//自动倍数
            System.out.println("1-1");
            int count = 0;
            int size = shopList.size();
            for (int i = tDscGroupPrices.size() - 1; i >= 0; i--) {
                TDscGroupPriceBean tDscGroupPriceBean = tDscGroupPrices.get(i);
                int groupCountN = tDscGroupPriceBean.getGroupCountN();
                double groupTotal = tDscGroupPriceBean.getGroupTotal();
//                int a = groupCountN / size;
                count++;
                if (size - groupCountN * count >= groupCountN) {
                    for (int j = count; j <= groupCountN * count; j++) {
                        shopList.get(j).setItemTotal(BigDecimalUtils.divide(groupTotal, groupCountN));
                        System.out.println(shopList.get(j).getItemTotal() + "dddddd");
                    }
                }
            }
        } else if ("0".equals(autoMulti)) {
            A:
            for (int i = tDscGroupPrices.size() - 1; i >= 0; i--) {
                TDscGroupPriceBean tDscGroupPriceBean = tDscGroupPrices.get(i);
                int groupCountN = tDscGroupPriceBean.getGroupCountN();
                double groupTotal = tDscGroupPriceBean.getGroupTotal();
                if (shopList.size() >= groupCountN) {
                    for (int j = 0; j <= groupCountN; j++) {
                        shopList.get(j).setItemTotal(BigDecimalUtils.divide(groupTotal, groupCountN));
                        break A;
                    }
                }
            }
        }
    }
}