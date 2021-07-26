import { request } from '../../request/request.js'
import { showToast } from "../../utils/asyncWx.js"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},  // 请求到的数据
    isCollect: false  // 商品收藏的状态
  },
  GoodsDetail: {},  // 商品详情数据

  onShow: function () {
    let pages = getCurrentPages();
    let options = pages[pages.length - 1].options;
    // 获取商品列表 传过来的goods_id
    const goods_id = options.goods_id;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsDetail = res;
    // 判断商品是否存在于缓存数组中
    let collect = wx.getStorageSync("collect") || [];
    let isCollect = collect.some(item => item.goods_id === res.goods_id)
    this.setData({
      // goodsDetail: res
      // 优化动态渲染 上面的优化
      goodsDetail: {
        pics: res.pics,
        goods_price: res.goods_price,
        goods_name: res.goods_name,
        // webp格式改为jpg格式
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg')
      },
      isCollect
    })
  },

  // 点击轮播图 放大预览
  HandlePreviewImage(e) {
    // 构造 预览的图片数组
    const urls = this.GoodsDetail.pics.map(item => item.pics_mid_url);
    // 获取点击图片的索引值
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: urls[index],
      urls // 解构
    });
  },

  // 点击 加入购物车
  handleAddCart() {
    // 获取本地缓存数据 第一次没获取到设为数组形式
    let NativeCart = wx.getStorageSync("nativeCart") || [];
    // 判断 当前商品是否存在 存在返回目标索引 不存在返回-1
    let index = NativeCart.findIndex(item => item.goods_id === this.GoodsDetail.goods_id);
    if (index === -1) {
      // 不存在 第一次添加 添加新属性 数量num 选中状态checked 总价格totalPrice 购买数量totalNum
      this.GoodsDetail.num = 1
      this.GoodsDetail.checked = true
      this.GoodsDetail.totalPrice = 0
      this.GoodsDetail.totalNum = 0
      NativeCart.push(this.GoodsDetail);
    } else {
      // 已经存在购物
      NativeCart[index].num++;
    }
    // 把购物车重新添加回缓存
    wx.setStorageSync("nativeCart", NativeCart);
    // 弹窗提示
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      mask: true, // true 防止用户疯狂点击按钮
    });
  },

  // 点击 商品收藏图标
  async handleCollect() {
    // 1. 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2. 判断该商品是否被收藏过
    let index = collect.findIndex(item => item.goods_id === this.GoodsDetail.goods_id);
    // 3. index为-1 表示没被收藏过
    if (index !== -1) {
      // 能找到 已经收藏过了 删除
      collect.splice(index, 1);
      await showToast("取消成功");
    } else {
      // 没找到 收藏
      collect.push(this.GoodsDetail)
      await showToast("收藏成功");
    }
    // 4. 存入缓存
    wx.setStorageSync("collect", collect);
    // 5. 修改data中的 isCollect
    this.setData({
      isCollect: !this.data.isCollect
    })
  }
})