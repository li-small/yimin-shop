import { request } from '../../request/request.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []  // 商品列表数据
  },
  // 接口要的参数
  QueryParmams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,  // 总页数

  /**
   * 生命周期函数--监听页面加载
   * options能拿到分类界面传过来的id
   */
  onLoad: function (options) {
    this.QueryParmams.cid = options.cid || "";
    this.QueryParmams.query = options.query || "";
    this.getGoodsList();
  },

  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: '/goods/search', data: this.QueryParmams });
    // 获取总条数
    const { total } = res;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParmams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]  // es6合并数组
    }),

      // 关闭下拉刷新等待效果
      wx.stopPullDownRefresh()
  },

  // 顶部导航栏点击事件
  handleChangeTabItem(e) {
    // 获取子组件tabs传过来的索引
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    // 判断还有没有下一页数据
    if (this.QueryParmams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '没有下一页数据'
      })
    } else {
      // 当前页码加1
      this.QueryParmams.pagenum++;
      // 请求下一页
      this.getGoodsList()
    }
  },

  // 页面下拉 刷新事件
  onPullDownRefresh() {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParmams.pagenum = 1
    // 重新发送请求
    this.getGoodsList()
  }
})