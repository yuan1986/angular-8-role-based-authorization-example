export enum Url {
  // 登录
  userLogin = 'auth/user/login',
  // 查询商品预览TOP20
  getProductView = 'dataQuery/topn/productView',
  // 查询商品加入购物车TOP20
  getProductAddCart = 'dataQuery/topn/productAddCart',
  // 查询商品销量TOP20
  getProductPurchase = 'dataQuery/topn/productPurchase',
  // 查询最多的销量的产品分类，降序排列
  getSellCnts = 'dataQuery/cotagory/view/sellCnts',
  // 查询最多的销售额的产品分类，降序排列
  getSells = 'dataQuery/cotagory/view/sells',
  // 查询某日开始用户留存率
  getTrend = 'dataQuery/retentionrate/trend'
}