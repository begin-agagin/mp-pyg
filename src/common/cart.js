const KEY = 'GOODS'
const getLocalGoods = () => {
  return wx.getStorageSync(KEY) || {}
}
const addGoods = goods => {
  // 查看本地购物车是否已有改商品
  let localGoods = getLocalGoods()
  // 本地已有,累加
  if (localGoods[goods.goods_id]) {
    localGoods[goods.goods_id] += goods.goods_num
  } else {
    localGoods[goods.goods_id] = goods.goods_num
  }
  // 存储新的数据
  wx.setStorageSync(KEY, localGoods)
}
export {
  addGoods
}
