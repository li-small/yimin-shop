import { request } from "../../request/request.js"
import { requestPayment, showToast } from "../../utils/asyncWx.js"

Page({
  data: {
    address: [],  // 存储本地缓存的数据
    addressAll: '',  // 存储详细的地址信息
    cartData: [], // 获取缓存中购物车数据
    totalPrice: 0,  // 总价格
    totalNum: 0  // 购买数量
  },
  onShow() {
    // 获取本地缓存的收货地址
    const nativeAddress = wx.getStorageSync("address") || [];
    // 获取本地缓存的购物车数据
    let nativeCartData = wx.getStorageSync("nativeCart") || [];
    // 过滤 点击的商品才渲染
    nativeCartData = nativeCartData.filter(item => item.checked)

    // 计算 底部工具栏的数据
    let totalPrice = 0
    let totalNum = 0
    nativeCartData.forEach(item => {
      totalPrice += item.num * item.goods_price
      totalNum += item.num
    })
    // data中的值重新设置
    this.setData({
      address: nativeAddress,
      addressAll: nativeAddress.provinceName + nativeAddress.cityName + nativeAddress.countyName + nativeAddress.detailInfo,
      cartData: nativeCartData,
      totalPrice,
      totalNum
    })
  },
  // 处理支付点击事件
  async handlePay() {
    try {
      // 1. 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return
      }
      // 2. 创建订单
      // 2.1 准备 请求头参数 
      // const header = { Authorization: token }  // 这里的请求头被封装到request.js
      // 2.2 准备 请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.addressAll
      let goods = []
      this.data.cartData.forEach(item => goods.push({
        goods_id: item.goods_id,
        goods_number: item.num,
        goods_price: item.goods_price
      }))
      // 3. 发送请求 创建订单 获取订单编号
      // 需要传递过去获取创建订单的参数
      const orderParams = { order_price, consignee_addr, goods }
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams })
      // 4. 发起 预支付
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } })
      // 5. 发起微信支付
      // 这里不是自己的appid 没有权限 所以出不了二维码 不能成功支付
      // 所以这里是我"伪装"的支付成功
      const res = await requestPayment(pay).catch((res) => {
      })
      // 6. 支付成功 查询订单状态
      // const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } })
      // 7. 支付成功的同时 把缓存中 购物车中支付成功(选中)的商品删除
      let newCartData = wx.getStorageSync("nativeCart");
      newCartData = newCartData.filter(item => !item.checked)
      wx.setStorageSync("nativeCart", newCartData);
      // 8. 支付成功后 跳转到订单界面
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/order/order?type=1'
        });
      }, 1000);
    } catch (error) {
      await showToast("支付失败")
      console.log(error);
    }
  }
})