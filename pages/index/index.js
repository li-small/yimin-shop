import { request } from '../../request/request.js'

Page({
  data: {
    swiperList: [],  // 轮播图数据
    navList: [],  // 分类导航数据
    floorList: []  // 楼层数据
  },
  // 页面开始加载就会触发
  onLoad() {
    // 发送异步请求获取轮播图数据
    /* wx.request({
      url: '/v1/home/swiperdata',
      success: (res) => {
        this.setData({
          swiperList: res
        })
      }
    }); */

    // 上面的进一步优化 Promise
    this.getSwiperList();
    this.getNavList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" }).then(res => {
      this.setData({
        swiperList: res
      })
    })
  },
  // 获取分类导航数据
  getNavList() {
    request({ url: "/home/catitems" }).then(res => {
      this.setData({
        navList: res
      })
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({ url: "/home/floordata" }).then(res => {
      // 处理 拼接以下url字符串
      res.map(item => {
        item.product_list.map(item1 => {
          item1.navigator_url = item1.navigator_url.replace("goods_list", "goods_list/goods_list")
        })
      })
      this.setData({
        floorList: res
      })
    })
  },
});
