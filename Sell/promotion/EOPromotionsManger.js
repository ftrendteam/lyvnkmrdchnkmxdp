package com.pos.promotion;

import android.content.Context;

import com.pos.bean.ProductBean;
import com.pos.bean.TDscBrandBean;
import com.pos.bean.TDscConditionBean;
import com.pos.bean.TDscDepBean;
import com.pos.bean.TDscPlanBean;
import com.pos.bean.TDscProdBean;
import com.pos.bean.TDscSuppBean;
import com.pos.bean.TdscheadBean;
import com.pos.utils.BigDecimalUtils;
import com.pos.utils.DateUtils;
import com.pos.utils.PromotionUtils;
import com.pos.utils.XDbUtils;
import com.lidroid.xutils.db.sqlite.Selector;
import com.lidroid.xutils.exception.DbException;
import com.pos.bean.TDscCustBean;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 2016/10/8.
 */
public class EOPromotionsManger {
    private static int currentDis = 0;
    private static List<TDscPlanBean> planList;
    private static EOPromotionsManger eoPromotionsManger = new EOPromotionsManger();

    public synchronized static EOPromotionsManger getInstance() {
        if (eoPromotionsManger == null) {
            eoPromotionsManger = new EOPromotionsManger();
        }
        return eoPromotionsManger;
    }

    private EOPromotionsManger() {

    }

    public synchronized static String eoPromotionsManger(Context context, ProductBean productBean, String custTypeCode) throws DbException {
        if (planList == null) {
            planList = new ArrayList<TDscPlanBean>();
        }
        System.out.println("er--");
//        if (shopList == null) {
//            shopList = new ArrayList<ProductBean>();
//        }
        //按价格由大到小排序
//        Collections.sort(productBeans);
        List<TdscheadBean> tdscheadBeans = XDbUtils.getBasicDB(context).
                findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "EO"));
        if (tdscheadBeans == null) {
            return "";
        }
        for (int i = 0; i < tdscheadBeans.size(); i++) {
            String dtCust = tdscheadBeans.get(i).getDtCust();
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
            List<TdscheadBean> tdscheads = XDbUtils.getBasicDB(context).
                    findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "EO").
                            and("FormNo", "=", planList.get(planIndex).getFormNo()));
            if (tdscheadBeans != null) {
//                for (int i = 0; i < productBeans.size(); i++) {//遍历所有商品
//                    ProductBean productBean = productBeans.get(i);
                boolean tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
                if (!tDscExceptShop) {
                    System.out.println("非促销商品!");
                }
                for (int indext = 0; indext < tdscheads.size(); indext++) {
                    String formNo = tdscheads.get(indext).getFormNo();
                    String dtAll = tdscheads.get(indext).getDtAll();
                    if ("1".equals(dtAll)) {
                        System.out.println("全场");
                    } else if ("0".equals(dtAll)) {
                        String dtDep = tdscheads.get(indext).getDtDep();
                        String dtSupp = tdscheads.get(indext).getDtSupp();
                        String dtBrand = tdscheads.get(indext).getDtBrand();
                        String dtProd = tdscheads.get(indext).getDtProd();
                        String autoMulti = tdscheads.get(indext).getAutoMulti();
                        if ("1".equals(dtDep)) {
                            TDscDepBean tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class)
                                    .where("DepCode ", "=", productBean.getDepCode()));
                            if (tDscDepBean != null) {
                                System.out.println("eeeeezhixing-1");
                                initData(context, formNo, productBean);
                            }
                        } else if ("1".equals(dtSupp)) {
                            TDscSuppBean tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class)
                                    .where("CuppCode ", "=", productBean.getSuppCode()));
                            if (tDscSuppBean != null) {
                                System.out.println("zhixing-2");
                                initData(context, formNo, productBean);
                            }
                        } else if ("1".equals(dtBrand)) {
                            TDscBrandBean tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class)
                                    .where("BrandCode ", "=", productBean.getBrandCode()));
                            if (tDscBrandBean != null) {
                                System.out.println("zhixing-3");
                                initData(context, formNo, productBean);
                            }
                        } else if ("1".equals(dtProd)) {
                            TDscProdBean tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class)
                                    .where("ProdCode  ", "=", productBean.getProdCode()));
                            if (tDscProdBean != null) {
                                System.out.println("zhixing-4");
                                initData(context, formNo, productBean);
                            }
                        }
//                        }
                    }
                }
            }
            return "";
        }
        return "";
    }

    private static void initData(Context context, String formNo, ProductBean productBean) throws DbException {
        List<TDscConditionBean> tDscConditions = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscConditionBean.class)
                .where("FormNo  ", "=", formNo));
        if (currentDis > tDscConditions.size() - 1) {
            currentDis = 0;
        }
        double con2 = tDscConditions.get(currentDis).getCon2();
        String cxConType = tDscConditions.get(currentDis).getCxConType();
        if ("0".equals(cxConType)) {//折扣
            System.out.println("eo-1");
            if (productBean.getList().size() == 1) {
                productBean.setItemTotal(BigDecimalUtils.multiply(productBean.getStdPrice(),
                        BigDecimalUtils.subtract(1, BigDecimalUtils.divide(con2, 100))));
            } else {
                productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(), BigDecimalUtils.multiply(productBean.getStdPrice(),
                        BigDecimalUtils.subtract(1, BigDecimalUtils.divide(con2, 100)))));
            }
        } else if ("1".equals(cxConType)) {//固定价
            System.out.println("eo-2");
            productBean.setItemTotal(BigDecimalUtils.multiply(con2, productBean.getList().size()));
        } else if ("2".equals(cxConType)) {//买减
            System.out.println("eo-3");
            if (productBean.getList().size() == 1) {
                productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(), BigDecimalUtils.subtract(productBean.getStdPrice(), con2)));
            } else {
                productBean.setItemTotal(BigDecimalUtils.scaleAdd(productBean.getItemTotal(),
                        BigDecimalUtils.subtract(productBean.getStdPrice(), con2)));
            }
        }
        currentDis++;
    }
}
