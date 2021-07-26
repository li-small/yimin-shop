import { request } from "../../request/request.js"

Page({
  data: {
    goods: [],  // 获取搜索出来的数据
    isShow: false,  // 取消按钮 显示或隐藏
    cancelValue: ''  // 取消按钮点击后 输入框的值
  },
  timer: 0,

  // 处理 输入框输入事件
  handleInput(e) {
    // 1. 获取输入框的值
    const { value } = e.detail
    // 2. 检测合法性
    if (!value.trim()) {
      // 值不合法
      // 取消按钮隐藏 搜索出来的内容清空
      clearTimeout(this.timer)
      this.setData({
        goods: [],
        isShow: false
      })
      return
    }
    // 3. 取消按钮显示
    this.setData({
      isShow: true
    })
    // 防抖
    if (this.timer)
      clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      // 4. 准备发送请求获取数据
      this.qsearch(value)
    }, 600);
  },

  // 发送请求获取 要搜索的数据
  async qsearch(query) {
    const res = await request({ url: "/goods/search", data: { query } })
    this.setData({
      goods: res.goods
    })
  },

  // 处理 取消按钮点击事件
  handleCancel() {
    clearTimeout(this.timer)
    this.setData({
      cancelValue: "",
      isShow: false,
      goods: []
    })
  }
})