<template>
    <div>
    <view class="empty-car" v-if="isEmpty">
      <image src="/static/img/kong.png"></image>
      <text class="empty-car-tips">购物车还是空的</text>
      <text class="empty-car-tips extra">快去逛逛吧~</text>
    </view>
    <view v-else>
      <!-- 头部 -->
      <view class="shop-head">
        <view class="shop-head-info">
          <view class="iconfont icon-shop flex-center icon-dianpu"></view>
          <text class="shop-name">品优购生活馆</text>
        </view>
      </view>
      <!-- 列表 -->
      <block v-for="item in goodsList" :key="item.goods_id">
        <view class="goods-item">
            <!-- 左边选中的图标 -->
            <view @click="toggleSelect(item)" :class="['pubIcon',item.isSelect ? 'trueIcon' : 'falseIcon']"></view>
            <!-- 中间的图片 -->
            <view class="goods-item-pic">
              <image :src="item.goods_small_logo"/>
            </view>
            <!-- 右边的商品信息 -->
            <view class="goods-item-info">
              <text class="goods-item-info-title">{{item.goods_name}}</text>
              <text class="goods-item-info-price">￥{{item.goods_price}}</text>
              <view class="goods-item-info-edit">
                <view class="outer">
                  <view :style="{'color':item.goods_number == 1 ? '#ccc' : 'black'}" @click="substrict(item)">-</view>
                  <view class="value">
                    <input
                      style="font-size:12px;color:#999;"
                      v-model="item.goods_number"
                      @input="changeValue(item)"
                      type="number"
                    /></view>
                  <view @click="add(item)" class="add">+</view>
                </view>
                <text @click="deleteGoods(item)">| 删除</text>
              </view>
          </view>
        </view>
      </block>
      <!-- 工具条 -->
      <view class="fixed-bar">
        <view @click="toggleAllSelect" class="allselect">
          <!-- 左边选中的图标 -->
          <view :class="['pubIcon',allSelected ? 'trueIcon' : 'falseIcon']"></view>
          <text style="margin-left:10rpx;color:#999;">全选</text>
        </view>
        <view class="statistics">
          <view>
            <text>合计：</text>
            <text style="color:#ff2d4a;font-size:30rpx;">￥{{totalPrice}}</text>
          </view>
          <view>
            <text>包含运费</text>
          </view>
        </view>
        <view @click="goToOrderAndPay" :class="['jiesuan',totalCount === 0 ? 'disabled':'']">
          <text>去结算 ({{totalCount}})</text>
        </view>
      </view>
    </view>
  </div>
</template>
<script>
export default {
    allSelected: false
}
</script>

<style lang="scss" scoped>
$PADDING-LEFT: 20rpx;
.empty-car {
  display: flex;
  flex-direction: column;
  height: 500rpx;
  justify-content: center;
  align-items: center;
  image {
    width: 125rpx;
    height: 124rpx;
  }
  &-tips {
    margin-top: 30rpx;
    font-size: 28rpx;
    color: #666;
  }
}
.extra {
  font-size: 24rpx;
  color: #999;
}
.shop-head {
  background-color: #fff;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 $PADDING-LEFT;
  border-bottom: 1px solid #ddd;
  &-info {
    display: flex;
    align-items: center;
    .shop-name {
      margin-left: 10rpx;
    }
  }
}
.goods-item {
  height: 220rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding-left: $PADDING-LEFT;
  border-bottom: 1px solid #eee;
  &-pic {
    width: 160rpx;
    height: 160rpx;
    margin-left: 10rpx;
    border: 1px solid #ddd;
    padding: 10rpx;
    border-radius: 5rpx;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &-info {
    flex: 1;
    height: 180rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0rpx $PADDING-LEFT;
    &-title {
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    &-price {
      color: #ff2d4a;
      font-size: 30rpx;
    }
    &-edit {
      display: flex;
      justify-content: space-between;
      .outer {
        border: 1px solid #ddd;
        display: flex;
        align-items: center;
        border-radius: 5rpx;
        view {
          height: 50rpx;
          width: 50rpx;
          line-height: 50rpx;
          text-align: center;
        }
        .value {
          width: 65rpx;
          border-left: 1px solid #ddd;
        }
        .add {
          border-left: 1px solid #ddd;
        }
      }
    }
  }
}
.pubIcon {
  background: url(https://mcart.jiuxian.com/statics/images/cart/catIcon.png)
    no-repeat 0 0;
  background-size: 300rpx 300rpx;
  width: 55rpx;
  height: 55rpx;
}
.trueIcon {
  background-position: 0 -225rpx;
}
.falseIcon {
  background-position: -50rpx -225rpx;
}
.fixed-bar {
  display: flex;
  height: 98rpx;
  width: 750rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  .allselect {
    padding-left: $PADDING-LEFT;
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
  }
  .statistics {
    flex: 1;
    display: flex;
    // align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .jiesuan {
    width: 200rpx;
    height: 98rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ff2d4a;
    text {
      color: #fff;
    }
  }

  .disabled {
    background-color: #ddd;
  }
}
</style>
