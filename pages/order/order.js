import { request } from "../../request/request.js"

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待收货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      },
    ],
    orders: [],  // 获取的订单数据
  },
  onShow() {
    // 1. 判断缓存中有没有token 没有就先去获取token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
    }
    // 2. 获取当前的小程序的页面栈 长度最大是10页面(个人理解式能往返回多少层的意思)
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1]
    // 3. 获取url上的type参数
    const { type } = currentPage.options
    // 4. 根据type参数 决定导航栏谁被选中
    const index = type - 1
    this.changeTabTitleItem(index)
    // 5. 发送请求 获取订单 
    this.getOrders(type)
  },

  // 获取订单列表
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } })
    const { orders } = res
    // 把时间戳处理成时间格式
    this.setData({
      orders: orders.map(item => ({ ...item, create_time_cn: new Date(item.create_time * 1000).toLocaleString() }))
    })
  },
  // 顶部导航栏点击事件
  handleChangeTabItem(e) {
    // 获取子组件tabs传过来的索引
    const { index } = e.detail
    this.changeTabTitleItem(index)
    // 发送请求 获取订单
    this.getOrders(index + 1)
  },
  // 封装起来 点击或者根据type值都可以决定导航栏选中
  changeTabTitleItem(index) {
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  }
})
