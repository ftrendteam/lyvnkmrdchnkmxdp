/**
 * Created by admin on 2017/11/13.
 *  生成单据提交的单据号
 */
export default class CreatePDGFromNo {
  
  /***
   * 创建单据请求的单号
   * @param fromFlag 单据标识 标识哪个单据
   *        ProYH 门店要货
   *        ProPSSH配送收货单
   *        ProPC商品盘点单
   *        ProCurrPC实时盘点
   *        ProSY 商品损益
   *        ProCG商品采购单
   *        ProYS商品验收单
   *        ProXPCG协配采购单
   *        ProXPYS协配收货单
   */
  static createFromNO = (fromFlag) => {
    let fromNO = fromFlag + '当前时间的毫秒值';
    return fromNO;
  }
}