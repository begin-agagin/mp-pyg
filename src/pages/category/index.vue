<template>
  <div class="categories">
    <!-- 左边的scroll-view -->
    <scroll-view :style="{height:height+'px'}" scroll-y class="categories-left">
      <view
        @click="toggleSelect(index)"
        :class="['categories-left-item', index === currentIndex ? 'categories-left-active':'']"
        v-for="(item,index) in categories"
        :key="item.cat_id"
      >
        <text>{{item.cat_name}}</text>
      </view>
    </scroll-view>
    <!-- 右边的scroll-view -->
    <scroll-view :style="{height:height+'px'}" v-if="categories.length > 0" scroll-y class="categories-right">
      <view class="categories-right-item" v-for="item in categories[currentIndex].children" :key="item.cat_id">
        <view class="categories-right-item-title">{{item.cat_name}}</view>
        <view class="categories-right-item-body">
          <view class="right-body-item" v-for="(subitem,index2) in item.children" :key="subitem.cat_id">
            <image :src="subitem.cat_icon"/>
            <text class="right-body-item-title">{{subitem.cat_name}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 窗口高度
      height: null,
      categories: [],
      // 当前tab
      currentIndex: 0
    };
  },
  methods: {
    // 获取分类
    async getCategory() {
      var res = await this.$axios({
        method: "get",
        url: "categories"
      });
      let { message, meta } = res.data;
      if (meta.status === 200) {
        this.categories = message;
        wx.hideLoading();
      }
    },
    // 获取窗口高度
    getHeight() {
      mpvue.getSystemInfo({
        success: res => {
          this.height = res.windowHeight - 10
        }
      })
    },
    // 切换tab
    toggleSelect(index) {
      this.currentIndex = index
    },
    // 正在加载
    isLoading() {
      mpvue.showLoading({
        title: 'Loading...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
      });
    }
  },
  mounted() {
    this.getCategory();
    this.getHeight();
    this.isLoading()
  }
};
</script>

<style lang="scss" scoped>
.categories {
  display: flex;
  margin-top: 10px;
  &-left {
    width: 200rpx;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    background-color: #f4f4f4;
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200rpx;
      height: 100rpx;
      position: relative;
      color: #999;
    }
    &-active {
      background: #fff;
      color: #000;
      &::before {
        position: absolute;
        content: "";
        background-color: #ff2d4a;
        left: 0;
        top: 10rpx;
        width: 5px;
        height: 80rpx;
      }
    }
  }
  &-right {
    flex: 1;
    background-color: white;
    &-item {
      &-title {
        display: flex;
        justify-content: center;
        align-items: center;
        color: #666;
        font-size: 14px;
        &::before {
          content: "/";
          color: #eeeeee;
          margin-right: 20rpx;
        }

        &::after {
          content: "/";
          color: #eeeeee;
          margin-left: 20rpx;
        }
      }
      &-body {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
image {
  width: 100rpx;
  height: 80rpx;
}
.right-body-item {
  height: 200rpx;
  width: 33.33333%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-title {
    margin-top: 5rpx;
    color: #666;
    font-size: 14px;
  }
}
</style>
