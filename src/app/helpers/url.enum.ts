export enum Url {
  // 登录
  userLogin = 'api/auth/user/login',
  // 查询商品预览TOP20
  getProductView = 'api/dataQuery/topn/productView',
  // 查询商品加入购物车TOP20
  getProductAddCart = 'api/dataQuery/topn/productAddCart',
  // 查询商品销量TOP20
  getProductPurchase = 'api/dataQuery/topn/productPurchase',
  // 查询最多的销量的产品分类，降序排列
  getSellCnts = 'api/dataQuery/cotagory/view/sellCnts',
  // 查询最多的成交额的产品分类，降序排列
  getSells = 'api/dataQuery/cotagory/view/sells',
  // 查询某日开始用户留存率
  getTrend = 'api/dataQuery/retentionrate/trend',
  // 查询用户访问UV
  getUserUvView = 'api/dataQuery/userVisitTrend/userUvView',
  // 查询用户访问PV
  getUserPvView = 'api/dataQuery/userVisitTrend/userPvView',
  // 查询性能耗时
  getAnalysisTimeView = 'api/dataQuery/analysisTime/analysisTimeView',
  // PV构建情况
  getPvInfo = 'api/dataQuery/event/statistics/info?start_index=0&num=50',
  // 查询后台是否正在执行查询。
  getDataHasQueryed = 'api/dataHandle/dataHasQueryed',
  // 重新获取数据
  getRequeryDatas = 'api/dataHandle/requeryDatas'
}
