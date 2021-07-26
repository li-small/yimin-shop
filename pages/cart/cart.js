import { showModal, showToast } from '../../utils/asyncWx.js'

Page({
  data: {
    address: [],  // 存储本地缓存的数据
    addressAll: '',  // 存储详细的地址信息
    cartData: [], // 获取缓存中购物车数据
    allChecked: false, // 全选状态
    totalPrice: 0,  // 总价格
    totalNum: 0  // 购买数量
  },
  onShow() {
    // 获取本地缓存的收货地址
    const nativeAddress = wx.getStorageSync("address") || [];
    // 获取本地缓存的购物车数据
    const nativeCartData = wx.getStorageSync("nativeCart") || [];
    // 判断全选按钮状态 计算总价格和购买数量
    this.setCart(nativeCartData)
    this.setData({
      address: nativeAddress,
      addressAll: nativeAddress.provinceName + nativeAddress.cityName + nativeAddress.countyName + nativeAddress.detailInfo
    })
  },
  // 点击后 获取收货地址
  handleReceiveAddress() {
    wx.chooseAddress({
      success: (result) => {
        // 存入到本地缓存
        wx.setStorageSync("address", result);
      }
    });
  },
  // 处理商品选中事件
  handleCartSelect(e) {
    // 获取点击商品的id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数据
    const { cartData } = this.data
    // 找到要修改的对象
    const index = cartData.findIndex(item => item.goods_id === goods_id)
    // 选中状态取反
    cartData[index].checked = !cartData[index].checked
    // 重新判断全选按钮状态 计算总价格和购买数量
    this.setCart(cartData)
  },
  // 处理全选点击事件
  handleCartSelectAll() {
    let { allChecked, cartData } = this.data
    allChecked = !allChecked
    cartData.forEach(item => item.checked = allChecked)
    this.setCart(cartData)
  },
  // 处理商品+-按钮点击事件
  async handleCount(e) {
    let { id, sign } = e.currentTarget.dataset
    const { cartData } = this.data
    const index = cartData.findIndex(item => item.goods_id === id)
    cartData[index].num += sign
    // 如果用户操作商品数低于1 询问是否要删除
    if (cartData[index].num < 1) {
      const res = await showModal("您是否要删除")
      if (res.confirm) {
        cartData.splice(index, 1)
        this.setCart(cartData)
      } else if (res.cancel) {
        cartData[index].num = 1
        this.setCart(cartData)
      }
    } else {
      // 设置回data和缓存中
      this.setCart(cartData)
    }
  },
  // 处理结算点击事件
  async handlePay() {
    const { address, totalNum } = this.data;
    // 判断有没有选购商品
    if (!totalNum) {
      await showToast("您还没有选购商品")
      return
    }
    // 判断有没有添加收货地址
    if (!address.userName) {
      await showToast("您还没有选择收货地址")
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '../pay/pay'
    });

  },
  // 计算 底部工具栏的数据
  setCart(cartData) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cartData.forEach(item => {
      if (item.checked) {
        totalPrice += item.num * item.goods_price
        totalNum += item.num
      } else {
        allChecked = false
      }
    })
    // 如果数组为空 allChecked状态要改为false
    allChecked = cartData.length !== 0 ? allChecked : false
    // 本地缓存的值重新设置
    wx.setStorageSync("nativeCart", cartData);
    // data中的值重新设置
    this.setData({
      cartData,
      allChecked,
      totalPrice,
      totalNum
    })
  }
})