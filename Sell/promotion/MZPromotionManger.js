package com.pos.promotion;

import android.content.Context;

import com.pos.bean.TDscBrandBean;
import com.pos.bean.TDscDepBean;
import com.pos.bean.TDscPlanBean;
import com.pos.bean.TdscheadBean;
import com.pos.utils.XDbUtils;
import com.lidroid.xutils.db.sqlite.Selector;
import com.lidroid.xutils.exception.DbException;
import com.pos.bean.ProductBean;
import com.pos.bean.TDscCustBean;
import com.pos.bean.TDscProdBean;
import com.pos.bean.TDscSuppBean;
import com.pos.utils.DateUtils;
import com.pos.utils.PromotionUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 2016/9/27.
 */
public class MZPromotionManger {

    private String formNo;
    private double currentDiscountPrice;
    private String conditionType;
    private double shopTotal;
    private int shopNum;
    private List<ProductBean> list;
    private List<TDscPlanBean> planList;

    private static MZPromotionManger ourInstance;

    public synchronized static MZPromotionManger getInstance() {
        if (ourInstance == null) {
            return ourInstance = new MZPromotionManger();
        } else {
            return ourInstance;
        }
    }

    private MZPromotionManger() {
    }

    public synchronized double mzPromotion(Context context, String custTypeCode, List<ProductBean> productBeans) throws DbException {
        list = productBeans;
        if (planList == null) {
            planList = new ArrayList<TDscPlanBean>();
        }
        List<TDscCustBean> tDscCustBeans = XDbUtils.getBasicDB(context)
                .findAll(Selector.from(TDscCustBean.class).where("CustTypeCode", "=", custTypeCode));
        if (tDscCustBeans != null) {
            //判断所有的促销是否符合时间要求
            for (int j = 0; j < tDscCustBeans.size(); j++) {
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

        for (int planIndex = 0; planIndex < planList.size(); planIndex++) {//遍历所有商品，取出最大优惠
            List<TdscheadBean> tdscheadBeans = XDbUtils.getBasicDB(context).
                    findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "MZ").
                            and("FormNo", "=", planList.get(planIndex).getFormNo()));
//            System.out.println("tdscheadBeans=-=-"+tdscheadBeans.size());
            if (tdscheadBeans != null) {
                for (int i = 0; i < productBeans.size(); i++) {//遍历所有商品
                    ProductBean productBean = productBeans.get(i);
                    boolean tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
                    if (!tDscExceptShop) {
                        System.out.println("非促销商品!");
                        continue;
                    }
                    for (int indext = 0; indext < tdscheadBeans.size(); indext++) {
                        System.out.println(tdscheadBeans.get(indext).getFormNo());
                        String dtAll = tdscheadBeans.get(indext).getDtAll();
                        if ("1".equals(dtAll)) {
                            System.out.println("全场");
                        } else if ("0".equals(dtAll)) {
                            String dtDep = tdscheadBeans.get(indext).getDtDep();
                            String dtSupp = tdscheadBeans.get(indext).getDtSupp();
                            String dtBrand = tdscheadBeans.get(indext).getDtBrand();
                            String dtProd = tdscheadBeans.get(indext).getDtProd();
                            if ("1".equals(dtDep)) {
                                TDscDepBean tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class)
                                        .where("DepCode ", "=", productBean.getDepCode()));
                                if (tDscDepBean != null) {
                                    System.out.println("zhixing-1");
                                    initData(indext, productBean, tdscheadBeans, context);
                                }
                            } else if ("1".equals(dtSupp)) {
                                TDscSuppBean tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class)
                                        .where("CuppCode ", "=", productBean.getSuppCode()));
                                if (tDscSuppBean != null) {
                                    System.out.println("zhixing-2");
                                    initData(indext, productBean, tdscheadBeans, context);
                                }
                            } else if ("1".equals(dtBrand)) {
                                TDscBrandBean tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class)
                                        .where("BrandCode ", "=", productBean.getBrandCode()));
                                if (tDscBrandBean != null) {
                                    System.out.println("zhixing-3");
                                    initData(indext, productBean, tdscheadBeans, context);
                                }
                            } else if ("1".equals(dtProd)) {
                                TDscProdBean tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class)
                                        .where("ProdCode  ", "=", productBean.getProdCode()));
                                if (tDscProdBean != null) {
                                    System.out.println("zhixing-4");
                                    initData(indext, productBean, tdscheadBeans, context);
                                }
                            }
                        }
                    }
                }
                shopNum = 0;
                shopTotal = 0;
            }
        }
        return currentDiscountPrice;
    }

    private void initData(int indext, ProductBean productBean, List<TdscheadBean> tdscheadBeans, Context context) throws DbException {
        shopNum += productBean.getList().size();
        shopTotal += productBean.getItemTotal();
        formNo = tdscheadBeans.get(indext).getFormNo();
        conditionType = tdscheadBeans.get(indext).getConditionType();
        double price = countMZPrice(context,tdscheadBeans.get(indext));
        if (currentDiscountPrice < price) {
            currentDiscountPrice = price;
        }
    }

    private double countMZPrice(Context context,TdscheadBean tdscheadBean) throws DbException {
        double con1 = tdscheadBean.getCon1();
        if ("0".equals(conditionType)) {//满金额
            if (con1 < shopTotal) {
                return tdscheadBean.getCon2();
            }
        } else if ("1".equals(conditionType)) {//数量
            if (con1 < shopNum) {
                return tdscheadBean.getCon2();
            }
        } else if ("2".equals(conditionType)) {//项数
            if (con1 < list.size()) {
                return tdscheadBean.getCon2();
            }
        }
        return 0;
    }

}
