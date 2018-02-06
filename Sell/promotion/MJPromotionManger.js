package com.pos.promotion;

import android.content.Context;

import com.pos.bean.TDscConditionBean;
import com.pos.bean.TdscheadBean;
import com.lidroid.xutils.db.sqlite.Selector;
import com.lidroid.xutils.exception.DbException;
import com.pos.bean.ProductBean;
import com.pos.bean.TDscBrandBean;
import com.pos.bean.TDscCustBean;
import com.pos.bean.TDscDepBean;
import com.pos.bean.TDscPlanBean;
import com.pos.bean.TDscProdBean;
import com.pos.bean.TDscSuppBean;
import com.pos.utils.BigDecimalUtils;
import com.pos.utils.DateUtils;
import com.pos.utils.PromotionUtils;
import com.pos.utils.XDbUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by admin on 2016/9/24.
 */
public class MJPromotionManger {
    private static MJPromotionManger ourInstance = new MJPromotionManger();
    private String conditionType;
    private String dscType;
    private String str1;
    private double dscValue;
    private String formNo;
    private double shopTotal = 0;
    private int shopNum = 0;
    private List<ProductBean> list;
    private boolean isReturnPrice = false;
    private TDscDepBean tDscDepBean;
    private TDscSuppBean tDscSuppBean;
    private TDscBrandBean tDscBrandBean;
    private TDscProdBean tDscProdBean;
    private List<TdscheadBean> tdscheadBeans;
    private double currentDiscountPrice;
    private ArrayList<TDscPlanBean> planList;

    public static MJPromotionManger getInstance() {
        return ourInstance;
    }

    private MJPromotionManger() {
    }

    public synchronized double MJPromotion(Context context, List<ProductBean> productBeans, String custTypeCode) throws DbException {
        list = productBeans;
        if (planList == null) {
            planList = new ArrayList<TDscPlanBean>();
        }
//        boolean custAndDate = PromotionUtils.custAndDate(context, custTypeCode);
        //根据客户类型，获取所有的促销单号
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

        try {
            for (int planIndex = 0; planIndex < planList.size(); planIndex++) {//遍历促销单，取出最大优惠
                tdscheadBeans = XDbUtils.getBasicDB(context).
                        findAll(Selector.from(TdscheadBean.class).where("FormType", "=", "MJ").
                                and("FormNo", "=", planList.get(planIndex).getFormNo()));
                for (int i = 0; i < productBeans.size(); i++) {//遍历所有商品
                    ProductBean productBean = productBeans.get(i);
                    boolean tDscExceptShop = PromotionUtils.isTDscExceptShop(context, productBean.getProdCode());
                    if (!tDscExceptShop) {
                        System.out.println("非促销商品！");
                        return 0;
                    }
                    if (tdscheadBeans != null) {
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
                                    tDscDepBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscDepBean.class)
                                            .where("DepCode ", "=", productBean.getDepCode()));
                                    if (tDscDepBean != null) {
                                        System.out.println("zhixing-1");
                                        initData(indext, productBean, tdscheadBeans, context);
                                    }
                                } else if ("1".equals(dtSupp)) {
                                    tDscSuppBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscSuppBean.class)
                                            .where("CuppCode ", "=", productBean.getSuppCode()));
                                    if (tDscSuppBean != null) {
                                        System.out.println("zhixing-2");
                                        initData(indext, productBean, tdscheadBeans, context);
                                    }
                                } else if ("1".equals(dtBrand)) {
                                    tDscBrandBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscBrandBean.class)
                                            .where("BrandCode ", "=", productBean.getBrandCode()));
                                    if (tDscBrandBean != null) {
                                        System.out.println("zhixing-3");
                                        initData(indext, productBean, tdscheadBeans, context);

                                    }
                                } else if ("1".equals(dtProd)) {
                                    tDscProdBean = XDbUtils.getBasicDB(context).findFirst(Selector.from(TDscProdBean.class)
                                            .where("ProdCode  ", "=", productBean.getProdCode()));
                                    if (tDscProdBean != null) {
                                        System.out.println("zhixing-4");
                                        initData(indext, productBean, tdscheadBeans, context);
                                    }
                                }
                            }
                        }
                    }
                }
                shopNum = 0;
                shopTotal = 0;
            }
        } catch (DbException e) {
            e.printStackTrace();
        }
        System.out.println("currentDiscountPrice=" + currentDiscountPrice);
        return currentDiscountPrice;
    }

    private void initData(int i, ProductBean productBean, List<TdscheadBean> tdscheadBeans, Context context) throws DbException {
        shopNum += productBean.getList().size();
        shopTotal += productBean.getItemTotal();
        conditionType = tdscheadBeans.get(i).getConditionType();
        str1 = tdscheadBeans.get(i).getStr1();
        dscType = tdscheadBeans.get(i).getDscType();
        dscValue = tdscheadBeans.get(i).getDscValue();
        formNo = tdscheadBeans.get(i).getFormNo();
        double price = countMJPrice(shopNum, context);
        System.out.println("price=" + price);
        if (currentDiscountPrice < price) {
            currentDiscountPrice = price;
        }
    }

    private double countMJPrice(int shopNum, Context context) throws DbException {
        double discountPrice = 0;
        System.out.println("conditionType=" + conditionType);
        List<TDscConditionBean> select = select(context);
        if (select == null || select.size() == 0) {
            return 0;
        }
        if ("0".equals(conditionType)) {//金额
            if ("0".equals(dscType)) {//返款
                isReturnPrice = true;
                if ("0".equals(str1)) {//不累加
                    System.out.println("0-1");
                    for (int i = select.size() - 1; i >= 0; i--) {
                        double con1 = select.get(i).getCon1();
                        System.out.println("com1=" + con1 + ",shopTotal=" + shopTotal);
                        if (con1 <= shopTotal) {
                            discountPrice = select.get(select.size() - 1).getCon2();
//                            BigDecimalUtils.subtract(shopTotal)
                            System.out.println("con2=" + select.get(select.size() - 1).getCon2());
                            break;
                        }
                    }
                } else if ("1".equals(str1)) {//累加
                    double lastCon1 = 0;
                    System.out.println("0-2");
                    for (int i = select.size() - 1; i >= 0; i--) {
                        double con1 = select.get(i).getCon1();
                        System.out.println("con1=" + con1);
                        System.out.println("shopTotal" + shopTotal);
                        if (con1 <= shopTotal - lastCon1) {
                            discountPrice += select.get(i).getCon2();
                            lastCon1 += con1;
                        }
                    }
                }
            } else if ("1".equals(dscType)) {//折扣
                isReturnPrice = false;
                for (int i = select.size() - 1; i >= 0; i--) {
                    double con1 = select.get(i).getCon1();
                    if (con1 <= shopTotal) {
                        double con2 = select.get(select.size() - 1).getCon2();
                        discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
                        break;
                    }
                }

            }
        } else if ("1".equals(conditionType)) {//数量
            if ("0".equals(dscType)) {//返款
                isReturnPrice = true;
                if ("0".equals(str1)) {//不累加
                    for (int i = select.size() - 1; i >= 0; i--) {
                        double con1 = select.get(i).getCon1();
                        if (con1 <= shopNum) {
                            discountPrice = select.get(select.size() - 1).getCon2();
                            break;
                        }
                    }


                } else if ("1".equals(str1)) {//累加
                    int lastCon1 = 0;
                    for (int i = select.size() - 1; i >= 0; i--) {
                        double con1 = select.get(i).getCon1();
                        if (con1 <= shopNum - lastCon1) {
                            discountPrice += select.get(i).getCon2();
                            lastCon1 += con1;
                        }
                    }
                }
            } else if ("1".equals(dscType)) {//折扣
                isReturnPrice = false;
                for (int i = select.size() - 1; i >= 0; i++) {
                    double con1 = select.get(i).getCon1();
                    if (con1 <= shopNum) {
                        double con2 = select.get(select.size() - 1).getCon2();
                        discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
                    }
                }

            }
        } else if ("2".equals(conditionType)) {//项数
            if ("0".equals(dscType)) {//返款
                isReturnPrice = true;
                if ("0".equals(str1)) {//不累加
                    double con1 = select.get(select.size() - 1).getCon1();
                    if (con1 <= list.size()) {
                        discountPrice = select.get(select.size() - 1).getCon2();
//                            BigDecimalUtils.subtract(shopTotal)
                    }
                } else if ("1".equals(str1)) {//累加
                    int lastCon1 = 0;
                    for (int i = select.size() - 1; i >= 0; i--) {
                        double con1 = select.get(i).getCon1();
                        if (con1 <= list.size() - lastCon1) {
                            discountPrice += select.get(i).getCon2();
                            lastCon1 += con1;
                        }
                    }
                }
            } else if ("1".equals(dscType)) {//折扣
                isReturnPrice = false;
                double con1 = select.get(select.size() - 1).getCon1();
                if (con1 <= list.size()) {
                    double con2 = select.get(select.size() - 1).getCon2();
                    discountPrice = BigDecimalUtils.multiply(shopTotal, BigDecimalUtils.divide(con2, 100));
                }
            }
        }
        if (isReturnPrice) {
            if (dscValue == 0) {
                return discountPrice;
            }
            if (dscValue < discountPrice) {
                return dscValue;
            } else if (dscValue > discountPrice) {
                return discountPrice;
            } else {
                return discountPrice;
            }
        } else {
            return discountPrice;
        }
    }

    /**
     * 获取优惠梯度集合
     *
     * @param context
     * @return
     * @throws DbException
     */
    private List<TDscConditionBean> select(Context context) throws DbException {
        List<TDscConditionBean> all = XDbUtils.getBasicDB(context).findAll(Selector.from(TDscConditionBean.class)
                .where("FormNo ", "=", formNo));
        return all;
    }
}
