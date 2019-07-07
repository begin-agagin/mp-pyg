<template>
  <div>
    <!-- 1.轮播图 -->
    <swiper @click="preView" indicator-dots autoplay circular indicator-active-color="#fff">
      <block v-for="slide in goods.pics" :key="slide.pics_id">
        <swiper-item>
          <img mode="aspectFill" :src="slide.pics_mid" :data-url="slide.pics_big">
        </swiper-item>
      </block>
    </swiper>
    <!-- 2.0 商品的基本信息 -->
    <div class="product-info">
      <div class="product-head">
        <span class="price">￥{{goods.goods_price}}</span>
      </div>
      <div class="product-body">
        <div class="product-name">{{goods.goods_name}}</div>
        <div class="product-like">
          <div class="iconfont icon-shoucang"></div>
          <div>
            <span>收藏</span>
          </div>
        </div>
      </div>
      <div class="product-foot">
        <span>快递：免运费</span>
      </div>
    </div>
    <!-- 3.0 促销信息 -->
    <div class="part">
      <div class="part-item part-line">
        <span class="note">促销</span>
        <span class="color-main description">满300减30元</span>
      </div>
      <div class="part-item">
        <span class="note">已选</span>
        <span class="description">黑色/S/1件</span>
      </div>
    </div>
    <!-- 4.0 收获地址 -->
    <div class="part" @click="chooseAddress">
      <div class="part-item">
        <span class="note">送至</span>
        <div v-if="address">{{address.provinceName}} {{address.cityName}} {{address.countyName}}</div>
        <div v-else>
          <span>请选择收货地址</span>
        </div>
        <div style="float:right;" class="iconfont icon-jiantouyou"></div>
      </div>
    </div>
    <!-- 5.0 tabs栏目的展示 -->
    <view class="tabs">
      <view class="tabs-head">
        <view
          @click="tabSelect(index)"
          :class="[currentTabIndex===index ? 'active':'','tabs-item']"
          v-for="(item,index) in tabs"
          :key="index"
        >
          <text>{{item}}</text>
        </view>
      </view>
      <view class="tabs-body">
        <!-- 图文介绍 -->
        <view v-show="currentTabIndex === 0">
          <div v-html="goods.goods_introduce"></div>
        </view>
        <!-- 规格参数 -->
        <view v-show="currentTabIndex === 1">
          <view v-for="(item,index) in goods.attrs" :key="item .attr_id" class="param-item">
            <text
              :class="['note',index === goods.attrs.length-1?'param-item-last':'']"
            >{{item.attr_name}}</text>
            <text
              :class="['description',index === goods.attrs.length-1?'param-item-last':'']"
            >{{item.attr_vals}}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 6.0 底部菜单条 -->
    <view class="fixed-bar">
      <view class="item">
        <button class="contact-btn" open-type="contact"></button>
        <view class="iconfont icon-kefu"></view>
        <text class="note">联系客服</text>
      </view>
      <view @click="goToShopCart" class="item">
        <view class="iconfont icon-gouwuche"></view>
        <text class="note">购物车</text>
      </view>
      <view class="btn-group">
        <view @click="addToShopCart" class="btn yellow-btn">加入购物车</view>
        <view class="btn red-btn">立即购买</view>
      </view>
    </view>
  </div>
</template>

<script>
import { addGoods } from '../../common/cart.js'
export default {
  data() {
    return {
      goods: {}, // 商品数据
      address: null, // 收货地址
      currentTabIndex: 0, // 当前tab
      tabs: ['图文介绍', '规格参数'], // tab栏
      buy_num: 0, // 购买数量
    };
  },
  async onLoad({ goods_id }) {
    mpvue.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    const res = await this.$axios.get(`goods/detail?goods_id=${goods_id}`);
    const { message, meta } = res.data;
    if (meta.status === 200) {
      this.goods = message;
    }
    mpvue.hideLoading();
    // 读取存储地址
    mpvue.getStorage({
      key: "address",
      success: res => {
        this.address = res.data;
      }
    });
  },
  methods: {
    // 预览大图
    preView(e) {
      const preImage = this.goods.pics.map(m => m.pics_big_url);
      const current = e.target.dataset.url;
      mpvue.previewImage({
        urls: preImage, //需要预览的图片链接列表,
        current
      });
    },
    // 选择收货地址
    chooseAddress() {
      // 获取用户权限设置信息
      // mpvue.getSetting({
      //   success: res => {
      //     // 判断权限是否曾被拒绝
      //     if (res.authSetting["scope.address"] === false) {
      //       // 打开权限引导
      //       mpvue.openSetting({
      //         success: res => {
      //           // 用户授权,直接为其打开选择地址界面
      //           if (res.authSetting["scope.address"] === true) {
      //             mpvue.chooseAddress({
      //               success: res => {
      //                 this.address = res;
      //                 mpvue.setStorage({
      //                   key: "address",
      //                   data: res
      //                 });
      //               }
      //             });
      //           }
      //         }
      //       });
      //     }
      //   }
      // });
      // 第一次请求权限
      mpvue.chooseAddress({
        success: res => {
          this.address = res;
          mpvue.setStorage({
            key: "address",
            data: res
          });
        },
        fail: err => {
          if(err.errMsg === 'chooseAddress:fail auth deny')
          wx.showModal({
            title: '提示', //提示的标题,
            content: '取消授权,应用将无法获得你的收货地址,请点击确认前往"我的"-"我的授权"打开授权', //提示的内容,
            showCancel: true, //是否显示取消按钮,
            cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
            cancelColor: '#000000', //取消按钮的文字颜色,
            confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
            confirmColor: '#3CC51F', //确定按钮的文字颜色,
            success: res => {
              if (res.confirm) {
                wx.switchTab({ url: '/pages/mine/main' });
              }
            }
          });
        }
      });
    },
    // 选择tab栏
    tabSelect(index){
      this.currentTabIndex = index
    },
    // 加入购物车
    addToShopCart() {
      addGoods({
        goods_id: this.goods.goods_id,
        goods_num: 1
      })
      wx.showToast({
        title: '添加成功', //提示的内容,
        icon: 'success', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
    },
    // 跳转购物车
    goToShopCart(){
      wx.switchTab({ url: '/pages/shopcart/main' });
    }
  }
};
</script>

<style lang="scss" scoped>
swiper {
  width: 750rpx;
  height: 400rpx;
  image {
    width: 750rpx;
    height: 400rpx;
  }
}
.product-info {
  display: flex;
  flex-direction: column;
  height: 300rpx;
  background-color: #fff;
  padding: 0 16rpx;
}

.product-head {
  height: 38rpx;
  padding: 40rpx 0;
}

.product-head .price {
  color: #ff2d4a;
  font-size: 50rpx;
  // margin-left: 10rpx;
}

.product-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-body .product-name {
  font-size: 34rpx;
  width: 546rpx;
  height: 88rpx;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.product-body .product-like {
  font-size: 24rpx;
  width: 50rpx;
  height: 78rpx;
  border-left: 1rpx solid #ddd;
  padding-left: 46rpx;
  margin-right: 30rpx;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.product-foot {
  font-size: 24rpx;
  color: #333;
  margin-top: 34rpx;
}

.part {
  background-color: #fff;
  margin: 20rpx 0;
  font-size: 24rpx;
  color: #333;
  &-line:after {
    content: "";
    height: 1rpx;
    width: 734rpx;
    background-color: #ddd;
    display: block;
    position: absolute;
    bottom: -1rpx;
  }
  &-item {
    display: flex;
    padding: 28rpx 16rpx;
    position: relative;
    align-items: center;
    // justify-content: space-between;
  }
}
.part .note {
  color: #333;
  margin-right: 40rpx;
}

.part .description {
  width: 490rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.part .color-main {
  color: #ff2d4a;
}

.tabs {
  &-head {
    height: 100rpx;
    background-color: #fff;
    display: flex;
    .active {
      color: #ff2d4a;
      font-weight: 400;
      &:after {
        content: "";
        height: 12rpx;
        width: 100%;
        background-color: #ff2d4a;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
  }
  &-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: relative;
  }
  &-body {
    background-color: #fff;
    padding: 16rpx;
    margin-bottom: 100rpx;
  }
}
.param-item {
  display: flex;
  height: 100rpx;
  line-height: 100rpx;
  border-top: 1px solid rgba(92, 92, 92, 0.3);
  border-right: 1px solid rgba(92, 92, 92, 0.3);
  border-left: 1px solid rgba(92, 92, 92, 0.3);
}
.param-item .note {
  padding-left: 30rpx;
  width: 300rpx;
  border-right: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item-last {
  border-bottom: 1px solid rgba(92, 92, 92, 0.3);
}

.param-item .description {
  padding-left: 30rpx;
  width: 400rpx;
}
.fixed-bar {
  width: 750rpx;
  height: 98rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn-group {
    display: flex;
  }
  .btn {
    width: 213rpx;
    height: 98rpx;
    line-height: 98rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;
  }
  .yellow-btn {
    background-color: #ffb400;
  }
  .red-btn {
    background-color: #ff2d4a;
  }
  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    .contact-btn {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
    }
    .iconfont {
      width: 40rpx;
      height: 40rpx;
      font-size: 40rpx;
    }
    .note {
      margin-top: 10rpx;
      font-size: 22rpx;
      color: #666;
    }
  }
}
.iconfont .icon-shoucang {
  font-size: 50px;
  color: "#ff2d4a" !important;
}

.iconfont .icon-shoucang-fill {
  font-size: 50px;
  color: "#ff2d4a" !important;
}
</style>
