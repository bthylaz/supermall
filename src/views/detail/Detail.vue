<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
    >
      <!-- <ul>
        <li v-for="(item, index) in $store.state.cartList" :key="index">
          {{ item }}
        </li>
      </ul> -->

      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <detail-bottom-bar @addToCart="addToCart" />
    <toast :message="message" :show="show" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetailBottomBar.vue'
import BackTop from 'components/content/backTop/BackTop.vue'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList.vue'
import Toast from 'components/common/toast/Toast.vue'

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    BackTop,
    Scroll,
    GoodsList,
    Toast

  },
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
      isShowBackTop: 'false',
      message: '哈哈哈哈',
      show: false
    }
  },
  created () {
    this.iid = this.$route.params.iid

    getDetail(this.iid).then(res => {
      //   1.获取顶部的图片轮播数据
      //   console.log(res);
      const data = res.result
      this.topImages = data.itemInfo.topImages

      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      this.shop = new Shop(data.shopInfo)

      this.detailInfo = data.detailInfo

      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }



    })

    getRecommend().then(res => {
      this.recommends = res.data.list
    })
  },
  mounted () {

  },
  updated () {

  },
  methods: {
    imageLoad () {
      this.$refs.scroll.refresh()

      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      //   console.log(this.themeTopYs);
    },
    titleClick (index) {
      //   console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll (position) {
      const positionY = -position.y
      let length = this.themeTopYs.length
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) ||
          (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          this.currentIndex = i;
          //   console.log(this.currentIndex);
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      // 1.判断backtop是否显示
      this.isShowBackTop = (-position.y) > 1000
      //   2.决定tabcontrol是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    backClick () {
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
    addToCart () {
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      //   product.checked = 'true';
      //   console.log(product);
      this.$store.commit('addCart', product)
      console.log('添加购物车成功');
      //   this.show = true;
      //   this.message = '添加购物车成功';

      //   setTimeout(() => {
      //     this.show = false;
      //     this.message = ''
      //   }, 1500)
      this.$toast.show('添加购物车成功', 2000)
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 102px);
}
</style>