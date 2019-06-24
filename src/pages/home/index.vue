<template>
  <div>
    <!-- 1.焦点轮播图 -->
    <swiper indicator-dots autoplay circular indicator-active-color="#fff">
      <block v-for="item in slides" :key="item.goods_id">
        <navigator :url="item.navigator_url" :open-type="item.open_type">
          <swiper-item>
            <img mode="aspectFill" :src="item.image_src">
          </swiper-item>
        </navigator>
      </block>
    </swiper>
    <!-- 2.菜单 -->
    <div class="categories">
      <div v-for="(item, index) in categories" :key="index" class="category-item">
        <img :src="item.image_src">
      </div>
    </div>
    <!-- 3.楼层数据 -->
    <div class="floor">
      <div v-for="(item1, index) in floor" :key="index">
        <!-- 头部 -->
        <div class="floor-head">
          <img :src="item1.floor_title.image_src">
        </div>
        <!-- 左边 -->
        <div class="floor-body">
          <div class="floor-body-left">
            <img :src="item1.product_list[0].image_src">
          </div>
          <!-- 右边 -->
          <div class="floor-body-right">
            <div v-for="(item2, index2) in item1.product_list" :key="index2" v-if="index2 > 0">
              <img
                :style="'width:'+item2.image_width+'rpx'"
                class="floor-body-right-img"
                :src="item2.image_src"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 4.0 到底的提示 -->
    <div class="end-tips">
      <span class="iconfont icon-xiao"></span>
      <span class="bottomline">我是有底线的哦~</span>
    </div>
    <!-- 5.0 回到顶部 -->
    <div v-show="isShowToTop">
      <div @click="goToTop" class="to-top">
        <img src="/static/img/arrow_top@2x.png">
        <text>顶部</text>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      slides: [], // 焦点轮播图
      categories: null, // 菜单
      floor: null, // 楼层数据
      isShowToTop: false // 是否显示返回顶部
    };
  },
  components: {
    "my-tem": "../../components/card.vue"
  },
  methods: {
    // 获取轮播图
    async getSlides() {
      var res = await this.$axios.get("home/swiperdata");
      let { message, meta } = res.data;
      if (meta.status === 200) {
        this.slides = message;
      }
    },
    // 获取菜单
    async getCate() {
      var res = await this.$axios.get("home/catitems");
      let { message, meta } = res.data;
      if (meta.status === 200) {
        this.categories = message;
      }
    },
    // 获取楼层数据
    async getFloor() {
      var res = await this.$axios.get("home/floordata");
      let { message, meta } = res.data;
      if (meta.status === 200) {
        this.floor = message;
        mpvue.hideLoading();
      }
    },
    // 回到顶部
    goToTop() {
      wx.nav
      mpvue.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    // isLoading
    isLoading() {
      mpvue.showLoading({
        title: 'Loading...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
    }
  },
  onPageScroll({scrollTop}) {
    // 如果滑动距离大于80并且isShowToTop为false，进入条件修改为true
    if(scrollTop > 80 && !this.isShowToTop) {
      this.isShowToTop = true
    }else if(scrollTop <= 80 && this.isShowToTop) {
      this.isShowToTop = false
    }
  },
  mounted() {
    this.getSlides();
    this.getCate();
    this.getFloor();
    this.isLoading()
  }
};
</script>

<style lang="scss">
swiper {
  width: 750rpx;
  height: 400rpx;
  img {
    width: 100%;
    height: 100%;
  }
}
.categories {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #ffffff;
  height: 150rpx;
  .category-item {
    width: 120rpx;
    height: 120rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.floor {
  margin-top: 20rpx;
  background-color: white;
  &-head {
    width: 750rpx;
    height: 59rpx;
    img {
      margin: 10rpx 0rpx 0rpx 10rpx;
      width: 100%;
      height: 100%;
    }
  }
  &-body {
    display: flex;
    padding: 20rpx 16rpx 10rpx 16rpx;
    &-left {
      width: 232rpx;
      height: 386rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-right {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      &-img {
        height: 188rpx;
        margin: 0 0 10rpx 10rpx;
      }
    }
  }
}
.end-tips {
  display: flex;
  height: 100rpx;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #888;
  .bottomline {
    margin-left: 5rpx;
  }
}
.to-top {
  width: 90rpx;
  height: 90rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  position: fixed;
  right: 40rpx;
  bottom: 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 24rpx;
    height: 14rpx;
  }
  text {
    margin-top: 20rpx;
    color: #999;
  }
}
</style>